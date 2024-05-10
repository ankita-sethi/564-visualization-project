import React, { useEffect } from "react";
import * as d3 from "d3";
import { donutchart } from "../utils/svg-donutchart";

const DonutChart = ({ width, selectedYear }) => {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/year_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        year: selectedYear
      })
    })
      .then((response) => response.json())
      .then((data) => {
        const output = JSON.parse(JSON.stringify(data));
        const data1 = [
          { name: "Category 1", value: 1032230 },
          { name: "Category 2", value: 2322300 },
          { name: "Category 3", value: 12323350 }
          // Add more data as needed
        ];
        donutchart(width, data1);
      });
  }, [selectedYear, width]);
  return (
    <>
      <h2>Donut Chart</h2>
      <svg id={"donut_chart"}></svg>
    </>
  );
};

export default DonutChart;
