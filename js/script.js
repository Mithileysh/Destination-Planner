function drawLineChart(country) {
//alert(country)
d3.select(".chart").select("svg").remove();
d3.select(".chart").select("div").remove();
    //.attr("class", "tooltip")
//d3.select(".chart").select("div").select(".tooltip").remove();
var margin = {
    top: 30,
    right: 220,
    bottom: 30,
    left: 40
},
    width = 1290 - margin.left - margin.right,      // if i reduce this svg size i.e. 1600 the colors don't show up!!
    height = 250 - margin.top - margin.bottom;

    var color_hash = {  0 : ["hot", "#ffcc66"],
        1 : ["rainy", "#b3b3cc"],
        2 : ["cold", "#99ccff"]
    }

//var data = planes;
// Parse the date / time
var parseDate = d3.time.format("%Y%m%d").parse;

var formatTime = d3.time.format("%B" + " " + "%d");

var x = d3.time.scale()
    .range([0, width - 25]);


var bisectDate = d3.bisector(function(d) {
    return d.date;
}).left;

var y = d3.scale.linear().range([height, 0]);

var y0 = d3.scale.linear().range([height, 0]); // Change to y0

var yAxisLeft = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var yAxisRight = d3.svg.axis().scale(y0)
    .orient("right").ticks(5);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(5)
    .ticks(d3.time.days, 31)        // if you want every alternate month make it 2 as the second parameter !!
    .orient("bottom")
    .tickFormat(d3.time.format("%b"));      // %m will produce the month and %Y will produce the year

var line = d3.svg.line()
    .x(function(d) {
        return x(d.date);
    })
    .y(function(d) {
        return y0(d.prices);
    })
    .interpolate("cardinal")
    .tension(0.9);

var svg = d3.select(".chart").append("svg")
    //.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add grid lines

function make_X_axis() {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6);
}

function make_Y_axis() {
    return d3.svg.axis()
        .scale(y)
        .orient("right")
        .ticks(10);
}

//load data

d3.csv("data/myClimateData.csv", function(error, data) {
//alert(country)
   //var result= filterData(data,country);
   var result=data.filter(function(row) {
   //alert(row.country)
      return row['country'] == country;
  });
    result
    //.filter(function(d) { return d.country = country })
    .forEach(function(d) {
        d.date = parseDate(d.date);
        d.climateBar = +d.climateBar;
        d.prices = +d.prices;
        d.climate = d.climate;
    });
    //
    x.domain(d3.extent(result, function(d) {
        return d.date;
    }));


    // x.domain (["jan", "Feb", "March", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"])
    y.domain([0, d3.max(result, function(d) {
        return d.prices;
    })]);
    y0.domain([0, d3.max(result, function(d) {
        return d.prices;
    })]);

    // var color = d3.scale.linear()
    //     .domain([0, d3.max(result,function (d) {
    //         return d.climate;
    //
    //     })])
    //     .range(["green"]);

    //var climates = []; // list of climates generated according to the country!!

    var color = d3.scale.linear()
        .domain([d3.min(result,function (d) {
                     return d.climate;

                 }),
            d3.mean(result,function (d) {
                return d.climate;

            }),
            d3.max(result,function (d) {
                return d.climate;

            })])
            .range(["red", "yellow", "green"]);
    ///axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("x", 60);


    svg.append("g") //Left
    .attr("class", "y axis")
        .call(yAxisLeft)
        .append("text")
        .attr("x", 9)
        .attr("y", -25)
        .attr("dy", ".70em")
        .style("text-anchor", "end")
        .text("Prices ($)");

    // svg.append("g") // Add the Y Axis Right
    // .attr("class", "y axis") // Add the Y Axis Right
    // .attr("transform", "translate(" + width + " ,0)") // move to the right
    // .call(yAxisRight)
    //     .append("text")
    //     .attr("x", 40)
    //     .attr("y", -25)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("Accident rate");


    // add legend *******************




    //add grid
    svg.append("g")
        .attr("class", "grid")
        .call(make_Y_axis()
            .tickSize(-width/1000, 0, 0)
            .tickFormat(""));

    var div = d3.select(".chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    ///BARS

    svg.selectAll("bar")
        .data(result)
        .enter().append("rect")
        .style("fill", function (d) {

            if (d.climate == "0")
            //    return "#ffffb3";
                return color_hash[0][1];
            else if (d.climate == "1")
              //  return "#ccffff";
                return color_hash[1][1];
             else if (d.climate == "2")
              //  return "#cccccc";
                return color_hash[2][1];


        })
      //  .style("fill", color)

        // .style("fill", function(d) {
        //     return "rgb(100, " + (d.climate) + " , 0)";
        // })

        .attr("x", function(d) {
            return x(d.date) - (width / result.length) / 2000;
        })
        .attr("width", 2)
        .attr("y", function(d) {
            return y(d.prices);
        })
        .attr("height", function(d) {
            return height - y(d.prices);
        });


    // svg.selectAll("rect")
    //     .attr("width", 2)
    //     .on("mouseover", function(d) {
    //         div.transition()
    //             .duration(50)
    //             .style("opacity", .9);
    //         div.html("<h3>"+ formatTime(d.date) + "</h3>" + "<br/>" +"<p>Deaths: " +  "<strong>"+ d.climateBar + "</strong>"+"</p>")
    //             .style("left", (d3.event.pageX) + 10+"px")
    //             .style("top", (d3.event.pageY + 28) + "px");
    //     })
    //     .on("mouseout", function(d) {
    //         div.transition()
    //             .duration(50)
    //             .style("opacity", 1e-6);
    //     });

    svg.append("path") // Add the line path.
    .data(result)
        .attr("class", "line")
        .attr("stroke", "red")
        .attr("d", line(result));

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 4.5);

    focus.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() {
            focus.style("display", null);
        })
        .on("mouseout", function(d) {
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(result, x0, 1),
            d0 = result[i - 1],
            d1 = result[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        //move focus around
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.prices) + ")");
        div.transition()
            .duration(5)
            .style("opacity", .9);
        if(d.climate == 0)
        temp="some sunny days"
        else if(d.climate == 1)
        temp="rains"
        else {
        temp="chills"
        }
        div.html("<h3>"+ formatTime(d.date)+ "<br/>"  + d.prices +" CAD<br/>Expect "+temp + "</h3>" )
            .style("left", 1030 + "px")
            .style("top", 1 + "px");
    }
});



}
