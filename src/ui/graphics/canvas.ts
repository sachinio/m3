/// <reference path="canvasPainter.ts"/>
/// <reference path="../events/hitTester.ts"/>

module m3.ui.graphics {
    export function create(context, optimize:boolean = false) {
        return new Canvas(context, optimize);
    }

    export class Canvas implements ISurface {
        private context;
        public canvas;
        private optimize:boolean;
        private hitTester;

        public circles:Circle[];
        public rectangles:Rect[];
        public roundRectangles:RoundRect[];
        public lines:Line[];
        public regularPolygons:RegularPolygon[];

        constructor(canvas, optimize) {
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
            this.circles = [];
            this.rectangles = [];
            this.roundRectangles = [];
            this.regularPolygons = [];
            this.lines = [];
            this.optimize = optimize;
            this.hitTester = new m3.ui.events.CanvasHitTester();
        }

        public listenTo(name: string){
            this.hitTester.subscribe(name, this);
        }

        public stopListeningTo(eventName: string){
            this.hitTester.unSubscribe(eventName, this);
        }

        public drawCircle(props:Circle) {
            this.circles.push(props);
        }

        public drawRect(props:Rect) {
            this.rectangles.push(props);
        }

        public drawRoundRect(props:RoundRect) {
            this.roundRectangles.push(props);
        }

        public drawLine(props:Line) {
            this.lines.push(props);
        }

        public drawRegularPolygon(props:RegularPolygon) {
            this.regularPolygons.push(props);
        }

        public begin(){
            this.clear();
        }

        public clear() {
            this.circles = [];
            this.rectangles = [];
            this.roundRectangles = [];
            this.lines = [];
            this.regularPolygons = [];
            this.clearContext();
        }

        private clearContext() {
            var canvas = this.canvas;
            this.context.clearRect(0, 0, canvas.width, canvas.height);
        }

        public update() {
            this.clearContext();
            var context = this.context;
            var optimize = this.optimize;
            CanvasPainter.drawCircles(context, this.circles);
            CanvasPainter.drawRectangles(context, this.rectangles, optimize);
            CanvasPainter.drawRoundRectangles(context, this.roundRectangles, optimize);
            CanvasPainter.drawLines(context, this.lines);
            CanvasPainter.drawRegularPolygons(context, this.regularPolygons, optimize);
        }
    }
}