module m3.graphics.surface {

    export interface AnimationDefinition<T> {
        ease: string;
        duration: number;
        delay: number;
        endValue: T;
        startValue?: T;
        timeStarted?: number;
    }

    export interface Events {
        [id: string]:<T>(d:T, datum:T[]) => void;
    }

    export interface Shape {
        events?: Events;
        style: Style;
        animations?:{[id: string]: AnimationDefinition<number | string>}
    }
    export interface Style {
        fill: string;
        stroke: string;
    }

    export interface Point {
        x: number,
        y: number
    }

    export interface Line extends Shape {
        points: Point[];
    }

    export interface Circle extends Shape {
        x: number | AnimationDefinition<number>;
        y: number | AnimationDefinition<number>;
        r: number | AnimationDefinition<number>;
    }

    export interface Rect extends Shape {
        x: number | AnimationDefinition<number>;
        y: number | AnimationDefinition<number>;
        width: number | AnimationDefinition<number>;
        height: number | AnimationDefinition<number>;
    }

    export interface RoundRect extends Shape {
        x: number;
        y: number;
        width: number;
        height: number;
        radiusTL : number;
        radiusTR : number;
        radiusBL: number;
        radiusBR: number;
    }

    export interface RegularPolygon extends Shape {
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
        drawLine(props:Line);
        drawRegularPolygon(props:RegularPolygon);

        // Eventing
        listenTo(eventName:string);
        stopListeningTo(eventName:string);

        //lifecycle
        begin();
        update(force:boolean);
        clear();
    }
}