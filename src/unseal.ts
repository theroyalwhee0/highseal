import { createDecipheriv, createHmac } from 'node:crypto';
import {
    authTagSize, cipherAlgorithm, keyAHmacAlgorithm, ivSize,
    padMinLength, re_valid_sealed, separator, version,
} from './constants';

/**
 * Unseal a sealed value.
 * @param sealed The sealed value.
 * @param secret The secret to decrypt with.
 * @returns A tuple of an error boolean and the unsealed value.
 */
export function unseal(sealed: string, secret: string): [boolean, string | undefined] {
    if (!re_valid_sealed.test(sealed)) {
        return [true, ''];
    }
    const [versionIdent, authTagEncoded, ivEncoded, valueEncoded] = sealed.split(separator);
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
    const hmac = createHmac(keyAHmacAlgorithm, secret);
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
    const unpadded = decryptBuffer.subarray(0, -1 * paddingByte);
    const result = unpadded.toString();
    return [false, result];
}
