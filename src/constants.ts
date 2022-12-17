// Key.
export const minSecretLength = 10; // In characters.
export const keySize = 32; // in bytes
export const hmacAlgorithm = 'sha3-256';
export const keyIterations = 1024;
export const keySalt = 'tWWFNS4n/3V0EUSG6xhyU/Z1';

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
export const re_valid_sealed = /^[AB]\.[a-zA-Z0-9/+]{21,22}\.[a-zA-Z0-9/+]{16}\.[a-zA-Z0-9/+]{42,}$/;

// Version.
export const version = 'B';
export const validVersions: Readonly<string[]> = ['A', 'B'];
export type SealVersion = 'A' | 'B';
