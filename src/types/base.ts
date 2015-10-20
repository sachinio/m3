module m3.types {
    export interface ITextProperties{
        text: string;
        fontFamily: string;
        fontSize: string;
        fontWeight?: string;
    }

    export interface IBoundingBox{
        x: number;
        y: number;
        width: number;
        height: number;
    }
}