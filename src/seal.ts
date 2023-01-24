import { createCipheriv } from 'node:crypto';
import { cipherAlgorithm, prefix, separator, version } from './constants';
import { createIv } from './iv';
import { deriveKey } from './key';
import { padValue } from './pad';

/**
 * Seal options.
 */
export type SealOptions = {
    prefix?: boolean // Defaults to false.
};

/**
 * Seal a string with a secret.
 * The value will be padded to a minimum length, a multiple length, and 
 * encrypted with authenticate encryption.
 * @param value The string to seal.
 * @param secret The secret to encrypt with. Must be at least 10 characters.
 * @param options Seal options. Optional.
 * @returns The sealed string.
 */
export function seal(value: string, secret: string, options?: SealOptions): string {
    const addPrefix = options?.prefix ?? false;
    const keyBuffer = deriveKey(secret);
    const ivBytes = createIv();
    const cipher = createCipheriv(cipherAlgorithm, keyBuffer, ivBytes);
    const paddedValue = padValue(value);
    const encryptedBytes = Buffer.concat([
        cipher.update(paddedValue),
        cipher.final(),
    ]);
    const iv = ivBytes.toString('base64').replace(/=+$/, '');
    const encrypted = encryptedBytes.toString('base64').replace(/=+$/, '');
    const authTag = cipher.getAuthTag().toString('base64').replace(/=+$/, '');
    const joined = [
        version, authTag, iv, encrypted,
    ].join(separator);
    const results = (addPrefix ? prefix : '') + joined;
    return results;
}
