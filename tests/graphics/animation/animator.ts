/// <reference path="../../../src/_reference.ts"/>

namespace m3tests.graphics.animation {
    describe('animation', ()=> {
        function createShapes():m3.graphics.surface.Shape[] {
            return [<m3.graphics.surface.Shape>{
                x: 10,
                y: 10,
                r: 10,
                style: {fill: '', stroke: ''}
            },
                <m3.graphics.surface.Shape>{
                    x: 10,
                    y: 10,
                    height: 10,
                    width: 10,
                    style: {fill: '', stroke: ''}
                }];
        }

        it('initialize animations', ()=> {
            var shapes = createShapes();
            shapes[0]['x'] = <m3.graphics.surface.AnimationDefinition<number>>{
                ease: 'bounce',
                endValue: 10,
                duration: 1000
            };

            m3.graphics.animation.initializeAnimation(shapes);

            expect(shapes[0]['x']).toBe(0);
        });

        it('Compute start values from previous shape', ()=> {
            var shapes = createShapes();
            var newShapes = createShapes();
            newShapes[0]['x'] = <m3.graphics.surface.AnimationDefinition<number>>{
                ease: 'bounce',
                endValue: 20,
                duration: 1000
            };

            m3.graphics.animation.computeStartValues(newShapes, shapes);
            m3.graphics.animation.initializeAnimation(newShapes);

            expect(newShapes[0].animations['x'].startValue).toBe(10);
        });

        it('tick animations', (done)=> {
            var shapes = createShapes();
            shapes[0]['x'] = <m3.graphics.surface.AnimationDefinition<number>>{
                ease: 'linear',
                endValue: 10,
                duration: 1000
            };

            m3.graphics.animation.initializeAnimation(shapes);

            setTimeout(()=> {
                m3.graphics.animation.tickAnimations(shapes);
                expect(shapes[0]['x']).toBeCloseTo(1,0);
                done();
            },100);
        });
    });
}