'use client';

import React, { useRef, useEffect, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Basemap from '@arcgis/core/Basemap';
import Locate from '@arcgis/core/widgets/Locate';
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

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const point = new Point({
        longitude: -74.00504,
        latitude: 40.27984,
      });

      const pictureMarkerSymbol = new PictureMarkerSymbol({
        url: '/map_marker.png',
        width: '25px',
        height: '30px',
      });

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: pictureMarkerSymbol,
        attributes: {
          jobTitle: 'Software Developer',
          company: 'Apple, Inc.',
          location: 'West Long Branch, NJ',
          salary: 100000,
        },
        popupTemplate: {
          // autocasts as new PopupTemplate()
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
        },
      });

      graphicsLayer.add(pointGraphic);

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

      // If element exists , assign id to it
      if (calciteTheme) {
        calciteTheme.id = 'devsListJobMap-rootMapView';
      }

      // Now that element has ID, we can manipulate it
      const rootMapView = document.getElementById('devsListJobMap-rootMapView');

      // Change basemap & Calcite theme based on NextUI theme selection
      if (map != null && theme === 'dark') {
        if (rootMapView) {
          rootMapView.classList.remove('calcite-mode-light');
          rootMapView.classList.add('calcite-mode-dark');
        }
        map.basemap = darkModeBasemap;
      } else if (map != null && theme === 'light') {
        if (rootMapView) {
          rootMapView.classList.remove('calcite-mode-dark');
          rootMapView.classList.add('calcite-mode-light');
        }
        map.basemap = lightModeBasemap;
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
