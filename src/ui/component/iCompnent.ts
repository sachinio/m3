/// <reference path="../../types/base.ts"/>

module m3.ui.component {

    export interface ILayout {
        update(data, boundingBox: m3.types.IBoundingBox);
    }

    export interface IComponent{
        update(data, boundingBox: m3.types.IBoundingBox);
    }2
}