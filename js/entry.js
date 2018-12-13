var comicWeightData,
    scatterData,
    scatterGenderData;

//load in data for all vizzes and then build
getData()

function getData() {
	// Load data sources
    var comicWeightDataUnresolved = d3.csv('assets/data/comicWeightData.csv').then(function(comicWeight) { return comicWeight; });
    var scatterDataUnresolved = d3.csv('assets/data/height_weight_aggregate.csv').then(function(scatter) { return scatter; });
    var scatterGenderDataUnresolved = d3.csv('assets/data/gender_height_weight_aggregate.csv').then(function(scatterGender) { return scatterGender; });
	Promise.all([comicWeightDataUnresolved, scatterDataUnresolved, scatterGenderDataUnresolved]).then(function(response) {
        comicWeightData = prepComicWeightData(response[0]);
        scatterData = prepScatterData(response[1]);
        scatterGenderData = prepScatterData(response[2]);
        heatmapData = prepScatterData(response[1]);
        heatmapGenderData = prepScatterData(response[2]);
        resizeGeneral();
	});
}

function prepComicWeightData(data) {
    data.forEach(function(d) {
        d.weight = +d.weightInPounds;
        d.heightInInches = +d.heightInInches;
        d.appearances = +d.appearances;
    })

    var limitedWeightData = data.filter(function(d) {
        return d.weight > 80 && d.weight < 300 && d.appearances > 0 && d.universe == 'Earth-616';
    });

    return limitedWeightData;
}

function prepScatterData(data) {
    data.forEach(function(d) {
        d.weight = +d.weight;
        d.height = +d.height;
        d.count = +d.count;
    })

    var limitedWeightData = data.filter(function(d) {
        return d.weight > 80 && d.weight < 400;
    });
    
    return limitedWeightData;
}
