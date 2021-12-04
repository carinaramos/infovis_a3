const layout = {
    width: 1000,
    height: 550,
    chartWidth: 620,
    chartHeight: 450,
    marginTop: 50,
    marginBottom: 20,
    marginLeft: 80,
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
    var records = await d3.json("records.json");
    var streaks = await d3.json("streaks_by_team.json");
    var selectedSchools = ["Georgetown"];
    var allSchools = Object.keys(streaks)
    console.log(allSchools.length)
    function filterData() {
        return records.filter(record => selectedSchools.includes(record.name));
    }
    var filteredRecords = filterData();
    console.log(filteredRecords.length);

    // create\ background paper for plot
    let svg = d3.select("#main").append("svg");
    svg.attr("id", "my-main")
        .attr("width", layout.width)
        .attr("height", layout.height)
        .attr("viewBox", [0, 0, layout.width, layout.height].join(" "));

    
    function drawColumns(schoolName) {
        // var schoolRecords = records.filter(record => record.name === schoolName);
        var schoolStreaks = streaks[schoolName];
        console.log(schoolStreaks)
        var schoolColor = schoolStreaks[0][0].color
        var schoolRecords = []
        for (var i=0 ; i<schoolStreaks.length ; i++) {
            schoolRecords = schoolStreaks[i]

            svg.selectAll(".bar")
                .data(schoolRecords, d => d["id"])
                .enter().append("rect")
                .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`)
                .attr("class", "bar")
                .attr("fill", "steelblue")
                .attr("opacity", 0.7)
                .attr("x", d => xScale(d["seed"]))
                .attr("y", d => yScale(d["wins"]))
                .attr("width", 5)
                .attr("height", function(d) { return layout.chartHeight - yScale(d.wins); });
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
        console.log(selectedSchools);
        for (var i=0; i<selectedSchools.length; i++){ 
            drawColumns(selectedSchools[i]);
        }  
    }
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    // SCALE FUNCTIONS
    // y scale and axis for wins by team
    let yData =  range(0, 6);
    let yScale = d3.scaleLinear()
        .domain([d3.min(yData) - 0.9, d3.max(yData)])
        .range([layout.chartHeight, 0]);
    let yAxis = svg.append("g")
        .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`)
        .call(d3.axisLeft(yScale))
        .call(d3.axisLeft(yScale).ticks(6).tickFormat(function(d, i) {
            return data[i].val;
          }));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    var counter = 0;
    svg.append("text")
        .attr("transform", `translate(${layout.marginLeft - 70},${layout.marginTop - 20})`)
        .text("Round")
        .attr("font-size", 14)
        .attr("fill", "dimgray");
    
    
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    let xData =  range(1, 16);
    let xScale = d3.scaleLinear()
        .domain([d3.min(xData) - 1, d3.max(xData)])
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
        drawColumns(selectedSchools[i]);
        // drawColumns(allSchools[i]);
    }
};

ready();