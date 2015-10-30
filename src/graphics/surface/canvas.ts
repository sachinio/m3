/// <reference path="canvasPainter.ts"/>
/// <reference path="../events/hitTester.ts"/>
/// <reference path="../animation/animator.ts"/>
/// <reference path="../../_reference.ts"/>

namespace m3.graphics.surface {
    export function create(htmlCanvas, experimental:boolean = false) {
        return new Canvas(htmlCanvas, experimental);
    }

    export interface CanvasViewModel {
        circles: Circle[];
        rectangles:Rect[];
        roundRectangles:RoundRect[];
        lines:Line[];
        regularPolygons:RegularPolygon[];
    }

    export class Canvas implements ISurface {
        private context;
        private hitTester:m3.graphics.events.CanvasHitTester;
        private pointer:number;
        private previousPointer:number;
        private viewModel:[CanvasViewModel,CanvasViewModel];
        private animating: boolean;

        constructor(public htmlCanvas, private experimental) {
            this.context = htmlCanvas.getContext('2d');
            this.hitTester = new m3.graphics.events.CanvasHitTester();
            this.resetViewModel();
            this.previousPointer = this.pointer = 0;
            this.animating = false;

            if(this.experimental){
                console.warn(strings.ExperimentalFeaturesOnMessage);
            }
        }

        public listenTo(name:string) {
            this.hitTester.subscribe(name, this);
        }

        public stopListeningTo(eventName:string) {
            this.hitTester.unSubscribe(eventName, this);
        }

        public drawCircle(props:Circle) {
            this.viewModel[this.pointer].circles.push(props);
        }

        public drawRect(props:Rect) {
            this.viewModel[this.pointer].rectangles.push(props);
        }

        public drawRoundRect(props:RoundRect) {
            this.viewModel[this.pointer].roundRectangles.push(props);
        }

        public drawLine(props:Line) {
            this.viewModel[this.pointer].lines.push(props);
        }

        public drawRegularPolygon(props:RegularPolygon) {
            this.viewModel[this.pointer].regularPolygons.push(props);
        }

        public begin() {
            this.previousPointer = this.pointer;
            this.pointer++;
            this.pointer = this.pointer % 2;
            this.viewModel[this.pointer] = {
                circles: [],
                rectangles: [],
                roundRectangles: [],
                regularPolygons: [],
                lines: [],
            };
        }

        public clear() {
            this.resetViewModel();
            this.clearContext();
        }

        public update(forceUpdate: boolean = false) {
            if (!forceUpdate && this.sceneUnchanged()) return;
            var viewModel = this.viewModel[this.pointer];

            var lastViewModel = this.viewModel[(this.pointer + 1) % 2];

            graphics.animation.computeStartValues(viewModel.rectangles, lastViewModel.rectangles);
            graphics.animation.computeStartValues(viewModel.circles, lastViewModel.circles);
            let hasAnimations = graphics.animation.initializeAnimation(viewModel.rectangles, viewModel.circles);

            if (!this.animating) {
                if (hasAnimations) {
                    this.requestAnimation();
                } else {
                    console.log('paint');
                    this.paint();
                }
            }
        }

        private requestAnimation() {
            this.animating = true;
            window.requestAnimationFrame(()=> {
                if (this.paint()) {
                    this.requestAnimation();
                }else{
                    console.log('animator stopped')
                    this.animating = false;
                }
            })
        }

        private paint(){
            var context = this.context;
            var experimental = this.experimental;

            var viewModel = this.viewModel[this.pointer];

            var hasAnimations = graphics.animation.tickAnimations(viewModel.rectangles, viewModel.circles);
            this.clearContext();
            CanvasPainter.drawCircles(context, viewModel.circles);
            CanvasPainter.drawRectangles(context, viewModel.rectangles, experimental);
            CanvasPainter.drawRoundRectangles(context, viewModel.roundRectangles, experimental);
            CanvasPainter.drawLines(context, viewModel.lines);
            CanvasPainter.drawRegularPolygons(context, viewModel.regularPolygons, experimental);

            return hasAnimations;
        }

        public getCurrentState(): CanvasViewModel {
            return this.viewModel[this.pointer];
        }

        private clearContext() {
            this.context.clearRect(0,0,this.htmlCanvas.width, this.htmlCanvas.height);
        }

        private resetViewModel() {
            this.viewModel = [{
                circles: [],
                rectangles: [],
                roundRectangles: [],
                regularPolygons: [],
                lines: [],
            }, {
                circles: [],
                rectangles: [],
                roundRectangles: [],
                regularPolygons: [],
                lines: [],
            }];
        }

        private sceneUnchanged() {
            var viewModel = this.viewModel;

            if (this.previousPointer === this.pointer) {
                throw new Error(m3.strings.CanvasPointerMismatchErrorMessage);
            }

            return _.isEqual(viewModel[0], viewModel[1]);
        }
    }
}