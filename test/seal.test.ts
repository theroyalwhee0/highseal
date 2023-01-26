import crypto, { pbkdf2Sync } from 'node:crypto';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { seal } from '../src/seal';
import {
    cipherAlgorithm, hmacAlgorithm, ivSize, keyIterations,
    keySalt, keySize, version, re_valid_sealed, prefix,
} from '../src/constants';
import sinon from 'sinon';

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
            const match = re_valid_sealed.exec(result);
            expect(match).to.not.equal(null);
            const split = match as RegExpExecArray;
            expect(split.length).to.equal(6);
            const [, _prefixed, ver, _authTag, _iv, encrypted] = split;
            expect(ver).to.equal(version);
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length).to.equal(32);
        });
        it('should seal a single character', () => {
            const secret = 'marabou stork';
            const value = 'z';
            const result = seal(value, secret);
            expect(result).to.be.a('string');
            const match = re_valid_sealed.exec(result);
            expect(match).to.not.equal(null);
            const split = match as RegExpExecArray;
            expect(split.length).to.equal(6);
            const [, _prefixed, ver, _authTag, _iv, encrypted] = split;
            expect(ver).to.equal(version);
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length).to.equal(32);
        });
        it('should seal a value smaller than minimum padding', () => {
            const secret = 'marabou stork';
            const value = 'stork family';
            const result = seal(value, secret);
            expect(result).to.be.a('string');
            const match = re_valid_sealed.exec(result);
            expect(match).to.not.equal(null);
            const split = match as RegExpExecArray;
            expect(split.length).to.equal(6);
            const [, _prefixed, ver, _authTag, _iv, encrypted] = split;
            expect(ver).to.equal(version);
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length).to.equal(32);
        });
        it('should seal a value', () => {
            const secret = 'marabou stork';
            const value = 'The marabou stork is a large wading bird in the stork family';
            const result = seal(value, secret);
            expect(result).to.be.a('string');
            const match = re_valid_sealed.exec(result);
            expect(match).to.not.equal(null);
            const split = match as RegExpExecArray;
            expect(split.length).to.equal(6);
            const [, prefixed, ver, authTag, iv, encrypted] = split;
            expect(prefixed).to.equal(prefix);
            expect(ver).to.equal(version);
            const authTagBuffer = Buffer.from(authTag, 'base64');
            const ivBuffer = Buffer.from(iv, 'base64');
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length % 8).to.equal(0);
            expect(ivBuffer.length).to.equal(ivSize);
            // Manually create key buffer.
            const keyBuffer = pbkdf2Sync(secret, keySalt, keyIterations, keySize, hmacAlgorithm);
            // Manually decrypt and check paddding.
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
                const match = re_valid_sealed.exec(result);
                expect(match).to.not.equal(null);
                const split = match as RegExpExecArray;
                expect(split.length).to.equal(6);
                const [, _prefixed, ver, _authTag, _iv, encrypted] = split;
                expect(ver).to.equal(version);
                const sealedBuffer = Buffer.from(encrypted, 'base64');
                expect(sealedBuffer.length).to.be.greaterThan(idx);
                expect(sealedBuffer.length % 8).to.equal(0);
            }
        });
        it('should seal with a prefixed', () => {
            const secret = 'marabou stork';
            const value = 'z';
            const result = seal(value, secret, {
                prefix: true,
            });
            expect(result).to.be.a('string');
            const match = re_valid_sealed.exec(result);
            expect(match).to.not.equal(null);
            const split = match as RegExpExecArray;
            expect(split.length).to.equal(6);
            const [, prefixed, ver, _authTag, _iv, encrypted] = split;
            expect(prefixed).to.equal(prefix);
            expect(ver).to.equal(version);
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length).to.equal(32);
        });
        it('should seal without a prefixed', () => {
            const secret = 'marabou stork';
            const value = 'z';
            const result = seal(value, secret, {
                prefix: false,
            });
            expect(result).to.be.a('string');
            const match = re_valid_sealed.exec(result);
            expect(match).to.not.equal(null);
            const split = match as RegExpExecArray;
            expect(split.length).to.equal(6);
            const [, prefixed, ver, _authTag, _iv, encrypted] = split;
            expect(prefixed).to.equal(undefined);
            expect(ver).to.equal(version);
            const sealedBuffer = Buffer.from(encrypted, 'base64');
            expect(sealedBuffer.length).to.equal(32);
        });
    });
    describe('should handle times within the given epoch', () => {
        describe('from the start', () => {
            let clock: sinon.SinonFakeTimers;
            beforeEach(() => {
                clock = sinon.useFakeTimers(1_577_854_800_000);
            });
            afterEach(() => {
                clock.restore();
            });
            it('of the epoch', () => {
                const secret = 'frequent scavenger';
                const value = 'large and powerful bird';
                const sealed = seal(value, secret);
                expect(sealed).to.be.a('string');
            });
        });
        describe('to the end', () => {
            let clock: sinon.SinonFakeTimers;
            beforeEach(() => {
                clock = sinon.useFakeTimers(1_577_854_800_000 + 281_474_976_710_655);
            });
            afterEach(() => {
                clock.restore();
            });
            it('of the epoch', () => {
                const secret = 'frequent scavenger';
                const value = 'large and powerful bird';
                const sealed = seal(value, secret);
                expect(sealed).to.be.a('string');
            });
        });
        describe('before start of epoch', () => {
            let clock: sinon.SinonFakeTimers;
            beforeEach(() => {
                clock = sinon.useFakeTimers(1_577_854_800_000 - 1);
            });
            afterEach(() => {
                clock.restore();
            });
            it('should throw', () => {
                const secret = 'frequent scavenger';
                const value = 'large and powerful bird';
                expect(() => {
                    seal(value, secret);
                }).to.throw(/Timestamp before minimum/i);
            });
        });
        describe('after end of epoch', () => {
            let clock: sinon.SinonFakeTimers;
            beforeEach(() => {
                clock = sinon.useFakeTimers(1_577_854_800_000 + 281_474_976_710_655 + 1);
            });
            afterEach(() => {
                clock.restore();
            });
            it('should throw', () => {
                const secret = 'frequent scavenger';
                const value = 'large and powerful bird';
                expect(() => {
                    seal(value, secret);
                }).to.throw(/Timestamp beyond maximum/i);
            });
        });
    });
});