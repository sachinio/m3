/// <reference path="../../types/base.ts"/>

module m3.graphics.component {

    export interface ILayout {
        update(data, boundingBox: m3.types.IBoundingBox);
    }

    export interface ComponentUpdateOptions<T>{
        data: T;
        boundingBox: m3.types.IBoundingBox;
    }

    export interface IComponent{
        update(options: ComponentUpdateOptions<any>);
    }
}