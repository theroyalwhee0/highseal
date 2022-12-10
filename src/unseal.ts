import { createDecipheriv, createHmac } from "node:crypto";
import {
    authTagSize,
    cipherAlgorithm,
    hmacAlgorithm,
    ivSize,
    padMinLength,
    separator,
    version
} from './constants';

const re_valid_encrypted = /^A\.[a-zA-Z0-9\/\+]+\.[a-zA-Z0-9\/\+]+\.[a-zA-Z0-9\/\+]+$/;

export function unseal(encrypted: string, key: string): [boolean, string | undefined] {
    if (!re_valid_encrypted.test(encrypted)) {
        return [true, ''];
    }
    const [versionIdent, authTagEncoded, ivEncoded, valueEncoded] = encrypted.split(separator);
    if (versionIdent !== version) {
        return [true, ''];
    }
    const authTagBuffer = Buffer.from(authTagEncoded, 'base64');
    const ivBuffer = Buffer.from(ivEncoded, 'base64');
    if (
        ivBuffer.length !== ivSize ||
        authTagBuffer.length !== authTagSize
    ) {
        return [true, ''];
    }
    const valueBuffer = Buffer.from(valueEncoded, 'base64');
    const hmac = createHmac(hmacAlgorithm, key);
    const keyBuffer = hmac.digest();
    const decipher = createDecipheriv(cipherAlgorithm, keyBuffer, ivBuffer);
    decipher.setAuthTag(authTagBuffer);
    let decryptBuffer: Buffer;
    try {
        decryptBuffer = Buffer.concat([
            decipher.update(valueBuffer),
            decipher.final(),
        ]);
    } catch {
        // Decipher will throw unspecialized Errors if unable to decrypt.
        // Could indicate invalid IV, authTag, password, content, etc.
        return [true, ''];
    }
    const paddingByte = decryptBuffer.at(-1);
    if (paddingByte === undefined || paddingByte < 0 || paddingByte > padMinLength) {
        return [true, ''];
    }
    const unpadded = decryptBuffer.subarray(0, -1 * paddingByte)
    const result = unpadded.toString();
    return [false, result];
}
