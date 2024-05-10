import * as d3 from "d3";

export function Svg_Line_Graph({
  data,
  selectedItem,
  highestData,
  lowestData
}) {
  const margin = { top: 20, right: 30, bottom: 30, left: 60 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // Remove previous SVG if exists
  d3.select("#line_graph").selectAll("*").remove();

  const svg = d3
    .select("#line_graph")
    .append("svg")
    .attr("id", "line_graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([2016, 2023]).range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data.concat(highestData, lowestData), (d) => d[selectedItem])
    ])
    .nice()
    .range([height, 0]);

  const line = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d[selectedItem]));

  // Draw main data line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Draw highestData line
  const highestLine = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d[selectedItem]));

  svg
    .append("path")
    .datum(highestData)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 2)
    .attr("d", highestLine);

  // Draw lowestData line
  const lowestLine = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d[selectedItem]));

  svg
    .append("path")
    .datum(lowestData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", lowestLine);

  // Draw x-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format("d")))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "0.5em")
    .attr("transform", "rotate(-45)");

  // Draw y-axis
  svg.append("g").call(d3.axisLeft(y));

  // Add labels
  svg
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
    .style("text-anchor", "middle")
    .text("Year");

  svg
    .append("text")
    .attr(
      "transform",
      `translate(${-margin.left + 10}, ${height / 2}) rotate(-90)`
    )
    .style("text-anchor", "middle")
    .text(selectedItem);

  // Add grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(8).tickSize(-height).tickFormat(""));

  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

  // Style the grid lines
  svg
    .selectAll(".grid line")
    .style("stroke", "#e0e0e0")
    .style("stroke-dasharray", "3,3")
    .style("opacity", 0.8);
}
