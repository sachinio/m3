/// <reference path="../../src/geometry/quadTree.ts"/>
/// <reference path="../../typedefs/jasmine.d.ts"/>

module m3tests {
    describe('Quad Tree', () => {
        function intersect(a: m3.types.IBoundingBox, b: m3.types.IBoundingBox) {
            return (a.x <= (b.x + b.width) &&
            b.x <= (a.x + a.width) &&
            a.y <= (b.y + b.height) &&
            b.y <= (a.y + a.height))
        }

        function createTree(){
            var tree = new m3.geometry.QuadTree({x:0,y:0,width:200,height:200});

            tree.insert({x:0,y:0,width:10,height:10});
            tree.insert({x:10,y:10,width:10,height:10});
            tree.insert({x:80,y:80,width:10,height:10});
            tree.insert({x:40,y:40,width:10,height:10});
            tree.insert({x:100,y:80,width:10,height:10});
            tree.insert({x:150,y:40,width:10,height:10});

            return tree;
        }

        it('check collision with each other',()=> {
            var tree = createTree();

            var objects = [];
            var counter = 0;

            tree.everything(objects);

            for (var x = 0, len = objects.length; x < len; x++) {
                var obj = [];
                tree.find(obj, objects[x]);
                for (var y = 0, length = obj.length; y < length; y++) {
                    if(obj[y] !== objects[x] && intersect(obj[y], objects[x])){
                        counter++;
                    }
                }
            }

            expect(counter).toBe(2);
        });

        it('check collision with point',()=> {
            var tree = createTree();
            var counter = 0;

            var obj = [];
            var point = {x:1,y:1,width:0,height:0};
            tree.find(obj, point);
            for (var y = 0, length = obj.length; y < length; y++) {
                if(intersect(obj[y], point)){
                    counter++;
                }
            }

            expect(counter).toBe(1);
        });
    });
}