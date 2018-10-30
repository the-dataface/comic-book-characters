// using d3 for convenience
var container = d3.select('#scatter-wrapper');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');
// initialize the scrollama
var scroller = scrollama();
// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepHeight = Math.floor(window.innerHeight * 0.75);
    step.style('height', stepHeight + 'px');
    // 2. update width/height of graphic element
    var bodyWidth = d3.select('body').node().offsetWidth;
    var textWidth = text.node().offsetWidth;
    var graphicWidth = bodyWidth;
    graphic
        .style('width', graphicWidth + 'px')
        .style('height', window.innerHeight + 'px');
    var chartMargin = 32;
    var chartWidth = graphic.node().offsetWidth - chartMargin;
    chart
        .style('width', chartWidth * .5 + 'px')
        .style('height', Math.floor(window.innerHeight * .75) + 'px');
    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}
// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    step.classed('is-active', function (d, i) {
        return i === response.index;
    })
    
    if (response.index == 0) {
        updateScatter('All');
    } else if (response.index == 1) {
        updateScatter('Male');
    } else if (response.index == 2) {
        updateScatter('Female');
    }
    
}
function handleContainerEnter(response) {
    // response = { direction }
}
function handleContainerExit(response) {
    // response = { direction }
}
function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        Stickyfill.add(this);
    });
}
function init() {
    setupStickyfill();
    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();
    // 2. setup the scroller passing options
    // this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        container: '#scroll',
        graphic: '.scroll__graphic',
        text: '.scroll__text',
        step: '.scroll__text .step',
    })
        .onStepEnter(handleStepEnter)
        .onContainerEnter(handleContainerEnter)
        .onContainerExit(handleContainerExit);
    // setup resize event
    window.addEventListener('resize', handleResize);
}
// kick things off
init();