/// <reference path="../../_reference.ts"/>
/// <reference path="../surface/iSurface.ts"/>

module m3.graphics.component {
    import Rect = m3.graphics.surface.Rect;

    export interface BarsData {
        values: number[];
    }
    export class Bars implements IComponent {
        private surface:m3.graphics.surface.ISurface;

        constructor(surface) {
            this.surface = surface;
            surface.listenTo(m3.graphics.events.types.mouseDown);
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
                var rect:m3.graphics.surface.Rect = {
                    x: xScale(i.toString()),
                    y: <m3.graphics.surface.AnimationDefinition<number>>{
                        ease: 'bounce',
                        duration: 1000,
                        delay: 0,
                        endValue: yScale(values[i])
                    },
                    width: xScale.rangeBand(),
                    height: <m3.graphics.surface.AnimationDefinition<number>>{
                        ease: 'bounce',
                        duration: 1000,
                        delay: 0,
                        endValue: height - yScale(values[i])
                    },
                    style: {fill: 'green', stroke: ''},
                    events: {
                        [m3.graphics.events.types.mouseDown]: (d:Rect, ds:Rect[])=> {
                            ds.forEach(dc=> {
                                if (dc != d) {
                                    dc.style.fill = 'green'
                                }
                            });
                            d.style.fill = d.style.fill === 'green' ? 'red' : 'green'
                            d.height = <m3.graphics.surface.AnimationDefinition<number>>{
                                ease: 'bounce',
                                duration: 1000,
                                delay: 0,
                                startValue: <number>d.height,
                                endValue: 40
                            };
                            d.y = <m3.graphics.surface.AnimationDefinition<number>>{
                                ease: 'bounce',
                                duration: 1000,
                                delay: 0,
                                startValue: <number>d.y,
                                endValue: height - 40
                            }
                        }
                    }
                };

                surface.drawRect(rect);
            }
        }
    }
}