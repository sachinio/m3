module m3.graphics.animation {
    import Shape = m3.graphics.surface.Shape;

    export function initializeAnimation(...shapeTypes: Shape[][]): boolean {
        var now = new Date().getTime();
        let hasAnimations = false;
        for(let shapes of shapeTypes) {
            for (let shape of shapes) {
                if (transformAnimationDefinitions(shape, now)) hasAnimations = true;
            }
        }
        return hasAnimations;
    }

    export function computeStartValues(shapes:Shape[], previousShapes: Shape[]){
        for (var i = 0, len = (shapes.length < previousShapes.length) ? shapes.length: previousShapes.length;
             i < len; i++) {
            var shape = shapes[i];
            var pShape = previousShapes[i];
            for (var key in shape) {
                var attr = shape[key];
                if(attr.ease){
                    if(!attr.startValue) {
                        attr.startValue = pShape[key];
                    }
                }
            }
        }
    }

    var interpolations = {
        'bounce': (t) =>{
            if (t < (1 / 2.75)) {
                return (7.5625 * t * t);
            } else if (t < (2 / 2.75)) {
                return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
            } else if (t < (2.5 / 2.75)) {
                return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
            } else {
                return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
            }
        },
        'linear':(t)=>{
            return t;
        }
    }

    function transformAnimationDefinitions(shape:Shape, now: number): boolean {
        let hasAnimations = false;

        for (var key in shape) {
            var attr = shape[key];
            if(attr.ease){
                shape.animations = shape.animations || {};
                attr.startValue = attr.startValue || 0;
                shape.animations[key] = _.clone(attr);
                let animationDef = shape.animations[key];
                animationDef.timeStarted = now;
                shape[key] = animationDef.startValue;
                hasAnimations = true;
            }
            else if(shape.animations && shape.animations[key]){
                hasAnimations = true;
            }
        }

        return hasAnimations;
    }

    function interpolate(start, end, ease: string, t: number){
        if(typeof end === 'number') {
            return interpolateNumber(start, end,ease, t);
        }
        throw new Error('cannot interpolate this type')
    }

    function interpolateNumber(startValue: number, endValue: number, ease: string, t:number){
        return startValue + interpolations[ease](t) * (endValue -  startValue);
    }

    function tickAnimation(shape: Shape, now: number){
        var animations = shape.animations;
        let hasAnimations = false;

        if(animations) {
            for (var key in animations) {
                var def = animations[key];
                let t = (now - def.timeStarted) / def.duration;

                if (t >= 1) {
                    shape[key] = def.endValue;
                    delete animations[key];
                } else {
                    let currentValue = interpolate(def.startValue, def.endValue,def.ease ,t);
                    shape[key] = currentValue;
                    hasAnimations = true;
                }
            }
        }

        return hasAnimations;
    }

    export function tickAnimations(...shapeTypes: Shape[][]){
        let now = new Date().getTime();
        let hasAnimations = false;

        for(let shapes of shapeTypes) {
            for (let shape of shapes) {
                if (tickAnimation(shape, now)) {
                    hasAnimations = true;
                }
            }
        }

        return hasAnimations;
    }
}