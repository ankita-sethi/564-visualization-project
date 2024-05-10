import * as d3 from "d3";

const thresholds = {
  clean_water_sanitation_score: [80, 70, 60, 60],
  freedom_to_make_life_choices: [0.6, 0.4, 0.2, 0.2],
  gdp_per_capita: [2, 1.5, 1, 1],
  gender_equality_score: [80, 70, 60, 60],
  generosity: [0.3, 0.1, 0.02, 0.02],
  good_health_score: [80, 70, 60, 60],
  happiness_score: [7, 6, 5, 5],
  healthy_life_expectancy: [0.5, 0.3, 0.1, 0.1],
  no_poverty_score: [80, 60, 40, 40],
  perceptions_of_corruption: [0.4, 0.3, 0.2, 0.2],
  quality_education_score: [80, 60, 40, 40],
  social_support: [2, 1.5, 1, 1],
  sustainable_index_score: [80, 70, 60, 60],
  zero_hunger_score: [80, 70, 60, 60]
};
const categories = {
  clean_water_sanitation_score: [
    "Greater than 80",
    "70-80",
    "60-70",
    "Less than 60"
  ],
  freedom_to_make_life_choices: [
    "Greater than 0.6",
    "0.4-0.6",
    "0.2-0.4",
    "Less than 0.2"
  ],
  gdp_per_capita: ["Greater than 2", "1.5-2", "1-1.5", "Less than 1"],
  gender_equality_score: ["Greater than 80", "70-80", "60-70", "Less than 60"],
  generosity: ["Greater than 0.3", "0.1-0.3", "0.02-0.1", "Less than 0.02"],
  good_health_score: ["Greater than 80", "70-80", "60-70", "Less than 60"],
  happiness_score: ["Greater than 7", "6-7", "5-6", "Less than 5"],
  healthy_life_expectancy: [
    "Greater than 0.5",
    "0.3-0.5",
    "0.1-0.3",
    "Less than 0.1"
  ],
  no_poverty_score: ["Greater than 80", "60-80", "40-60", "Less than 40"],
  perceptions_of_corruption: [
    "Less than 0.2",
    "0.2-0.3",
    "0.3-0.4",
    "Greater than 0.4"
  ],
  quality_education_score: [
    "Greater than 80",
    "60-80",
    "40-60",
    "Less than 40"
  ],
  social_support: ["Greater than 2", "1.5-2", "1-1.5", "Less than 1"],
  sustainable_index_score: [
    "Greater than 80",
    "70-80",
    "60-70",
    "Less than 60"
  ],
  zero_hunger_score: ["Greater than 80", "70-80", "60-70", "Less than 60"]
};

const getColor = (index) => {
  if (index === 0) {
    return "green";
  }
  if (index === 1) {
    return "yellow";
  }
  if (index === 2) {
    return "orange";
  }
  if (index === 3) {
    return "red";
  }
  return "lightgray";
};

export function drawBarChart({ data, selectedItem }) {
  // Get thresholds and categories for the selected item
  const selectedThresholds = thresholds[selectedItem];
  const selectedCategories = categories[selectedItem];

  // Count the number of data points falling into each category
  const categoryCounts = Array(selectedCategories.length).fill(0);
  data.forEach((d) => {
    const value = d[selectedItem];
    const categoryIndex = selectedThresholds.findIndex((val, index) => {
      let ind;
      if (selectedItem !== "perceptions_of_corruption") {
        if (index === 0) {
          if (value >= val) {
            ind = index;
          }
        } else if (index === 3) {
          if (val >= value) {
            ind = index;
          }
        } else {
          if (selectedThresholds[index - 1] > value && value > val) {
            ind = index;
          }
        }
      } else {
        if (index === 0) {
          if (value <= val) {
            ind = index;
          }
        } else if (index === 3) {
          if (val <= value) {
            ind = index;
          }
        } else {
          if (selectedThresholds[index - 1] < value && value < val) {
            ind = index;
          }
        }
      }
      return ind !== undefined; // return true when index is defined
    });

    categoryCounts[categoryIndex]++;
  });

  // Prepare data for the chart
  const chartData = selectedCategories.map((category, i) => {
    return {
      range: category,
      count: categoryCounts[i]
    };
  });

  // Define chart dimensions
  const w = 600;
  const h = 400;
  const padding = 60;

  // Remove previous SVG if exists
  d3.select("#bar_chart").selectAll("*").remove();

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(categoryCounts)])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleBand()
    .domain(selectedCategories)
    .range([padding, h - padding])
    .padding(0.1);

  // Create SVG element
  const svg = d3.select("#bar_chart").attr("width", w).attr("height", h);

  // Create bars
  svg
    .selectAll("rect")
    .data(chartData)
    .enter()
    .append("rect")
    .attr("x", padding)
    .attr("y", (d) => yScale(d.range))
    .attr("width", (d) => xScale(d.count) - padding)
    .attr("height", yScale.bandwidth())
    .attr("fill", function (d, i) {
      return getColor(i);
    })
    .style("stroke-width", 2)
    .style("stroke", "white")
    .style("opacity", 0.8)
    .on("mouseover", function () {
      d3.select(this).style("stroke", "black").style("opacity", 1);
    })
    .on("mouseleave", function () {
      d3.select(this).style("stroke", "white").style("opacity", 0.8);
    });

  // Create y-axis
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(d3.axisLeft(yScale));

  // Create x-axis
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(d3.axisBottom(xScale).ticks(10));
}
