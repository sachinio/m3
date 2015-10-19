/// <reference path="../../typedefs/m3.d.ts"/>
module m3.services{
    export interface IWorker{
        onmessage: (d:any)=>void;
        postMessage(m:any);
    }
    export module Worker{
        export function create(script: string){

            var URL = (<any>window).URL || (<any>window).webkitURL;
            var Blob = (<any>window).Blob;
            var Worker = (<any>window).Worker;

            if (!URL || !Blob || !Worker || !script) {
                return null;
            }

            var blob = new (<any>window).Blob([script]);
            return new (<any>window).Worker(URL.createObjectURL(blob));
        }
    }
}