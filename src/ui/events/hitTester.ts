module m3.ui.events {
    import Circle = m3.ui.graphics.Circle;
    import Rect = m3.ui.graphics.Rect;
    import Point = m3.ui.graphics.Point;

    export module Types {
        export var Click = 'onclick';
        export var MouseDown = 'onmousedown';
    }

    function normalizeMouseCoordinated(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function pointInsidePolygon(point:Point, vs) {
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

    function getHitForRectangle(point:Point, rectangles:Rect[]) {
        var i = rectangles.length;
        while (i--) {
            var r = rectangles[i];
            if (r.events) {
                let x2 = r.x + r.width;
                let y2 = r.y + r.height;
                if (pointInsidePolygon(
                        point,
                        [[r.x, r.y],
                            [x2, r.y],
                            [x2, y2],
                            [r.x, y2]])) {
                    return r;
                }
            }
        }
    }

    function getHitForCircles(point:Point, circles:Circle[]):Circle {
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

    function testSelection(eventName:string, canvas:m3.ui.graphics.Canvas, p:Point) {
        var circle = getHitForCircles(p, canvas.circles);
        if (circle) {
            var eventLambda = circle.events[eventName];
            if (eventLambda) {
                eventLambda(circle, canvas.circles);
                canvas.update();
            }
        }

        var rect = getHitForRectangle(p, canvas.rectangles);
        if (rect) {
            var eventLambda = rect.events[eventName];
            if (eventLambda) {
                eventLambda(rect, canvas.rectangles);
                canvas.update();
            }
        }
    }

    function isSelection(eventName:string):boolean {
        return eventName === Types.Click || eventName === Types.MouseDown;
    }

    export class CanvasHitTester {
        public subscribe(eventName:string, canvas:m3.ui.graphics.Canvas):void {
            var htmlCanvas = canvas.canvas;
            htmlCanvas[eventName] = (e)=> {
                if (isSelection(eventName)) {
                    var p = normalizeMouseCoordinated(htmlCanvas, e);
                    testSelection(eventName, canvas, p);
                }
            };
        }

        public unSubscribe(eventName:string, canvas:m3.ui.graphics.Canvas):void {
            canvas.canvas[eventName] = undefined;
        }
    }
}