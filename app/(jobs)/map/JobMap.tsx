'use client';

import React, { useRef, useEffect, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Basemap from '@arcgis/core/Basemap';
import Locate from '@arcgis/core/widgets/Locate';
import Search from '@arcgis/core/widgets/Search';
import Legend from '@arcgis/core/widgets/Legend';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import styles from '@/styles/JobMap.module.css';
import { useTheme } from 'next-themes';

export default function JobMap() {
  const mapDiv = useRef(null);
  const { theme } = useTheme();
  const [map, setMap] = useState<Map | null>(null);

  const lightModeBasemap = Basemap.fromId('gray-vector');
  const darkModeBasemap = Basemap.fromId('dark-gray-vector');

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
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'company',
                label: 'Company',
              },
              {
                fieldName: 'location',
                label: 'Location',
              },
            ],
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
            name: 'location',
            alias: 'Location',
            type: 'string',
          },
          {
            name: 'jobType',
            alias: 'Job Type',
            type: 'string',
          },
        ],
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

      const point = new Point({
        longitude: -74.00504,
        latitude: 40.27984,
      });

      const pointGraphic = new Graphic({
        geometry: point,
        attributes: {
          jobTitle: 'Software Developer',
          company: 'Apple, Inc.',
          location: 'West Long Branch, NJ',
          jobType: 'Full-Time',
          salary: 100000,
        },
      });

      // Map widgets
      const locate = new Locate({
        view: view,
        useHeadingEnabled: false,
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

      featureLayer.applyEdits({ addFeatures: [pointGraphic] });

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
      <div className={`${styles.mapDiv}`} ref={mapDiv} id='root'></div>
    </>
  );
}
