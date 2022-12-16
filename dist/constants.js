"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.re_valid_sealed = exports.version = exports.separator = exports.padMinLength = exports.padSize = exports.ivSize = exports.ivRandomSize = exports.ivMaxCounter = exports.ivCounterSize = exports.ivEpochEnd = exports.ivEpochStart = exports.ivMaxEpochTimestamp = exports.ivTimestampSize = exports.authTagSize = exports.cipherAlgorithm = exports.keySize = exports.hmacAlgorithm = exports.minSecretLength = void 0;
// Key.
exports.minSecretLength = 10; // In characters.
exports.hmacAlgorithm = 'sha3-256';
exports.keySize = 32; // in bytes
// Cipher.
exports.cipherAlgorithm = 'aes-256-gcm';
exports.authTagSize = 16; // in bytes
// IV.
exports.ivTimestampSize = 6; // in bytes
exports.ivMaxEpochTimestamp = 281474976710655; // 2^48-1
exports.ivEpochStart = 1577854800000; // 2020-01-01 0:00:00.000 in ms
exports.ivEpochEnd = exports.ivEpochStart + exports.ivMaxEpochTimestamp; // 
exports.ivCounterSize = 2; // in bytes
exports.ivMaxCounter = 65535; // 2^16-1
exports.ivRandomSize = 4; // in bytes
exports.ivSize = 12; // in bytes
// Padding.
exports.padSize = 8; // in bytes
exports.padMinLength = 32; // in bytes
// Result.
exports.separator = '.';
exports.version = 'A';
exports.re_valid_sealed = /^A\.[a-zA-Z0-9/+]{21,22}\.[a-zA-Z0-9/+]{16}\.[a-zA-Z0-9/+]{42,}$/;
//# sourceMappingURL=constants.js.map