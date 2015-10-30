
module m3.graphics.events {
    import Circle = m3.graphics.surface.Circle;
    import Rect = m3.graphics.surface.Rect;
    import Point = m3.graphics.surface.Point;
    import Canvas = m3.graphics.surface.Canvas;

    export module types {
        export var click = 'onclick';
        export var mouseDown = 'onmousedown';
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
                let x2 = <number>r.x + <number>r.width;
                let y2 = <number>r.y + <number>r.height;
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
        var i = 0;
        var l = circles.length;
        while (i<l) {
            var c = circles[i];
            if (c.events) {
                if (Math.sqrt(Math.pow((<number>c.x - x), 2) + Math.pow((<number>c.y - y), 2)) <= <number>c.r) {
                    return c;
                }
            }
            i++;
        }
        return null;
    }

    function testSelection(eventName:string, canvas:Canvas, p:Point) {
        var circles = canvas.getCurrentState().circles;
        var circle = getHitForCircles(p, circles);
        if (circle) {
            var eventLambda = circle.events[eventName];
            if (eventLambda) {
                eventLambda<Circle>(circle, canvas.getCurrentState().circles);
                canvas.update(true);
            }
        }

        var rect = getHitForRectangle(p, canvas.getCurrentState().rectangles);
        if (rect) {
            var eventLambda = rect.events[eventName];
            if (eventLambda) {
                eventLambda<Rect>(rect, canvas.getCurrentState().rectangles);
                canvas.update(true);
            }
        }
    }

    function isSelection(eventName:string):boolean {
        return eventName === types.click || eventName === types.mouseDown;
    }

    export class CanvasHitTester {
        public subscribe(eventName:string, canvas:Canvas):void {
            var htmlCanvas = canvas.htmlCanvas;
            htmlCanvas[eventName] = (e)=> {
                if (isSelection(eventName)) {
                    var p = normalizeMouseCoordinated(htmlCanvas, e);
                    testSelection(eventName, canvas, p);
                }
            };
        }

        public unSubscribe(eventName:string, canvas:Canvas):void {
            canvas.htmlCanvas[eventName] = undefined;
        }
    }
}