import * as d3 from "d3";

const getColor = (val) => {
  if (val >= 7) {
    return "green";
  } else if (6 <= val && val < 7) {
    return "blue";
  } else if (5 <= val && val < 6) {
    return "orange";
  } else {
    return "red";
  }
};
export function PcpChart({ data1, dimensions, selectedYear }) {
  const reorderKeys = (arr, key) => {
    return arr.map((obj) => {
      const reorderedObj = { year: obj.year }; // Ensure 'year' key is first
      for (const k in obj) {
        if (k !== "year") {
          reorderedObj[k] = obj[k];
        }
      }
      return reorderedObj;
    });
  };

  // Reorder keys in each object of dataPcp
  const dataPcp = reorderKeys(data1, "year");
  d3.select("#svg_3").html("");
  const currentData = dataPcp.find((el) => el.year === selectedYear);
  const color = getColor(currentData?.happiness_score);
  var margin = { top: 90, right: 80, bottom: 35, left: 80 },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var x = d3.scalePoint().range([0, width], 1),
    y = {},
    dragging = {};

  var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

  var svg = d3
    .select("#svg_3")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(
    (dimensions = d3.keys(dataPcp[0]).filter(function (d) {
      if (d === "clusters") return false;
      if (d === "year") {
        y[d] = d3
          .scaleBand()
          .domain(
            dataPcp.map(function (p) {
              return p[d];
            })
          )
          .rangeRound([height, 0])
          .padding(1);
      } else {
        y[d] = d3
          .scaleLinear()
          .domain(
            d3.extent(dataPcp, function (p) {
              return +p[d];
            })
          )
          .range([height, 0]);
      }
      return true;
    }))
  );

  // Add grey background lines for context.
  background = svg
    .append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(dataPcp)
    .enter()
    .append("path")
    .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg
    .append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(dataPcp)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("style", function (d) {
      return "stroke:" + color + ";";
    });

  // Add a group element for each dimension.
  var g = svg
    .selectAll(".dimension")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "dimension")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    });
  // .call(
  //   d3
  //     .drag()
  //     .subject(function (d) {
  //       return { x: x(d) };
  //     })
  //     .on("start", function (d) {
  //       dragging[d] = x(d);
  //       background.attr("visibility", "hidden");
  //     })
  //     .on("drag", function (d) {
  //       dragging[d] = Math.min(width, Math.max(0, d3.event.x));
  //       foreground.attr("d", path);
  //       dimensions.sort(function (a, b) {
  //         return position(a) - position(b);
  //       });
  //       x.domain(dimensions);
  //       g.attr("transform", function (d) {
  //         return "translate(" + position(d) + ")";
  //       });
  //     })
  //     .on("end", function (d) {
  //       delete dragging[d];
  //       transition(d3.select(this)).attr(
  //         "transform",
  //         "translate(" + x(d) + ")"
  //       );
  //       transition(foreground).attr("d", path);
  //       background
  //         .attr("d", path)
  //         .transition()
  //         .delay(500)
  //         .duration(0)
  //         .attr("visibility", null);
  //     })
  // );

  // Add an axis and title.
  g.append("g")
    .attr("class", "axis")
    .each(function (d) {
      d3.select(this).call(axis.scale(y[d]));
    });
  g.append("text")
    .style("text-anchor", "middle")
    .attr("x", 15)
    .attr("y", -15)
    .attr("transform", "rotate(-25)")
    .text(function (d) {
      return d;
    });

  // Add and store a brush for each axis.

  // const yBrushes = {};
  // g.append("g")
  //   .attr("class", "brush")
  //   .each(function (d) {
  //     d3.select(this).call(
  //       (y[d].brush = d3
  //         .brushY()
  //         .extent([
  //           [-10, 0],
  //           [10, height]
  //         ])
  //         .on("start", brushstart)
  //         .on("brush", brush))
  //     );
  //   });

  // function brush() {
  //   var actives = [];
  //   //filter brushed extents
  //   svg
  //     .selectAll(".brush")
  //     .filter(function (d) {
  //       return d3.brushSelection(this);
  //     })
  //     .each(function (d) {
  //       actives.push({
  //         dimension: d,
  //         extent: d3.brushSelection(this)
  //       });
  //     });
  //   //set un-brushed foreground line disappear
  //   foreground.classed("fade", function (d, i) {
  //     return !actives.every(function (active) {
  //       var dim = active.dimension;
  //       return (
  //         active.extent[0] <= y[dim](d[dim]) &&
  //         y[dim](d[dim]) <= active.extent[1]
  //       );
  //     });
  //   });
  // }

  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  function path(d) {
    return line(
      dimensions.map(function (p) {
        return [position(p), y[p](d[p])];
      })
    );
  }

  function brushstart() {
    if (d3.event.sourceEvent) {
      d3.event.sourceEvent.stopPropagation();
    }
  }
}
