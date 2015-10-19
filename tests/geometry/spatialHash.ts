/// <reference path="../../src/geometry/spatialHash.ts"/>
/// <reference path="../../typedefs/jasmine.d.ts"/>

module m3tests {
    describe('Spatial Hash', () => {
        it('Find exact point',()=>{
            var hash = new m3.geometry.SpatialHash(10);

            hash.insert({ position:{ x: 0, y: 1 }});
            hash.insert({ position:{ x: 100, y: 100 }});
            hash.insert({ position:{ x: 110, y: 100 }});
            hash.insert({ position:{ x: 120, y: 100 }});

            var points = hash.closest({ position:{ x: 100, y: 100 }});

            expect(points.length).toBe(1);
            expect(points[0].position.x).toBe(100);
            expect(points[0].position.y).toBe(100);
        })
    });
}
