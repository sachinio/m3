/// <reference path="../../src/services/worker.ts"/>
/// <reference path="../../typedefs/jasmine.d.ts"/>

module m3tests {
    import Worker = m3.services.Worker;

    describe('Worker',() => {
        it('postMessage',(done)=> {
            var inlineWorkerText = "self.addEventListener('message', function(e) { postMessage(e.data * 2); } ,false);";
            var inlineWorker:Worker.IWorker = Worker.create(inlineWorkerText);
            inlineWorker.onmessage = (e) => {
                expect(e.data).toBe(20);
                done();
            };

            inlineWorker.postMessage(10);
        });
    });
}