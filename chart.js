const layout = {
    width: 1000,
    height: 1000,
    chartWidth: 950,
    topChartHeight: 425,
    bottomChartHeight: 425,
    marginTop: 10,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 10,
    bumper: 10
  };

async function ready() {
    seedsBySchool = await d3.json("seeds_by_school.json");
    winsBySchool = await d3.json("wins_by_school.json");

    // create background paper for plot
    let svg = d3.select("#vis").append("svg");
    svg.attr("id", "my-vis")
        .attr("width", layout.width)
        .attr("height", layout.height)
        .attr("viewBox", [0, 0, layout.width, layout.height].join(" "));
    
    // calculate scale functions
    if (seedsBySchool && winsBySchool) {

        // y scale and axis for seeds by team
        let yScale = d3.scaleLinear()
                        .domain([1, 16])
                        .range([layout.topChartHeight, 0]);
        let yAxis = svg.append("g")
            .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`)
            .call(d3.axisLeft(yScale));

        // styling
        yAxis.selectAll("text").attr("fill", "gray");
        yAxis.selectAll("line, .domain").attr("stroke", "gray");
        svg.append("text")
        .attr("transform", `translate(${layout.marginLeft + 5},${layout.marginTop + 5})`)
        .text("Seed")
        .attr("font-size", 14)
        .attr("fill", "dimgray");
    }
    

    // create a button for each school
    var listDiv = document.getElementById('list');
    var ul = document.createElement('ul');
    var counter = 0;
    for (var key in seedsBySchool) {
        var button = document.createElement('button');
        button.classList = 'btn btn-outline-secondary';
        button.innerHTML = key;
        console.log(key);
        if (counter < 10) {
            ul.appendChild(button); 
        }
        counter += 1;                                
    }
        listDiv.appendChild(ul);
};

ready();