/// <reference path="services/textMeasurement.ts"/>
/// <reference path="geometry/spatialHash.ts"/>

var textSize = m3.services.TextMeasurement.measureWidth({
    text: 'Hey',
    fontFamily: 'san-serif',
    fontSize: '12px'
});

var spatial = new m3.geometry.SpatialHash(10);
spatial.insert({position: {x: 10, y: 10}});
console.log(spatial.find({position: {x: 10, y: 10}}));

window.console.log(textSize);