/// <reference path="../../../typedefs/jasmine.d.ts"/>
/// <reference path="../../../src/ui/graphics/iSurface.ts"/>
/// <reference path="../../../src/ui/graphics/canvas.ts"/>

module m3tests.ui.graphics {
    describe('Canvas', () => {
        function createCanvasContext(){
            var canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 600;
            return canvas;//.getContext('2d');
        }

        it('draw circle', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'red',fill:'green'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            var fillSpy = spyOn((<any>surface).context, 'fill');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('draw rectangle', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            var fillSpy = spyOn((<any>surface).context, 'fill');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('draw round rectangle', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'red',fill:'green'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            var fillSpy = spyOn((<any>surface).context, 'fill');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('draw line', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawLine({points: [{x:0,y:0},{x:2,y:2}],style:{fill:'',stroke:'black'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
        });

        it('draw regular polygon', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            var fillSpy = spyOn((<any>surface).context, 'fill');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('no optimize round rectangle', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), false);
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'red',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'green',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'red',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'green',fill:'green'}});

            var counter = 0;
            spyOn((<any>surface).context, 'stroke').and.callFake(()=>{
                counter++;
            });
            surface.update();
            expect(counter).toBe(4);
        });

        it('no optimize rectangle', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), false);
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'green',fill:'green'}});
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'green',fill:'green'}});

            var counter = 0;
            spyOn((<any>surface).context, 'stroke').and.callFake(()=>{
                counter++;
            });
            surface.update();
            expect(counter).toBe(4);
        });

        it('no optimize circle', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), false);
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'red',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'green',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'red',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'green',fill:'green'}});

            var counter = 0;
            spyOn((<any>surface).context, 'stroke').and.callFake(()=>{
                counter++;
            });
            surface.update();
            expect(counter).toBe(4);
        });

        it('no optimize polygon', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), false);
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'red'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'red'}});

            var counter = 0;
            spyOn((<any>surface).context, 'stroke').and.callFake(()=>{
                counter++;
            });
            surface.update();
            expect(counter).toBe(4);
        });

        it('optimize polygon', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'red'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'red'}});

            var counter = 0;
            spyOn((<any>surface).context, 'stroke').and.callFake(()=>{
                counter++;
            });
            surface.update();
            expect(counter).toBe(2);
        });

        it('optimize rectangle', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'green',fill:'green'}});
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'green',fill:'green'}});

            var counter = 0;
            spyOn((<any>surface).context, 'stroke').and.callFake(()=>{
                counter++;
            });
            surface.update();
            expect(counter).toBe(2);
        });

        it('optimize round rectangle', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'red',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'green',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'red',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'green',fill:'green'}});

            var counter = 0;
            spyOn((<any>surface).context, 'stroke').and.callFake(()=>{
                counter++;
            });
            surface.update();
            expect(counter).toBe(2);
        });

        it('wipe', () => {
            var surface = m3.ui.graphics.create(createCanvasContext(), true);
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'green',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'green',fill:'green'}});
            surface.drawLine({points: [{x:0,y:0},{x:2,y:2}],style:{fill:'',stroke:'black'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});

            surface.update();
            surface.clear();
            expect((<any>surface).rectangles.length).toBe(0);
            expect((<any>surface).roundRectangles.length).toBe(0);
            expect((<any>surface).circles.length).toBe(0);
            expect((<any>surface).lines.length).toBe(0);
            expect((<any>surface).regularPolygons.length).toBe(0);
        });
    });
}