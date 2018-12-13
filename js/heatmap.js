//set up heatmap
//data

//containers
var heatmapSectionWrapper = d3.select('#heatmap-section-wrapper'),
    heatmapContainer = d3.select('#heatmap-container'),
    heatmapSvg,
    heatmapG;

//sizes
var heatmapOuterW,
    heatmapOuterH,
    heatmapW,
    heatmapH,
    heatmapMargin;

//scales
var heatmapXScale,
    heatmapYScale,
    heatmapRScale,
    heatmapColorScale;

//grid stuff
var heatmapGridXRange,
    heatmapGridYRange,
    heatmapGridWidth,
    heatmapGridHeight;
    
//other

function updateHeatmap(gender) {
    var filteredData;
    if (gender == 'All') {
        filteredData = heatmapData;
    } else {
        filteredData = heatmapGenderData.filter(function(d) {
            return d.gender == gender;
        })
    }

    d3.selectAll('.heatmap-rect')
        .transition()
        .duration(2000)
        .attr('fill', function() {
            var thisID = d3.select(this).attr('id'),
                thisHeightWeight = thisID.split(' '),
                thisHeight = parseInt(thisHeightWeight[0]),
                thisWeight = parseInt(thisHeightWeight[1]);

            var thisCountFind = filteredData.filter(function(d) {
                return d.height == thisHeight && d.weight == thisWeight;
            })

            var thisCount = 0;
            if (thisCountFind.length == 1) {
                thisCount = thisCountFind[0].count;
            }

            return heatmapColorScale(thisCount);  
        })
}

function buildHeatmap() {   
    heatmapSvg = heatmapContainer.append('svg')
        .attr('class', 'heatmap-svg')
        .attr('width', heatmapOuterW)
        .attr('height', heatmapOuterH);

    heatmapG = heatmapSvg.append('g')
        .attr('transform', 'translate(' + heatmapMargin.left + ', ' + heatmapMargin.top + ')');

    var heatmapXAxis = d3.axisBottom(heatmapXScale)
        .tickSizeOuter(0)
        /*.tickValues(xScale.domain())
        .ticks(0)
        .tickSizeOuter(0)
        .tickFormat(function(d) {
            return (d * 100).toFixed(1) + '%';
        });
        */

    heatmapG.append('g')
        .attr("transform", "translate(0," + heatmapH + ")")
        .attr('class', 'heatmap-x-axis heatmap-axis')
        .call(heatmapXAxis);

    var heatmapYAxis = d3.axisLeft(heatmapYScale)
        .tickSizeOuter(0)
        /*.tickValues(yScale.domain())
        .ticks(0)
        .tickSizeOuter(0)
        .tickFormat(function(d) {
            return (d * 100).toFixed(1) + '%';
        });
        */

    heatmapG.append('g')
        .attr('class', 'heatmap-y-axis heatmap-axis')
        .call(heatmapYAxis);

    for (i in heatmapGridYRange) {
        for (v in heatmapGridXRange) {
            var thisXPos = v * heatmapGridWidth,
                thisYPos = i * heatmapGridHeight;

            var thisXValue = heatmapGridXRange[v],
                thisYValue = heatmapGridYRange[i];

            var thisRectG = heatmapG.append('g')
                .attr("transform", 'translate(' + thisXPos + ', ' + thisYPos + ')')

            var thisCountFind = heatmapData.filter(function(d) {
                return d.height == thisXValue && d.weight == thisYValue;
            })

            var thisCount = 0;
            if (thisCountFind.length == 1) {
                thisCount = thisCountFind[0].count;
            }

            thisRectG.append('rect')
                .attr('class', 'heatmap-rect')
                .attr('id', thisXValue + ' ' + thisYValue)
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', heatmapGridWidth)
                .attr('height', heatmapGridHeight)
                .attr('fill', function() {
                    return heatmapColorScale(thisCount);
                });

        }

    }

    /*
    heatmapG.selectAll('.heatmap-dot')
        .data(heatmapData, function(d) {
            return d.height.toString() + d.weight.toString();
        })
        .enter()
        .append('circle')
        .attr('class', 'heatmap-dot')
        .attr('cx', function(d) { return heatmapXScale(d.height);})
        .attr('cy', function(d) { return heatmapYScale(d.weight);})
        .attr('r', function(d) { return heatmapRScale(d.count);})
        .attr('stroke', function(d) { return '#37609B'; })
        .attr('stroke-width', function(d) { return '1'; })
        .attr('fill', 'grey')
    */
}

function setupHeatmap() {
    heatmapOuterW = heatmapContainer.node().offsetWidth,
    heatmapOuterH = heatmapContainer.node().offsetHeight;

    heatmapMargin = {
        left:40,
        right:20,
        top:20,
        bottom:20
    };

    heatmapW = heatmapOuterW - heatmapMargin.left - heatmapMargin.right,
    heatmapH = heatmapOuterH - heatmapMargin.top - heatmapMargin.bottom;

    var minMaxX = d3.extent(heatmapData, function(d) {
        return d.height;
    });

    var minMaxY = d3.extent(heatmapData, function(d) {
        return d.weight;
    });

    var minMaxR = d3.extent(heatmapData, function(d) {
        return d.count;
    });

    var minMaxCount = d3.extent(heatmapData, function(d) {
        return d.count;
    });

    heatmapXScale = d3.scaleLinear().range([0, heatmapW]).domain([minMaxX[0] - 1, minMaxX[1] + 1]),
    //heatmapYScale = d3.scaleLinear().range([heatmapH, 0]).domain([0, minMaxY[1]]),
    heatmapYScale = d3.scaleLinear().range([heatmapH, 0]).domain([80, 280]),
    heatmapRScale = d3.scaleSqrt().range([2, 10]).domain(minMaxR),
    heatmapColorScale = d3.scaleSqrt().domain([0, minMaxCount[1]]).interpolate(d3.interpolateHcl).range([d3.rgb("#37609B"), d3.rgb('#FFF500')]);


    heatmapGridXRange = range(heatmapXScale.domain()[0], heatmapXScale.domain()[1]),
    heatmapGridYRange = range(heatmapYScale.domain()[0], heatmapYScale.domain()[1]).reverse();

    heatmapGridWidth = heatmapW / heatmapGridXRange.length,
    heatmapGridHeight = heatmapH / heatmapGridYRange.length;



    buildHeatmap();
}

function initHeatmap() {
    setupHeatmap();
}

function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}
