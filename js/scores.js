const scoreLayout = {
    width: 1000,
    height: 160,
    chartWidth: 425,
    chartHeight: 110,
    marginTop: 30,
    marginBottom: 40,
    marginLeft: 105,
    marginRight: 10,
    bumper: 10
};

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function strFormat(schoolName) {
    return schoolName.replaceAll(' ', '-').replaceAll("'", '-').replaceAll(',', '-').replaceAll('.', '-').replace('&','')
}

let scoresSvg = d3.select("#score").append("svg");

let xDataScores = range(1985, 2016);
let xScaleScores = d3.scaleLinear()
    .domain([d3.min(xDataScores) - 0.5, d3.max(xDataScores) + 0.5])
    .range([0, scoreLayout.chartWidth]);
let yDataScores =  range(-5, 6);
let yScaleScores = d3.scaleLinear()
        .domain([d3.min(yDataScores)- 0.9, d3.max(yDataScores)])
        .range([scoreLayout.chartHeight, 0]);

var scoresTooltip = d3.select("#round").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


async function scoresReady() {

    // create svg called my-score for this plot
    scoresSvg.attr("id", "my-score")
        .attr("width", scoreLayout.width)
        .attr("height", scoreLayout.height)
        .attr("viewBox", [0, 0, scoreLayout.width, scoreLayout.height].join(" "));

    // create reference line at y=0
    scoresSvg.append('line')
        .style("stroke", "gray")
        .style("stroke-width", 0.5)
        .attr("x1", 105)
        .attr("y1", 85.5)
        .attr("x2", 530)
        .attr("y2", 85); 


    function handleSchoolClick(event) {
        scoresSvg.selectAll("rect").remove()
        // scoresSvg.selectAll(".connector").remove()
        var btn = event.target;
        var schoolName = btn.innerHTML;
        if (btn.style.backgroundColor !== "white") {
            btn.style.backgroundColor = "white";
            btn.style.color = "grey";
        } else {
            btn.style.backgroundColor = streaks[schoolName][0][0].color;
            btn.style.color = "white";
        }
        const index = selectedSchools.indexOf(schoolName);
        if (index > -1) {
            selectedSchools.splice(index, 1);
        } else {
            selectedSchools.push(schoolName);
        }
        // console.log(selectedSchools);
        for (var i=0; i<selectedSchools.length; i++){ 
            drawMark(selectedSchools[i]);
        }
        
    }
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    // SCALE FUNCTIONS
    // y scale and axis for wins by team

    let yAxis = scoresSvg.append("g")
        .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop})`)
        .call(d3.axisLeft(yScaleScores))
        .call(d3.axisLeft(yScaleScores).ticks(8));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");

    scoresSvg.append("text")
        .attr("transform", `translate(${mainLayout.marginLeft - 37},${mainLayout.marginTop - 25})`)
        .text("Score")
        .attr("font-size", 11)
        .attr("fill", "dimgray");    

    let xAxis = scoresSvg.append("g")
        .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop + scoreLayout.chartHeight})`)
        .call(d3.axisBottom(xScaleScores))
        .call(d3.axisBottom(xScaleScores).ticks(10).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // x axis title
    scoresSvg.append("text")
      .attr("transform", `translate(${scoreLayout.width - scoreLayout.marginRight - 430},${scoreLayout.height - scoreLayout.marginBottom + 15})`)
    //   .text("Year")
      .attr("text-anchor", "end")
      .attr("font-size", 14)
      .attr("fill", "dimgray")
    // // create a button for each school
    // var listDiv = document.getElementById('list');
    // var counter = 0;
    // for (var i=0; i < records.length; i++) {
    //     var button = document.createElement('button');
    //     button.classList = 'btn btn-outline-secondary';
    //     button.id = records[i]["name"];
    //     // button.style.backgroundColor = ...
    //     button.innerHTML = records[i]["name"];
    //     button.onclick = handleSchoolClick;
    //     if (counter < 8) {
    //         listDiv.appendChild(button); 
    //     }
    //     counter += 1;                                
    // }
      
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
            .attr("r", 3)
            .attr("fill", d => d["color"])
            .attr("opacity", 0.7)
            .on("mouseover", function(e, d) {
                // console.log(d);
                // console.log(e);
                scoresTooltip.transition()		
                    .duration(100)		
                    .style("opacity", .9);
                scoresTooltip.html("<b>" + d.name + " " + d.year + "</b><br/>" + "Predicted to win " + d.predictedWins + " game" + (d.predictedWins > 1 ? "s " : " ") + (d.predictedWins == d.wins ? "and" : "but") + " actually won " + d.wins)	
                    .style("left", (e.x) + "px")		
                    .style("top", (e.y)+ "px");	
                })					
            .on("mouseout", function(d) {		
                scoresTooltip.transition()		
                    .duration(50)		
                    .style("opacity", 0);	
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