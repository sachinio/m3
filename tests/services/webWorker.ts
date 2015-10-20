/// <reference path="../../src/services/webWorker.ts"/>
/// <reference path="../../typedefs/jasmine.d.ts"/>

module m3tests {
    describe('Web Worker',() => {
        it('exec function',(done)=> {
            function loopy(m) {
                let total = 0;
                for(let i=0; i< m;i++) total+=2;
                return total;
            }

            m3.services.Thread.execute(loopy, [10],(data) => {
                expect(data).toBe(20);
                done();
            });
        });
    });
}