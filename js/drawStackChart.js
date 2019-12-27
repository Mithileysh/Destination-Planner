

function drawStack(country){

  //var inputs = document.getElementsByName('mode');
//inputs[0].setAttribute('checked', 'checked');
d3.select("#stackChart").select("svg").remove();
d3.select("#stackChart").select("div").remove();
  var marginStacked = {top: 20, right: 100, bottom: 50, left: 40},
      widthStacked = 550 - marginStacked.left - marginStacked.right,
      heightStacked = 310 - marginStacked.top - marginStacked.bottom;



  var xScale = d3.scale.ordinal()
      .rangeRoundBands([0, widthStacked], .2);

  var yScale = d3.scale.linear()
      .rangeRound([heightStacked, 0]);


  var color = d3.scale.ordinal().range(["#6b486b", "#7b6888", "#8a89a6", "#b0aac0", "#e4d1d1"]);
  //var color = d3.scale.ordinal().range(["#7b68ee", "#8878dd", "#9389cd", "#9f9abc", "#ababab"]);
  //var color = d3.scale.ordinal().range(["#9c8cf2", "#afa3f5", "#c3baf7", "#d7d1fa", "#ebe8fc"]);
  //var color = d3.scale.ordinal().range(["#db7093", "#ce7e98", "#c18b9d", "#b398a1", "#a6a6a6"]);
  //var color = d3.scale.ordinal().range(["#395e60", "#568e8f", "#46b5b9", "#669799", "#a6a6a6"]);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");
      //.innerTickSize([0]);

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .tickFormat(d3.format(".2s")); // for the stacked totals version

  var stack = d3.layout
      .stack(); // default view is "zero" for the count display.

  var svg = d3.select("#stackChart").append("svg")
      .attr("width", widthStacked + marginStacked.left + marginStacked.right)
      .attr("height", heightStacked + marginStacked.top + marginStacked.bottom)
    .append("g")
      .attr("transform", "translate(" + marginStacked.left + "," + marginStacked.top + ")");

  var tooltip = d3.select("#stackChart")
                  .append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

  var percentClicked = false;

  d3.csv("data/airports.csv", function(error, indata) {
    //var country='London'
    //alert(indata.length)
    data = indata.filter(function(d){ if (d['Country'] == country) { return d;} });

    data.sort(function(a,b) { return +a.total - +b.total;});

    var segmentsStacked = ["NonStop","1-Stop","2-Stop","3-Stop","more"];

    var stacked = stack(makeData(segmentsStacked, data));

    xScale.domain(data.map(function(d) { return d.Code; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightStacked + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 4)
        .attr("x", 15)
          .attr("dy", "1em")
          .attr("dx", "1em")
          .attr("transform", "rotate(60)")
          .style("text-anchor", "middle");
          //.style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
        //.text("segmentsStacked");

    var State = svg.selectAll(".State")
        .data(stacked)
      .enter().append("g")
        .attr("class", "State")
        .style("fill", function(d, i) { return color(i); });


    var rectangles = State.selectAll("rect")
        .data(function(d) {
          // console.log("array for a rectangle");
          return d; })  // this just gets the array for bar segment.
      .enter().append("rect")
          .attr("width", xScale.rangeBand());

      // this just draws them in the default way, now they're appended.
    //transitionCount();
   //var mode_chkd = d3.select('input[name="mode"]:checked').node().value; //undefined
   var mode_chkd = "bycount"
   //alert(mode_chkd);
   if (mode_chkd === "bypercent") {
     percentClicked = true;
     transitionPercent();
   } else {
     percentClicked = false;
     transitionCount();
   }

    drawLegend();

    d3.selectAll("input").on("change", handleFormClick);

    // All the functions for stuff above!

    function handleFormClick() {
      if (this.value === "bypercent") {
        percentClicked = true;
        transitionPercent();
      } else {
        percentClicked = false;
        transitionCount();
      }
    }


    function makeData(segmentsStacked, data) {
      return segmentsStacked.map(function(component) {
          return data.map(function(d) {
            return {x: d["Code"], y: Math.floor((Math.random() +1) * 1000), component: component};
          })
        });
    }


    function transitionPercent() {

      yAxis.tickFormat(d3.format("%"));
      stack.offset("expand");  // use this to get it to be relative/normalized!
      var stacked = stack(makeData(segmentsStacked, data));
      // call function to do the bars, which is same across both formats.
      transitionRects(stacked);
    }

    function transitionCount() {

      yAxis.tickFormat(d3.format(".2s")); // for the stacked totals version
      stack.offset("zero");
      var stacked = stack(makeData(segmentsStacked, data));
      transitionRects(stacked);

      }

    function transitionRects(stacked) {

      // this domain is using the last of the stacked arrays, which is the last illness, and getting the max height.
      yScale.domain([0, d3.max(stacked[stacked.length-1], function(d) { return d.y0 + d.y; })]);

      // attach new fixed data
      var State = svg.selectAll(".State")
        .data(stacked);

      // same on the rects
      State.selectAll("rect")
        .data(function(d) {
          console.log("array for a rectangle");
          return d;
        })  // this just gets the array for bar segment.

      svg.selectAll("g.State rect")
        .transition()
        .duration(250)
        .attr("x", function(d) {
          return xScale(d.x); })
        .attr("y", function(d) {
          return yScale(d.y0 + d.y); }) //
        .attr("height", function(d) {
          return yScale(d.y0) - yScale(d.y0 + d.y); });  // height is base - tallness

      svg.selectAll(".y.axis").transition().call(yAxis);
    }
  // =====================================================================
  // Building a legend by hand, based on http://bl.ocks.org/mbostock/3886208
  // ===================================================================

    function drawLegend() {
      var labels = ["NonStop","1-Stop","2-Stop","3-Stop","more"];
      var legend = svg.selectAll(".legend")
          .data(color.domain().slice()) // what do you think this does?
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + Math.abs((i-8) * 20) + ")"; });
          // Added the absolute value and transition. I reversed the names, so that I can continue to use category20(), but have health as green to make it stand out.

      legend.append("rect")
          .attr("x", widthStacked)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", widthStacked + 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d, i) { return labels[i]; });
    }

  // ================================================================
  // Mouse Events
  // ================================================================

      rectangles
          .on("mouseover", mouseoverFunc)
          .on("mousemove", mousemoveFunc);
        //  .on("mouseout", mouseoutFunc);


      function mouseoverFunc(d) {


        console.log("moused over", d.x);
          /*if(percentClicked) {
            tooltip
              .style("display", null)
              .html("<p><span class='tooltipHeader'>" + d3.format("%")(d.y) + "</p>");
              // .html("<p><span class='tooltipHeader'>" + d.x + "</span><br>"+ d.component + ": " + d3.format("%")(d.y) + "</p>");
          } else */
          //{
                //console.log("segmentsStacked", d.component, "percent", d.y);
                tooltip.transition()
                    .duration(5)
                    .style("opacity", .9);
                tooltip
                  .style("display", null)
                  .html("<h3><span class='tooltipHeader'>" +d.y + " of total <br/> flights to " + d.x + "</h3>");
                  // .html("<p><span class='tooltipHeader'>" + d.x + "</span><br>"+ d.component + ": " +d.y + "</p>");
          //}
      }

      function mousemoveFunc(d) {
          tooltip
              .style("top",  1 + "px")
              .style("left", 380 + "px");
      }

      function mouseoutFunc(d) {
          return tooltip.style("display", "none"); // this sets it to invisible!
      }
  });

}
