import React, { useEffect } from "react";
import { Draw_Elbow_chart } from "../utils/svg-elbow";

const ClusteringPlot = ({ kValue, changeKValue }) => {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/scree_elbow")
      .then((response) => response.json())
      .then((text) => {
        const eig_data = JSON.parse(JSON.stringify(text.data));
        // Draw_Elbow_chart(eig_data, kValue, changeKValue);
      });
  }, [changeKValue, kValue]);
  return (
    <div style={{ textAlign: "center" }}>
      <h3>Elbow Method to find the best K(cluster)</h3>
      <svg id="svg_4"></svg>
    </div>
  );
};
export default ClusteringPlot;
