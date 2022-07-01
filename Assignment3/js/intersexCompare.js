// Your code here
const w = 500;
const wExt = w+120;
const h = 500;
const hExt = h+100;
const rectSize = 50;

const legendWidth = 30;
const legendHeight = hExt;

let fromYear = 1990;
let toYear = 2010;
let yearRange = 20;
let enteredName;
let compName;
let dataset = [];
let yearlyset = {}; //Array(121);
let namesAlike = ["CAMILLE", "CAMERON"]
multiSet = new Set();
x = () => {}
y = () => {}
yMain = () => {}
pop = () => {}
colorFill = () => {}
color = d3.scaleOrdinal(d3.schemeCategory10)




// Linear scale for y-axis 
let div = d3.select("body").append("div").attr("class", "descriptors")
div.append("span").text("From")
div.append("span").text("Range")
div.append("span").text("To")

div = d3.select("body").append("div").attr("class", "descriptors")
let fromYearInput = div.append("input").attr("type", "text").attr("id","date1").attr("name","date1").attr("required", true).attr("minlength",4).attr("maxlength",4).attr("size", 6).attr("value", 1990);
let yearRangeInput = div.append("input").attr("type", "text").attr("id","range").attr("name","range").attr("required", true).attr("minlength",1).attr("maxlength",3).attr("size", 6).attr("value", 20);
let toYearInput = div.append("input").attr("type", "text").attr("id","date2").attr("name","date2").attr("required", true).attr("minlength",4).attr("maxlength",4).attr("size", 6).attr("value", 2010);
div = d3.select("body").append("div").attr("class", "descriptors").attr("margin", "20px")
let nameInput = div.append("input").attr("type", "text").attr("id","nameInput").attr("name","nameInput").attr("required", true).attr("minlength",3).attr("size", 20).attr("value", "CAM");

div = d3.select("body").append("div").attr("class", "tooltip")
let nameText = div.append("p").text("Name: ").append("span");
let postalText = div.append("p").text("Number: ").append("span");
let densityText = div.append("p").text("Sex: ").append("span");
let populationText = div.append("p").text("Year: ").append("span");


div = d3.select("body").append("div")

let svgMain = div.append("svg")
                .attr("width", wExt)
                .attr("height", hExt)
                .attr("id","values");

let svgLegend = div.append("svg").attr("class", "squareScale").attr("height", legendHeight+20).attr("width", legendWidth+90);
let svgComp = div.append("svg")
                .attr("width", wExt)
                .attr("height", hExt)
                .attr("id","ranking");

let svgColor = div.append("svg").attr("class", "colorBar").attr("height", legendHeight+20).attr("width", legendWidth+90);






computeHeight = (prenom, year) => {
    if (!dataset[prenom][year]) return [0,0];
    difference = dataset[prenom][year].nb_g - dataset[prenom][year].nb_f;
    height = Math.abs(difference);
    return [height, Math.sign(difference)];
}

getMainValues = function(prenom, year)  {
    if (!dataset[prenom][year]) return [0,0];
    
    return [dataset[prenom][year].nb_g, dataset[prenom][year].nb_f];
}



setTooltip = (d) => {
    if (d === ""){
        nameText.text("");
        postalText.text("");
        densityText.text("");
        populationText.text("");
        return
    }
    console.log(d)
    
    nameText.text(d.prenom);
    postalText.text(d.value.toLocaleString());
    densityText.text(d.sexe);
    populationText.text(d.year.toLocaleString());
}

setCompName = (d) => {
    compName = d.prenom;
    draw();
}

drawColorBar = ()=>{
    
    svgColor.append("rect").attr("x", 0).attr("y", legendHeight/3).attr("width", 15).attr("height", 10).attr("fill", "red").attr("opacity", 0.5);
    svgColor.append("rect").attr("x", 0).attr("y", 2*legendHeight/3).attr("width", 15).attr("height", 10).attr("fill", "blue").attr("opacity", 0.5);

    svgColor.append("text").attr("x", 20).attr("y", legendHeight/3+5).attr("font-size", "0.8em").attr("dy", "0.4em").text("More males");
    svgColor.append("text").attr("x", 20).attr("y", 2*legendHeight/3+5).attr("font-size", "0.8em").attr("dy", "0.4em").text("More females");

}

drawSquareScale = () => {
    //let tickList = d3.ticks(minPop, maxPop/popSubDiv, 8).concat(d3.ticks(maxPop/popSubDiv, maxPop, 2));
    
    // Defining the legend bar scale
    yScale = d3.scaleLinear()
                .domain([-2, namesAlike.length+2])
                .range([legendHeight, 0]);


    svgLegend.selectAll("rect").remove();
    svgLegend.selectAll("text").remove();
    //svgLegend.append("text").attr("transform", 'translate(0,40)').text("Names");
    // Drawing the legend bar
    svgLegend.selectAll("rect")
      .data(namesAlike)
      .enter()
      .append('rect')
      //.attr('transform', `translate(${pop(maxPop)/2}, 50)`)
      .attr("x", (d) => 0)
      .attr("y", (d, i) => yScale(i))
      .attr("width", 15)
      .attr("height", 10)
      .attr("fill", (d)=>color(d));
      
    // Adding the names
    svgLegend.selectAll("text")
        .data(namesAlike)
        .enter()
        .append("text").attr("transform", `translate(20, 5)`).attr("x", (d) => 0)
        .attr("y", (d, i)=>yScale(i))
        .attr("font-size", "0.8em")
        .attr("dy", "0.4em")
        .text((d) => d);
}

drawMain = () => {
    curves = [];
    rectangles = [];
    for (year=fromYear; year <=toYear; year++){
        namesAlike.forEach((prenom) => {
            curves.push({"prenom": prenom, "year": year, value: getMainValues(prenom, year)[0], sexe: "Male"}); // male variant
            rectangles.push({"prenom": prenom, "year": year, value: getMainValues(prenom, year)[0]}); // male variant
            curves.push({"prenom": prenom, "year": year, value: getMainValues(prenom, year)[1], sexe: "Female"}); // female variant
        });
    }

    yMain = d3.scaleLinear().domain([0, d3.max(curves, (data)=> data.value)+10]).range([h+50, 50]);

    svgMain.selectAll("path").remove();
    svgMain.selectAll("rect").remove();
    svgMain.selectAll("g").remove();

    
    svgMain.selectAll("path")
        .data(curves.slice(2*namesAlike.length))
        .enter()
        .append("path")
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(d.value))
        .attr("stroke", (d) => color(d.prenom))
        .attr("stroke-width", 2)
        .attr("name", (d)=>d.prenom+`-${d.year}`)
        .attr("d", (d, i)=> {
                    path = d3.path();
                    path.moveTo(x(d.year-1), yMain(curves[i].value));
                    path.lineTo(x(d.year), yMain(d.value));
                    return path;
    }
    ).on("mouseover", (o, d)=>setTooltip(d)).on("mouseout", (o, d)=>setTooltip("")).on("click", (o, d) => setCompName(d)).append("svg:title")
    .text(function(d) { 
        return `Name: ${d.prenom}\nSexe: ${d.sexe}\nNumber: ${d.value}\nYear: ${d.year}\nClick to see comparison!`
     });
    
    svgMain.selectAll("rect")
        .data(rectangles.slice(namesAlike.length))
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.year)-2)
        .attr("y", (d) => yMain(d.value)-2)
        .attr("fill", (d)=>color(d.prenom))
        .attr("width", 4)
        .attr("height", 4)
        .attr("name", (d)=>d.prenom+`-${d.year}`);
    
    

    svgMain.append("g").attr("class", "x_axis").attr("transform", `translate(0, ${h+60})`).call(d3.axisBottom(x));
    svgMain.append("g").attr("class", "y_axis").attr("transform", `translate(60, 0)`).call(d3.axisLeft(yMain));
    drawSquareScale();
}

draw = () => {
    if (namesAlike.length == 0) return;
    if (!namesAlike.includes(compName)) compName = namesAlike[0];
    selected = {};
    selected[compName] = [];
    for (year=fromYear; year <=toYear; year++)
        selected[compName].push({"year": year, value: computeHeight(compName, year)});

    ma = 0;
    for (year=fromYear; year <=toYear; year++)
        if (ma < computeHeight(compName, year)[0]) ma=computeHeight(compName, year)[0];
    
    y = d3.scaleLinear().domain([0,ma]).range([h+50, 0+50]);

    svgComp.selectAll("path").remove();
    svgComp.selectAll("g").remove();

    svgComp.selectAll("path")
        .data(selected[compName].slice(1))
        .enter()
        .append("path")
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(d.value[0]))
        .attr("stroke", (d) => colorFill(d.value[1]))
        .attr("stroke-width", 1)
        .attr("fill", (d)=>colorFill(d.value[1]))
        .attr("name", (d)=>compName+`-${d.year}`)
        .attr("opacity", 0.5)
        .attr("stroke-opacity", 0.5)
        .attr("d", (d, i)=> {
                path = d3.path();
                path.moveTo(x(d.year-1), y(selected[compName][i].value[0]));
                path.lineTo(x(d.year), y(d.value[0]));
                path.lineTo(x(d.year), y(0));
                path.lineTo(x(d.year-1), y(0));
                return path;
            }).append("svg:title")
            .text(function(d) { // yeah! Tooltips!
                favor = "";
                (d.value[1] == 1)? favor = "males": favor="females";
                return `Name: ${compName}\nDifference: ${d.value[0]} in favor of ${favor} in year ${d.year}`
             });
    
    svgComp.append("g").attr("class", "x_axis").attr("transform", `translate(0, ${h+60})`).call(d3.axisBottom(x));
    svgComp.append("g").attr("class", "y_axis").attr("transform", `translate(60, 0)`).call(d3.axisLeft(y));

    //drawColorBar();
    //drawSquareScale();
}

d3.json("data/out2.json").then((data) => {
    dataset = data;
    console.log(dataset)
    x = d3.scaleLinear().domain([fromYear, toYear]).range([65, w+65]);
    y = d3.scaleLinear().domain([0,7200]).range([h+50, 0+50]);
    colorFill = (sexe) =>{
        switch (sexe){
            case -1:
                return "blue";
            case 1:
                return "red";
            default:
                return "white";
        }
    };
    
    drawMain();
    draw();
    drawColorBar();
})
//.catch ((error) => console.log(`AAAH there's an error! \n${error}`));


// shamelessly taken from Lola's work
function SetFromYear(e){
    fromYear = parseInt(e.target.value);
    toYear = fromYear + yearRange;
    toYearInput.value = toYear;

    x = d3.scaleLinear().domain([fromYear, toYear]).range([65, w+65]);

    drawMain();
    draw();
}

function SetToYear(e){
    toYear = parseInt(e.target.value);
    fromYear = toYear - yearRange;
    fromYearInput.attr("value", fromYear);

    x = d3.scaleLinear().domain([fromYear, toYear]).range([65, w+65]);
    draw();
    drawMain();
}

setRange = (e)=>{
    yearRange = parseInt(e.target.value);

    fromYear = toYear - yearRange;
    fromYearInput.attr("value", fromYear);

    x = d3.scaleLinear().domain([fromYear, toYear]).range([65, w+65]);
    draw();
    drawMain();
}

setName = (e) =>{
    enteredName = e.target.value.toUpperCase();
    theReg = new RegExp(`^${enteredName}`);
    namesAlike = Object.keys(dataset).filter((prenom)=>prenom.match(theReg));
    
    draw();
    drawMain();
}


fromYearInput.on("change", SetFromYear);
toYearInput.on("change", SetToYear);
nameInput.on("change", setName);