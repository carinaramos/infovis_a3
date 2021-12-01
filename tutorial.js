// Parameterizing layout
const layout = {
  width: 1000,
  height: 600,
  chartWidth: 950,
  chartHeight: 540,
  marginTop: 10,
  marginBottom: 40,
  marginLeft: 40,
  marginRight: 10,
  bumper: 10
};

async function drawScatter(selector, dataPath) {
  // draws a scatter plot
  // @selector: a CSS selector in which a scatterplot is inserted
  // @dataPath: data file path
  // returns the SVG object as a Promise
  let data;
  if (dataPath.endsWith(".csv")) {
    data = await d3.csv(dataPath);
  } else if (dataPath.endsWith(".json")) {
    data = await d3.json(dataPath);
  } else if (dataPath.endsWith(".tsv")) {
    data = await d3.tsv(dataPath);
  } else {
    console.error("Unsupported data type")
  }
  // see your what your data look like
  console.table(data)
  if (data) { // when data is not undefined
    // making SVG element and layout
    let svg = d3.select(selector).append("svg");
    svg.attr("id", "my-vis")
       .attr("width", layout.width)
       .attr("height", layout.height)
       .attr("viewBox", [0, 0, layout.width, layout.height].join(" "));
    
    // y scale and axis
    let yData = data.map(d => d["wages"]);
    let yScale = d3.scaleLinear()
                   .domain([d3.min(yData) - 0.5, d3.max(yData) + 0.5])
                   .range([layout.chartHeight, 0]);
    let yAxis = svg.append("g")
      .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`)
      .call(d3.axisLeft(yScale));
    
    // styling
    yAxis.selectAll("text").attr("fill", "gray");
    yAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    // axis title
    svg.append("text")
      .attr("transform", `translate(${layout.marginLeft + 5},${layout.marginTop + 5})`)
      .text("Wheat")
      .attr("font-size", 14)
      .attr("fill", "dimgray");
    
    // x scale and axis
    let xData = data.map(d => d["wheat"]);
    let xScale = d3.scaleLinear()
                    .domain([d3.min(xData), d3.max(xData)])
                    .range([0, layout.chartWidth]);
    let xAxis = svg.append("g")
      .attr("transform", `translate(${layout.marginLeft},${layout.marginTop + layout.chartHeight})`)
      .call(d3.axisBottom(xScale));

    xAxis.selectAll("text").attr("fill", "gray");
    xAxis.selectAll("line, .domain").attr("stroke", "gray");
    
    svg.append("text")
      .attr("transform", `translate(${layout.width - layout.marginRight},${layout.height - layout.marginBottom + 15})`)
      .text("Wages")
      .attr("text-anchor", "end")
      .attr("font-size", 14)
      .attr("fill", "dimgray");
    
    // mark group layout
    let markGroup = svg.append("g")
      .attr("id", "marks")
      .attr("transform", `translate(${layout.marginLeft},${layout.marginTop})`);
    
    // mapping data to actual marks
    let marks = markGroup.selectAll("circle").data(data, d => d["year"]);
    marks.join(enter => enter.append("circle"))
      .attr("cx", d => xScale(d["wheat"]))
      .attr("cy", d => yScale(d["wages"]))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7);
    return svg;
  }
  return;
}

drawScatter("#vis", "wheat.json");