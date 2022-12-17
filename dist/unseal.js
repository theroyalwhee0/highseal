"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unseal = void 0;
const node_crypto_1 = require("node:crypto");
const constants_1 = require("./constants");
const key_1 = require("./key");
/**
 * Unseal a sealed value.
 * @param sealed The sealed value.
 * @param secret The secret to decrypt with.
 * @returns A tuple of an error boolean and the unsealed value.
 */
function unseal(sealed, secret) {
    if (!constants_1.re_valid_sealed.test(sealed)) {
        return [new Error('Invalid formatting'), ''];
    }
    const [versionIdent, authTagEncoded, ivEncoded, valueEncoded] = sealed.split(constants_1.separator);
    const authTagBuffer = Buffer.from(authTagEncoded, 'base64');
    const ivBuffer = Buffer.from(ivEncoded, 'base64');
    if (ivBuffer.length !== constants_1.ivSize) {
        return [new Error('Invalid IV size'), ''];
    }
    else if (authTagBuffer.length !== constants_1.authTagSize) {
        return [new Error('Invalid tag size'), ''];
    }
    const valueBuffer = Buffer.from(valueEncoded, 'base64');
    let keyBuffer;
    switch (versionIdent) {
        case 'A': {
            keyBuffer = (0, key_1.deriveKeyA)(secret);
            break;
        }
        case 'B': {
            keyBuffer = (0, key_1.deriveKeyB)(secret);
            break;
        }
        default: {
            return [new Error('Unsupported version'), ''];
        }
    }
    const decipher = (0, node_crypto_1.createDecipheriv)(constants_1.cipherAlgorithm, keyBuffer, ivBuffer);
    decipher.setAuthTag(authTagBuffer);
    let decryptBuffer;
    try {
        decryptBuffer = Buffer.concat([
            decipher.update(valueBuffer),
            decipher.final(),
        ]);
    }
    catch (err) {
        // Decipher will throw unspecialized Errors if unable to decrypt.
        // Could indicate invalid IV, authTag, password, content, etc.
        return [err, ''];
    }
    const paddingByte = decryptBuffer.at(-1);
    if (paddingByte === undefined || paddingByte < 0 || paddingByte > constants_1.padMinLength) {
        return [new Error('Invalid padding bytes.'), ''];
    }
    const unpadded = decryptBuffer.subarray(0, -1 * paddingByte);
    const result = unpadded.toString();
    return [undefined, result];
}
exports.unseal = unseal;
//# sourceMappingURL=unseal.js.map