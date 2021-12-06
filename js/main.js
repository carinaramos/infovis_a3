const mainLayout = {
    width: 1000,
    height: 630,
    chartWidth: 648,
    chartHeight: 462,
    marginTop: 120,
    marginBottom: 20,
    marginLeft: 120,
    marginRight: 10,
    bumper: 10
  };


var years = {}
var streaks = {}
var selectedSchools = [];
var selectedYear = "2000";

const updateSelectedYear = (year) => {
    console.log("updating selectedYear to " + year)
    removeColumns();
    selectedYear = year;
    document.getElementById("year-selector").value = selectedYear;
    drawColumns(selectedYear);
}

const updateSelectedSchools = (schoolName) => {
    const index = selectedSchools.indexOf(schoolName);
    if (index == -1) {
        selectedSchools.push(schoolName);
        drawScores(schoolName);
        drawSeeds(schoolName);
        drawRounds(schoolName);
        createButton(schoolName);
    } else {
        selectedSchools.splice(index, 1);
        removeScores(schoolName);
        removeSeeds(schoolName);
        removeRounds(schoolName);
        removeButton(schoolName);
    }
    console.log("now selectedSchools is: " + selectedSchools);
    removeColumns();
    drawColumns(selectedYear);
}

const handleTeamButtonClick = (btn) => {
    var teamName = btn.value
    if (teamName.includes('amp;')) {
        teamName = teamName.replace('amp;', '')
    }
    console.log("calling updateSelectedSchools on " + teamName);
    updateSelectedSchools(teamName);
}

// create a button for each school
const createButton = (teamName) => {
    var teamButtons = document.getElementById('team-buttons');
    var btn = document.createElement('button');

    btn.classList = 'btn btn-outline-secondary btn-sm';
    btn.value = teamName;
    btn.id = strFormat(teamName) + "-button";
    btn.style.borderColor = colors[teamName];
    btn.style.color = colors[teamName];
    btn.addEventListener("mouseover", function() {
        document.getElementById(strFormat(teamName) + "-button").style.backgroundColor = "lightgrey";
    });
    btn.addEventListener("mouseout", function() {
        let btn = document.getElementById(strFormat(teamName) + "-button");
        if (btn) {
            btn.style.backgroundColor = "white";
        }
    });
    btn.onclick = function() {handleTeamButtonClick(this)};
    btn.innerHTML = teamName + ' ✕';
    teamButtons.appendChild(btn);                             
}

// remove school button
const removeButton = (teamName) => {
    var teamButton = document.getElementById(strFormat(teamName) + "-button");
    teamButton.parentNode.removeChild(teamButton);        
}

var rounds = [{
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

let mainSvg = d3.select("#main").append("svg");

let xDataMain =  range(1, 16);
let xScaleMain = d3.scaleLinear()
    .domain([d3.min(xDataMain), d3.max(xDataMain) + .99])
    .range([0, mainLayout.chartWidth]);
let yDataMain =  range(0, 6);
let yScaleMain = d3.scaleLinear()
    .domain([d3.min(yDataMain) - 0.2, d3.max(yDataMain)])
    .range([mainLayout.chartHeight, 0]);

// Define the div for the tooltip - https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
var mainTooltip = d3.select("#main").append("div")	
    .attr("class", "tooltip main-tooltip")				
    .style("opacity", 0);

async function mainReady() {
    years = await d3.json("years_with_colors_sorted_lost_to.json");
    colors = await d3.json("colors.json");
    streaks = await d3.json("team_streaks_with_colors.json");

    // create background paper for plot
    
    mainSvg.attr("id", "my-main")
        .attr("width", mainLayout.width)
        .attr("height", mainLayout.height)
        .attr("viewBox", [0, 0, mainLayout.width, mainLayout.height].join(" "));
    
    // SCALE FUNCTIONS
    // y scale and axis for wins by team
    let yAxis = mainSvg.append("g")
        .attr("transform", `translate(${mainLayout.marginLeft},${mainLayout.marginTop})`)
        .call(d3.axisLeft(yScaleMain))
        .call(d3.axisLeft(yScaleMain).ticks(6).tickFormat(function(d, i) {
            return rounds[i].val;
          }));
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    mainSvg.append("text")
        .attr("transform", `translate(${0},${mainLayout.marginTop - 20})`)
        .text("Round Knocked Out")
        .attr("font-size", 14)
        .attr("fill", "dimgray");
    

    let xAxis = mainSvg.append("g")
        .attr("transform", `translate(${mainLayout.marginLeft},${mainLayout.marginTop + mainLayout.chartHeight})`)
        .call(d3.axisBottom(xScaleMain).ticks(16).tickFormat(d3.format("d")));

    xAxis.selectAll("text").attr("fill", "gray").attr("transform", `translate(${21},${0})`);
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // x axis title
    mainSvg.append("text")
      .attr("transform", `translate(${mainLayout.chartWidth/2 + mainLayout.marginLeft},${mainLayout.height - mainLayout.marginBottom + 15})`)
      .text("Seed")
      .attr("text-anchor", "end")
      .attr("font-size", 14)
      .attr("fill", "dimgray")
            
    drawColumns(selectedYear);
};

function removeColumns() { 
    mainSvg.selectAll(".bar").remove();
}

function drawColumns(year) {
    var teams = years[year];
    console.log("drawing columns withselected schools: " + selectedSchools)
   
    mainSvg.selectAll("bar")
        .data(teams)
        .enter().append("rect")
        .attr("id", d => strFormat(d.name) + "-bar")
        .attr("transform", `translate(${mainLayout.marginLeft+2},${mainLayout.marginTop})`)
        .attr("class", "bar")
        .attr("fill", d => d.color)
        .attr("opacity", d=> selectedSchools.includes(d.name) ? 1.0 : 0.5)
        .attr("x", d => xScaleMain(d.seed)+ d.offset*10)
        .attr("y", d => yScaleMain(d.wins))
        .attr("width", 8)
        .attr('rx', 0)
        .attr("height", function(d) { return mainLayout.chartHeight - yScaleMain(d.wins); })
        .on("mouseover", function(e, d) {
            d3.select("#" + strFormat(d.name) + "-bar").style("opacity", selectedSchools.includes(d.name) ? 0.5 : 1.0);
            d3.select("#" + strFormat(d.lostTo) + "-bar").style("opacity", 1.0);
            mainTooltip.transition()		
                .duration(100)		
                .style("opacity", .9);
            mainTooltip.html("<b>" + d.name + "</b><br/>" + (d.wins === 6 ? "" : "Lost in ") + wins_to_round[d.wins] + (d.wins === 6 ? "" : " to " + d.lostTo))
                .style("left", (e.x) + "px")		
                .style("top", (e.y)+ "px");	
            })					
        .on("mouseout", function(e, d) {
            d3.select("#" + strFormat(d.name) + "-bar").style("opacity", (selectedSchools.includes(d.name) ? 1.0 : 0.5));
            d3.select("#" + strFormat(d.lostTo) + "-bar").style("opacity", (selectedSchools.includes(d.lostTo) ? 1.0 : 0.5));
            mainTooltip.transition()		
                .duration(50)		
                .style("opacity", 0);	
        })
        .on("click", function(e, d) {
            console.log("clicking on: " + d.name);
            updateSelectedSchools(d.name);
        });
}


async function ready() {
    await mainReady();
    await scoresReady();
    await roundsReady();
    await seedsReady();
}
ready();
