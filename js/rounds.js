const roundLayout = {
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

var wins_to_round = {
    0: "Round of 64",
    1:"Round of 32",
    2:"Sweet Sixteen",
    3: "Elite 8",
    4:"Final Four",
    5:"Championship",
    6:"Winner"
};

let roundsSvg = d3.select("#round").append("svg");

let xDataRounds =  range(1985, 2016);
let xScaleRounds = d3.scaleLinear()
    .domain([d3.min(xDataRounds) - 0.5, d3.max(xDataRounds) + 0.5])
    .range([0, roundLayout.chartWidth]);
let yDataRounds =  range(0, 6);
let yScaleRounds = d3.scaleLinear()
    .domain([d3.min(yDataRounds) - 0.9, d3.max(yDataRounds)])
    .range([roundLayout.chartHeight, 0]);

var roundsTooltip = d3.select("#round").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


async function roundsReady() {
    
    // create background paper for plot
    
    roundsSvg.attr("id", "my-round")
        .attr("width", roundLayout.width)
        .attr("height", roundLayout.height)
        .attr("viewBox", [0, 0, roundLayout.width, roundLayout.height].join(" "));
        
    function handleSchoolClick(event) {
        roundsSvg.selectAll("circle").remove()
        roundsSvg.selectAll(".connector").remove()
        var btn = event.target;
        var schoolName = btn.innerHTML;
        // console.log("clicked " + schoolName);
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
        // console.log("selected schools: " + selectedSchools);
        for (var i = 0; i < selectedSchools.length; i++){
            // console.log("drawing: " + selectedSchools[i]);
            drawMarks(selectedSchools[i]);
        }
    }
        
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    // SCALE FUNCTIONS
    // y scale and axis for wins by team    

    let yAxis = roundsSvg.append("g")
        .attr("transform", `translate(${roundLayout.marginLeft},${roundLayout.marginTop})`)
        .call(d3.axisLeft(yScaleRounds))
        .call(d3.axisLeft(yScaleRounds).ticks(6).tickFormat(function(d, i) {
            return data[i].val;
        }));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");

    roundsSvg.append("text")
        .attr("transform", `translate(${roundLayout.marginLeft - 95},${roundLayout.marginTop - 15})`)
        .text("Round Knocked Out")
        .attr("font-size", 11)
        .attr("fill", "dimgray");
    
    let xAxis = roundsSvg.append("g")
        .attr("transform", `translate(${roundLayout.marginLeft},${roundLayout.marginTop + roundLayout.chartHeight})`)
        .call(d3.axisBottom(xScaleRounds))
        .call(d3.axisBottom(xScaleRounds).ticks(10).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // x axis title
    roundsSvg.append("text")
    .attr("transform", `translate(${roundLayout.width - roundLayout.marginRight - 500},${roundLayout.height - roundLayout.marginBottom + 15})`)
    //   .text("Year")
    .attr("text-anchor", "end")
    .attr("font-size", 14)
    .attr("fill", "dimgray")
    // create a button for each school
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
        // console.log(selectedSchools[i]);
        // // console.log(streaks[selectedSchools[i]])
        drawRounds(selectedSchools[i]);
    }   
};

function removeRounds(schoolName) {
    roundsSvg.selectAll("#round-marks-" + strFormat(schoolName)).remove()
    roundsSvg.selectAll(".round-lines-" + strFormat(schoolName)).remove()
};

function drawRounds(schoolName) {
    // var schoolRecords = records.filter(record => record.name === schoolName);
    var schoolStreaks = streaks[schoolName];
    // console.log(schoolStreaks)
    var schoolColor = schoolStreaks[0][0].color
    var schoolRecords = []
    for (var i=0 ; i<schoolStreaks.length ; i++) {
        schoolRecords = schoolStreaks[i]
        
        // draw points
        let markGroupWins = roundsSvg.append("g")
            .attr("id", "round-marks-" + strFormat(schoolName))
            .attr("transform", `translate(${roundLayout.marginLeft},${roundLayout.marginTop})`);
        let winMarks = markGroupWins.selectAll("circle").data(schoolRecords, d => d["id"]);
        winMarks.join(enter => enter.append("circle"))
            .attr("cx", d => xScaleRounds(d["year"]))
            .attr("cy", d => yScaleRounds(d["wins"]))
            .attr("r", 3)
            .attr("fill", d => d["color"])
            .attr("opacity", 0.7)
            .on("mouseover", function(e, d) {
                // console.log(d);
                // console.log(e);
                roundsTooltip.transition()		
                    .duration(100)		
                    .style("opacity", .9);
                roundsTooltip.html("<b>" + d.name + " " + d.year + "</b><br/>" + (d.wins === 6 ? "" : "Lost in ") + wins_to_round[d.wins])	
                    .style("left", (e.x) + "px")		
                    .style("top", (e.y)+ "px");	
                })					
            .on("mouseout", function(d) {		
                roundsTooltip.transition()		
                    .duration(50)		
                    .style("opacity", 0);	
            });
        
        // draw lines connecting points
        roundsSvg.append("path")
            .datum(schoolRecords, d => d["id"])
            .attr("transform", `translate(${roundLayout.marginLeft},${roundLayout.marginTop})`)
            .attr("class", "round-lines-" + strFormat(schoolName))
            .attr("fill", "none")
            .attr("stroke", schoolColor)
            .attr("stroke-opacity", 0.7)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => xScaleRounds(d["year"]))
                .y(d => yScaleRounds(d["wins"]))
            );
    }
    
};