const layout = {
    width: 1000,
    height: 600,
    chartWidth: 950,
    topChartHeight: 125,
    bottomChartHeight: 325,
    marginTop: 10,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 10,
    bumper: 10
  };

async function ready() {
    var records = await d3.json("records.json");
    var selectedSchools = ["Georgetown"]
    var filteredRecords = records.filter(record => selectedSchools.includes(record.name));

    // create background paper for plot
    let svg = d3.select("#vis").append("svg");
    svg.attr("id", "my-vis")
        .attr("width", layout.width)
        .attr("height", layout.height)
        .attr("viewBox", [0, 0, layout.width, layout.height].join(" "));
    
    // calculate scale functions
    if (records) {

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
        svg.append("text")
            .attr("transform", `translate(${layout.marginLeft + 5},${layout.marginTop + 5})`)
            .text("Wins")
            .attr("font-size", 14)
            .attr("fill", "dimgray");
        
        // y scale and axis for seeds by team
        let yScaleBottom = d3.scaleLinear()
            .domain([16, 0])
            .range([layout.bottomChartHeight, 0]);
        let yAxisBottom = svg.append("g")
            .attr("transform", `translate(${layout.marginLeft},${layout.marginTop + layout.topChartHeight })`)
            .call(d3.axisLeft(yScaleBottom))
            .call(d3.axisLeft(yScaleBottom).ticks(16));
        yAxisBottom.selectAll("text").attr("fill", "gray");
        yAxisBottom.selectAll("line, .domain").attr("stroke", "gray");
        svg.append("text")
            .attr("transform", `translate(${layout.marginLeft + 5},${layout.marginTop + layout.topChartHeight + layout.bottomChartHeight + 5})`)
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
      
   
    
    // mark group layout
    let markGroup = svg.append("g")
        .attr("id", "marks")
        .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`);
      
    // mapping data to actual marks
    let marks = markGroup.selectAll("circle").data(filteredRecords, d => d["id"]);
    marks.join(enter => enter.append("circle"))
        .attr("cx", d => xScale(d["year"]))
        .attr("cy", d => yScale(d["wins"]))
        .attr("r", 4)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);
    
    // create a button for each school
    var listDiv = document.getElementById('list');
    var ul = document.createElement('ul');
    var counter = 0;
    for (var i=0; i < records.length; i++) {
        var button = document.createElement('button');
        button.classList = 'btn btn-outline-secondary';
        button.innerHTML = records[i]["name"];
        if (counter < 8) {
            ul.appendChild(button); 
        }
        counter += 1;                                
    }
        listDiv.appendChild(ul);
    }
};

ready();