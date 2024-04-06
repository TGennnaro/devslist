'use client';

import React, { useRef, useEffect, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter.js';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Basemap from '@arcgis/core/Basemap';
import Locate from '@arcgis/core/widgets/Locate';
import Search from '@arcgis/core/widgets/Search';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import Expand from '@arcgis/core/widgets/Expand.js';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils.js';
import styles from '@/styles/JobMap.module.css';
import { useTheme } from 'next-themes';
import { createRoot } from 'react-dom/client';
import { currency, debounce } from '@/lib/utils';
import { JobPopup } from './JobPopup';
import { Job, Company } from '@/db/schema';
import MapLegend from './Legend';

export default function JobMap() {
	const mapDiv = useRef(null);
	const { theme } = useTheme();
	const [map, setMap] = useState<Map | null>(null);

	const lightModeBasemap = Basemap.fromId('gray-vector');
	const darkModeBasemap = Basemap.fromId('dark-gray-vector');

	const markerIds = new Set();

	async function jobPreview(target: any) {
		const attributes = target.graphic.attributes;
		let puNode = document.createElement('div');
		const root = createRoot(puNode);
		root.render(
			<JobPopup
				id={attributes.id}
				position={attributes.jobTitle}
				company={attributes.company}
				location={attributes.location}
				jobType={attributes.jobType}
				pay={
					attributes.showPayRate === 'true'
						? currency(attributes.salary ?? attributes.hourlyRate ?? 0) +
						  (attributes.salary ? ' per year' : ' an hour')
						: 'Not specified'
				}
				companyLogo={attributes.companyLogo}
			/>
		);
		return puNode;
	}

	useEffect(() => {
		// Initialize application
		if (mapDiv.current) {
			// Map settings
			const map = new Map({
				basemap: theme === 'light' ? lightModeBasemap : darkModeBasemap, // When loading initial map, user's current theme selection determines basemap
			});

			const view = new MapView({
				map,
				container: mapDiv.current,
				center: [-74.00504, 40.27984],
				zoom: 10,
				constraints: {
					minZoom: 4,
					maxZoom: 12,
				},
			});

			// Map marker symbol
			const defaultPictureMarkerSymbol = new PictureMarkerSymbol({
				url: '/default_map_marker.png',
				width: '25px',
				height: '30px',
			});

			const fullTimeJobPictureMarkerSymbol = new PictureMarkerSymbol({
				url: '/full_time_job_map_marker.png',
				width: '25px',
				height: '30px',
			});

			const partTimeJobPictureMarkerSymbol = new PictureMarkerSymbol({
				url: '/part_time_job_map_marker.png',
				width: '25px',
				height: '30px',
			});

			const internshipPictureMarkerSymbol = new PictureMarkerSymbol({
				url: '/internship_map_marker.png',
				width: '25px',
				height: '30px',
			});

			const freelancePictureMarkerSymbol = new PictureMarkerSymbol({
				url: '/freelance_map_marker.png',
				width: '25px',
				height: '30px',
			});

			// Renderer for markers on the FeatureLayer
			const renderer = new UniqueValueRenderer({
				field: 'jobType',
				defaultSymbol: defaultPictureMarkerSymbol,
				uniqueValueInfos: [
					{
						value: 'Full-Time',
						symbol: fullTimeJobPictureMarkerSymbol,
					},
					{
						value: 'Part-Time',
						symbol: partTimeJobPictureMarkerSymbol,
					},
					{
						value: 'Internship',
						symbol: internshipPictureMarkerSymbol,
					},
					{
						value: 'Freelance',
						symbol: freelancePictureMarkerSymbol,
					},
				],
			});

			// Attributes for popup that appears when map marker is clicked
			const popupTemplate = new PopupTemplate({
				title: '{jobTitle}',
				content: [
					{
						type: 'custom',
						creator: jobPreview,
					},
				],
			});

			// Feature layer
			const featureLayer = new FeatureLayer({
				title: 'Jobs Around You',
				fields: [
					{
						name: 'ObjectID',
						alias: 'Object ID',
						type: 'oid',
					},
					{
						name: 'id',
						alias: 'Job ID',
						type: 'integer',
					},
					{
						name: 'jobTitle',
						alias: 'Job Title',
						type: 'string',
					},
					{
						name: 'company',
						alias: 'Company',
						type: 'string',
					},
					{
						name: 'companyLogo',
						alias: 'Company Logo',
						type: 'string',
					},
					{
						name: 'location',
						alias: 'Location',
						type: 'string',
					},
					{
						name: 'jobType',
						alias: 'Job Type',
						type: 'string',
					},
					{
						name: 'showPayRate',
						alias: 'Show Pay Rate',
						type: 'string',
					},
					{
						name: 'payType',
						alias: 'Pay Type',
						type: 'string',
					},
					{
						name: 'hourlyRate',
						alias: 'Hourly Rate',
						type: 'string',
					},
					{
						name: 'salary',
						alias: 'Salary',
						type: 'string',
					},
				],
				outFields: ['*'],
				objectIdField: 'ObjectID',
				geometryType: 'point',
				spatialReference: {
					wkid: 4326,
				},
				source: [], // Adding an empty feature collection
				renderer: renderer,
				popupTemplate: popupTemplate,
				featureReduction: {
					type: 'cluster',
					clusterRadius: '75px',
					clusterMinSize: '24px',
					clusterMaxSize: '60px',
					// Defines the label within each cluster
					labelingInfo: [
						{
							deconflictionStrategy: 'none',
							labelExpressionInfo: {
								expression: "Text($feature.cluster_count, '#,###')",
							},
							symbol: {
								type: 'text',
								color: 'white',
								font: {
									weight: 'bold',
									family: 'Noto Sans',
									size: '12px',
								},
							},
							labelPlacement: 'center-center',
						},
					],
					// Information to display when the user clicks a cluster
					popupTemplate: {
						title: 'Cluster Summary',
						content: 'This cluster contains <b>{cluster_count}</b> jobs.',
						fieldInfos: [
							{
								fieldName: 'cluster_count',
								format: {
									places: 0,
									digitSeparator: true,
								},
							},
						],
					},
					symbol: new SimpleMarkerSymbol({
						style: 'circle',
						color: '#69b7ff',
						outline: {
							color: 'rgba(0, 139, 174, 0.5)',
							width: 6,
						},
					}),
				},
			});

			map.add(featureLayer);

			function loadMarkers() {
				if (view.extent) {
					const minXY = webMercatorUtils.xyToLngLat(
						view.extent.xmin,
						view.extent.ymin
					);
					const maxXY = webMercatorUtils.xyToLngLat(
						view.extent.xmax,
						view.extent.ymax
					);
					generateMapMarkers(
						parseFloat(minXY[0].toFixed(2)),
						parseFloat(maxXY[0].toFixed(2)),
						parseFloat(minXY[1].toFixed(2)),
						parseFloat(maxXY[1].toFixed(2))
					);
				}
			}

			const debouncedLoadMarkers = debounce(loadMarkers, 1000);

			// Watch view's stationary property for becoming true
			reactiveUtils.when(
				() => view.stationary === true,
				() => debouncedLoadMarkers()
			);

			// Map widgets
			const locate = new Locate({
				view: view,
				rotationEnabled: false,
				popupEnabled: false,
				goToOverride: function (view, options) {
					options.target.scale = 24000;
					return view.goTo(options.target);
				},
			});
			view.ui.add(locate, 'top-left');

			const search = new Search({
				view: view,
				includeDefaultSources: false,
				minSuggestCharacters: 1,
				sources: [
					{
						//@ts-ignore
						layer: featureLayer,
						searchFields: ['jobTitle'],
						displayField: 'jobTitle',
						exactMatch: false,
						outFields: ['*'],
						name: 'Find a job',
						placeholder: 'e.g., Software Engineer',
					},
				],
			});
			view.ui.add(search, 'top-right');

			let jobsLayerView: FeatureLayerView;

			const jobTypesElement = document.getElementById('job-type-filter');

			const jobMapLegendElement = document.getElementById(
				'job-map-legend'
			) as HTMLElement;

			view.ui.add(jobMapLegendElement, 'bottom-right');

			// Click event handler for job type choices
			if (jobTypesElement) {
				jobTypesElement.addEventListener('click', filterByJobType);
			}

			// User clicked on specific job type
			// Set an attribute filter on jobs layer view
			// to display jobs with the selected job type only
			function filterByJobType(event: any) {
				const selectedJobType = event.target.getAttribute('data-job');
				jobsLayerView.filter = new FeatureFilter({
					where: "jobType = '" + selectedJobType + "'",
				});
			}

			view.whenLayerView(featureLayer).then((layerView) => {
				// Jobs layer loaded
				// Get a reference to the layer view
				jobsLayerView = layerView;

				if (jobTypesElement) {
					// Set up UI items
					jobTypesElement.style.visibility = 'visible';
					const jobTypesExpand = new Expand({
						view: view,
						content: jobTypesElement,
						expandIcon: 'filter',
						group: 'top-left',
					});
					// Clear the filters when user closes the expand widget
					reactiveUtils.when(
						() => !jobTypesExpand.expanded,
						() => {
							// @ts-ignore
							jobsLayerView.filter = null;
						}
					);
					view.ui.add(jobTypesExpand, 'top-left');
				}
			});

			const generateMapMarkers = async (
				xMin: number,
				xMax: number,
				yMin: number,
				yMax: number
			) => {
				try {
					const response = await fetch(
						'/api/map?xmin=' +
							xMin +
							'&xmax=' +
							xMax +
							'&ymin=' +
							yMin +
							'&ymax=' +
							yMax
					);
					const jobs = await response.json();

					if (response.ok) {
						jobs.map((job: Job & Company) => {
							if (job.latitude && job.longitude) {
								const point = new Point({
									longitude: job.longitude,
									latitude: job.latitude,
								});

								const pointGraphic = new Graphic({
									geometry: point,
									attributes: {
										id: job.id,
										jobTitle: job.jobTitle,
										company: job.name,
										companyLogo: job.logo,
										location: job.address,
										jobType: job.jobType,
										showPayRate: job.showPayRate,
										payType: job.payType,
										hourlyRate: job.hourlyRate,
										salary: job.salary,
									},
								});

								// Only add to map if job is not already on map
								if (!markerIds.has(job.id)) {
									featureLayer.applyEdits({ addFeatures: [pointGraphic] });
									markerIds.add(job.id);
								}
							}
						});
					}
				} catch (error) {
					console.log(error);
				}
			};

			loadMarkers();

			setMap(map);
		}
	}, []);

	// Separate useEffect to prevent complete map reload due to theme state dependency
	// Programmatically update map theme based on NextUI theme selection
	useEffect(() => {
		if (mapDiv.current) {
			// By default, Esri root map has this Calcite class
			const calciteTheme = document.querySelector(
				'.esri-ui.calcite-mode-light'
			);

			// If element exists, assign id to it
			if (calciteTheme) {
				calciteTheme.id = 'devsListJobMap-rootMapView';
			}

			// Now that element has ID, we can manipulate it
			const rootMapView = document.getElementById('devsListJobMap-rootMapView');

			// Change basemap based on NextUI theme selection
			if (map && theme === 'dark') {
				map.basemap = darkModeBasemap;
			} else if (map && theme === 'light') {
				map.basemap = lightModeBasemap;
			}

			// Change Calcite theme based on NextUI theme selection
			if (rootMapView && theme === 'dark') {
				rootMapView.classList.remove('calcite-mode-light');
				rootMapView.classList.add('calcite-mode-dark');
			} else if (rootMapView && theme === 'light') {
				rootMapView.classList.remove('calcite-mode-dark');
				rootMapView.classList.add('calcite-mode-light');
			}
		}
	}, [theme]);

	return (
		<>
			<link
				id='mapTheme'
				rel='stylesheet'
				href={`https://js.arcgis.com/4.28/esri/themes/${theme}/main.css`}
			/>
			<div id='job-type-filter' className='esri-widget'>
				<div className={`${styles.jobTypeItem}`} data-job='Full-Time'>
					Full-Time
				</div>
				<div className={`${styles.jobTypeItem}`} data-job='Part-Time'>
					Part-Time
				</div>
				<div className={`${styles.jobTypeItem}`} data-job='Internship'>
					Internship
				</div>
				<div className={`${styles.jobTypeItem}`} data-job='Freelance'>
					Freelance
				</div>
			</div>
			<div
				id='job-map-legend'
				className='esri-component esri-legend esri-widget esri-widget--panel p-3'
			>
				<MapLegend />
			</div>
			<div className={`${styles.mapDiv}`} ref={mapDiv} id='root'></div>
		</>
	);
}
