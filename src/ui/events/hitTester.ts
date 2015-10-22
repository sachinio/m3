module m3.ui.events {
    import Circle = m3.ui.graphics.Circle;
    import Rect = m3.ui.graphics.Rect;

    function normalizeMouseCoordinated(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function pointInsidePolygon(point, vs) {
        var x = point.x, y = point.y;

        var inside = false;
        var vsLen = vs.length;
        for (var i = 0, j = vsLen - 1; i < vsLen; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };

    export function getHitForRectangle(point, rectangles:Rect[]) {
        var i = rectangles.length;
        while (i--) {
            var r = rectangles[i];
            if (r.events) {
                if (pointInsidePolygon(
                        point,
                        [[r.x, r.y],
                        [r.x + r.width, r.y],
                        [r.x + r.width, r.y + r.height],
                        [r.x, r.y + r.height]])) {
                    return r;
                }
            }
        }
    }

    export function getHitForCircles(point:{x: number,y:number}, circles:Circle[]):Circle {
        var x = point.x;
        var y = point.y;
        var i = circles.length;
        while (i--) {
            var c = circles[i];
            if (c.events) {
                if (Math.sqrt(Math.pow((c.x - x), 2) + Math.pow((c.y - y), 2)) <= c.r) {
                    return c;
                }
            }
        }
        return null;
    }

    export class CanvasHitTester {
        public subscribe(canvas:m3.ui.graphics.Canvas) {
            var htmlCanvas = canvas.canvas;
            htmlCanvas.onmousedown = (e)=> {
                var p = normalizeMouseCoordinated(htmlCanvas, e);
                var circle = getHitForCircles(p, canvas.circles);
                if (circle) {
                    var click = circle.events.click;
                    if (click) {
                        click(circle);
                        canvas.update();
                    }
                }

                var rect = getHitForRectangle(p, canvas.rectangles);
                if (rect) {
                    var click = rect.events.click;
                    if (click) {
                        click(rect);
                        canvas.update();
                    }
                }
            };
        }
    }
}