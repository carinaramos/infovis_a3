const scoreLayout = {
    width: 1000,
    height: 180,
    chartWidth: 425,
    chartHeight: 110,
    marginTop: 30,
    marginBottom: 40,
    marginLeft: 130,
    marginRight: 10,
    bumper: 10
};

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function strFormat(schoolName) {
    return schoolName.replaceAll(' ', '-').replaceAll("'", '-').replaceAll(',', '-').replaceAll('.', '-').replace('&','')
}

var helpTooltip = d3.select("#round").append("div")	
    .attr("class", "tooltip help-tooltip")				
    .style("opacity", 0);


let scoresSvg = d3.select("#score").append("svg");

let xDataScores = range(1985, 2016);
let xScaleScores = d3.scaleLinear()
    .domain([d3.min(xDataScores) - 0.5, d3.max(xDataScores) + 0.5])
    .range([0, scoreLayout.chartWidth]);
let yDataScores =  range(-6, 6);
let yScaleScores = d3.scaleLinear()
        .domain([d3.min(yDataScores), d3.max(yDataScores)])
        .range([scoreLayout.chartHeight, 0]);

var scoresTooltip = d3.select("#round").append("div")	
    .attr("class", "tooltip score-tooltip")				
    .style("opacity", 0);




async function scoresReady() {

    // create svg called my-score for this plot
    scoresSvg.attr("id", "my-score")
        .attr("width", scoreLayout.width)
        .attr("height", scoreLayout.height)
        .attr("viewBox", [0, 0, scoreLayout.width, scoreLayout.height].join(" "));

    // format y axis
    let yAxis = scoresSvg.append("g")
        .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop})`)
        .call(d3.axisLeft(yScaleScores))
        .call(d3.axisLeft(yScaleScores).ticks(8).tickFormat(d3.format("+d")));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    scoresSvg.append("text")
        .attr("transform", `translate(${scoreLayout.marginLeft - 125},${scoreLayout.marginTop - 15})`)
        .text("Games Won vs. Expected")
        .attr("font-size", 11)
        .attr("fill", "dimgray");
    
    // add title
    scoresSvg.append("text")
        .attr("transform", `translate(${scoreLayout.marginLeft + 125},${scoreLayout.marginTop - 16})`)
        .text("Team Performance Over Time")
        .attr("font-size", 14)
        .attr("fill", "black");

    // add help text
    scoresSvg.append("text")
      .attr("transform", `translate(${465},${scoreLayout.marginTop - 16})`)
      .text("Help")
      .attr("text-anchor", "end")
      .attr("font-size", 11)
      .attr("fill", "red")
      .attr("text-decoration", "underline")
      .on("mouseover", function(e, d) {
        helpTooltip.transition()		
            .duration(100)		
            .style("opacity", .9);
        helpTooltip.html("Performance scores for each year are calculated by subtracting the actual number of games a team won in each year from the number of games that team was predicted to win based on its seed that year. Scores above zero indicate more wins than expected, while scores below zero indicate fewer.  If a team did not qualify for the tournament in a given year, there is no data point displayed for that year.")	
            .style("left", (e.x) + "px")		
            .style("top", (e.y)+ "px");	
        })					
        .on("mouseout", function(d) {		
            helpTooltip.transition()		
                .duration(50)		
                .style("opacity", 0);	
        })
    

    // format x axis
    let xAxis = scoresSvg.append("g")
        .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop + scoreLayout.chartHeight})`)
        .call(d3.axisBottom(xScaleScores))
        .call(d3.axisBottom(xScaleScores).ticks(10).tickFormat(d3.format("d")));
    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    scoresSvg.append("text")
      .attr("transform", `translate(${scoreLayout.chartWidth + scoreLayout.marginLeft + 40},${scoreLayout.chartHeight + scoreLayout.marginTop + 10})`)
      .text("Year")
      .attr("text-anchor", "end")
      .attr("font-size", 11)
      .attr("fill", "dimgray")

    // plot horizontal reference lines
    for (let i=0; i < 6; i++) {
        scoresSvg.append('line')
            .style("stroke", "gray")
            .style("stroke-width", i == 3? 1.5 : 0.5)
            .attr("x1", scoreLayout.marginLeft)
            .attr("y1", scoreLayout.marginTop + i*scoreLayout.chartHeight/6)
            .attr("x2", scoreLayout.marginLeft + scoreLayout.chartWidth)
            .attr("y2", scoreLayout.marginTop + i*scoreLayout.chartHeight/6); 
    }

    // // create reference line at x=selectedYear
    // scoresSvg.append('line')
    //     .attr("id", "scores-selected-year-line")
    //     .style("stroke", "gray")
    //     .style("stroke-width", 0.5)
    //     .attr("x1", scoreLayout.marginLeft + xScaleScores(selectedYear) + 0.5)
    //     .attr("y1", scoreLayout.marginTop)
    //     .attr("x2", scoreLayout.marginLeft + xScaleScores(selectedYear))
    //     .attr("y2", scoreLayout.marginTop + scoreLayout.chartHeight); 

    for (var i=0; i < selectedSchools.length; i++) {
        drawScores(selectedSchools[i]);
    }
};

function removeScores(schoolName) {
    scoresSvg.selectAll("#score-marks-" + strFormat(schoolName)).remove()
    scoresSvg.selectAll(".score-lines-" + strFormat(schoolName)).remove()
};

function drawScores(schoolName) {
    var schoolStreaks = streaks[schoolName];
    var schoolColor = schoolStreaks[0][0].color
    var schoolRecords = []

    for (var i=0 ; i < schoolStreaks.length ; i++) {
        schoolRecords = schoolStreaks[i]
    
        // draw points
        let markGroupWins = scoresSvg.append("g")
            .attr("id", "score-marks-" + strFormat(schoolName))
            .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop})`);
        let winMarks = markGroupWins.selectAll("circle").data(schoolRecords, d => d["id"]);
        winMarks.join(enter => enter.append("circle"))
            .attr("cx", d => xScaleScores(d["year"]))
            .attr("cy", d => yScaleScores(d["score"]))
            .attr("r", 4)
            .attr("fill", d => d["color"])
            .attr("opacity", 0.8)
            .on("mouseover", function(e, d) {
                scoresTooltip.transition()		
                    .duration(100)		
                    .style("opacity", .9);
                scoresTooltip.html("<b>" + d.name + " " + d.year + "</b><br/>" + "Predicted to win " + (d.predictedWins == 4.75 ? "4 to 6" : d.predictedWins) + " game" + (d.predictedWins == 1 ? " " : "s ") + (d.predictedWins == d.wins ? "and " : "but ")  + " won " + d.wins)	
                    .style("left", (e.x) + "px")		
                    .style("top", (e.y)+ "px");	
                })					
            .on("mouseout", function(d) {		
                scoresTooltip.transition()		
                    .duration(50)		
                    .style("opacity", 0);	
            })
            .on("click", function(e, d) {
                console.log("clicking on: " + d.name);
                updateSelectedYear(d.year);
            });
        
        // draw lines connecting points
        scoresSvg.append("path")
            .datum(schoolRecords, d => d["id"])
            .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop})`)
            .attr("class", "score-lines-" + strFormat(schoolName))
            .attr("fill", "none")
            .attr("stroke", schoolColor)
            .attr("stroke-opacity", 0.7)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(d => xScaleScores(d["year"]))
            .y(d => yScaleScores(d["score"]))
        )
    }
    
};