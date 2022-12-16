import { randomBytes } from 'node:crypto';
import { uint16Counter } from '@theroyalwhee0/counters';
import { ivEpochStart, ivMaxEpochTimestamp, ivRandomSize } from './constants';

/**
 * The counter.
 */
const ivCounter = uint16Counter({
    initial: randomUint16GTZ(),
});

/**
 * Get a random UINT16 greater than zero.
 * @returns An integer between 1 and 65535.
 */
function randomUint16GTZ() {
    return Math.max(1, randomBytes(4).readUInt16BE());
}

/**
 * Create an IV.
 * From a epoch timestamp, a counter, and random bytes.
 * @returns IV Buffer.
 */
export function createIv(): Buffer {
    // Timestamp, 6 bytes
    const timestamp = Date.now() - ivEpochStart;
    if (timestamp < 0) {
        throw new Error('Unable to create IV. Timestamp before minimum.');
    } else if (timestamp > ivMaxEpochTimestamp) {
        throw new Error('Unable to create IV. Timestamp beyond maximum.');
    }
    const timestampBigBuffer = Buffer.alloc(8);
    timestampBigBuffer.writeBigInt64BE(BigInt(timestamp));
    const timestampBuffer = timestampBigBuffer.subarray(2);
    // Counter, 2 bytes.
    const { value } = ivCounter.next();
    const counterBuffer = Buffer.alloc(2);
    counterBuffer.writeUInt16BE(value);
    // Random, 4 bytes.
    const randomBuffer = randomBytes(ivRandomSize);
    // Concat buffers.
    return Buffer.concat([
        timestampBuffer,
        counterBuffer,
        randomBuffer,
    ]);
}