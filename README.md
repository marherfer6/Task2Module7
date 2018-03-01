# Task2Module7

Create a Line chart add dots and interaction (whenever you click on the dots display information). As an alternative you can propose another similar excercise (please original samples no copy paste).

# Steps

- First let's create the basic HTML.

_./index.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
  </body>
  <link rel="stylesheet" href="./styles.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.5.0/d3.min.js" charset="utf-8"></script>
  <script src="./data.js"></script>
  <script src="./main.js"></script>
</html>
```

- Let's add the data.

_./data.js_

```javascript
var totalSales = [
    { date: new Date(2016,0, 01), sales: 9000 },
    { date: new Date(2016,1, 01), sales: 8500 },
    { date: new Date(2016,2, 01), sales: 5500 },
    { date: new Date(2016,3, 01), sales: 6500 },
    { date: new Date(2016,4, 01), sales: 7500 },
    { date: new Date(2016,5, 01), sales: 8500 },
    { date: new Date(2016,6, 01), sales: 5500 },
    { date: new Date(2016,7, 01), sales: 6500 },
    { date: new Date(2016,8, 01), sales: 7500 },
    { date: new Date(2016,9, 01), sales: 6500 },
    { date: new Date(2016,10, 01), sales: 5400 },
    { date: new Date(2016,11, 01), sales: 3500 },
    ];
```

- Let's calculate the size of the new chart and add some margins

_./main.js_

```javascript
function setupCanvasSize() {
  margin = {top: 20, left: 80, bottom: 20, right: 30};
  width = 960 - margin.left - margin.right;
  height = 520 - margin.top - margin.bottom;
}
```
- Let's add the SVG element with the given new width and height, and translate the origins applying the margins.

_./main.js_

```javascript
function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}
```

- Now on the X axis we want to map totalSales values to pixels, in this case we map the canvas range 0..350, to 0...maxSales,
domain == data (data from 0 to maxSales) boundaries

_./main.js_

```javascript
function setupXScale()
{

  x = d3.scaleTime()
      .range([0, width])
      .domain(d3.extent(totalSales, function(d) { return d.date}));
}
```

- Now we don't have a linear range of values, we have a discrete range of values (one per product). Here we are generating an array of product names

_./main.js_

```javascript
function setupYScale()
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxSales]);

}
```

- Let's add the X and Y axis.

_./main.js_

```javascript
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
```

- Now it's time to append the line chart with

_./main.js_

```javascript
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
```

- Finally, it´s time to define the styles

_styles.css_

```css
.axis text {
    font: 10px sans-serif;
  }
  
  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }
  
  .line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
  }

  .dot {
    fill: black;
    stroke: black;
    stroke-width: 1.5px;
  }

  .datos {
    background-color: lightblue;
    width: 500px;
    padding: 15px;
    margin-top: 25px;
    border-radius: 10px;
  }
```
