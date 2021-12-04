const scoreLayout = {
    width: 1000,
    height: 160,
    chartWidth: 450,
    chartHeight: 110,
    marginTop: 30,
    marginBottom: 40,
    marginLeft: 80,
    marginRight: 10,
    bumper: 10
  };

async function ready() {
    var streaks = await d3.json("streaks_by_team_with_scores.json");
    var selectedSchools = ["Michigan"];

    // create\ background paper for plot
    let svg = d3.select("#score").append("svg");
    svg.attr("id", "my-score")
        .attr("width", scoreLayout.width)
        .attr("height", scoreLayout.height)
        .attr("viewBox", [0, 0, scoreLayout.width, scoreLayout.height].join(" "));

    svg.append('line')
        .style("stroke", "gray")
        .style("stroke-width", 0.5)
        .attr("x1", 80)
        .attr("y1", 85)
        .attr("x2", 530)
        .attr("y2", 85); 

    
        function drawMarks(schoolName) {
            var schoolStreaks = streaks[schoolName];
            var schoolColor = schoolStreaks[0][0].color
            var schoolRecords = []
            for (var i=0 ; i<schoolStreaks.length ; i++) {
                schoolRecords = schoolStreaks[i]
                // NUM WINS
                // line connecting points
            svg.append("path")
                .datum(schoolRecords, d => d["id"])
                .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop})`)
                .attr("class", "connector")
                .attr("fill", "none")
                .attr("stroke", schoolColor)
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x(d => xScale(d["year"]))
                .y(d => yScale(d["score"]))
                )
            
            // mark group scoreLayout
            let markGroupWins = svg.append("g")
                .attr("id", "marks")
                .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop})`);
            // mapping data to actual marks
            let winMarks = markGroupWins.selectAll("circle").data(schoolRecords, d => d["id"]);
            winMarks.join(enter => enter.append("circle"))
                .attr("cx", d => xScale(d["year"]))
                .attr("cy", d => yScale(d["score"]))
                .attr("r", 4)
                .attr("fill", d => d["color"])
                .attr("opacity", 0.7)
                .on("mouseover", function(e, d) {
                    // console.log(d);
                    // console.log(e);
                    tooltip.transition()		
                        .duration(100)		
                        .style("opacity", .9);
                    tooltip.html(d.year + "<br/>" + "Predicted to win " + d.predictedWins + " games " + (d.predictedWins == d.wins ? "and" : "but") + " actually won " + d.wins)	
                        .style("left", (e.x) + "px")		
                        .style("top", (e.y)+ "px");	
                    })					
                .on("mouseout", function(d) {		
                    tooltip.transition()		
                        .duration(50)		
                        .style("opacity", 0);	
                });
            }
            
        }


    function handleSchoolClick(event) {
        svg.selectAll("rect").remove()
        // svg.selectAll(".connector").remove()
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
    let yData =  range(-5, 6);
    let yScale = d3.scaleLinear()
        .domain([d3.min(yData)- 0.9, d3.max(yData)])
        .range([scoreLayout.chartHeight, 0]);
    let yAxis = svg.append("g")
        .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop})`)
        .call(d3.axisLeft(yScale))
        .call(d3.axisLeft(yScale).ticks(8));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    var counter = 0;
    svg.append("text")
        .attr("transform", `translate(${layout.marginLeft - 70},${layout.marginTop - 30})`)
        .text("Score")
        .attr("font-size", 14)
        .attr("fill", "dimgray");
    
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    let xData = range(1985, 2016);
    let xScale = d3.scaleLinear()
        .domain([d3.min(xData) - 0.5, d3.max(xData) + 0.5])
        .range([0, scoreLayout.chartWidth]);
    let xAxis = svg.append("g")
        .attr("transform", `translate(${scoreLayout.marginLeft},${scoreLayout.marginTop + scoreLayout.chartHeight})`)
        .call(d3.axisBottom(xScale))
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // x axis title
    svg.append("text")
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
      
    var tooltip = d3.select("#round").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
      
    for (var i=0; i < selectedSchools.length; i++) {
        drawMarks(selectedSchools[i]);
    }
};

ready();