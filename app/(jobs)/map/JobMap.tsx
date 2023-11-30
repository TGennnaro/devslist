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
import Legend from '@arcgis/core/widgets/Legend';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import Expand from '@arcgis/core/widgets/Expand.js';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
import styles from '@/styles/JobMap.module.css';
import { useTheme } from 'next-themes';
import { createRoot } from 'react-dom/client';
import { currency } from '@/lib/utils';
import { JobPopup } from './JobPopup';
import { Job, Company } from '@/db/schema';

export default function JobMap({
	jobs,
}: {
	jobs: { jobs: Job; company: Company | null }[];
}) {
	const mapDiv = useRef(null);
	const { theme } = useTheme();
	const [map, setMap] = useState<Map | null>(null);

	const lightModeBasemap = Basemap.fromId('gray-vector');
	const darkModeBasemap = Basemap.fromId('dark-gray-vector');

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
				zoom: 12,
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
					{
						name: 'skills',
						alias: 'Skills',
						type: 'string',
					},
					{
						name: 'jobDescription',
						alias: 'Job Description',
						type: 'string',
					},
					{
						name: 'jobResponsibilities',
						alias: 'Job Responsibilities',
						type: 'string',
					},
					{
						name: 'jobRequirements',
						alias: 'Job Requirements',
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
			});

			map.add(featureLayer);

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

			let legend = new Legend({
				view: view,
			});

			view.ui.add(legend, 'bottom-right');

			let jobsLayerView: FeatureLayerView;

			const jobTypesElement = document.getElementById('job-type-filter');

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

			const generateMapMarkers = async () => {
				try {
					jobs.map((listing: { jobs: Job; company: Company | null }) => {
						if (listing.jobs.latitude && listing.jobs.longitude) {
							const point = new Point({
								longitude: listing.jobs.longitude,
								latitude: listing.jobs.latitude,
							});

							const pointGraphic = new Graphic({
								geometry: point,
								attributes: {
									id: listing.jobs.id,
									jobTitle: listing.jobs.jobTitle,
									company: listing.company?.name,
									companyLogo: listing.company?.logo,
									location: listing.jobs.address,
									jobType: listing.jobs.jobType,
									showPayRate: listing.jobs.showPayRate,
									payType: listing.jobs.payType,
									hourlyRate: listing.jobs.hourlyRate,
									salary: listing.jobs.salary,
									skills: listing.jobs.skills,
									jobDescription: listing.jobs.jobDescription,
									jobResponsibilities: listing.jobs.jobResponsibilities,
									jobRequirements: listing.jobs.jobRequirements,
								},
							});

							featureLayer.applyEdits({ addFeatures: [pointGraphic] });
						}
					});
				} catch (error) {
					console.log(error);
				}
			};

			generateMapMarkers();

			setMap(map);

			// When map is done loading, zoom to extent of all features
			const handle = view.watch('updating', function (value) {
				if (!value) {
					featureLayer

						.queryExtent()

						.then(function (results) {
							const extent = results.extent;
							view.goTo(extent);
							handle.remove();
						});
				}
			});
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
			<div className={`${styles.mapDiv}`} ref={mapDiv} id='root'></div>
		</>
	);
}
