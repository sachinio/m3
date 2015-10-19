/// <reference path="../types/basic.ts"/>

module m3.services {
    export module TextMeasurement {
        var element;

        export function measureWidth(properties:m3.types.ITextProperties):number {
            if (!properties || !properties.text) return 0;

            if (!element)
                element = document.createElement('canvas');

            var ctx = element.getContext('2d');
            ctx.font = properties.fontFamily + ' ' + properties.fontSize;
            return ctx.measureText(properties.text).width;
        }
    }
}