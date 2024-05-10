import React, { useEffect } from "react";
import { PcpChart } from "../utils/svg-pcpplot";
import { defaultData } from "../constants/data";

const PCPPlot = ({ selectedCountry, selectedYear }) => {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/PcpData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country: selectedCountry,
        post: defaultData,
        kValue: 3
      })
    })
      .then((response) => response.json())
      .then((pcaData) => {
        const output = JSON.parse(JSON.stringify(pcaData));
        PcpChart({ data1: output.data, dimensions: [], selectedYear });
      });
  }, [selectedCountry, selectedYear]);

  return (
    <div style={{ textAlign: "center" }}>
      <h3>PCP Plot</h3>
      {selectedCountry && <svg id="svg_3"></svg>}
    </div>
  );
};

export default PCPPlot;
