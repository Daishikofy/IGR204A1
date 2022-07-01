// Your code here
const w = 500;
const wExt = w+120;
const h = 500;
const hExt = h+50;
const rectSize = 50;

const legendWidth = 30;
const legendHeight = hExt;

let fromYear = 1900;
let toYear = 2020;
let selectedName;
let dataset = [];
let yearlyset = {}; //Array(121);
let namesAlike = ["CAMILLE"]
multiSet = new Set();
x = () => {}
y = () => {}
pop = () => {}
colorFill = () => {}




// Linear scale for y-axis 
let div = d3.select("body").append("div").attr("class", "descriptors")
let fromYearInput = div.append("input").attr("type", "text").attr("id","date1").attr("name","date1").attr("required", true).attr("minlength",4).attr("maxlength",4).attr("size", 6).attr("value", 2000);
let toYearInput = div.append("input").attr("type", "text").attr("id","date2").attr("name","date2").attr("required", true).attr("minlength",4).attr("maxlength",4).attr("size", 6).attr("value", 2010);
div = d3.select("body").append("div").attr("class", "descriptors").attr("margin", "20px")
let nameInput = div.append("input").attr("type", "text").attr("id","nameInput").attr("name","nameInput").attr("required", true).attr("minlength",3).attr("size", 20).attr("value", "CAMILLE");


d3.select("body").append("br")
d3.select("body").append("br")
div = d3.select("body").append("div")

let svgMain = div.append("svg")
                .attr("width", wExt)
                .attr("height", hExt)
                .attr("id","ranking");

let svgComp = div.append("svg")
                .attr("width", wExt)
                .attr("height", hExt)
                .attr("id","ranking");

//let svgBar = d3.select("div").append("svg").attr("class", "colorBar").attr("height", legendHeight+70).attr("width", 2*legendWidth+70);

//let svgLegend = d3.select("div").append("svg").attr("class", "squareScale").attr("height", legendHeight+70).attr("width", legendWidth+90);



//let nameText = pName.append("p").text("Name: ").append("span");
//let postalText = pName.append("p").text("Postal code: ").append("span");
//let densityText = pName.append("p").text("Density: ").append("span");
//let populationText = pName.append("p").text("Population: ").append("span");

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
    nameText.text(d.place);
    postalText.text(d.codePostal.toLocaleString());
    densityText.text(d.density.toLocaleString());
    populationText.text(d.population.toLocaleString());
}

drawColorBar = ()=>{
    let maxDens = d3.max(dataset, (d)=>d.density);
    const densSubDiv = 10;
    


    // Defining the legend bar scale. That Paris problem sure is troublesome.
    yScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => d.density), maxDens/densSubDiv, maxDens])
    .range([legendHeight, legendHeight/10, 0]);
    
    svgBar.append("text").attr("transform", 'translate(0,40)').text("Density (/km²)");
    // Drawing the legend bar
    const legendBar = svgBar
      .selectAll("rect")
      .data(d3.ticks(0, maxDens/densSubDiv, legendHeight*0.9).concat(d3.ticks(maxDens/densSubDiv, maxDens, legendHeight/10)))
      .enter()
      .append('rect')
      .attr('transform', `translate(0, 50)`)
      .attr("x", 0)
      .attr("y", (d) => yScale(d))
      .attr("width", legendWidth)
      .attr("height", 1)
      .attr("stroke", (d)=>color(d))
      .attr("fill", (d)=>color(d));
    
    // Adding the axis
    
    svgBar.append("g").attr("class", "y_axis").attr("transform", `translate(${legendWidth}, 50)`).call(d3.axisRight(yScale)
        .tickValues(d3.ticks(0, maxDens/10, legendHeight*0.045).concat(d3.ticks(maxDens/10, maxDens, legendHeight/200))));
}

drawSquareScale = () => {
    let maxPop = d3.max(dataset, (d)=>d.population);
    let minPop = d3.min(dataset, (d)=>d.population);
    const popSubDiv = 5;
    let tickList = d3.ticks(minPop, maxPop/popSubDiv, 8).concat(d3.ticks(maxPop/popSubDiv, maxPop, 2));
    


    // Defining the legend bar scale. That Paris problem sure is troublesome.
    yScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => d.population), maxPop/popSubDiv, maxPop])
    .range([legendHeight, legendHeight/5, 0]);


    svgLegend.append("text").attr("transform", 'translate(0,40)').text("Population");
    // Drawing the legend bar
    const paf = svgLegend
      .selectAll("rect")
      .data(tickList)
      .enter()
      .append('rect')
      .attr('transform', `translate(${pop(maxPop)/2}, 50)`)
      .attr("x", (d) => -pop(d)/2)
      .attr("y", (d) => yScale(d))
      .attr("width", (d) => pop(d))
      .attr("height", (d) => pop(d));
    
    // Adding the numbers
    svgLegend.selectAll("text")
        .data(tickList)
        .enter()
        .append("text").attr("transform", `translate(${pop(maxPop)+5}, 50)`)
        .attr("y", (d)=>yScale(d)+pop(d)/2)
        .attr("font-size", "0.8em")
        .attr("dy", "0.4em")
        .text((d) => d.toLocaleString());
}

drawMain = () => {
    selected = [];

    for (year=fromYear; year <=toYear; year++){
        namesAlike.forEach((prenom) => {
            selected.push({"prenom": prenom, "year": year, value: getMainValues(prenom, year)});
            //console.log(selected[prenom]);
        });
    }

    svgMain.selectAll("path").remove();
    svgMain.selectAll("g").remove();

    
    svgMain.selectAll("path")
        .data(selected[prenom].slice(1))
        .enter()
        .append("path")
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(d.value[0]))
        .attr("stroke", (d) => colorFill(d.value[1]))
        .attr("stroke-width", 1)
        .attr("fill", (d)=>colorFill(d.value[1]))
        .attr("name", (d)=>d.prenom+`-${d.year}`)
        .attr("opacity", 0.5)
        .attr("stroke-opacity", 0.5)
        .attr("d", (d, i)=> {
                path = d3.path();
                path.moveTo(x(d.year-1), y(selected[prenom][i].value[0]));
                path.lineTo(x(d.year), y(d.value[0]));
                path.lineTo(x(d.year), y(0));
                path.lineTo(x(d.year-1), y(0));
                return path;
            });

    svgMain.append("g").attr("class", "x_axis").attr("transform", `translate(0, ${h+10})`).call(d3.axisBottom(x));
    svgMain.append("g").attr("class", "y_axis").attr("transform", `translate(60, 0)`).call(d3.axisLeft(y));
}

draw = () => {
    selected = {};
    namesAlike.forEach((prenom) => {
        selected[prenom] = [];
        for (year=fromYear; year <=toYear; year++)
            selected[prenom].push({"year": year, value: computeHeight(prenom, year)});
        //console.log(selected[prenom]);
    });

    svgComp.selectAll("path").remove();
    svgComp.selectAll("g").remove();

    namesAlike.forEach((prenom) => {
        console.log(prenom)
        svgComp.selectAll("path")
            .data(selected[prenom].slice(1))
            .enter()
            .append("path")
            .attr("x", (d) => x(d.year))
            .attr("y", (d) => y(d.value[0]))
            .attr("stroke", (d) => colorFill(d.value[1]))
            .attr("stroke-width", 1)
            .attr("fill", (d)=>colorFill(d.value[1]))
            .attr("name", (d)=>d.prenom+`-${d.year}`)
            .attr("opacity", 0.5)
            .attr("stroke-opacity", 0.5)
            .attr("d", (d, i)=> {
                    path = d3.path();
                    path.moveTo(x(d.year-1), y(selected[prenom][i].value[0]));
                    path.lineTo(x(d.year), y(d.value[0]));
                    path.lineTo(x(d.year), y(0));
                    path.lineTo(x(d.year-1), y(0));
                    return path;
                });
    });
    
        //.on("mouseover", (o, d)=>setTooltip(d));
        //.on("mouseout", (o,d)=>setTooltip(""));
    
    svgComp.append("g").attr("class", "x_axis").attr("transform", `translate(0, ${h+10})`).call(d3.axisBottom(x));
    svgComp.append("g").attr("class", "y_axis").attr("transform", `translate(60, 0)`).call(d3.axisLeft(y));

    //drawColorBar();
    //drawSquareScale();
}

d3.json("data/out2.json").then((data) => {
    dataset = data;
    console.log(dataset)
    x = d3.scaleLinear().domain([1900, 2020]).range([65, w+65]);
    y = d3.scaleLinear().domain([0,7200]).range([h, 0]);
    colorFill = (sexe) =>{
        switch (sexe){
            case -1:
                return "blue";
            case 1:
                return "red";
            default:
                return "white";
        }};

    draw();
})
//.catch ((error) => console.log(`AAAH there's an error! \n${error}`));


// shamelessly taken from Lola's work
function SetFromYear(e){
    ma = 0;
    namesAlike.forEach((prenom) => {
        for (year=fromYear; year <=toYear; year++)
            if (ma < computeHeight(prenom, year)[0]) ma=computeHeight(prenom, year)[0];
    });
    y = d3.scaleLinear().domain([0,ma+10]).range([h, 0]);

    fromYear = parseInt(e.target.value);
    toYear = fromYear + 10;
    toYearInput.value = toYear;

    x = d3.scaleLinear().domain([fromYear, toYear]).range([65, w+65]);

    draw();
}

function SetToYear(e){
    ma = 0;
    namesAlike.forEach((prenom) => {
        for (year=fromYear; year <=toYear; year++)
            if (ma < computeHeight(prenom, year)[0]) ma=computeHeight(prenom, year)[0];
    });
    y = d3.scaleLinear().domain([0,ma+10]).range([h, 0]);

    toYear = parseInt(e.target.value);
    fromYear = toYear - 10;
    fromYearInput.attr("value", fromYear);

    x = d3.scaleLinear().domain([fromYear, toYear]).range([65, w+65]);
    draw();
}

setName = (e) =>{
    selectedName = e.target.value.toUpperCase();
    theReg = new RegExp(`^${selectedName}`);
    namesAlike = Object.keys(dataset).filter((prenom)=>prenom.match(theReg));
    console.log(namesAlike);
    
    ma = 0;
    namesAlike.forEach((prenom) => {
        for (year=fromYear; year <=toYear; year++)
            if (ma < computeHeight(prenom, year)[0]) ma=computeHeight(prenom, year)[0];
    });
    y = d3.scaleLinear().domain([0,ma+10]).range([h, 0]);
    draw();
}


fromYearInput.on("change", SetFromYear);
toYearInput.on("change", SetToYear);
nameInput.on("change", setName);