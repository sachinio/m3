module m3.ui.graphics {
    export interface Events{
        [id: string]:(d: Shape, datum: Shape[]) => void;
    }

    export interface Shape{
        events?: Events;
        style: Style;
    }
    export interface Style {
        fill: string;
        stroke: string;
    }

    export interface Point{
        x: number,
        y: number
    }

    export interface Line extends Shape{
        points: Point[];
    }

    export interface Circle extends Shape{
        x: number;
        y: number;
        r: number;
    }

    export interface Rect extends Shape{
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export interface RoundRect extends Shape{
        x: number;
        y: number;
        width: number;
        height: number;
        radiusTL : number;
        radiusTR : number;
        radiusBL: number;
        radiusBR: number;
    }

    export interface RegularPolygon extends Shape{
        x: number;
        y: number;
        sides: number;
        radius: number;
        startAngle: number;
    }

    export interface ISurface {
        drawCircle(props:Circle);
        drawRect(props:Rect);
        drawRoundRect(props:RoundRect);
        drawLine(props: Line);
        drawRegularPolygon(props: RegularPolygon);

        // Eventing
        listenTo(eventName: string);
        stopListeningTo(eventName: string);

        //lifecycle
        begin();
        update();
        clear();
    }
}