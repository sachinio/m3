/// <reference path="../../../src/_reference.ts"/>

namespace m3tests.ui.events {
    describe('Hit Tester', ()=> {

        function createSurface() {
            var canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;

            return m3.graphics.surface.create(canvas);
        }

        function createAndCallEvent(e: Element,name){
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(name, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            e.dispatchEvent(evt);
        }

        it('test click circle', ()=> {
            var surface = createSurface();
            surface.listenTo(m3.graphics.events.types.click);
            var circle: m3.graphics.surface.Circle = {x:0,y:0,r:10, style:{fill:'green',stroke:''}, events:{}};
            circle.events[m3.graphics.events.types.click] = (d)=>d.style.fill='red';
            surface.begin();
            surface.drawCircle(circle);

            var spy = spyOn(surface,'update');
            createAndCallEvent(surface.htmlCanvas, 'click');

            expect(circle.style.fill).toEqual('red');
            expect(spy).toHaveBeenCalledWith(true);

        });

        it('test click rectangle', ()=> {
            var surface = createSurface();
            surface.listenTo(m3.graphics.events.types.click);
            var rect: m3.graphics.surface.Rect = {x:0,y:0,height:10,width:10, style:{fill:'green',stroke:''}, events:{}};
            rect.events[m3.graphics.events.types.click] = (d)=>d.style.fill='pink';
            surface.begin();
            surface.drawRect(rect);

            var spy = spyOn(surface,'update');
            createAndCallEvent(surface.htmlCanvas, 'click');

            expect(rect.style.fill).toEqual('pink');
            expect(spy).toHaveBeenCalledWith(true);
        });
    });
}