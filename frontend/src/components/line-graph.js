import React, { useEffect, useState, useCallback } from "react";
import { Svg_Line_Graph } from "../utils/svg-linegraph";

function LineGraph({ data, selectedItem }) {
  const [maxData, setMaxData] = useState([]);
  const [minData, setMinData] = useState([]);

  const updateMaxData = useCallback(
    (output) => {
      const maxCountry = output.data.reduce((acc, curr) => {
        if (!acc || curr[selectedItem] > acc[selectedItem]) {
          return curr;
        } else {
          return acc;
        }
      }, null);
      const maxCountryName = maxCountry ? maxCountry.country : null;
      setMaxData(output.data.filter((el) => el.country === maxCountryName));
    },
    [selectedItem]
  );

  const updateMinData = useCallback(
    (output) => {
      const minCountry = output.data.reduce((acc, curr) => {
        if (!acc || curr[selectedItem] < acc[selectedItem]) {
          return curr;
        } else {
          return acc;
        }
      }, null);
      const minCountryName = minCountry ? minCountry.country : null;
      setMinData(output.data.filter((el) => el.country === minCountryName));
    },
    [selectedItem]
  );

  useEffect(() => {
    fetch("http://127.0.0.1:5000/country_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country: [],
        year: []
      })
    })
      .then((response) => response.json())
      .then((data) => {
        const output = JSON.parse(JSON.stringify(data));
        updateMaxData(output);
        updateMinData(output);
      });
  }, [updateMaxData, updateMinData]);

  useEffect(() => {
    Svg_Line_Graph({
      data,
      selectedItem,
      lowestData: minData,
      highestData: maxData
    });
  }, [data, maxData, minData, selectedItem]);

  return <div id="line_graph" className="line-graph"></div>;
}

export default LineGraph;
