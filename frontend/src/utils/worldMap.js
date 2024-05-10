import * as d3 from "d3";

function purifyString(str) {
  var regex = /\s*\[[^\]]*\]\s*/g;
  return str.replace(regex, "");
}

const data = [
  { text: ">7", color: "green" },
  { text: "6-7", color: "yellow" },
  { text: "5-6", color: "orange" },
  { text: "<5", color: "red" }
];

export function createWorldMap({
  selected_year,
  selectedCountry,
  handleCountryChange
}) {
  var svg = d3.select("#world_map"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Increase map scale
  var scale = 110;

  var Tooltip = d3
    .select("#world_map")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Define map projection
  var projection = d3
    .geoMercator()
    .scale(scale)
    .center([0, 20])
    .translate([width / 2, height / 2]);

  // Define path generator
  var path = d3.geoPath().projection(projection);

  // Define color scale with the desired ranges
  var colorScale = d3
    .scaleThreshold()
    .domain([5, 6, 7]) // Adjusted domain
    .range(["red", "orange", "yellow", "green"]);

  var happinessScoreMap;
  var countryCodes;

  d3.queue()
    .defer(d3.json, process.env.PUBLIC_URL + "/data/world_countries.json")
    .defer(d3.csv, process.env.PUBLIC_URL + "/data/country-codes.csv")
    .defer(
      d3.csv,
      process.env.PUBLIC_URL +
        "/data/sustainable-score-" +
        selected_year +
        ".csv"
    )
    .await(createMap);

  function createMap(error, topo, codes, score) {
    if (error) throw error;

    happinessScoreMap = new Map(
      score.map((d) => [d.country, +d.happiness_score])
    );

    countryCodes = new Map(codes.map((x) => [x.alpha3, x.country]));

    svg
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function (t) {
        var countryCode = t.id;
        var countryName = countryCodes.get(countryCode) || "";
        var happinessScore =
          happinessScoreMap.get(purifyString(countryName)) || 5.2;
        return colorScale(happinessScore);
      })
      .style("stroke-width", 2)
      .style("stroke", "white")
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", mouseclick);

    // Add country labels
    // svg
    //   .selectAll(".country-label")
    //   .data(topo.features)
    //   .enter()
    //   .append("text")
    //   .attr("class", "country-label")
    //   .attr("x", function (d) {
    //     return path.centroid(d)[0];
    //   })
    //   .attr("y", function (d) {
    //     return path.centroid(d)[1];
    //   })
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    //   .style("font-size", "6px")
    //   .style("fill", "black")
    //   .text(function (d) {
    //     var countryCode = d.id;
    //     return countryCodes.get(countryCode) || "";
    //   });
  }

  let xPos = 720;
  const yPosStart = 10;
  const yPosStep = 20;

  // Append rectangles and texts dynamically
  data.forEach((d, i) => {
    // Append rectangle
    svg
      .append("rect")
      .attr("x", xPos)
      .attr("y", yPosStart + i * yPosStep)
      .attr("width", 20)
      .attr("height", 10)
      .style("fill", d.color);

    // Append text
    svg
      .append("text")
      .transition()
      .duration(1000)
      .attr("x", xPos + 30) // Place text next to the rectangle
      .attr("y", yPosStart + i * yPosStep + 5) // Center text vertically
      .text(d.text)
      .style("fill", "black")
      .style("font-size", "13px")
      .style("font-family", "Verdana, sans-serif")
      .attr("alignment-baseline", "middle");
  });

  var mouseover = function (d) {
    Tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
    var countryCode = d.id;
    var countryName = countryCodes.get(countryCode) || "";
    Tooltip.html("<strong>" + countryName + "</strong>")
      .style("left", d3.event.pageX + 10 + "px")
      .style("top", d3.event.pageY + 10 + "px");
  };

  var mousemove = function () {
    Tooltip.style("left", d3.event.pageX + 10 + "px").style(
      "top",
      d3.event.pageY + 10 + "px"
    );
  };

  var mouseleave = function () {
    Tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  var mouseclick = function (d) {
    var countryCode = d.id;
    var countryName = countryCodes.get(countryCode) || "";
    handleCountryChange(countryName);
  };

  svg.on("mouseout", function () {
    Tooltip.style("opacity", 0);
  });
}
