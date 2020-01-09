//set svg and chart dimensions
//set svg dimensions
var svgWidth = 1000;
var svgHeight = 1000;

//set borders in svg
var margin = {
    top: 20,
    right: -100,
    bottom: 200,
    left: 150
};

//calculate chart height and width
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//append a div classed chart to the scatter element
var chart = d3.select("#scatter").append("div").classed("chart", true);

//append an svg element to the chart with appropriate height and width
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial Parameters
var chosenXAxis = "legalization_status89";
var chosenYAxis = "Age1217_89";


//function used for updating x-scale var upon clicking on axis label
function xScale(SAMHSAData, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(SAMHSAData, d => d[chosenXAxis]) * 0.8,
            d3.max(SAMHSAData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

//function used for updating y-scale var upon clicking on axis label
function yScale(SAMHSAData, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(SAMHSAData, d => d[chosenYAxis]) * 0.8,
            d3.max(SAMHSAData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}

//function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

//function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

//function used for updating circles group with a transition to new circles
//for change in x axis or y axis
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => newXScale(data[chosenXAxis]))
        .attr("cy", data => newYScale(data[chosenYAxis]));

    return circlesGroup;
}

//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    //stylize based on variable chosen
    //Legalization Status 2008-2009
    if (chosenXAxis === 'legalization_status89') {
        return `${value}`;
    }
    //Legalization Status 2016-2017
    else {
        return `${value}`;
    }
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    //select x label
    //poverty percentage
    if (chosenXAxis === 'legalization_status89') {
        var xLabel = "State Legaliation Status 2008-2009 (1-Recreational Use Legal, 2- Medical Use Legal, 3-Prohibited):";
    }
    //household income in dollars
    else {
        var xLabel = "State Legaliation Status 2016-2017 (1-Recreational Use Legal, 2- Medical Use Legal, 3-Prohibited):";
    }
    
    //select y label
    //percentage of 12-17 smoke marijuana in last year 2008-2009
    if (chosenYAxis === 'Age1217_89') {
        var yLabel = "Percentage of 12-17 year olds who Smoked Marijuana in the last year in 2008-2009:"
    }
    //percentage 12-17 smoke marijuana in last year 2016-2017
    else if (chosenYAxis === 'Age1217_1617') {
        var yLabel = "Percentage of 12-17 year olds who Smoked Marijuana in the last year in 2016-2017:"
    }
    //percentage 26+ smoke marijuana in last year 2008-2009
    else if (chosenYAxis === 'Age18_89') {
        var yLabel = "Percentage of 18+ year olds who Smoked Marijuana in the last year in 2008-2009:"
    }
    //percentage 26+ smoke marijuana in last year 2016-2017
    else {
        var yLabel = "Percentage of 18+ year olds who Smoked Marijuana in the last year in 2016-2017:"
    }
    
    //create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
        });

    circlesGroup.call(toolTip);

    //add events
    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}

//retrieve csv data and execute everything below
d3.csv("./assets/data/data.csv").then(function(SAMHSAData) {
    
    console.log(SAMHSAData);

    //parse data
    SAMHSAData.forEach(function(data) {
        data.legalization_status89 = +data.legalization_status89;
        data.legalization_status1617 = +data.legalization_status1617;
        data.Age1217_89 = +data.Age1217_89;
        data.Age1217_1617 = +data.Age1217_1617;
        data.Age1217_sigdiff = +data.Age1217_sigdiff;
        data.Age18_89 = +data.Age18_89;
        data.Age18_1617 = +data.Age18_1617;
        data.Age18_sigdiff = +data.Age18_sigdiff;
    });

    //create first linear scales
    var xLinearScale = xScale(SAMHSAData, chosenXAxis);
    var yLinearScale = yScale(SAMHSAData, chosenYAxis);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(SAMHSAData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("opacity", ".5");

    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(SAMHSAData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    //create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var legalization_status89Label = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "legalization_status89")
        .text("State Legalization 2008-2009 (1-Recreational Use Legal, 2- Medical Use Legal, 3-Prohibited)");

    var legalization_status1617Label = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "legalization_status1617")
        .text("State Legalization 2016-2017 (1-Recreational Use Legal, 2- Medical Use Legal, 3-Prohibited)")

    //create group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

    var Age1217_89 = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "Age1217_89")
        .text("Age 12-17 Marijuana Use in Year 2008-2009 (%)");

    var Age1217_1617 = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 40)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "Age1217_1617")
        .text("Age 12-17 Marijuana Use in Year 2016-2017 (%)");

    var Age18_89 = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "Age18_89")
        .text("Age 18+ Marijuana Use in Year 2008-2009 (%)");

    var Age18_1617 = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 80)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "Age18_1617")
        .text("Age 18+ Marijuana Use in Year 2016-2017 (%)");

    //updateToolTip function with data
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != chosenXAxis) {

                //replace chosenXAxis with value
                chosenXAxis = value;

                //update x scale for new data
                xLinearScale = xScale(SAMHSAData, chosenXAxis);

                //update x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update text with new x values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                //change classes to change bold text
                if (chosenXAxis === "legalization_status89") {
                    legalization_status89Label.classed("active", true).classed("inactive", false);
                    legalization_status1617Label.classed("active", false).classed("inactive", true);
                }
                else {
                    legalization_status89Label.classed("active", false).classed("inactive", true);
                    legalization_status1617Label.classed("active", true).classed("inactive", false);
                }
            }
        });

    //y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");

        //check if value is same as current axis
        if (value != chosenYAxis) {

            //replace chosenYAxis with value
            chosenYAxis = value;

            //update y scale for new data
            yLinearScale = yScale(SAMHSAData, chosenYAxis);

            //update x axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            //update circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update text with new y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

            //update tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //change classes to change bold text
            if (chosenYAxis === "Age1217_89Label") {
                Age1217_89Label.classed("active", true).classed("inactive", false);
                Age1217_1617Label.classed("active", false).classed("inactive", true);
                Age18_89Label.classed("active", false).classed("inactive", true);
                Age18_1617Label.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "Age1217_1617Label") {
                Age1217_89Label.classed("active", false).classed("inactive", true);
                Age1217_1617Label.classed("active", true).classed("inactive", false);
                Age18_89Label.classed("active", false).classed("inactive", true);
                Age18_1617Label.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "Age18_89Label") {
                Age1217_89Label.classed("active", false).classed("inactive", true);
                Age1217_1617Label.classed("active", false).classed("inactive", true);
                Age18_89Label.classed("active", true).classed("inactive", false);
                Age18_1617Label.classed("active", false).classed("inactive", true);
            }
            else {
                Age1217_89Label.classed("active", false).classed("inactive", true);
                Age1217_1617Label.classed("active", false).classed("inactive", true);
                Age18_89Label.classed("active", false).classed("inactive", true);
                Age18_1617Label.classed("active", true).classed("inactive", false);
            }
        }
    });
    


    
});
