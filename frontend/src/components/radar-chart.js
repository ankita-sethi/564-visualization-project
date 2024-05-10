import React, { useEffect } from "react";
import "./radar-chart.css";
import { radarChart } from "../utils/svg-radarchart";

function RadarChart({ data, selectedItem }) {
  useEffect(() => {
    radarChart(data, selectedItem);
  }, [data, selectedItem]);
  return <div class="radarChart" style={{ display: "inline-flex" }}></div>;
}

export default RadarChart;
