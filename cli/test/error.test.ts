import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HighSealError } from '../src/error';

describe('error', () => {
    describe('HighSealError', () => {
        it('should be an error class', () => {
            expect(HighSealError).to.be.a('function');
            const err = new HighSealError();
            expect(err).to.be.instanceOf(HighSealError);
            expect(err).to.be.instanceOf(Error);
        });
        it('should have Type Guard ', () => {
            const genericErr = new Error();
            const highSealErr = new HighSealError();
            expect(HighSealError.isHighSealError(null)).to.be.false;
            expect(HighSealError.isHighSealError(genericErr)).to.be.false;
            expect(HighSealError.isHighSealError(highSealErr)).to.be.true;
        });
    });
});