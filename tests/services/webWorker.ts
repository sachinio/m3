/// <reference path="../../src/services/webWorker.ts"/>
/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

module m3tests.services {
    describe('Web Worker',() => {
        it('execute function in background',(done)=> {
            function loopy(m) {
                let total = 0;
                for(let i=0; i< m;i++) total+=2;
                return total;
            }

            m3.services.Background.execute(loopy, [10],(data) => {
                expect(data).toBe(20);
                done();
            });
        });
    });
}