var comicWeightData;

//load in data for all vizzes and then build
getData()

function getData() {
	// Load data sources
    var comicWeightDataUnresolved = d3.csv('assets/data/comicWeightData.csv').then(function(comicWeight) { return comicWeight; });
	Promise.all([comicWeightDataUnresolved]).then(function(response) {
        comicWeightData = prepComicWeightData(response[0]);

        resizeGeneral();
	});
}

function prepComicWeightData(data) {
    data.forEach(function(d) {
        d.weight = +d.weightInPounds;
        d.appearances = +d.appearances;
    })

    var limitedWeightData = data.filter(function(d) {
        return d.weight > 80 && d.weight < 300 && d.appearances > 0;
    });

    return limitedWeightData;
}
