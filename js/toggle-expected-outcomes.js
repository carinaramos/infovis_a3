expectedOutcomes = [
    {"seed": 1,  "offset": 0, "wins": 6},
    {"seed": 1,  "offset": 1, "wins": 5},
    {"seed": 1,  "offset": 2, "wins": 4},
    {"seed": 1,  "offset": 3, "wins": 4},
    {"seed": 2,  "offset": 0, "wins": 3},
    {"seed": 2,  "offset": 1, "wins": 3},
    {"seed": 2,  "offset": 2, "wins": 3},
    {"seed": 2,  "offset": 3, "wins": 3},
    {"seed": 3,  "offset": 0, "wins": 2},
    {"seed": 3,  "offset": 1, "wins": 2},
    {"seed": 3,  "offset": 2, "wins": 2},
    {"seed": 3,  "offset": 3, "wins": 2},
    {"seed": 4,  "offset": 0, "wins": 2},
    {"seed": 4,  "offset": 1, "wins": 2},
    {"seed": 4,  "offset": 2, "wins": 2},
    {"seed": 4,  "offset": 3, "wins": 2},
    {"seed": 5,  "offset": 0, "wins": 1},
    {"seed": 5,  "offset": 1, "wins": 1},
    {"seed": 5,  "offset": 2, "wins": 1},
    {"seed": 5,  "offset": 3, "wins": 1},
    {"seed": 6,  "offset": 0, "wins": 1},
    {"seed": 6,  "offset": 1, "wins": 1},
    {"seed": 6,  "offset": 2, "wins": 1},
    {"seed": 6,  "offset": 3, "wins": 1},
    {"seed": 7,  "offset": 0, "wins": 1},
    {"seed": 7,  "offset": 1, "wins": 1},
    {"seed": 7,  "offset": 2, "wins": 1},
    {"seed": 7,  "offset": 3, "wins": 1},
    {"seed": 8,  "offset": 0, "wins": 1},
    {"seed": 8,  "offset": 1, "wins": 1},
    {"seed": 8,  "offset": 2, "wins": 1},
    {"seed": 8,  "offset": 3, "wins": 1},
    {"seed": 9,  "offset": 0, "wins": 0},
    {"seed": 9,  "offset": 1, "wins": 0},
    {"seed": 9,  "offset": 2, "wins": 0},
    {"seed": 9,  "offset": 3, "wins": 0},
    {"seed": 10, "offset": 0, "wins": 0},
    {"seed": 10, "offset": 1, "wins": 0},
    {"seed": 10, "offset": 2, "wins": 0},
    {"seed": 10, "offset": 3, "wins": 0},
    {"seed": 11, "offset": 0, "wins": 0},
    {"seed": 11, "offset": 1, "wins": 0},
    {"seed": 11, "offset": 2, "wins": 0},
    {"seed": 11, "offset": 3, "wins": 0},
    {"seed": 12, "offset": 0, "wins": 0},
    {"seed": 12, "offset": 1, "wins": 0},
    {"seed": 12, "offset": 2, "wins": 0},
    {"seed": 12, "offset": 3, "wins": 0},
    {"seed": 13, "offset": 0, "wins": 0},
    {"seed": 13, "offset": 1, "wins": 0},
    {"seed": 13, "offset": 2, "wins": 0},
    {"seed": 13, "offset": 3, "wins": 0},
    {"seed": 14, "offset": 0, "wins": 0},
    {"seed": 14, "offset": 1, "wins": 0},
    {"seed": 14, "offset": 2, "wins": 0},
    {"seed": 14, "offset": 3, "wins": 0},
    {"seed": 15, "offset": 0, "wins": 0},
    {"seed": 15, "offset": 1, "wins": 0},
    {"seed": 15, "offset": 2, "wins": 0},
    {"seed": 15, "offset": 3, "wins": 0},
    {"seed": 16, "offset": 0, "wins": 0},
    {"seed": 16, "offset": 1, "wins": 0},
    {"seed": 16, "offset": 2, "wins": 0},
    {"seed": 16, "offset": 3, "wins": 0},
]

function drawExpectedOutcomes() {
   
    mainSvg.selectAll(".bar-expected")
        .data(expectedOutcomes)
        .enter().append("rect")
        .attr("id", d => "" + d.seed + "-" + d.offset + "-bar")
        .attr("transform", `translate(${mainLayout.marginLeft+2},${mainLayout.marginTop})`)
        .attr("class", "bar-expected")
        .attr("fill", "lightgrey")
        .attr("opacity", 0.4)
        .attr("x", d => xScaleMain(d.seed)+ d.offset*10)
        .attr("y", d => yScaleMain(d.wins))
        .attr("width", 8)
        .attr('rx', 0)
        .attr("height", function(d) { return mainLayout.chartHeight - yScaleMain(d.wins); });
}

function removeExpectedOutcomes() { 
    mainSvg.selectAll(".bar-expected").remove();
}

// add clear button functionality
var toggle = document.getElementById('toggle');
const handleToggle = (e) => {
    if (e.checked) {
        drawExpectedOutcomes();
    } else {
        removeExpectedOutcomes();
    }
}
toggle.onchange = function() {handleToggle(this)};