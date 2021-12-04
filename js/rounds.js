const roundLayout = {
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
    var selectedSchools = [];
    var allSchools = Object.keys(streaks)
    console.log(allSchools.length)
    function filterData() {
        return records.filter(record => selectedSchools.includes(record.name));
    }
    var filteredRecords = filterData();
    console.log(filteredRecords.length);

    // create\ background paper for plot
    let svg = d3.select("#round").append("svg");
    svg.attr("id", "my-round")
        .attr("width", roundLayout.width)
        .attr("height", roundLayout.height)
        .attr("viewBox", [0, 0, roundLayout.width, roundLayout.height].join(" "));

    
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
        .attr("transform", `translate(${roundLayout.marginLeft},${roundLayout.marginTop})`)
        .attr("class", "connector")
        .attr("fill", "none")
        .attr("stroke", schoolColor)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(d => xScale(d["year"]))
        .y(d => yScale(d["wins"]))
        )
        // mark group roundLayout
        let markGroupWins = svg.append("g")
        .attr("id", "marks")
        .attr("transform", `translate(${roundLayout.marginLeft},${roundLayout.marginTop})`);
        // mapping data to actual marks
        let winMarks = markGroupWins.selectAll("circle").data(schoolRecords, d => d["id"]);
        winMarks.join(enter => enter.append("circle"))
        .attr("cx", d => xScale(d["year"]))
        .attr("cy", d => yScale(d["wins"]))
        .attr("r", d => d["wins"] === 6? 10 : 4)
        .attr("fill", d => d["color"])
        .attr("opacity", 0.7);
    }
}


function handleSchoolClick(event) {
    svg.selectAll("circle").remove()
    svg.selectAll(".connector").remove()
    var btn = event.target;
    var schoolName = btn.innerHTML;
    console.log("clicked " + schoolName);
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
    console.log("selected schools: " + selectedSchools);
    for (var i = 0; i < selectedSchools.length; i++){
        console.log("drawing: " + selectedSchools[i]);
        drawMarks(selectedSchools[i]);
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
        .range([roundLayout.chartHeight, 0]);
    let yAxis = svg.append("g")
        .attr("transform", `translate(${roundLayout.marginLeft},${roundLayout.marginTop})`)
        .call(d3.axisLeft(yScale))
        .call(d3.axisLeft(yScale).ticks(6).tickFormat(function(d, i) {
            return data[i].val;
          }));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    var counter = 0;
    svg.append("text")
        .attr("transform", `translate(${roundLayout.marginLeft - 70},${roundLayout.marginTop - 20})`)
        .text("Wins")
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
        .range([0, roundLayout.chartWidth]);
    let xAxis = svg.append("g")
        .attr("transform", `translate(${roundLayout.marginLeft},${roundLayout.marginTop + roundLayout.chartHeight})`)
        .call(d3.axisBottom(xScale))
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // x axis title
    svg.append("text")
      .attr("transform", `translate(${roundLayout.width - roundLayout.marginRight - 500},${roundLayout.height - roundLayout.marginBottom + 15})`)
    //   .text("Year")
      .attr("text-anchor", "end")
      .attr("font-size", 14)
      .attr("fill", "dimgray")
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