/// <reference path="algorithms/textMeasurement.ts"/>

module m3 {
    var textSize = algorithms.TextMeasurement.measureWidth({
        text: 'Hey',
        fontFamily: 'san-serif',
        fontSize: '12px'
    });

    console.log(textSize)
}