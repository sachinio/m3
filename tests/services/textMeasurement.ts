/// <reference path="../../src/services/textMeasurement.ts"/>
/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

module m3tests.services {
    describe('Text Measurement', () => {
        it('Measure with null properties', () =>{
            var width = m3.services.TextMeasurement.measureWidth(null);

            expect(width).toBe(0);
        });

        it('Measure with null text', ()=>{
            let width = m3.services.TextMeasurement.measureWidth({
                text:'',
                fontFamily:'san-serif',
                fontSize:'10px'});

            expect(width).toBe(0);
        });

        it('Measure text', ()=>{
            let width = m3.services.TextMeasurement.measureWidth({
                text:'Hello M3',
                fontFamily:'san-serif',
                fontSize:'10px'});

            expect(width).not.toBe(0);
        });
    });
}