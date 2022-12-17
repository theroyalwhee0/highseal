"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validVersions = exports.version = exports.re_valid_sealed = exports.separator = exports.padMinLength = exports.padSize = exports.ivSize = exports.ivRandomSize = exports.ivMaxCounter = exports.ivCounterSize = exports.ivEpochEnd = exports.ivEpochStart = exports.ivMaxEpochTimestamp = exports.ivTimestampSize = exports.authTagSize = exports.cipherAlgorithm = exports.keySalt = exports.keyIterations = exports.hmacAlgorithm = exports.keySize = exports.minSecretLength = void 0;
// Key.
exports.minSecretLength = 10; // In characters.
exports.keySize = 32; // in bytes
exports.hmacAlgorithm = 'sha3-256';
exports.keyIterations = 1024;
exports.keySalt = 'tWWFNS4n/3V0EUSG6xhyU/Z1';
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
exports.re_valid_sealed = /^[AB]\.[a-zA-Z0-9/+]{21,22}\.[a-zA-Z0-9/+]{16}\.[a-zA-Z0-9/+]{42,}$/;
// Version.
exports.version = 'B';
exports.validVersions = ['A', 'B'];
//# sourceMappingURL=constants.js.map