import { expect } from 'chai';
import { describe, it } from 'mocha';
import { keySize } from '../src/constants';
import { deriveKeyA } from '../src/key';

describe('key', () => {
    describe('deriveKeyA', () => {
        it('should be a function', () => {
            expect(deriveKeyA).to.be.a('function');
        });
        it('should create a key buffer from a secret', () => {
            const result = deriveKeyA('0123456789');
            expect(result).to.be.an.instanceOf(Buffer);
            expect(result.length).to.equal(keySize);
            expect(result.toString('hex')).to.equal(
                '4118de3542c987a9e050dd4003e217871a7c5553bcc5d9e4a3f17753c7e2bcde'
            );
        });
        it('should throw if secret is too short', () => {
            expect(() => {
                deriveKeyA('');
            }).to.throw(/Secret is required and must be at least 10 characters/i);
        });
    });
});