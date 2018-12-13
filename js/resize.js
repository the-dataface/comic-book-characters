//general st up
var windowW,
    windowH;

var previousWidth = 0;

var isDesktop = false,
    isTablet = false,
    isMobile = false;

var genderColors = {
    'Male':'black',
    'Female':'white',
    'All':'grey'
};

function resizeGeneral() {
    windowW = window.innerWidth,
    windowH = window.innerHeight;

    if (previousWidth != windowW) {
        previousWidth = windowW;

        isDesktop = false,
        isTablet = false,
        isMobile = false;

        if (windowW >= 1000) {
            isDesktop = true;
        } else if (windowW >= 764) {
            isTablet = true;
        } else {
            isMobile = true;
        }

        initSwarm();
        //initScatter();
        initHeatmap();
    }
}

window.addEventListener('resize', function() {
    resizeGeneral();
})