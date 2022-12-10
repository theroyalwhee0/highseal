import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createIv } from '../src/iv';
import {
    ivCounterSize, ivEpochStart, ivMaxCounter,
    ivRandomSize, ivSize, ivTimestampSize
} from '../src/constants';

describe('iv', () => {
    describe('createIv', () => {
        it('should be a function', () => {
            expect(createIv).to.be.a('function');
        });
        it('should generate an IV', () => {
            const now = Date.now();
            const iv = createIv();
            expect(iv).to.be.an.instanceOf(Buffer);
            expect(iv.length).to.equal(ivSize);
            // Timestamp.            
            const timestampBuffer = Buffer.concat([
                Buffer.alloc(2),
                iv.subarray(0, ivTimestampSize)
            ]);
            expect(timestampBuffer.length).to.equal(ivTimestampSize + 2);
            const timestampEpoch = timestampBuffer.readBigInt64BE();
            expect(timestampEpoch > 0).to.be.true;
            expect(timestampEpoch <= 281_474_976_710_656); // 2^48
            const timestamp = timestampEpoch + BigInt(ivEpochStart);
            expect(timestamp > ivEpochStart).to.be.true;
            expect(timestamp <= Date.now()).to.be.true;
            // Counter.
            const counterBuffer = iv.subarray(ivTimestampSize, ivTimestampSize + ivCounterSize)
            expect(counterBuffer.length).to.equal(ivCounterSize);
            const counter = counterBuffer.readUInt16BE();
            expect(counter >= 0).to.be.true;
            expect(counter <= 4_294_967_296).to.be.true; // 2^32
            // Random.
            const randomBuffer = iv.subarray(ivTimestampSize + ivCounterSize, ivTimestampSize + ivCounterSize + ivRandomSize);
            expect(randomBuffer.length).to.equal(ivRandomSize);
        });
        it('should generate IV sequences', () => {
            const set = new Set<string>();
            let lastCounter: number = -1;
            let lastTimestamp: bigint = -1n;
            let firstTimestamp: bigint = -1n;
            for (let idx = 0; idx < 1000; idx++) {
                const iv = createIv();
                expect(iv).to.be.an.instanceOf(Buffer);
                expect(iv.length).to.equal(ivSize);
                const ivString = iv.toString('base64');
                expect(set.has(ivString)).to.equal(false);
                set.add(ivString);
                // Timestamp.            
                const timestampBuffer = Buffer.concat([
                    Buffer.alloc(2),
                    iv.subarray(0, ivTimestampSize)
                ]);
                expect(timestampBuffer.length).to.equal(ivTimestampSize + 2);
                const timestampEpoch = timestampBuffer.readBigInt64BE();
                expect(timestampEpoch > 0).to.be.true;
                expect(timestampEpoch <= 281_474_976_710_655); // 2^48-1
                const timestamp = timestampEpoch + BigInt(ivEpochStart);
                expect(timestamp > ivEpochStart).to.be.true;
                expect(timestamp <= Date.now()).to.be.true;
                if (lastTimestamp === -1n) {
                    expect(lastTimestamp <= timestamp).to.be.true;
                }
                if (firstTimestamp === -1n) {
                    firstTimestamp = timestamp;
                }
                lastTimestamp = timestamp;
                // Counter.
                const counterBuffer = iv.subarray(ivTimestampSize, ivTimestampSize + ivCounterSize)
                expect(counterBuffer.length).to.equal(ivCounterSize);
                const counter = counterBuffer.readUInt16BE();
                expect(counter >= 0).to.be.true;
                expect(counter <= 65535).to.be.true; // 2^16-1
                if (lastCounter !== -1) {
                    if (lastCounter >= ivMaxCounter) {
                        expect(counter).to.equal(0);
                    } else {
                        expect(counter).to.be.greaterThan(lastCounter);
                    }
                }
                lastCounter = counter;
                // Random.
                const randomBuffer = iv.subarray(ivTimestampSize + ivCounterSize, ivTimestampSize + ivCounterSize + ivRandomSize);
                expect(randomBuffer.length).to.equal(ivRandomSize);
            }
            expect(firstTimestamp < lastTimestamp).to.be.true;
        });
    });
});