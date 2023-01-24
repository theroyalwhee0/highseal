import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { isSealed } from '../src/check';
import { seal } from '../src/seal';

describe('check', () => {
    describe('isSealed', () => {
        it('should be a function', () => {
            expect(isSealed).to.be.a('function');
        });
        describe('should see as sealed', () => {
            // Values that should be seen as sealed...
            [
                [
                    'a sealed blank value, version-A',
                    'A.9DXhmSdywgfFt+Jta0uIaQ.ABWSkxaLf4oAwwFq.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM',
                ], [
                    'a sealed blank value, version-B',
                    'B.cOe0e/HEfA6Ao7j7rzjwgQ.ABXCBD5NYHr4lvlp.LtpCMzPk7yi2bPq/c0VPGBW3MgNGOF3zKEq2JQEZvH8',
                ], [
                    'a sealed blank value, version-B with prefix',
                    'highseal://B.cOe0e/HEfA6Ao7j7rzjwgQ.ABXCBD5NYHr4lvlp.LtpCMzPk7yi2bPq/c0VPGBW3MgNGOF3zKEq2JQEZvH8',
                ], [
                    'a sealed value, version-B',
                    'B.dc7Hor7FUQKCtMggI+znoA.ABXCF2jgUWvdi5IS.CYExntjgW29eutzikL/fRSBzvfl0HEDQBDNfNiNsx0VMumota8GM9d6/bkv9yeo5jJDTMfMucgMpJIPSuKycwQ',
                ], [
                    'a sealed string longer than minimum size',
                    'A.J3tfnvSR9RGH5ZN6yZ6yZw.ABW4LllE+FD4F3gm.QdoTcwbGrZeY1hsX1g/0cfPEuPMHPWiSZXBC3wptZH5zD1krQy/k4HBcn8vvQdTWrGjwEOVHGcY',
                ], [
                    'a sealed string at start of epoch',
                    'A.wHoQejdVhbjGpJG+Ai0g+Q.AAAAAAAAkM3NYTHq.0kLeG97+agQeUqM3kLULzHGQ2A+PH/3gehA0lBxQGHA',
                ], [
                    'a sealed string at end of epoch',
                    'A.hlw1K7866SCIWjBJ/kiDhw./////////AFU4ud0.KMGOGR7MZ31AKxOhZVjV46JK1TxKUJTs20nRY0aV65A',
                ],
            ].forEach(([description, value]) => {
                it(description, () => {
                    const result = isSealed(value);
                    expect(result).to.be.true;
                });
            });
        });
        describe('should see as not sealed', () => {
            // Values that should not be seen as sealed...
            [
                [
                    'a blank value',
                    '',
                ], [
                    'a sealed value with an invalid version',
                    '+.9DXhmSdywgfFt+Jta0uIaQ.ABWSkxaLf4oAwwFq.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM',
                ], [
                    'a sealed value with a shortened AuthTag',
                    'B.e0e/HEfA6Ao7j7rzjwgQ.ABXCBD5NYHr4lvlp.LtpCMzPk7yi2bPq/c0VPGBW3MgNGOF3zKEq2JQEZvH8',
                ], [
                    'a sealed value with a shortened IV',
                    'B.cOe0e/HEfA6Ao7j7rzjwgQ.XCBD5NYHr4lvlp.LtpCMzPk7yi2bPq/c0VPGBW3MgNGOF3zKEq2JQEZvH8',
                ], [
                    'a sealed value without separators',
                    'BcOe0e/HEfA6Ao7j7rzjwgQABXCBD5NYHr4lvlpLtpCMzPk7yi2bPq/c0VPGBW3MgNGOF3zKEq2JQEZvH8',
                ],
            ].forEach(([description, value]) => {
                it(description, () => {
                    const result = isSealed(value);
                    expect(result).to.be.false;
                });
            });
        });
        it('should see various generated values as sealed', () => {
            const secret = 'frequent scavenger';
            for (let idx = 0; idx < 100; idx++) {
                const value = '.'.repeat(idx);
                const sealed = seal(value, secret);
                const result = isSealed(sealed);
                expect(result).to.be.true;
            }
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
                    const result = isSealed(sealed);
                    expect(result).to.be.true;
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
                    const result = isSealed(sealed);
                    expect(result).to.be.true;
                });
            });
        });
    });
});