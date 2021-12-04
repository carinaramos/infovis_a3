const seedLayout = {
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
    var records = await d3.json("records.json");
    var streaks = await d3.json("streaks_by_team.json");
    var selectedSchools = ["Georgetown"];
    var allSchools = Object.keys(streaks)
    // console.log(allSchools.length)
    function filterData() {
        return records.filter(record => selectedSchools.includes(record.name));
    }
    var filteredRecords = filterData();
    // console.log(filteredRecords.length);

    // create\ background paper for plot
    let svg = d3.select("#seed").append("svg");
    svg.attr("id", "my-seed")
        .attr("width", seedLayout.width)
        .attr("height", seedLayout.height)
        .attr("viewBox", [0, 0, seedLayout.width, seedLayout.height].join(" "));

    
    function drawColumns(schoolName) {
        // var schoolRecords = records.filter(record => record.name === schoolName);
        // var schoolStreaks = streaks[schoolName];
        // // console.log(schoolStreaks)
        // var schoolColor = schoolStreaks[0][0].color
        // var schoolRecords = []
        // for (var i=0 ; i<schoolStreaks.length ; i++) {
        //     schoolRecords = schoolStreaks[i]

        //     svg.selectAll(".bar")
        //         .data(schoolRecords, d => d["id"])
        //         .enter().append("rect")
        //         .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop})`)
        //         .attr("class", "bar")
        //         .attr("fill", "steelblue")
        //         .attr("opacity", 0.7)
        //         .attr("x", d => xScale(d["seed"]))
        //         .attr("y", d => yScale(d["wins"]))
        //         .attr("width", 10)
        //         .attr("height", function(d) { return seedLayout.chartHeight - yScale(d.wins); });
        // }
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
            drawColumns(selectedSchools[i]);
        }
        
    }
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    // SCALE FUNCTIONS
    // y scale and axis for wins by team
    let yData =  range(1, 16);
    let yScale = d3.scaleLinear()
        .domain([d3.min(yData) - 0.9, d3.max(yData)])
        .range([seedLayout.chartHeight, 0]);
    let yAxis = svg.append("g")
        .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop})`)
        .call(d3.axisLeft(yScale))
        .call(d3.axisLeft(yScale).ticks(8));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    var counter = 0;
    svg.append("text")
        .attr("transform", `translate(${seedLayout.marginLeft - 70},${seedLayout.marginTop - 20})`)
        .text("Seed")
        .attr("font-size", 14)
        .attr("fill", "dimgray");
    
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    let xData =  range(1985, 2016);
    let xScale = d3.scaleLinear()
        .domain([d3.min(xData) - 0.5, d3.max(xData) + 0.5])
        .range([0, seedLayout.chartWidth]);
    let xAxis = svg.append("g")
        .attr("transform", `translate(${seedLayout.marginLeft},${seedLayout.marginTop + seedLayout.chartHeight})`)
        .call(d3.axisBottom(xScale))
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // x axis title
    svg.append("text")
      .attr("transform", `translate(${seedLayout.width - seedLayout.marginRight - 430},${seedLayout.height - seedLayout.marginBottom + 15})`)
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
        drawColumns(selectedSchools[i]);
        // drawColumns(allSchools[i]);
    }
};

ready();