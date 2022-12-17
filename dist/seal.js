"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seal = void 0;
const node_crypto_1 = require("node:crypto");
const constants_1 = require("./constants");
const iv_1 = require("./iv");
const key_1 = require("./key");
const pad_1 = require("./pad");
/**
 * Seal a string with a secret.
 * The value will be padded to a minimum length, a multiple length, and
 * encrypted with authenticate encryption.
 * @param value The string to seal.
 * @param secret The secret to encrypt with. Must be at least 10 characters.
 * @returns The sealed string.
 */
function seal(value, secret) {
    const keyBuffer = (0, key_1.deriveKey)(secret);
    const ivBytes = (0, iv_1.createIv)();
    const cipher = (0, node_crypto_1.createCipheriv)(constants_1.cipherAlgorithm, keyBuffer, ivBytes);
    const paddedValue = (0, pad_1.padValue)(value);
    const encryptedBytes = Buffer.concat([
        cipher.update(paddedValue),
        cipher.final(),
    ]);
    const iv = ivBytes.toString('base64').replace(/=+$/, '');
    const encrypted = encryptedBytes.toString('base64').replace(/=+$/, '');
    const authTag = cipher.getAuthTag().toString('base64').replace(/=+$/, '');
    const results = [
        constants_1.version, authTag, iv, encrypted,
    ].join(constants_1.separator);
    return results;
}
exports.seal = seal;
//# sourceMappingURL=seal.js.map