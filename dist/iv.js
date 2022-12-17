"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIv = void 0;
const node_crypto_1 = require("node:crypto");
const counters_1 = require("@theroyalwhee0/counters");
const constants_1 = require("./constants");
/**
 * The counter.
 */
const ivCounter = (0, counters_1.uint16Counter)({
    initial: randomUint16GTZ(),
});
/**
 * Get a random UINT16 greater than zero.
 * @returns An integer between 1 and 65535.
 */
function randomUint16GTZ() {
    return Math.max(1, (0, node_crypto_1.randomBytes)(4).readUInt16BE());
}
/**
 * Create an IV.
 * From a epoch timestamp, a counter, and random bytes.
 * @returns IV Buffer.
 */
function createIv() {
    // Timestamp, 6 bytes
    const timestamp = Date.now() - constants_1.ivEpochStart;
    if (timestamp < 0) {
        throw new Error('Unable to create IV. Timestamp before minimum.');
    }
    else if (timestamp > constants_1.ivMaxEpochTimestamp) {
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
    const randomBuffer = (0, node_crypto_1.randomBytes)(constants_1.ivRandomSize);
    // Concat buffers.
    return Buffer.concat([
        timestampBuffer,
        counterBuffer,
        randomBuffer,
    ]);
}
exports.createIv = createIv;
//# sourceMappingURL=iv.js.map