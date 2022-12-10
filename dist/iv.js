"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIv = void 0;
const node_crypto_1 = require("node:crypto");
const constants_1 = require("./constants");
let ivCounter = (0, node_crypto_1.randomBytes)(4).readUInt16BE();
function createIv() {
    // Timestamp, 6 bytes
    const timestamp = Date.now() - constants_1.ivEpochStart;
    if (timestamp < 0) {
        throw new Error(`Unable to create IV. Timestamp before minimum.`);
    }
    else if (timestamp > constants_1.ivMaxEpochTimestamp) {
        throw new Error(`Unable to create IV. Timestamp beyond maximum.`);
    }
    const timestampBigBuffer = Buffer.alloc(8);
    timestampBigBuffer.writeBigInt64BE(BigInt(timestamp));
    const timestampBuffer = timestampBigBuffer.subarray(2);
    // Counter, 4 bytes
    if (ivCounter >= constants_1.ivMaxCounter) {
        ivCounter = 0;
    }
    else {
        ivCounter += 1;
    }
    const counterBuffer = Buffer.alloc(2);
    counterBuffer.writeUInt16BE(ivCounter);
    return Buffer.concat([
        timestampBuffer,
        counterBuffer,
        (0, node_crypto_1.randomBytes)(constants_1.ivRandomSize),
    ]);
}
exports.createIv = createIv;
//# sourceMappingURL=iv.js.map