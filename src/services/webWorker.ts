/**
 * Adapted from https://github.com/vkiryukhin/vkthread
 */

module m3.services {
    export module Thread {
        var script = "(function() { \
            var JSONfn = { \
                parse:function (str, date2obj) { \
                    var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false; \
                    return JSON.parse(str, function (key, value) { \
                        if (typeof value != 'string') return value; \
                        if (value.length < 8) return value; \
                        if (iso8061 && value.match(iso8061)) return new Date(value); \
                        if (value.substring(0, 8) === 'function') return eval('(' + value + ')'); \
                        if (value.substring(0, 8) === '_PxEgEr_') return eval(value.slice(8)); \
                        return value; \
                    }); \
                } \
            }; \
            onmessage = function(e) { \
                var obj  = JSONfn.parse(e.data, true), \
                    cntx = obj.cntx ? obj.cntx : self; \
                if(obj.imprt){ \
                    importScripts.apply(null,obj.imprt); \
                } \
                postMessage(obj.fn.apply(cntx,obj.args)); \
            }; \
        }());";

        var JSONfn = {
            stringify: function (obj) {
                return JSON.stringify(obj, function (key, value) {
                    if (value instanceof Function || typeof value == 'function') {
                        return value.toString();
                    }
                    if (value instanceof RegExp) {
                        return '_PxEgEr_' + value;
                    }
                    return value;
                });
            }
        };

        export function execute(fn, args, cb) {
            var URL = (<any>window).URL || (<any>window).webkitURL;
            var Blob = (<any>window).Blob;
            var Worker: any = (<any>window).Worker;

            if (!URL || !Blob || !Worker || !script) {
                return null;
            }

            var builder = (<any>window).BlobBuilder
                || (<any>window).WebKitBlobBuilder
                || (<any>window).MozBlobBuilder
                || (<any>window).MSBlobBuilder;

            var blob;
            if(builder) {
                var builderInstance = new builder();
                builderInstance .append([script]);
                blob = builderInstance .getBlob();
            }else {
                blob = new (<any>window).Blob([script]);
            }

            var worker = new Worker(URL.createObjectURL(blob));
            var obj = {fn: fn, args: args, cntx: false, imprt: false};

            worker.onmessage = function (oEvent) {
                cb(oEvent.data);
                worker.terminate();
            };

            worker.onerror = function (error) {
                cb(new Error(error.message));
                worker.terminate();
            };

            worker.postMessage(JSONfn.stringify(obj));
        };

    }
}