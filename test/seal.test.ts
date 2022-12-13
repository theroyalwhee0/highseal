import crypto from 'node:crypto';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { seal } from '../src/seal';
import { cipherAlgorithm, hmacAlgorithm, ivSize, version } from '../src/constants';

describe('seal', () => {
    describe('seal', () => {
        it('should be a function', () => {
            expect(seal).to.be.a('function');
        });
        it('should seal an empty value', () => {
            const secret = 'marabou stork';
            const value = '';
            const result = seal(value, secret);
            expect(result).to.be.a('string');
            expect(result).to.match(/^[a-zA-Z0-9/+.]+$/);
            const split = result.split('.');
            expect(split.length).to.equal(4);
            const [ver, _authTag, _iv, encrypted] = split;
            expect(ver).to.equal(version);
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length).to.equal(32);
        });
        it('should seal a single character', () => {
            const secret = 'marabou stork';
            const value = 'A';
            const result = seal(value, secret);
            expect(result).to.be.a('string');
            expect(result).to.match(/^[a-zA-Z0-9/+.]+$/);
            const split = result.split('.');
            expect(split.length).to.equal(4);
            const [ver, _authTag, _iv, encrypted] = split;
            expect(ver).to.equal(version);
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length).to.equal(32);
        });
        it('should seal a value smaller than minimum paddin', () => {
            const secret = 'marabou stork';
            const value = 'stork family';
            const result = seal(value, secret);
            expect(result).to.be.a('string');
            expect(result).to.match(/^[a-zA-Z0-9/+.]+$/);
            const split = result.split('.');
            expect(split.length).to.equal(4);
            const [ver, _authTag, _iv, encrypted] = split;
            expect(ver).to.equal(version);
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length).to.equal(32);
        });
        it('should seal a value', () => {
            const secret = 'marabou stork';
            const value = 'The marabou stork is a large wading bird in the stork family';
            const result = seal(value, secret);
            expect(result).to.be.a('string');
            expect(result).to.match(/^[a-zA-Z0-9/+.]+$/);
            const split = result.split('.');
            expect(split.length).to.equal(4);
            const [ver, authTag, iv, encrypted] = split;
            expect(ver).to.equal(version);
            const authTagBuffer = Buffer.from(authTag, 'base64');
            const ivBuffer = Buffer.from(iv, 'base64');
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length % 8).to.equal(0);
            expect(ivBuffer.length).to.equal(ivSize);
            // Manually decrypt and check paddding.
            const hmac = crypto.createHmac(hmacAlgorithm, secret);
            const keyBuffer = hmac.digest();
            const decipher = crypto.createDecipheriv(cipherAlgorithm, keyBuffer, ivBuffer);
            decipher.setAuthTag(authTagBuffer);
            const decryptBuffer = Buffer.concat([
                decipher.update(sealedBuffer),
                decipher.final(),
            ]);
            const expectedPadding = 4;
            const decrypted = decryptBuffer.subarray(0, -1 * expectedPadding).toString();
            const paddingArray = Array.from(decryptBuffer.subarray(-1 * expectedPadding));
            expect(paddingArray).to.eql([
                expectedPadding, expectedPadding,
                expectedPadding, expectedPadding,
            ]);
            expect(decrypted).to.equal(value);
        });
        it('should seal a range of values', () => {
            const secret = 'marabou stork';
            for (let idx = 0; idx < 100; idx++) {
                const value = '.'.repeat(idx);
                const result = seal(value, secret);
                expect(result).to.be.a('string');
                expect(result).to.match(/^[a-zA-Z0-9/+.]+$/);
                const split = result.split('.');
                expect(split.length).to.equal(4);
                const [ver, _authTag, _iv, encrypted] = split;
                expect(ver).to.equal(version);
                const sealedBuffer = Buffer.from(encrypted, 'base64');
                expect(sealedBuffer.length).to.be.greaterThan(idx);
                expect(sealedBuffer.length % 8).to.equal(0);
            }
        });
    });
});