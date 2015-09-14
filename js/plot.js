// Custom plot function for Titanic survivors data set based on the 'dimple.plot.bubble'
// function from dimple.js
// This is a horrible hacky way of customizing dimplejs, it would have been better done by
// using d3 directly.
// TODO: rewrite in d3

// Copyright: 2015 AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/plot/bubble.js
dimple.plot.titanic = {

    // By default the bubble values are not stacked
    stacked: false,

    // This is not a grouped plot meaning that one point is treated as one series value
    grouped: false,

    // The axis positions affecting the bubble series
    supportedAxes: ["x", "y", "z", "c"],

    // Draw the axis
    draw: function (chart, series, duration) {

        var chartData = series._positionData,
            theseShapes = null,
            classes = ["dimple-series-" + chart.series.indexOf(series), "dimple-bubble"],
            updated,
            removed;

        if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
            chart._tooltipGroup.remove();
        }

        if (series.shapes === null || series.shapes === undefined) {
            theseShapes = chart._group.selectAll("." + classes.join(".")).data(chartData);
        } else {
            theseShapes = series.shapes.data(chartData, function (d) {
                return d.key;
            });
        }

        // Add
        theseShapes
            .enter()
            .append("path")
            // from https://upload.wikimedia.org/wikipedia/commons/b/b7/Mars_symbol.svg
            // and  https://upload.wikimedia.org/wikipedia/commons/6/66/Venus_symbol.svg
            .attr("d", function(d) { return d.aggField[3] == "male" ? "m30,21a12.2,12.2 0 1,0 2,2zl1,1 11-11m-9,0h9v9" : "m47,59H28m9.5,10V46.2a18.3,18.3 0 1,1 .1,0"; })
            .attr("stroke-width", "5")
            .attr("id", function (d) { return dimple._createClass([d.key]); })
            .attr("class", function (d) {
                var c = [];
                c = c.concat(d.aggField);
                c = c.concat(d.xField);
                c = c.concat(d.yField);
                c = c.concat(d.zField);
                return classes.join(" ") + " " + dimple._createClass(c) + " " + chart.customClassList.bubbleSeries + " " + dimple._helpers.css(d, chart);
            })
            .on("mouseover", function (e) { dimple._showPointTooltip(e, this, chart, series); })
            .on("mouseleave", function (e) { dimple._removeTooltip(e, this, chart, series); })
            .call(function () {
                if (!chart.noFormats) {
                    this.attr("opacity", "0.5")
                        .style("fill", "none")
                        .style("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                }
            });

        // Update
        updated = chart._handleTransition(theseShapes, duration, chart, series)
            .attr("transform", function(d) { return "translate(" + (dimple._helpers.cx(d, chart, series) - 10) + "," + (dimple._helpers.cy(d, chart, series) - 15) + ") scale(" + (d.aggField[3] == "male" ? 0.5 : 0.33) + ")"; })
            // cx,cy,r needed for dimple tooltip to work properly
            .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
            .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
            .attr("r", function (d) { return dimple._helpers.r(d, chart, series); })
            .call(function () {
                if (!chart.noFormats) {
                    this.attr("fill", "none")
                        .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                }
            });

        // Remove
        removed = chart._handleTransition(theseShapes.exit(), duration, chart, series);

        dimple._postDrawHandling(series, updated, removed, duration);

        // Save the shapes to the series array
        series.shapes = theseShapes;
    }
};
