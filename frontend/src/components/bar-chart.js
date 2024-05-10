import React, { useEffect, useState } from "react";
import { drawBarChart } from "../utils/svg-barchart";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import * as d3 from "d3";

const items = [
  "clean_water_sanitation_score",
  "freedom_to_make_life_choices",
  "gdp_per_capita",
  "gender_equality_score",
  "generosity",
  "good_health_score",
  "happiness_score",
  "healthy_life_expectancy",
  "no_poverty_score",
  "perceptions_of_corruption",
  "quality_education_score",
  "social_support",
  "sustainable_index_score",
  "zero_hunger_score"
];

function BarChart({ selectedCountry, selectedYear }) {
  const [barData, setBarData] = useState([]);
  const [selectedItem, setSelectedItem] = useState("happiness_score");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/country_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country: [],
        year: [selectedYear] // Use selectedYear here
      })
    })
      .then((response) => response.json())
      .then((data) => {
        const output = JSON.parse(JSON.stringify(data));
        setBarData(output.data);
      });
  }, [selectedYear]); // Only run the effect when selectedYear changes

  useEffect(() => {
    if (selectedItem !== "" && barData.length > 0) {
      drawBarChart({ data: barData, selectedItem });
    }
    if (selectedItem === "") {
      const svg = d3.select("#bar_chart");
      svg.selectAll("*").remove();
    }
  }, [barData, selectedItem]); // Run the effect when barData or selectedItem changes

  return (
    <div style={{ marginLeft: "30px" }}>
      <FormControl variant="outlined" style={{ minWidth: 200 }}>
        <InputLabel id="dropdown-label">Select an item</InputLabel>
        <Select
          labelId="dropdown-label"
          id="dropdown"
          value={selectedItem}
          onChange={(event) => {
            setSelectedItem(event.target.value);
          }}
          label="Select an item"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {items.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <svg id="bar_chart"></svg>
    </div>
  );
}

export default BarChart;
