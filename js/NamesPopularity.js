let dataset = [];
var selectedData = [];
var topNames = [];

let fromYearInput, toYearInput;

var fromYear = 2000;
var toYear = 2010;
var sexe = 2;

let yearScale, popularityScale;
var nameScale;


const margin = {top: 0, right: 0, bottom: 60, left: 50},
    width = 650 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

const nameWidth = Math.ceil(width/10);
const nameHeight = Math.ceil(height/9);

window.onload = function(){
    fromYearInput = document.getElementById("date1");
    toYearInput = document.getElementById("date2");

    fromYearInput.addEventListener("change", SetFromYear);
    toYearInput.addEventListener("change", SetToYear);
    
    const baseline = document.getElementsByClassName("baseline")[0]
    baseline.setAttribute("style","width:" + width + "px;" + "margin-left:" + margin.left + "px;");

    document.getElementsByClassName("title")[0].style.marginLeft = margin.left + "px";
    document.getElementsByClassName("bottomGroup")[0].style.marginLeft = margin.left + "px";
    document.getElementsByClassName("bottomGroup")[0].style.width = width + "px";
    
    
}

let svg = d3.select("body")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/data/topNames.csv", (d, i) => {
    return {
        year: +d.annais,
        sexe: +d.sexe,
        name: d.preusuel,
        rank: +d.rank,
    };
}).then( (rows) => {
    dataset = rows;

    yearScale = d3.scaleLinear()
    .domain(d3.extent([fromYear, toYear + 1]))
    .range([0, width]);

    popularityScale = d3.scaleLinear()
    .domain(d3.extent([1, 10]))
    .range([0, height]);

    selectData();
    draw();

}).catch( (error) => {
    console.log("Something went wrong", error);
});

function draw()
{
    console.log("draw");
    selectData();

    d3.selectAll("g > *").remove()

    svg.selectAll("rect")
    .data(selectedData)
    .enter()
    .append("rect")
    .attr("width", nameWidth)
    .attr("height", nameHeight)
    .attr("x", (d) => yearScale(d.year))
    .attr("y", (d) => popularityScale(d.rank))
    .style("fill", (d) => nameScale(d.name))
    .on("mouseover", function(d) {
        document.getElementById("currentName").textContent = d.explicitOriginalTarget.__data__.name;
        document.getElementById("currentYear").textContent = d.explicitOriginalTarget.__data__.year;
        document.getElementById("currentRank").textContent = "#" + d.explicitOriginalTarget.__data__.rank;
    });

    xAxisGenerator = d3.axisBottom()
    .scale(yearScale)
    .tickSize(0)
    .tickFormat(d3.format(""));

    let xAxis = svg.append("g")
    .attr("transform", "translate(" + nameWidth/2 + "," + (height + nameHeight) + ")")
    .call(xAxisGenerator);

    xAxis.select(".domain").remove()
    xAxis.selectAll(".tick text")
        .attr("fill", "#ffffff");

    yLeftAxisGenerator = d3.axisRight()
    .scale(popularityScale)
    .tickSize(0)
    .tickFormat((d,i) => topNames[0][i]);

    svg.append("g")
    .attr("transform", "translate(" + 0 + "," + nameHeight/2 + ")")
    .call(yLeftAxisGenerator)
    .select(".domain").remove();

    yRightAxisGenerator = d3.axisLeft()
    .scale(popularityScale)
    .tickSize(0)
    .tickFormat((d,i) => topNames[1][i]);

    svg.append("g")
    .attr("transform", "translate(" + (width - 10)+ "," + nameHeight/2 + ")")
    .call(yRightAxisGenerator)
    .select(".domain").remove();
}

function selectData()
{
    selectedData = [];
    names = [];
    startNames = [];
    endNames = [];
    topNames = []
    var i = 0;
    for (row of dataset){

        if (row.sexe == sexe){     

            if(row.year >= fromYear && row.year <= toYear){

                if (row.year == fromYear){
                    startNames.push(row.name);
                }
                else if (row.year == toYear){
                    endNames.push(row.name);
                }

                selectedData.push(row);
                if (!names.includes(row.name)){
                    names.push(row.name);
                }
                i ++;
            }
           
        }
        
    }
    
    nameScale = d3.scaleOrdinal()
    .domain(d3.extent(names))
    .range([
            "#9ADCFF",
            "#188dcc",
            "#FFF89A",
            "#ffd600",
            "#FFB2A6",
            "#c695f5",
            "#fa4e9d",
            "#976FBD",
            "#FF7733",
            "#FF5500",
            "#2fad82",
            "#14f57d",
            "#ff6273",
            "#FF2F45",
            "#54f0b9",
            "#5900ff",
            "#ffa3ee",
            "#a9b83e",
            "#e6b1c1",
            "#ffffff",
    ]);
    topNames.push(startNames);
    topNames.push(endNames);
}

function SetFromYear(e){
    fromYear = parseInt(e.target.value);
    toYear = fromYear + 10;
    toYearInput.value = toYear;

    yearScale = d3.scaleLinear()
    .domain(d3.extent([fromYear, toYear + 1]))
    .range([0, width]);

    draw();
}

function SetToYear(e){
    toYear = parseInt(e.target.value);
    fromYear = toYear - 10;
    fromYearInput.value = fromYear;

    yearScale = d3.scaleLinear()
    .domain(d3.extent([fromYear, toYear + 1]))
    .range([0, width]);

    draw();
}

function SetSexe(e)
{
    sexe = parseInt(e.value);

    draw();
}