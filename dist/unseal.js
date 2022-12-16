"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unseal = void 0;
const node_crypto_1 = require("node:crypto");
const constants_1 = require("./constants");
/**
 * Unseal a sealed value.
 * @param sealed The sealed value.
 * @param secret The secret to decrypt with.
 * @returns A tuple of an error boolean and the unsealed value.
 */
function unseal(sealed, secret) {
    if (!constants_1.re_valid_sealed.test(sealed)) {
        return [true, ''];
    }
    const [versionIdent, authTagEncoded, ivEncoded, valueEncoded] = sealed.split(constants_1.separator);
    if (versionIdent !== constants_1.version) {
        return [true, ''];
    }
    const authTagBuffer = Buffer.from(authTagEncoded, 'base64');
    const ivBuffer = Buffer.from(ivEncoded, 'base64');
    if (ivBuffer.length !== constants_1.ivSize ||
        authTagBuffer.length !== constants_1.authTagSize) {
        return [true, ''];
    }
    const valueBuffer = Buffer.from(valueEncoded, 'base64');
    const hmac = (0, node_crypto_1.createHmac)(constants_1.hmacAlgorithm, secret);
    const keyBuffer = hmac.digest();
    const decipher = (0, node_crypto_1.createDecipheriv)(constants_1.cipherAlgorithm, keyBuffer, ivBuffer);
    decipher.setAuthTag(authTagBuffer);
    let decryptBuffer;
    try {
        decryptBuffer = Buffer.concat([
            decipher.update(valueBuffer),
            decipher.final(),
        ]);
    }
    catch {
        // Decipher will throw unspecialized Errors if unable to decrypt.
        // Could indicate invalid IV, authTag, password, content, etc.
        return [true, ''];
    }
    const paddingByte = decryptBuffer.at(-1);
    if (paddingByte === undefined || paddingByte < 0 || paddingByte > constants_1.padMinLength) {
        return [true, ''];
    }
    const unpadded = decryptBuffer.subarray(0, -1 * paddingByte);
    const result = unpadded.toString();
    return [false, result];
}
exports.unseal = unseal;
//# sourceMappingURL=unseal.js.map