import { expect } from 'chai';
import { describe, it } from 'mocha';
import { seal, unseal } from '../src/index';

describe('seal and unseal', () => {
    describe('together', () => {
        it('should handle an empty string', () => {
            const secret = 'marabou stork';
            const value = '';
            const encrypted = seal(value, secret);
            expect(encrypted).to.be.a('string');
            const [err, decrypted] = unseal(encrypted, secret);
            expect(err).to.equal(false);
            expect(decrypted).to.equal('');
        });
        it('should handle a range of strings', () => {
            const secret = 'marabou stork';
            for (let idx = 0; idx < 300; idx++) {
                const value = '.'.repeat(idx);
                const encrypted = seal(value, secret);
                expect(encrypted).to.be.a('string');
                const [err, decrypted] = unseal(encrypted, secret);
                expect(err).to.equal(false);
                expect(decrypted).to.equal(value);
            }
        });
    });
});
