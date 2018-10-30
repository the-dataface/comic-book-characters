//set up scatter
//data

//containers
var scatterSectionWrapper = d3.select('#scatter-section-wrapper'),
    scatterContainer = d3.select('#scatter-container'),
    scatterTooltip = d3.select('#scatter-tooltip'),
    scatterSvg,
    scatterG;

//sizes
var scatterOuterW,
    scatterOuterH,
    scatterW,
    scatterH,
    scatterMargin;

//scales
var scatterXScale,
    scatterYScale,
    scatterRScale,
    scatterColorScale;

//other
var scatterRadius = 2;

function updateScatter(gender) {
    var filteredData;
    if (gender == 'All') {
        filteredData = scatterData;
    } else {
        filteredData = scatterGenderData.filter(function(d) {
            return d.gender == gender;
        })
    }

    var scatterDots = scatterG.selectAll('.scatter-dot')
        .data(filteredData, function(d) {
            return d.height.toString() + d.weight.toString();
        });

    scatterDots.transition()
        .duration(1000)
        .attr('fill', genderColors[gender])
        .attr('r', function(d) { return scatterRScale(d.count);});

    scatterDots.exit()
        .transition()
        .duration(1000)
        .attr('r', '0')
        .remove();

    scatterDots.enter()
        .append('circle')
        .attr('class', 'scatter-dot')
        .attr('cx', function(d) { return scatterXScale(d.height);})
        .attr('cy', function(d) { return scatterYScale(d.weight);})
        .attr('r', 0)
        .attr('fill', genderColors[gender])
        .attr('stroke', function(d) { return '#37609B'; })
        .attr('stroke-width', function(d) { return '1'; })
        .transition()
        .duration(1000)
        .attr('r', function(d) { return scatterRScale(d.count);});


    /*
    scatterG.selectAll('.scatter-dot')
        .transition()
        .delay(1100)
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('class', 'scatter-dot')
        .attr('cx', function(d) { return scatterXScale(d.height);})
        .attr('cy', function(d) { return scatterYScale(d.weight);})
        .attr('r', 0)
        .attr('stroke', function(d) { return '#37609B'; })
        .attr('stroke-width', function(d) { return '1'; })
        .attr('fill', 'grey')
        .transition()
        .duration(1000)
        .attr('r', function(d) { return scatterRScale(d.count);});
    */

}

function buildScatter() {   
    
    scatterSvg = scatterContainer.append('svg')
        .attr('class', 'scatter-svg')
        .attr('width', scatterOuterW)
        .attr('height', scatterOuterH);

    scatterG = scatterSvg.append('g')
        .attr('transform', 'translate(' + scatterMargin.left + ', ' + scatterMargin.top + ')');

    var scatterXAxis = d3.axisBottom(scatterXScale)
        .tickSizeOuter(0)
        /*.tickValues(xScale.domain())
        .ticks(0)
        .tickSizeOuter(0)
        .tickFormat(function(d) {
            return (d * 100).toFixed(1) + '%';
        });
        */

    scatterG.append('g')
        .attr("transform", "translate(0," + scatterH + ")")
        .attr('class', 'scatter-x-axis scatter-axis')
        .call(scatterXAxis);

    var scatterYAxis = d3.axisLeft(scatterYScale)
        .tickSizeOuter(0)
        /*.tickValues(yScale.domain())
        .ticks(0)
        .tickSizeOuter(0)
        .tickFormat(function(d) {
            return (d * 100).toFixed(1) + '%';
        });
        */

    scatterG.append('g')
        .attr('class', 'scatter-y-axis scatter-axis')
        .call(scatterYAxis);

    scatterG.selectAll('.scatter-dot')
        .data(scatterData, function(d) {
            return d.height.toString() + d.weight.toString();
        })
        .enter()
        .append('circle')
        .attr('class', 'scatter-dot')
        .attr('cx', function(d) { return scatterXScale(d.height);})
        .attr('cy', function(d) { return scatterYScale(d.weight);})
        .attr('r', function(d) { return scatterRScale(d.count);})
        .attr('stroke', function(d) { return '#37609B'; })
        .attr('stroke-width', function(d) { return '1'; })
        .attr('fill', 'grey')
}

function setupScatter() {
    scatterOuterW = scatterContainer.node().offsetWidth,
    scatterOuterH = scatterContainer.node().offsetHeight;

    scatterMargin = {
        left:40,
        right:20,
        top:20,
        bottom:20
    };

    scatterW = scatterOuterW - scatterMargin.left - scatterMargin.right,
    scatterH = scatterOuterH - scatterMargin.top - scatterMargin.bottom;

    var minMaxX = d3.extent(scatterData, function(d) {
        return d.height;
    });

    var minMaxY = d3.extent(scatterData, function(d) {
        return d.weight;
    });

    var minMaxR = d3.extent(scatterData, function(d) {
        return d.count;
    });

    scatterXScale = d3.scaleLinear().range([0, scatterW]).domain([minMaxX[0] - 1, minMaxX[1] + 1]),
    scatterYScale = d3.scaleLinear().range([scatterH, 0]).domain([0, minMaxY[1]]),
    scatterRScale = d3.scaleSqrt().range([2, 10]).domain(minMaxR);

    buildScatter();
}

function initScatter() {
    setupScatter();
}

function findOrientation(width, xPos) {
    if (xPos < width / 2) {
        return ['start', 5, -5];
    } else {
        return ['end', -5, -5];
    }
}