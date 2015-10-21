module m3.ui.graphics {
    export interface Style {
        fill: string;
        stroke: string;
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

    export interface ISurface {
        drawCircle(props:Circle);
        drawRect(props:Rect);
        drawRoundRect(props:RoundRect);
        update();
        wipe();
    }
}