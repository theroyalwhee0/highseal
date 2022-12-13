import { randomBytes } from 'node:crypto';
import {
    ivEpochStart, ivMaxCounter, ivMaxEpochTimestamp, ivRandomSize,
} from './constants';

let ivCounter = randomBytes(4).readUInt16BE();
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
    // Counter, 4 bytes
    if (ivCounter >= ivMaxCounter) {
        ivCounter = 0;
    } else {
        ivCounter += 1;
    }
    const counterBuffer = Buffer.alloc(2);
    counterBuffer.writeUInt16BE(ivCounter);
    return Buffer.concat([
        timestampBuffer,
        counterBuffer,
        randomBytes(ivRandomSize),
    ]);
}