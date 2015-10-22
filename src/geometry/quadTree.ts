/// <reference path="../types/base.ts"/>

module m3.geometry {
    import IBoundingBox = m3.types.IBoundingBox;
    export class QuadTree {
        private static MaxLevels:number = 5;
        private static MaxObjects = 1000;
        private bounds:IBoundingBox;
        private level:number;
        private nodes:QuadTree[];
        private objects:IBoundingBox[];

        public constructor(boundingBox:IBoundingBox, level?:number) {
            this.bounds = boundingBox;
            this.level = level || 0;

            this.nodes = [];
            this.objects = [];
        }

        public clear() {
            this.objects = [];
            let nodes = this.nodes;
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].clear();
            }
            this.nodes = [];
        }

        public everything(returnedObjects:IBoundingBox[]) {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].everything(returnedObjects);
            }
            for (var i = 0, len = this.objects.length; i < len; i++) {
                returnedObjects.push(this.objects[i]);
            }
            return returnedObjects;
        }

        public find(returnedObjects:IBoundingBox[], obj:IBoundingBox) {
            if (!obj) {
                return;
            }
            var nodes = this.nodes;
            var index = this.getIndex(obj);
            if (index != -1 && this.nodes.length) {
                nodes[index].find(returnedObjects, obj);
            }
            for (var i = 0, len = this.objects.length; i < len; i++) {
                returnedObjects.push(this.objects[i]);
            }
            return returnedObjects;
        }

        public insert(obj) {
            var objects = this.objects;
            var level = this.level;
            var maxLevels = QuadTree.MaxLevels;
            var maxObjects = QuadTree.MaxObjects;
            var nodes = this.nodes;

            if (!obj) {
                return;
            }
            if (obj instanceof Array) {
                for (var i = 0, len = obj.length; i < len; i++) {
                    this.insert(obj[i]);
                }
                return;
            }
            if (nodes.length) {
                var index = this.getIndex(obj);
                if (index != -1) {
                    nodes[index].insert(obj);
                    return;
                }
            }
            objects.push(obj);
            if (objects.length > maxObjects && level < maxLevels) {
                if (nodes[0] == null) {
                    this.partition();
                }
                var i = 0;
                var lenO = objects.length;
                while (i < lenO) {
                    var index = this.getIndex(objects[i]);
                    if (index != -1) {
                        nodes[index].insert((objects.splice(i, 1))[0]);
                    }
                    else {
                        i++;
                    }
                }
            }
        }

        private getIndex(obj) {
            var index = -1;
            var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
            var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
            var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
            var bottomQuadrant = (obj.y > horizontalMidpoint);
            if (obj.x < verticalMidpoint &&
                obj.x + obj.width < verticalMidpoint) {
                if (topQuadrant) {
                    index = 1;
                }
                else if (bottomQuadrant) {
                    index = 2;
                }
            }
            else if (obj.x > verticalMidpoint) {
                if (topQuadrant) {
                    index = 0;
                }
                else if (bottomQuadrant) {
                    index = 3;
                }
            }
            return index;
        }

        private partition() {
            var level = this.level;
            var subWidth = (this.bounds.width / 2) | 0;
            var subHeight = (this.bounds.height / 2) | 0;
            this.nodes[0] = new QuadTree({
                x: this.bounds.x + subWidth,
                y: this.bounds.y,
                width: subWidth,
                height: subHeight
            }, level + 1);
            this.nodes[1] = new QuadTree({
                x: this.bounds.x,
                y: this.bounds.y,
                width: subWidth,
                height: subHeight
            }, level + 1);
            this.nodes[2] = new QuadTree({
                x: this.bounds.x,
                y: this.bounds.y + subHeight,
                width: subWidth,
                height: subHeight
            }, level + 1);
            this.nodes[3] = new QuadTree({
                x: this.bounds.x + subWidth,
                y: this.bounds.y + subHeight,
                width: subWidth,
                height: subHeight
            }, level + 1);
        }
    }
}