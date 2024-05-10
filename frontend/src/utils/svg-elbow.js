import * as d3 from "d3";
import { BAR_COLOR, OPTION_COLOR } from "../constants/colors";

export function Draw_Elbow_chart(data, kValue, changeKValue) {
  d3.select("#svg_4").html("");
  var x_axis = [],
    y_axis = [];
  for (let i = 0; i < data.length; i++) {
    x_axis.push(data[i].x);
    y_axis.push(data[i].y);
  }

  var padding = { top: 80, right: 50, bottom: 0, left: 50 };
  var width = 500;
  var height = 500;
  var maximumH = 300;

  var svg = d3
    .select("#svg_4")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

  var paddingXScale = width - padding.left - padding.right;
  var paddingYScale = maximumH - padding.top - padding.bottom;
  var xscale = d3.scaleBand().rangeRound([0, paddingXScale]);
  var yscale = d3.scaleLinear().range([paddingYScale, 0]);

  xscale.domain(x_axis);
  yscale.domain([0, d3.max(y_axis)]);

  var xaxis = d3.axisBottom().scale(xscale);
  svg
    .append("g")
    .transition()
    .duration(1000)
    .attr("class", "axis")
    .attr("transform", "translate(50," + paddingYScale + ")")
    .call(xaxis);
  var yaxis = d3.axisLeft().scale(yscale);
  svg
    .append("g")
    .transition()
    .duration(1000)
    .attr("class", "axis")
    .attr("transform", "translate(50,0)")
    .call(yaxis);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      "translate(" + 12 + "," + (height / 2 - 80) + ")rotate(-90)"
    )
    .style("font", "16px times")
    .style("font-family", "Verdana, sans-serif")
    .text("Eigen Values");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + width / 2 + "," + (maximumH - 45) + ")")
    .style("font", "16px times")
    .style("font-family", "Verdana, sans-serif")
    .text("Number of Clusters");

  var cum = 0;
  var valueline = d3
    .line()
    .x(function (d) {
      return xscale(d.x) + 75;
    })
    .y(function (d) {
      return yscale(d.y);
    });

  svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3.5)
    .attr("d", valueline(data));
  svg
    .append("line")
    .style("stroke", "black")
    .attr("x2", 51)
    .attr("y2", 70)
    .attr("x1", 540)
    .attr("y1", 70);

  svg
    .append("line")
    .style("stroke", "black")
    .attr("x1", 120)
    .attr("y1", 5)
    .attr("x2", 120)
    .attr("y2", 421);

  cum = 0;
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .style("cursor", "pointer")
    .attr("cx", function (d) {
      return xscale(d.x) + 94;
    })
    .attr("cy", function (d) {
      cum = cum + d.y;
      return yscale(d.y);
    })
    .attr("r", 15)
    .attr("transform", "translate(-20,0)")
    .attr("fill", function (d, i) {
      if (kValue - 1 === i) {
        return "orange";
      }
      return BAR_COLOR;
    })
    .on("mouseover", function (d) {
      // Use 'd' directly to access the data
      svg
        .append("text")
        .text(Math.round(d.y * 100000) / 100000)
        .attr("id", "text_number_elbow2")
        .attr("x", xscale(d.x) + 83)
        .attr("y", yscale(d.y) - 90)
        .attr("dy", 70)
        .attr("text-anchor", "middle")
        .attr("fill", OPTION_COLOR)
        .style("font", "18px times");
    })
    .on("click", function (d) {
      changeKValue(d.x);
    })
    .on("mouseout", function () {
      d3.select("#text_number_elbow2").remove();
    });
}
