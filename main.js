// Let's start using ES6
// Later one we will complete a version using imports + webpack

let margin = null,
    width = null,
    height = null;

let svg = null;
let x, y = null; // scales

setupCanvasSize();
appendSvg("body");
setupXScale();
setupYScale();
appendXAxis();
appendYAxis();
appendLineCharts();


// Let's calculate the size of the new chart and add some margins

function setupCanvasSize() {
  margin = {top: 20, left: 80, bottom: 20, right: 30};
  width = 960 - margin.left - margin.right;
  height = 520 - margin.top - margin.bottom;
}

// Let's add the SVG element with the given new width and height, and translate the origins applying the margins.

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}

// Now on the X axis we want to map totalSales values to
// pixels
// in this case we map the canvas range 0..350, to 0...maxSales
// domain == data (data from 0 to maxSales) boundaries
function setupXScale()
{

  x = d3.scaleTime()
      .range([0, width])
      .domain(d3.extent(totalSales, function(d) { return d.date}));
}

// Now we don't have a linear range of values, we have a discrete
// range of values (one per product)
// Here we are generating an array of product names
function setupYScale()
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxSales]);

}

function appendXAxis() {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x));
}

function appendYAxis() {
  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y));
}

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

function appendLineCharts()
{
  // Define the line
  var valueline = d3.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.sales); });

  // Add the valueline path.
  svg.append("path")
  .data([totalSales])
  .attr("class", "line")
  .attr("d", valueline);

  svg.selectAll("dot")
    .data(totalSales)
    .enter().append("circle")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) {  return y(d.sales); })
    .on("mouseover", function(d) {		
        div.transition()		
            .duration(200)
            .attr("class","datos")			
            .style("opacity", .9);		
        div	.html("Date: " + d.date.getDate() + "/" + (d.date.getMonth()+1) + "/" + d.date.getFullYear() + "<br/>" + "Sales: "  + d.sales)		
        })					
        .on("mouseout", function(d) {		
        div.transition()		
        .duration(500)		
        .style("opacity", 0);	
    });

}

