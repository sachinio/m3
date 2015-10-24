/// <reference path="canvasPainter.ts"/>
/// <reference path="../events/hitTester.ts"/>
/// <reference path="../../_reference.ts"/>

module m3.graphics.surface {
    export function create(htmlCanvas, optimize:boolean = false) {
        return new Canvas(htmlCanvas, optimize);
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

        constructor(public htmlCanvas, private optimize) {
            this.context = htmlCanvas.getContext('2d');
            this.hitTester = new m3.graphics.events.CanvasHitTester();
            this.resetViewModel();
            this.previousPointer = this.pointer = 0;

            if(this.optimize){
                console.warn('Warning: Optimize is turned on, this is an experimental feature ' +
                    '& might(probably will) result in rendering inconsistencies.');
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
            var viewModel = this.viewModel;

            if (!forceUpdate && this.sceneUnchanged()) return;

            var context = this.context;
            var optimize = this.optimize;

            this.clearContext();
            CanvasPainter.drawCircles(context, viewModel[this.pointer].circles);
            CanvasPainter.drawRectangles(context, viewModel[this.pointer].rectangles, optimize);
            CanvasPainter.drawRoundRectangles(context, viewModel[this.pointer].roundRectangles, optimize);
            CanvasPainter.drawLines(context, viewModel[this.pointer].lines);
            CanvasPainter.drawRegularPolygons(context, viewModel[this.pointer].regularPolygons, optimize);
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