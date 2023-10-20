"use client";

import React, { useRef, useEffect } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import styles from "../styles/JobMap.module.css";

export default function JobMap() {
  const mapDiv = useRef(null);

  useEffect(() => {
    /**
     * Initialize application
     */
    if (mapDiv.current) {
      const map = new Map({
        basemap: "dark-gray",
      });

      const view = new MapView({
        map,
        container: mapDiv.current,
        center: [-74.00504, 40.27984],
        zoom: 12,
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const point = new Point({
        longitude: -74.00504,
        latitude: 40.27984,
      });

      const simpleMarkerSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40], // Orange
        outline: {
          color: [255, 255, 255], // White
          width: 1,
        },
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
      });

      graphicsLayer.add(pointGraphic);
    }
  }, []);

  return <div className={styles.mapDiv} ref={mapDiv}></div>;
}
