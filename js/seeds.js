const seedLayout = {
    width: 1000,
    height: 160,
    chartWidth: 425,
    chartHeight: 110,
    marginTop: 30,
    marginBottom: 40,
    marginLeft: 130,
    marginRight: 10,
    bumper: 10
  };

let seedsSvg = d3.select("#seed").append("svg");

var seedsTooltip = d3.select("#seed").append("div")	
  .attr("class", "tooltip seed-tooltip")				
    .style("opacity", 0);
  
let xDataSeeds =  range(1985, 2016);
let xScaleSeeds = d3.scaleLinear()
    .domain([d3.min(xDataSeeds) - 0.5, d3.max(xDataSeeds) + 0.5])
    .range([0, seedLayout.chartWidth]);
let yScaleSeeds = d3.scaleLinear()
    .domain([16 + 2.99, 1])
    .range([seedLayout.chartHeight, 0]);

    
async function seedsReady() {

    seedsSvg.attr("id", "my-seed")
        .attr("width", seedLayout.width)
        .attr("height", seedLayout.height)
        .attr("viewBox", [0, 0, seedLayout.width, seedLayout.height].join(" "));
    
    // format y axis
    let yAxis = seedsSvg.append("g")
        .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop})`)
        .call(d3.axisLeft(yScaleSeeds).ticks(6).tickValues([1,4,7,10,13,16]));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    seedsSvg.append("text")
        .attr("transform", `translate(${seedLayout.marginLeft - 25},${seedLayout.marginTop - 15})`)
        .text("Seed")
        .attr("font-size", 11)
        .attr("fill", "dimgray");
    // add title
    seedsSvg.append("text")
        .attr("transform", `translate(${scoreLayout.marginLeft + 125},${scoreLayout.marginTop - 16})`)
        .text("Team Seed Number Over Time")
        .attr("font-size", 14)
        .attr("fill", "black");
    seedsSvg.append("text")
    .attr("transform", `translate(${470},${seedLayout.marginTop - 16})`)
    .text("Help")
    .attr("text-anchor", "end")
    .attr("font-size", 11)
    .attr("fill", "red")
    .attr("text-decoration", "underline")
    .on("mouseover", function(e, d) {
        helpTooltip.transition()		
            .duration(100)		
            .style("opacity", .9);
        helpTooltip.html("Y-position indicates a team’s tournament seed for each year on the X-axis. 1-seeded teams are expected to be the best, while 16-seeded teams are expected to perform the worst. If a team did not qualify for the tournament in a given year, there is no data point displayed for that year.")	
            .style("left", (e.x) + "px")		
            .style("top", (e.y)+ "px");	
        })					
        .on("mouseout", function(d) {		
            helpTooltip.transition()		
                .duration(50)		
                .style("opacity", 0);	
        })
    
    // format x axis
    let xAxis = seedsSvg.append("g")
        .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop + seedLayout.chartHeight})`)
        .call(d3.axisBottom(xScaleSeeds).ticks(10).tickFormat(d3.format("d")));
    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    seedsSvg.append("text")
        .attr("transform", `translate(${seedLayout.chartWidth + seedLayout.marginLeft + 40},${seedLayout.chartHeight + seedLayout.marginTop + 10})`)
        .text("Year")
        .attr("text-anchor", "end")
        .attr("font-size", 11)
        .attr("fill", "dimgray")

    // plot horizontal reference lines
    for (let i=0; i < 6; i++) {
        seedsSvg.append('line')
            .style("stroke", "gray")
            .style("stroke-width", 0.5)
            .attr("x1", seedLayout.marginLeft)
            .attr("y1", seedLayout.marginTop + i*seedLayout.chartHeight/6)
            .attr("x2", seedLayout.marginLeft + seedLayout.chartWidth)
            .attr("y2", seedLayout.marginTop + i*seedLayout.chartHeight/6); 
    }
    // // create reference line at x=selectedYear    
    // seedsSvg.append('line')
    //     .attr("id", "scores-selected-year-line")
    //     .style("stroke", "gray")
    //     .style("stroke-width", 0.5)
    //     .attr("x1", seedLayout.marginLeft + xScaleScores(selectedYear) + 0.5)
    //     .attr("y1", seedLayout.marginTop)
    //     .attr("x2", seedLayout.marginLeft + xScaleScores(selectedYear))
    //     .attr("y2", seedLayout.marginTop + seedLayout.chartHeight); 
    
    // draw points for each school
    for (var i=0; i < selectedSchools.length; i++) {
        drawSeeds(selectedSchools[i]);
    }

};


function removeSeeds(schoolName) {
    seedsSvg.selectAll("#seed-marks-" + strFormat(schoolName)).remove()
    seedsSvg.selectAll(".seed-lines-" + strFormat(schoolName)).remove()
};


function drawSeeds(schoolName) {
    var schoolStreaks = streaks[schoolName];
    var schoolColor = schoolStreaks[0][0].color
    var schoolRecords = []
    for (var i=0 ; i<schoolStreaks.length ; i++) {
        schoolRecords = schoolStreaks[i]
        
        // draw points
        let markGroupWins = seedsSvg.append("g")
            .attr("id", "seed-marks-" + strFormat(schoolName))
            .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop})`);
        let winMarks = markGroupWins.selectAll("circle").data(schoolRecords, d => d["id"]);
        winMarks.join(enter => enter.append("circle"))
            .attr("cx", d => xScaleSeeds(d["year"]))
            .attr("cy", d => yScaleSeeds(d["seed"]))
            .attr("r", 4)
            .attr("fill", d => d["color"])
            .attr("opacity", 0.8)
            .on("mouseover", function(e, d) {
                seedsTooltip.transition()		
                    .duration(100)		
                    .style("opacity", .9);
                seedsTooltip.html("<b>" + d.name + " " + d.year + "</b><br/>" + d.seed + " seed")	
                    .style("left", (e.x) + "px")		
                    .style("top", (e.y)+ "px");	
                })					
            .on("mouseout", function(d) {		
                seedsTooltip.transition()		
                    .duration(50)		
                    .style("opacity", 0);	
            })
            .on("click", function(e, d) {
                updateSelectedYear(d.year);
            });

            // draw lines connecting points
            seedsSvg.append("path")
                .datum(schoolRecords, d => d["id"])
                .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop})`)
                .attr("class", "seed-lines-" + strFormat(schoolName))
                .attr("fill", "none")
                .attr("stroke", schoolColor)
                .attr("stroke-opacity", 0.7)
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x(d => xScaleSeeds(d["year"]))
                .y(d => yScaleSeeds(d["seed"]))
                );
    }
    
}
