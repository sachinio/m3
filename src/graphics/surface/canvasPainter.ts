module m3.graphics.surface{
    export module CanvasPainter {
        var TwoPi = 2 * Math.PI;
        var Transparent = 'rgba(0,0,0,0)';

        export function drawRectangles(context, rectangles:Rect[], optimize:boolean) {
            context.save();
            if (optimize) {
                rectangles = rectangles.sort((a, b)=> a.style.stroke.localeCompare(b.style.stroke));
                //.sort((a, b)=> a.style.fill.localeCompare(b.style.fill));
            }

            let i = rectangles.length;
            while (i) {
                context.beginPath();
                var r = rectangles[i - 1];
                var style = r.style;
                context.fillStyle = style.fill || Transparent;
                context.strokeStyle = style.stroke || Transparent;
                do {
                    i--;
                    r = rectangles[i];
                    context.rect(r.x, r.y, r.width, r.height);
                    if (i) var nextRectStyle = rectangles[i - 1].style;
                } while (i
                && (style.stroke.localeCompare(nextRectStyle.stroke)) === 0
                && (style.fill.localeCompare(nextRectStyle.fill)) === 0);
                context.stroke();
                context.fill();
                context.closePath();
            }
            context.restore();
        }

        export function drawCircles(context, circles:Circle[]) {
            let i = circles.length;
            context.save();
            while (i) {
                i--;
                var c = circles[i];
                var currentStyle = c.style;
                context.fillStyle = currentStyle.fill || Transparent;
                context.strokeStyle = currentStyle.stroke || Transparent;
                context.beginPath();
                context.arc(c.x, c.y, c.r, 0, TwoPi, false);
                context.fill();
                context.stroke();
            }
            context.restore();
        }

        export function drawRoundRectangles(context, roundRectangles:RoundRect[], optimize:boolean) {
            if (optimize) {
                roundRectangles = roundRectangles.sort((a, b)=> a.style.stroke.localeCompare(b.style.stroke));
                //.sort((a, b)=> a.style.fill.localeCompare(b.style.fill));
                var end = new Date().getTime();
            }

            let i = roundRectangles.length;

            context.save();
            while (i) {
                context.beginPath();
                let r = roundRectangles[i - 1];
                let style = r.style;
                context.fillStyle = style.fill || Transparent;
                context.strokeStyle = style.stroke || Transparent;
                do {
                    i--;
                    r = roundRectangles[i];
                    context.moveTo(r.x + r.radiusTL, r.y);
                    context.lineTo(r.x + r.width - r.radiusTR, r.y);
                    context.quadraticCurveTo(r.x + r.width, r.y, r.x + r.width, r.y + r.radiusTR);
                    context.lineTo(r.x + r.width, r.y + r.height - r.radiusBR);
                    context.quadraticCurveTo(r.x + r.width, r.y + r.height, r.x + r.width - r.radiusBR, r.y + r.height);
                    context.lineTo(r.x + r.radiusBL, r.y + r.height);
                    context.quadraticCurveTo(r.x, r.y + r.height, r.x, r.y + r.height - r.radiusBL);
                    context.lineTo(r.x, r.y + r.radiusTL);
                    context.quadraticCurveTo(r.x, r.y, r.x + r.radiusTL, r.y);
                    if (i) var nextRectStyle = roundRectangles[i - 1].style;
                }
                while (i
                && (style.stroke.localeCompare(nextRectStyle.stroke)) === 0
                && (style.fill.localeCompare(nextRectStyle.fill)) === 0);
                context.stroke();
                context.fill();
                context.closePath();
            }
            context.restore();
        }

        export function drawRegularPolygons(context, polygons:RegularPolygon[], optimize) {
            let i = polygons.length;

            if (optimize) {
                polygons = polygons.sort((a, b)=> a.style.stroke.localeCompare(b.style.stroke));
                //.sort((a, b)=> a.style.fill.localeCompare(b.style.fill));
            }

            while (i) {
                let polygon = polygons[i - 1];
                let style = polygon.style;

                context.fillStyle = style.fill || Transparent;
                context.strokeStyle = style.stroke || Transparent;

                do {
                    context.save();
                    i--;
                    polygon = polygons[i];
                    let sides = polygon.sides;
                    let radius = polygon.radius;

                    let startAngle = (Math.PI / sides * (sides % 2 ? .5 : 1)) + polygon.startAngle;
                    if (sides < 3) return;
                    var a = (Math.PI * 2) / sides;
                    //context.moveTo(0, 0);
                    context.beginPath();
                    context.translate(polygon.x, polygon.y);
                    context.rotate(startAngle);
                    context.moveTo(radius, 0);
                    for (var k = 1; k < sides; k++) {
                        context.lineTo(radius * Math.cos(a * k), radius * Math.sin(a * k));
                    }
                    if (i) var nextRectStyle = polygons[i - 1].style;
                    context.closePath();
                    context.restore();
                }

                while (i
                && (style.stroke.localeCompare(nextRectStyle.stroke)) === 0
                && (style.fill.localeCompare(nextRectStyle.fill)) === 0);
                context.stroke();
                context.fill();
            }
        }

        export function drawLines(context, lines:Line[]) {
            let i = lines.length;
            while (i--) {
                let line = lines[i];
                drawPolyLine(context, line.points, line.style);
            }
        }

        export function drawPolyLine(context, points:Point[], style:Style) {
            context.save();
            context.beginPath();
            let i = points ? points.length : 0;
            context.strokeStyle = style.stroke || Transparent;
            while (i--) {
                let p = points[i];
                let nextP = points[i - 1];
                context.moveTo(p.x, p.y);
                if (nextP && p) {
                    context.lineTo(nextP.x, nextP.y);
                }
            }
            context.stroke();
            context.restore();
        }
    }
}