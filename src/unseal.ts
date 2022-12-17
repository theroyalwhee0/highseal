import { createDecipheriv } from 'node:crypto';
import {
    authTagSize, cipherAlgorithm, ivSize,
    padMinLength, re_valid_sealed, separator,
} from './constants';
import { deriveKeyA, deriveKeyB } from './key';

/**
 * Unseal a sealed value.
 * @param sealed The sealed value.
 * @param secret The secret to decrypt with.
 * @returns A tuple of an error boolean and the unsealed value.
 */
export function unseal(sealed: string, secret: string): [Error | undefined, string | undefined] {
    if (!re_valid_sealed.test(sealed)) {
        return [new Error('Invalid formatting'), ''];
    }
    const [versionIdent, authTagEncoded, ivEncoded, valueEncoded] = sealed.split(separator);
    const authTagBuffer = Buffer.from(authTagEncoded, 'base64');
    const ivBuffer = Buffer.from(ivEncoded, 'base64');
    if (ivBuffer.length !== ivSize) {
        return [new Error('Invalid IV size'), ''];
    } else if (authTagBuffer.length !== authTagSize) {
        return [new Error('Invalid tag size'), ''];
    }
    const valueBuffer = Buffer.from(valueEncoded, 'base64');
    let keyBuffer: Buffer;
    switch (versionIdent) {
        case 'A': {
            keyBuffer = deriveKeyA(secret);
            break;
        }
        case 'B': {
            keyBuffer = deriveKeyB(secret);
            break;
        }
        default: {
            return [new Error('Unsupported version'), ''];
        }
    }
    const decipher = createDecipheriv(cipherAlgorithm, keyBuffer, ivBuffer);
    decipher.setAuthTag(authTagBuffer);
    let decryptBuffer: Buffer;
    try {
        decryptBuffer = Buffer.concat([
            decipher.update(valueBuffer),
            decipher.final(),
        ]);
    } catch (err) {
        // Decipher will throw unspecialized Errors if unable to decrypt.
        // Could indicate invalid IV, authTag, password, content, etc.
        return [err, ''];
    }
    const paddingByte = decryptBuffer.at(-1);
    if (paddingByte === undefined || paddingByte < 0 || paddingByte > padMinLength) {
        return [new Error('Invalid padding bytes.'), ''];
    }
    const unpadded = decryptBuffer.subarray(0, -1 * paddingByte);
    const result = unpadded.toString();
    return [undefined, result];
}
