import { expect } from 'chai';
import { describe, it } from 'mocha';
import { isSealed, seal, unseal } from '../src/index';

describe('seal and unseal', () => {
    describe('together', () => {
        it('should handle an empty string', () => {
            const secret = 'marabou stork';
            const value = '';
            const sealed = seal(value, secret);
            expect(sealed).to.be.a('string');
            expect(isSealed(sealed)).to.be.true;
            const [err, unsealed] = unseal(sealed, secret);
            expect(err).to.equal(undefined);
            expect(unsealed).to.equal('');
        });
        it('should handle a range of strings', () => {
            const secret = 'marabou stork';
            for (let idx = 0; idx < 300; idx++) {
                const value = '.'.repeat(idx);
                const sealed = seal(value, secret);
                expect(isSealed(sealed)).to.be.true;
                expect(sealed).to.be.a('string');
                const [err, unsealed] = unseal(sealed, secret);
                expect(err).to.equal(undefined);
                expect(unsealed).to.equal(value);
            }
        });
    });
});
