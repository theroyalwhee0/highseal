"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveKey = exports.deriveKeyB = exports.deriveKeyA = void 0;
const node_crypto_1 = require("node:crypto");
const constants_1 = require("./constants");
/**
 * Derive a key buffer from a secret string for version A seal.
 * Version A seals and keys are deprecated.
 * @param secret The secret to use.
 * @returns The key buffer.
 */
function deriveKeyA(secret) {
    if (!(secret && secret.length >= constants_1.minSecretLength)) {
        throw new Error(`Secret is required and must be at least ${constants_1.minSecretLength} characters`);
    }
    const hmac = (0, node_crypto_1.createHmac)(constants_1.hmacAlgorithm, secret);
    return hmac.digest();
}
exports.deriveKeyA = deriveKeyA;
/**
 * Derive a key buffer from a secret string for version B seal.
 * @param secret The secret to use.
 * @param salt The salt to use. If not supplied defaults to HighSeal key salt.
 * @returns The key buffer.
 */
function deriveKeyB(secret, salt = constants_1.keySalt) {
    if (!(secret && secret.length >= constants_1.minSecretLength)) {
        throw new Error(`Secret is required and must be at least ${constants_1.minSecretLength} characters`);
    }
    return (0, node_crypto_1.pbkdf2Sync)(secret, salt, constants_1.keyIterations, constants_1.keySize, constants_1.hmacAlgorithm);
}
exports.deriveKeyB = deriveKeyB;
/**
 * Default key deriviation for new seals.
 */
exports.deriveKey = deriveKeyB;
//# sourceMappingURL=key.js.map