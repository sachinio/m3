/// <reference path="../../_reference.ts"/>

module m3.ui.component {
    export interface BarsData {
        values: number[];
    }
    export class Bars implements IComponent {
        private surface:m3.ui.graphics.ISurface;

        constructor(surface) {
            this.surface = surface;
            surface.listenTo(m3.ui.events.types.mouseDown);
        }

        public update(options:ComponentUpdateOptions<BarsData>) {
            var height = options.boundingBox.height;
            var width = options.boundingBox.width;
            var values = options.data.values;
            var surface = this.surface;

            var max = d3.max(values);

            var yScale = d3.scale.linear()
                .domain([0, max])
                .range([height, 0]);

            var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1);
            xScale.domain(values.map(function (d, i) {
                return i.toString();
            }));

            for (let i = 0, len = values.length; i < len; i++) {
                var rect:m3.ui.graphics.Rect = {
                    x: xScale(i.toString()),
                    y: yScale(values[i]),
                    width: xScale.rangeBand(),
                    height: height - yScale(values[i]),
                    style: {fill: 'green', stroke: ''},
                    events: {}
                };

                rect.events[m3.ui.events.types.mouseDown] = (d:m3.ui.graphics.Rect, dm:m3.ui.graphics.Rect[])=> {
                    dm.forEach(dc=>{
                        if(dc!=d){
                            dc.style.fill = 'green'
                        }
                    });
                    d.style.fill = d.style.fill === 'green' ? 'red' : 'green'
                };

                surface.drawRect(rect);
            }
        }
    }
}