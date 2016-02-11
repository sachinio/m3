/// <reference path="../../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../../src/graphics/surface/iSurface.ts"/>
/// <reference path="../../../src/graphics/surface/canvas.ts"/>
/// <reference path="../../../src/_reference.ts"/>

namespace m3tests.ui.graphics {

    describe('Canvas', () => {
        function createCanvasContext(){
            var canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 600;
            return canvas;//.getContext('2d');
        }

        function drawSomeShapesAndUpdate(surface: m3.graphics.surface.ISurface, force = false){
            surface.begin();
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'green',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'green',fill:'green'}});
            surface.drawLine({points: [{x:0,y:0},{x:2,y:2}],style:{fill:'',stroke:'black'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});
            surface.update(force);
        }

        it('draw circle', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(), true);
            surface.begin();
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'red',fill:'green'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            var fillSpy = spyOn((<any>surface).context, 'fill');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('draw rectangle', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            surface.begin();
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            var fillSpy = spyOn((<any>surface).context, 'fill');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('draw round rectangle', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            surface.begin();
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
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            surface.begin();
            surface.drawLine({points: [{x:0,y:0},{x:2,y:2}],style:{fill:'',stroke:'black'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
        });

        it('draw regular polygon', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            surface.begin();
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});
            var strokeSpy = spyOn((<any>surface).context, 'stroke');
            var fillSpy = spyOn((<any>surface).context, 'fill');
            surface.update();
            expect(strokeSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('no optimize round rectangle', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(),false);
            surface.begin();
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

        it('no optimize circle', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(),false);
            surface.begin();
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'red',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'green',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'red',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'green',fill:'green'}});

            let counter = 0;
            spyOn((<any>surface).context, 'stroke').and.callFake(()=>{
                counter++;
            });
            surface.update();
            expect(counter).toBe(4);
        });


        it('no optimize rectangle', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(),false);
            surface.begin();
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

        it('no optimize polygon', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(), false);
            surface.begin();
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
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            surface.begin();
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
            var surface = m3.graphics.surface.create(createCanvasContext(), true);
            surface.begin();
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
            var surface = m3.graphics.surface.create(createCanvasContext(), true);
            surface.begin();
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

        it('no re-draw if scene unchanged',()=>{
            var surface = m3.graphics.surface.create(createCanvasContext(),true);

            drawSomeShapesAndUpdate(surface);
            var spy = spyOn(surface,'clearContext');
            drawSomeShapesAndUpdate(surface)
            expect(spy).not.toHaveBeenCalled();
        });

        it('re-draw if scene unchanged, but force update on',()=>{
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            drawSomeShapesAndUpdate(surface);
            var spy = spyOn(surface,'clearContext');
            drawSomeShapesAndUpdate(surface,true);
            expect(spy).toHaveBeenCalled();
        });

        it('requestAnimation to be called when contains animation definition',()=>{
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            surface.begin();
            surface.drawRect({x:0,y:0,height:<m3.graphics.surface.AnimationDefinition<number>>
            {
                ease:'linear',
                duration: 500,
                endValue:20
            },
                width:100,
                style:{stroke:'red',fill:'green'}
            });
            var spy = spyOn(surface,'requestAnimation');
            surface.update();
            expect(spy).toHaveBeenCalled();
        });

        it('no begin preceding an update should throw',()=>{
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            expect(()=>surface.update()).toThrow(new Error(m3.strings.CanvasPointerMismatchErrorMessage));
        });

        it('wipe', () => {
            var surface = m3.graphics.surface.create(createCanvasContext(),true);
            surface.begin();
            surface.drawRect({x:0,y:0,height:100,width:100,style:{stroke:'red',fill:'green'}});
            surface.drawCircle({x:0,y:0,r:10,style:{stroke:'green',fill:'green'}});
            surface.drawRoundRect({x:0,y:0,height:100,width:100,
                radiusTL:10,radiusTR:10,radiusBL:10,radiusBR: 10,
                style:{stroke:'green',fill:'green'}});
            surface.drawLine({points: [{x:0,y:0},{x:2,y:2}],style:{fill:'',stroke:'black'}});
            surface.drawRegularPolygon({x:10,y:10,radius:10,sides:6, startAngle:0,style:{fill:'red',stroke:'green'}});

            surface.update();
            surface.clear();
            expect((<any>surface).viewModel[0].rectangles.length).toBe(0);
            expect((<any>surface).viewModel[0].roundRectangles.length).toBe(0);
            expect((<any>surface).viewModel[0].circles.length).toBe(0);
            expect((<any>surface).viewModel[0].lines.length).toBe(0);
            expect((<any>surface).viewModel[0].regularPolygons.length).toBe(0);

            expect((<any>surface).viewModel[1].rectangles.length).toBe(0);
            expect((<any>surface).viewModel[1].roundRectangles.length).toBe(0);
            expect((<any>surface).viewModel[1].circles.length).toBe(0);
            expect((<any>surface).viewModel[1].lines.length).toBe(0);
            expect((<any>surface).viewModel[1].regularPolygons.length).toBe(0);
        });
    });
}