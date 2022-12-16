// Key.
export const minSecretLength = 10; // In characters.
export const hmacAlgorithm = 'sha3-256';
export const keySize = 32; // in bytes

// Cipher.
export const cipherAlgorithm = 'aes-256-gcm';
export const authTagSize = 16; // in bytes

// IV.
export const ivTimestampSize = 6; // in bytes
export const ivMaxEpochTimestamp = 281_474_976_710_655; // 2^48-1
export const ivEpochStart = 1_577_854_800_000; // 2020-01-01 0:00:00.000 in ms
export const ivEpochEnd = ivEpochStart + ivMaxEpochTimestamp; // 
export const ivCounterSize = 2; // in bytes
export const ivMaxCounter = 65_535; // 2^16-1
export const ivRandomSize = 4; // in bytes
export const ivSize = 12; // in bytes

// Padding.
export const padSize = 8; // in bytes
export const padMinLength = 32; // in bytes

// Result.
export const separator = '.';
export const version = 'A';
export const re_valid_sealed = /^A\.[a-zA-Z0-9/+]{21,22}\.[a-zA-Z0-9/+]{16}\.[a-zA-Z0-9/+]{42,}$/;
