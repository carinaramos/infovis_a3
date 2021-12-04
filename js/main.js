const layout = {
    width: 1000,
    height: 550,
    chartWidth: 600,
    chartHeight: 460,
    marginTop: 40,
    marginBottom: 20,
    marginLeft: 90,
    marginRight: 10,
    bumper: 10
  };

// adapted from https://stackoverflow.com/questions/44872048/d3-js-how-can-i-create-an-axis-with-custom-labels-and-customs-ticks
var data = [{
    wins: 0,
    val: "Round of 64"
}, {
    wins: 1,
    val: "Round of 32"
}, {
    wins: 2,
    val: "Sweet Sixteen"
}, {
    wins: 3,
    val: "Elite 8"
}, {
    wins: 4,
    val: "Final Four"
}, {
    wins: 5,
    val: "Championship"
}, {
    wins: 6,
    val: "Winner"
}];


async function ready() {
    var years = await d3.json("years_with_scores.json");
    var selectedSchools = ["Georgetown"];
    var selectedYear = ["2000"];
    // create\ background paper for plot
    let svg = d3.select("#main").append("svg");
    svg.attr("id", "my-main")
        .attr("width", layout.width)
        .attr("height", layout.height)
        .attr("viewBox", [0, 0, layout.width, layout.height].join(" "));

    
    function drawColumns(year) {
        var teams = years[year];
        // console.log(teams)
       
        
        svg.selectAll("bar")
            .data(teams)
            .enter().append("rect")
            .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`)
            .attr("class", "bar")
            .attr("fill", d => d["color"])
            .attr("opacity", 0.7)
            .attr("x", d => xScale(d["seed"])+ d.offset*10)
            .attr("y", d => yScale(d["wins"]))
            .attr("width", 8)
            .attr('rx', 0)
            .attr("height", function(d) { return layout.chartHeight - yScale(d.wins); })
            .on("mouseover", function(e, d) {
                tooltip.transition()		
                    .duration(100)		
                    .style("opacity", .9);
                tooltip.html(d.name + "<br/>"  + "Lost to XXX (90-78)")	
                    .style("left", (e.x) + "px")		
                    .style("top", (e.y)+ "px");	
                })					
            .on("mouseout", function(d) {		
                tooltip.transition()		
                    .duration(50)		
                    .style("opacity", 0);	
            });
    }
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    // SCALE FUNCTIONS
    // y scale and axis for wins by team
    let yData =  range(0, 6);
    let yScale = d3.scaleLinear()
        .domain([d3.min(yData) - 0.2, d3.max(yData)])
        .range([layout.chartHeight, 0]);
    let yAxis = svg.append("g")
        .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`)
        .call(d3.axisLeft(yScale))
        .call(d3.axisLeft(yScale).ticks(6).tickFormat(function(d, i) {
            return data[i].val;
          }));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");

    // yAxis.selectAll('.major text')
    //     .attr('transform', 'translate( 16 ,0)');
    
    svg.append("text")
        .attr("transform", `translate(${layout.marginLeft - 70},${layout.marginTop + layout.chartHeight/2}) rotate(270)`)
        .text("Round Knocked Out")
        .attr("font-size", 14)
        .attr("fill", "dimgray");
    
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    let xData =  range(1, 16);
    let xScale = d3.scaleLinear()
        .domain([d3.min(xData), d3.max(xData)])
        .range([0, layout.chartWidth]);
    let xAxis = svg.append("g")
        .attr("transform", `translate(${layout.marginLeft},${layout.marginTop + layout.chartHeight})`)
        .call(d3.axisBottom(xScale))
        .call(d3.axisBottom(xScale).ticks(16).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // x axis title
    svg.append("text")
      .attr("transform", `translate(${layout.chartWidth/2 + layout.marginLeft},${layout.height - layout.marginBottom + 15})`)
      .text("Seed")
      .attr("text-anchor", "end")
      .attr("font-size", 14)
      .attr("fill", "dimgray")

    // Define the div for the tooltip - https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    var tooltip = d3.select("#main").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

            
    drawColumns(selectedYear);
};

ready();