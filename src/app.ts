/// <reference path="services/textMeasurement.ts"/>
/// <reference path="services/worker.ts"/>
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

var inlineWorkerText = "self.addEventListener('message', function(e) { postMessage(e.data * 2); } ,false);";
var inlineWorker:m3.services.IWorker = m3.services.Worker.create(inlineWorkerText);
inlineWorker.onmessage = (e) =>{
    console.log(e.data);
};

inlineWorker.postMessage(10);