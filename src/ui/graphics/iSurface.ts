module m3.ui.graphics {
    export interface Style {
        fill: string;
        stroke: string;
    }

    export interface Point{
        x: number,
        y: number
    }

    export interface Line{
        points: Point[];
        style: Style;
    }

    export interface Circle {
        x: number;
        y: number;
        r: number;
        style: Style;
    }

    export interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
        style: Style;
    }

    export interface RoundRect {
        x: number;
        y: number;
        width: number;
        height: number;
        radiusTL : number;
        radiusTR : number;
        radiusBL: number;
        radiusBR: number;
        style: Style;
    }

    export interface RegularPolygon{
        x: number;
        y: number;
        sides: number;
        radius: number;
        startAngle: number;
        style: Style;
    }

    export interface ISurface {
        drawCircle(props:Circle);
        drawRect(props:Rect);
        drawRoundRect(props:RoundRect);
        drawLine(props: Line);
        drawRegularPolygon(props: RegularPolygon);
        update();
        wipe();
    }
}