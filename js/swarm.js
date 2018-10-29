//set up swarm
//data
var swarmData,
    swarmAvgsData;

//containers
var swarmSectionWrapper = d3.select('#swarm-section-wrapper'),
    swarmContainer = d3.select('#swarm-container'),
    swarmTooltip = d3.select('#swarm-tooltip'),
    swarmContainerM,
    swarmContainerF;

//sizes
var swarmOuterW,
    swarmOuterH,
    swarmW,
    swarmH,
    swarmMargin;

//scales
var swarmYScale,
    swarmRScale,
    swarmColorScale;

//other
var swarmColors = {
    'Male':'black',
    'Female':'white'
};

//build after setup
function buildSwarm()   {
    swarmContainer.select('div').remove();

    var genders = ['Female', 'Male'];

    var swarmAxisSvg = swarmContainer.append('svg')
        .attr('class', 'swarm-axis-svg')
        .style('width', swarmOuterW)
        .style('height', swarmOuterH);

    var swarmAxisG = swarmAxisSvg.append('g')
        .attr('transform', 'translate(' + swarmMargin.left + ', ' + swarmMargin.top + ')')

    var swarmYAxis = d3.axisLeft(swarmYScale)
        .tickSize(-swarmOuterW)
        .tickFormat(function(d) {
            return d + ' lbs';
        })

    var swarmYAxisG = swarmAxisG.append("g")
        .attr('class', 'swarm-y-axis')
        .call(swarmYAxis);

    swarmYAxisG.selectAll('.tick')
        .select('text')
        .attr('x', swarmOuterW / 2)
        .attr('y', -10);

    for (var i in genders) {
        var thisGender = genders[i];

        var thisSwarm = swarmContainer.append('div')
            .attr('class', 'swarm-half')
            .attr('id', 'swarm-half-' + thisGender)
            .style('width', swarmOuterW / 2 + 'px')
            .style('height', swarmOuterH + 'px');

        var thisSwarmSvg = thisSwarm.append('svg')
            .attr('width', swarmOuterW / 2)
            .attr('height', swarmOuterH);
    
        var thisSwarmG = thisSwarmSvg.append('g')
            .attr('transform', 'translate(' + swarmMargin.left + ', ' + swarmMargin.top + ')')

        var thisGenderData = comicWeightData.filter(function(d) {
            return d.gender == thisGender;
        })

        var simulation = d3.forceSimulation(thisGenderData)
            .force("x", d3.forceX(swarmOuterW / 4).strength(.1))
            .force("y", d3.forceY(function(d) { return swarmYScale(d.weight); }).strength(.1))
            .force("collide", d3.forceCollide().radius(function(d) { return swarmRScale(d.appearances) + 0.5; }).iterations(2))
            .velocityDecay(0.2)
            .stop();
        
        for (var i = 0; i < 200; ++i) simulation.tick();
        

        var cells = thisSwarmG.append("g")
            .attr("class", "cells")
            .selectAll("g").data(d3.voronoi()
                .extent([[-swarmMargin.left, -swarmMargin.top], [swarmW + swarmMargin.right, swarmH + swarmMargin.top]])
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
            .polygons(thisGenderData)).enter().append("g");
        
        cells.append("circle")
            .attr('class', 'swarm-circle')
            .attr("r", function(d) { return swarmRScale(d.data.appearances); })
            .attr("cx", function(d) { return d.data.x; })
            .attr("cy", function(d) { return d.data.y; })
            .attr('fill', swarmColors[thisGender])
            .attr('stroke', '#37609B')
            .attr('stroke-width', '.2')
            .on("mouseover", function(d) {
                var thisGender = d.data.gender,
                    thisContainer = d3.select('#swarm-half-' + thisGender)

                swarmMouseover(d, this, thisContainer);
            })
            .on("mousemove", function(d) {
                swarmMousemove(d);
            })
            .on("mouseout", function() {
                swarmMouseout(this)
            });

    }

}

//set up variables and stuff
function setupSwarm() {
    swarmOuterH = 3000,
    swarmOuterW = swarmContainer.node().offsetWidth;

    swarmMargin = {
        top: 40,
        right: 10,
        bottom: 10,
        left: 10
    };

    swarmW = swarmOuterW - swarmMargin.left - swarmMargin.right,
    swarmH = swarmOuterH - swarmMargin.top - swarmMargin.bottom;

    swarmContainer.style('height', swarmOuterH + 'px');

    swarmYScale = d3.scaleLinear()
        .domain(d3.extent(comicWeightData, function(d) {
            return d.weight;
        }))
        .range([0, swarmH]);

    swarmRScale = d3.scaleSqrt()
        .domain(d3.extent(comicWeightData, function(d) {
            return d.appearances;
        }))
        .range([3, 20]);

    buildSwarm();
}

//control steps of build
function initSwarm() {
    setupSwarm();
}

function swarmMouseover(data, thisDot, container) {
    swarmTooltip.style("display", "inline");

    /*
    d3.select(thisDot)
        .transition()
        .duration(200)
        .attr('r', function(d) {return swarmRScale(d.data.appearances) + 2});
    */

    container.append('img')
        .attr('class', 'hero-img')
        .style('width', swarmRScale(data.data.appearances) * 2 + 'px')
        .style('height', swarmRScale(data.data.appearances) * 2 + 'px')
        .style('left', data.data.x + swarmMargin.left + 'px')
        .style('top', data.data.y + swarmMargin.top + 'px')
        .attr('src', data.data.picLink)
        .transition()
        .duration(200)
        .style('width', swarmRScale(data.data.appearances) * 3 + 'px')
        .style('height', swarmRScale(data.data.appearances) * 3 + 'px')

  }
  
  function swarmMousemove(data) {
    swarmTooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px");

    swarmTooltip.select('h3')
        .text(data.data.superName);
        
    swarmTooltip.select('#appearances')
        .text(data.data.appearances);

    swarmTooltip.select('#weight')
        .text(data.data.weight + 'lbs');
  }
  
  function swarmMouseout(thisDot) {
    swarmTooltip.style("display", "none");

    d3.selectAll('.hero-img').remove();

    /*
    d3.select(thisDot)
        .transition()
        .duration(200)
        .attr('r', function(d) {return swarmRScale(d.data.appearances)});
    */
  }
