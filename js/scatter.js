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
var scatterRadius = 2,
    heightWeightRanges = {
        'All' : {
            'bottomY1': 85.5,
            'topY1': 115.5,
            'bottomY2': 152,
            'topY2': 205.4
        },
        'Male' : {
            'bottomY1': 85.5,
            'topY1': 115.5,
            'bottomY2': 152,
            'topY2': 205.4
        },
        'Female': {
            'bottomY1': 85.5,
            'topY1': 115.5,
            'bottomY2': 152,
            'topY2': 205.4
        }
    };

function updateScatterLinesV2(gender) {
    var data = [
        {
          x:[268, 293, 251, 287, 265, 269, 253, 251, 253, 260],
          y:[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        },
        {
          x:[232, 207, 249, 213, 235, 231, 247, 249, 247, 240],
          y:[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        }
    ];

    var indexies = d3.range( data[0].x.length );

    var area = d3.svg.area()
        .interpolate("cardinal")
        .x0( function(d) { return data[1].x[d] } )
        .x1( function(d) { return data[0].x[d] } )
        .y0( function(d) { return yscale(data[1].y[d]) } )
        .y1(  function(d) { return yscale(data[1].y[d]) } );
                      
	svg.append('path')
        .datum(indexies)
        .attr('class', 'area')
        .attr('fill', 'lightsteelblue')
        .attr('d', area);
}

function updateScatterLines(gender) {
    var startX = scatterXScale(57),
        endX = scatterXScale(76),
        bottomY1 = scatterYScale(heightWeightRanges[gender]['bottomY1']),
        bottomY2 = scatterYScale(heightWeightRanges[gender]['bottomY2']),
        topY1 = scatterYScale(heightWeightRanges[gender]['topY1']),
        topY2 = scatterYScale(heightWeightRanges[gender]['topY2']);

    scatterG.selectAll('.healthy-weight-line').remove();

    scatterG.append('line')
        .attr('class', 'healthy-weight-line')
        .attr('x1', startX)
        .attr('x2', startX)
        .attr('y1', bottomY1)
        .attr('y2', bottomY1)
        .transition()
        .duration(2000)
        .attr('x2', endX)
        .attr('y2', bottomY2);

    scatterG.append('line')
        .attr('class', 'healthy-weight-line')
        .attr('x1', startX)
        .attr('x2', startX)
        .attr('y1', topY1)
        .attr('y2', topY1)
        .transition()
        .duration(2000)
        .attr('x2', endX)
        .attr('y2', topY2);

}

function updateScatterDots(gender) {
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