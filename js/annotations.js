function makeAnnotationsSwarm() {
    var type = d3.annotationCalloutCircle

    var annotations = [{
        note: {
            label: "Something about how this is the average female weight. Should probably use median BTW.",
            title: "Average Female Weight"
        },
        //can use x, y directly instead of data
        x: swarmW / 4,
        y: swarmYScale(140),
        dy: 100,
        dx: 100,
        subject: {
            radius: 50,
            radiusPadding: 5
        },
        color:'white',
        width:200
    }]

    var makeAnnotations = d3.annotation()
        .notePadding(0)
        .type(type)
        .annotations(annotations)

    d3.select("#Female-g")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
}