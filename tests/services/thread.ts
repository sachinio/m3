/// <reference path="../../src/services/thread.ts"/>
/// <reference path="../../typedefs/jasmine.d.ts"/>

module m3tests {
    interface IMockery{
        value: number;
    }
    describe('Worker',() => {
        it('exec function',(done)=> {
            function loopy(m: IMockery) {
                let total = 0;
                for(let i=0; i< m.value;i++) total+=1;
                return total;
            }

            m3.services.Thread.run(loopy, [{value:10}],(data) => {
                expect(data).toBe(10);
                done();
            });
        });
    });
}