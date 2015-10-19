/// <reference path="../../src/services/thread.ts"/>
/// <reference path="../../typedefs/jasmine.d.ts"/>

module m3tests {
    describe('Thread',() => {
        it('exec function',(done)=> {
            function loopy(num) {
                var total = 0;
                for(var i=0; i< num;i++) total+=1;
                return total;
            }

            m3.services.Thread.exec(loopy, [10], (data) => {
                expect(data).toBe(10);
                done();
            });
        });
    });
}