const seedLayout = {
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

let seedsSvg = d3.select("#seed").append("svg");

var seedsTooltip = d3.select("#seed").append("div")	
  .attr("class", "tooltip seed-tooltip")				
    .style("opacity", 0);
  
let xDataSeeds =  range(1985, 2016);
let xScaleSeeds = d3.scaleLinear()
    .domain([d3.min(xDataSeeds) - 0.5, d3.max(xDataSeeds) + 0.5])
    .range([0, seedLayout.chartWidth]);
let yDataSeeds =  range(1, 16);
let yScaleSeeds = d3.scaleLinear()
    .domain([d3.min(yDataSeeds) - 0.9, d3.max(yDataSeeds)])
    .range([seedLayout.chartHeight, 0]);

    
async function seedsReady() {

    // create background paper for plot
    seedsSvg.attr("id", "my-seed")
        .attr("width", seedLayout.width)
        .attr("height", seedLayout.height)
        .attr("viewBox", [0, 0, seedLayout.width, seedLayout.height].join(" "));

    function handleSchoolClick(event) {
        seedsSvg.selectAll("rect").remove()
        // seedsSvg.selectAll(".connector").remove()
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
            drawMarks(selectedSchools[i]);
        }
        
    }
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    // SCALE FUNCTIONS
    // y scale and axis for wins by team
    
    let yAxis = seedsSvg.append("g")
        .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop})`)
        .call(d3.axisLeft(yScaleSeeds))
        .call(d3.axisLeft(yScaleSeeds).ticks(8));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");

    seedsSvg.append("text")
        .attr("transform", `translate(${seedLayout.marginLeft - 25},${seedLayout.marginTop - 15})`)
        .text("Seed")
        .attr("font-size", 11)
        .attr("fill", "dimgray");
    
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    
    let xAxis = seedsSvg.append("g")
        .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop + seedLayout.chartHeight})`)
        .call(d3.axisBottom(xScaleSeeds))
        .call(d3.axisBottom(xScaleSeeds).ticks(10).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // x axis title
    seedsSvg.append("text")
      .attr("transform", `translate(${seedLayout.width - seedLayout.marginRight - 430},${seedLayout.height - seedLayout.marginBottom + 15})`)
    //   .text("Year")
      .attr("text-anchor", "end")
      .attr("font-size", 14)
      .attr("fill", "dimgray")
      
    for (var i=0; i < selectedSchools.length; i++) {
        drawSeeds(selectedSchools[i]);
        // drawColumns(allSchools[i]);
    }

};


function removeSeeds(schoolName) {
    seedsSvg.selectAll("#seed-marks-" + schoolName.replaceAll(' ', '-')).remove()
    seedsSvg.selectAll(".seed-lines-" + schoolName.replaceAll(' ', '-')).remove()
};

function drawSeeds(schoolName) {
    var schoolStreaks = streaks[schoolName];
    var schoolColor = schoolStreaks[0][0].color
    var schoolRecords = []
    for (var i=0 ; i<schoolStreaks.length ; i++) {
        schoolRecords = schoolStreaks[i]

        // draw line connecting points
        seedsSvg.append("path")
            .datum(schoolRecords, d => d["id"])
            .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop})`)
            .attr("class", "seed-lines-" + schoolName.replaceAll(' ', '-'))
            .attr("fill", "none")
            .attr("stroke", schoolColor)
            .attr("stroke-opacity", 0.7)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(d => xScaleSeeds(d["year"]))
            .y(d => yScaleSeeds(d["seed"]))
            )
        
        // draw points
        let markGroupWins = seedsSvg.append("g")
            .attr("id", "seed-marks-" + schoolName.replaceAll(' ', '-'))
            .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop})`);
        let winMarks = markGroupWins.selectAll("circle").data(schoolRecords, d => d["id"]);
        winMarks.join(enter => enter.append("circle"))
            .attr("cx", d => xScaleSeeds(d["year"]))
            .attr("cy", d => yScaleSeeds(d["seed"]))
            .attr("r", 3)
            .attr("fill", d => d["color"])
            .attr("opacity", 0.7)
            .on("mouseover", function(e, d) {
                // console.log(d);
                // console.log(e);
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
            });
    }
    
}
// seedsReady();