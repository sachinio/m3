/**
 * Created by sachinpatney on 10/21/15.
 */

module m3.ui.graphics {
    export function create(context, optimize: boolean = false) {
        return new Canvas(context, optimize);
    }

    class Canvas implements ISurface {
        private static TwoPi = 2 * Math.PI;
        private static Transparent = 'rgba(0,0,0,0)';
        private context;
        private circles:Circle[];
        private rectangles:Rect[];
        private roundRectangles:RoundRect[];
        private optimize: boolean;

        constructor(context, optimize) {
            this.context = context;
            this.circles = [];
            this.rectangles = [];
            this.roundRectangles = [];
            this.optimize = optimize;
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

        public wipe() {
            this.circles = [];
            this.rectangles = [];
            this.roundRectangles = [];
        }

        public update() {
            this.drawCircles();
            this.drawRectangles();
            this.drawRoundRectangles();
        }

        private drawCircles() {
            var context = this.context;
            var circles = this.circles;
            if(this.optimize) {
                circles = circles.sort((a, b)=> a.style.stroke.localeCompare(b.style.stroke));
            }
            //.sort((a, b)=> a.style.fill.localeCompare(b.style.fill));

            let i = circles.length;
            var counter = 0;
            while (i) {
                context.beginPath();
                var c = circles[i-1];
                var currentStyle = c.style;
                context.fillStyle = currentStyle.fill || Canvas.Transparent;
                context.strokeStyle = currentStyle.stroke || Canvas.Transparent;
                do {
                    i--;
                    var c = circles[i];
                    context.arc(c.x, c.y, c.r, 0, Canvas.TwoPi, false);
                    if(i) var nextCircleStyle = circles[i - 1].style;
                } while (i
                && (currentStyle.stroke.localeCompare(nextCircleStyle.stroke)) === 0
                && (currentStyle.fill.localeCompare(nextCircleStyle.fill)) === 0);
                context.fill();
                context.stroke();
                context.closePath();
                counter++;
            }
            console.log('stroked + filled '+ counter + ' times');
        }

        private drawRectangles() {
            var context = this.context;
            var rectangles = this.rectangles;
            if(this.optimize) {
                rectangles = rectangles.sort((a, b)=> a.style.stroke.localeCompare(b.style.stroke));
                //.sort((a, b)=> a.style.fill.localeCompare(b.style.fill));
            }

            let i = rectangles.length;
            var counter = 0;
            while (i) {
                context.beginPath();
                var r = rectangles[i-1];
                var style = r.style;
                context.fillStyle = style.fill || Canvas.Transparent;
                context.strokeStyle = style.stroke || Canvas.Transparent;
                do {
                    i--;
                    r = rectangles[i];
                    context.rect(r.x, r.y, r.width, r.width);
                    if(i) var nextRectStyle = rectangles[i - 1].style;
                } while (i
                && (style.stroke.localeCompare(nextRectStyle.stroke)) === 0
                && (style.fill.localeCompare(nextRectStyle.fill)) === 0);
                context.stroke();
                context.fill();
                context.closePath();
                counter++;
            }
            console.log('stroked + filled '+ counter + ' times');
        }

        private drawRoundRectangles() {
            var context = this.context;
            var rrs = this.roundRectangles;
            if(this.optimize) {
                var start = new Date().getTime();
                rrs = rrs.sort((a, b)=> a.style.stroke.localeCompare(b.style.stroke));
                //.sort((a, b)=> a.style.fill.localeCompare(b.style.fill));
                var end = new Date().getTime();
                console.log('optimizing took ' + (end - start));
            }

            let i = rrs.length;
            var counter = 0;
            while (i) {
                context.beginPath();
                var r = rrs[i-1];
                var style = r.style;
                context.fillStyle = style.fill || Canvas.Transparent;
                context.strokeStyle = style.stroke || Canvas.Transparent;
                do {
                    i--;
                    r = rrs[i];
                    context.moveTo(r.x + r.radiusTL, r.y);
                    context.lineTo(r.x + r.width - r.radiusTR, r.y);
                    context.quadraticCurveTo(r.x + r.width, r.y, r.x + r.width, r.y + r.radiusTR);
                    context.lineTo(r.x + r.width, r.y + r.height - r.radiusBR);
                    context.quadraticCurveTo(r.x + r.width, r.y + r.height, r.x + r.width - r.radiusBR, r.y + r.height);
                    context.lineTo(r.x + r.radiusBL, r.y + r.height);
                    context.quadraticCurveTo(r.x, r.y + r.height, r.x, r.y + r.height - r.radiusBL);
                    context.lineTo(r.x, r.y + r.radiusTL);
                    context.quadraticCurveTo(r.x, r.y, r.x + r.radiusTL, r.y);
                    if(i) var nextRectStyle = rrs[i - 1].style;
                }
                while (i
                && (style.stroke.localeCompare(nextRectStyle.stroke)) === 0
                && (style.fill.localeCompare(nextRectStyle.fill)) === 0);
                context.stroke();
                context.fill();
                context.closePath();
                counter++;
            }
            console.log('stroked + filled '+ counter + ' times');
        }
    }
}