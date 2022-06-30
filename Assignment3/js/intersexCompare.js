// Your code here
const w = 1000;
const wExt = w+120;
const h = 1000;
const hExt = h+50;
const rectSize = 50;

const legendWidth = 30;
const legendHeight = hExt;

let fromYear = 2000;
let toYear = 2010;
let dataset = [];
let yearlyset = {}; //Array(121);
let namesAlike = ["CAMILLE"]
multiSet = new Set();
x = () => {}
y = () => {}
pop = () => {}
colorFill = () => {}




// Linear scale for y-axis 

d3.select("body").append("div")

let svg = d3.select("div")
            .append("svg")
                .attr("width", wExt)
                .attr("height", hExt)
                .attr("id","ranking");

let svgBar = d3.select("div").append("svg").attr("class", "colorBar").attr("height", legendHeight+70).attr("width", 2*legendWidth+70);

let svgLegend = d3.select("div").append("svg").attr("class", "squareScale").attr("height", legendHeight+70).attr("width", legendWidth+90);


let mainDiv = d3.select("body").append("div").attr("class", "descriptors")
let fromYearInput = mainDiv.append("input").attr("type", "text").attr("id","date1").attr("name","date1").attr("required", true).attr("minlength",4).attr("maxlength",4).attr("size", 6).attr("value", 2000);
let toYearInput = mainDiv.append("input").attr("type", "text").attr("id","date2").attr("name","date2").attr("required", true).attr("minlength",4).attr("maxlength",4).attr("size", 6).attr("value", 2010);

//let nameText = pName.append("p").text("Name: ").append("span");
//let postalText = pName.append("p").text("Postal code: ").append("span");
//let densityText = pName.append("p").text("Density: ").append("span");
//let populationText = pName.append("p").text("Population: ").append("span");


fromYearInput.on("change", SetFromYear);
toYearInput.on("change", SetToYear);
yearmapping = (year) => {return year-1900};
mapyearing = (index) => {return index+1900};


getYearlyTotal = (prenom, year, sexe) => {
    total = 0;
    dataset.forEach((data) => {
        if (data.prenom == prenom && data.year == year && data.sexe == sexe){
            total += data.nb;
        }
    })
    return total;
}

computeHeight = (prenom, year) => {
    if (!multiSet.has(prenom) || year <1900){
        console.log(`Wesh ${prenom} ${multiSet.has(prenom)} ${year}`);
        return undefined;
    }
    difference = getYearlyTotal(prenom, year, 1) - getYearlyTotal(prenom, year, 2);
    height = Math.abs(difference);
    return [height, Math.sign(difference)];
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

draw = () => {
    selected = {};
    namesAlike.forEach((prenom) => {
        selected[prenom] = [];
        for (year=1900; year <=2020; year++)
            selected[prenom].push({"year": year, value: computeHeight(prenom, year)});
        console.log(selected[prenom]);
    });
    namesAlike.forEach((prenom) => {
        svg.selectAll("path")
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
    
    svg.append("g").attr("class", "x_axis").attr("transform", `translate(0, ${h+10})`).call(d3.axisBottom(x));
    svg.append("g").attr("class", "y_axis").attr("transform", `translate(60, 0)`).call(d3.axisLeft(y));

    //drawColorBar();
    //drawSquareScale();
}

d3.dsv(";", "data/dpt2020.csv", (data, i) => {
    return {
        sexe: +data.sexe,
        prenom: data.preusuel,
        year: +data.annais,
        dept: data.dpt,
        nb: +data.nombre
    }
}).then((data) => {
    dataset = data;
    x = d3.scaleLinear().domain(d3.extent(data, (dat) => dat.year)).range([65, w+65]);
    y = d3.scaleLinear().domain([0,d3.max(data, (dat) => dat.nb)]).range([h, 0]);
    colorFill = (sexe) =>{
        switch (sexe){
            case -1:
                return "blue";
            case 1:
                return "red";
            default:
                return "black";
        }};


    maleSet = new Set();
    
    dataset.forEach((data) => {
        if (data.sexe == 1 && data.prenom !="_PRENOMS_RARES") {
            maleSet.add(data.prenom);
        }
        else {
            if (maleSet.has(data.prenom) && data.year && data.dept){
                if (!multiSet.has(data.prenom)){
                multiSet.add(data.prenom);
                yearlyset[data.prenom] = [{year : data.year, }]
                }
            }
        }
    })
    console.log(multiSet);



    draw();
    })
.catch ((error) => console.log(`AAAH there's an error! \n${error}`));

/*
d3.tsv("../data/france.tsv",(data, i) => {
    return {
        codePostal: +data["Postal Code"],
        density: +data.density,
        inseeCode: +data.inseecode,
        place: data.place,
        population: +data.population,
        longitude: +data.x,
        latitude: +data.y
    }
}).then((data) => {
    dataset = data;
    x = d3.scaleLinear().domain(d3.extent(data, (dat) => dat.longitude)).range([35, w+35]);
    y = d3.scaleLinear().domain(d3.extent(data, (dat) => dat.latitude)).range([h, 0]);
    pop = d3.scaleSqrt().domain(d3.extent(data, (dat) => dat.population)).range([1, rectSize]);
    color = d3.scaleSqrt().domain(d3.extent(data, (dat) => dat.density)).range(["#00FF00", "#FF0000"]);



    //console.log(dataset);
    draw();
    })
.catch ((error) => console.log(`AAAH there's an error ${error}`));*/

// shamelessly taken from Lola's work
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