const layout = {
    width: 1000,
    height: 510,
    chartWidth: 950,
    topChartHeight: 225,
    bottomChartHeight: 225,
    marginTop: 20,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 10,
    bumper: 10
  };



async function ready() {
    var records = await d3.json("records.json");
    var streaks = await d3.json("streaks_by_team.json");
    var selectedSchools = ["Georgetown", "Michigan"];

    function filterData() {
        return records.filter(record => selectedSchools.includes(record.name));
    }
    var filteredRecords = filterData();
    console.log(filteredRecords.length);

    // create background paper for plot
    let svg = d3.select("#vis").append("svg");
    svg.attr("id", "my-vis")
        .attr("width", layout.width)
        .attr("height", layout.height)
        .attr("viewBox", [0, 0, layout.width, layout.height].join(" "));

    
    function drawMarks(schoolName) {
        // var schoolRecords = records.filter(record => record.name === schoolName);
        var schoolStreaks = streaks[schoolName];
        console.log(schoolStreaks)
        var schoolColor = schoolStreaks[0][0].color
        var schoolRecords = []
        for (var i=0 ; i<schoolStreaks.length ; i++) {
            schoolRecords = schoolStreaks[i]
            // NUM WINS
            // line connecting points
        svg.append("path")
            .datum(schoolRecords, d => d["id"])
            .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`)
            .attr("class", "connector")
            .attr("fill", "none")
            .attr("stroke", schoolColor)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(d => xScale(d["year"]))
            .y(d => yScale(d["wins"]))
            )
            // mark group layout
            let markGroupWins = svg.append("g")
            .attr("id", "marks")
            .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`);
            // mapping data to actual marks
            let winMarks = markGroupWins.selectAll("circle").data(schoolRecords, d => d["id"]);
            winMarks.join(enter => enter.append("circle"))
            .attr("cx", d => xScale(d["year"]))
            .attr("cy", d => yScale(d["wins"]))
            .attr("r", d => d["wins"] === 6? 10 : 4)
            .attr("fill", d => d["color"])
            .attr("opacity", 0.7);
            
            // SEEDS
            // line connecting points
            svg.append("path")
            .datum(schoolRecords, d => d["id"])
            .attr("transform", `translate(${layout.marginLeft},${layout.marginTop + layout.topChartHeight + 30})`)
            .attr("class", "connector")
            .attr("fill", "none")
            .attr("stroke", schoolColor)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(d => xScale(d["year"]))
            .y(d => yScaleBottom(d["seed"]))
            )
            // mark group layout
            let markGroupSeeds = svg.append("g")
            .attr("id", "marks")
            .attr("transform", `translate(${layout.marginLeft},${layout.marginTop + layout.topChartHeight + 30})`);
            // mapping data to actual marks
            let seedMarks = markGroupSeeds.selectAll("circle").data(schoolRecords, d => d["id"]);
            seedMarks.join(enter => enter.append("circle")).join(exit => exit.remove())
            .attr("cx", d => xScale(d["year"]))
            .attr("cy", d => yScaleBottom(d["seed"]))
            .attr("r", 4)
            .attr("fill", d => d["color"])
            .attr("opacity", 0.7);
        }
    }


    function handleSchoolClick(event) {
        svg.selectAll("circle").remove()
        svg.selectAll(".connector").remove()
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
        console.log(selectedSchools);
        for (var i=0; i<selectedSchools.length; i++){ 
            drawMarks(selectedSchools[i]);
        }
        
    }
    

    // SCALE FUNCTIONS
    // y scale and axis for wins by team
    let yScale = d3.scaleLinear()
        .domain([0 , 6])
        .range([layout.topChartHeight, 0]);
    let yAxis = svg.append("g")
        .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`)
        .call(d3.axisLeft(yScale))
        .call(d3.axisLeft(yScale).ticks(6));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    var counter = 0;
    svg.append("text")
        .attr("transform", `translate(${layout.marginLeft + 5},${layout.marginTop + 5})`)
        .text("Wins")
        .attr("font-size", 14)
        .attr("fill", "dimgray");
    
    // y scale and axis for seeds by team
    let yScaleBottom = d3.scaleLinear()
        .domain([16, 1])
        .range([layout.bottomChartHeight, 0]);
    let yAxisBottom = svg.append("g")
        .attr("transform", `translate(${layout.marginLeft},${layout.marginTop + layout.topChartHeight + 30})`)
        .call(d3.axisLeft(yScaleBottom))
        .call(d3.axisLeft(yScaleBottom).ticks(16));
    yAxisBottom.selectAll("text").attr("fill", "gray");
    yAxisBottom.selectAll("line, .domain").attr("stroke", "gray");
    svg.append("text")
        .attr("transform", `translate(${layout.marginLeft + 5},${layout.marginTop + layout.topChartHeight + layout.bottomChartHeight + 35})`)
        .text("Seed")
        .attr("font-size", 14)
        .attr("fill", "dimgray");
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
        }
    let xData =  range(1985, 2016);
    let xScale = d3.scaleLinear()
        .domain([d3.min(xData) - 0.5, d3.max(xData) + 0.5])
        .range([0, layout.chartWidth]);
    let xAxis = svg.append("g")
        .attr("transform", `translate(${layout.marginLeft},${layout.marginTop + layout.topChartHeight})`)
        .call(d3.axisBottom(xScale))
        .call(d3.axisBottom(xScale).ticks(32).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // create a button for each school
    var listDiv = document.getElementById('list');
    var counter = 0;
    for (var i=0; i < records.length; i++) {
        var button = document.createElement('button');
        button.classList = 'btn btn-outline-secondary';
        button.id = records[i]["name"];
        // button.style.backgroundColor = ...
        button.innerHTML = records[i]["name"];
        button.onclick = handleSchoolClick;
        if (counter < 8) {
            listDiv.appendChild(button); 
        }
        counter += 1;                                
    }
    for (var i=0; i < selectedSchools.length; i++) {
        console.log(selectedSchools[i]);
        // console.log(streaks[selectedSchools[i]])
        drawMarks(selectedSchools[i]);
    }
};

ready();