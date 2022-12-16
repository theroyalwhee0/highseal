import { createCipheriv, createHmac } from 'node:crypto';
import { cipherAlgorithm, hmacAlgorithm, minSecretLength, separator, version } from './constants';
import { createIv } from './iv';
import { padValue } from './pad';

/**
 * Seal a string with a secret.
 * The value will be padded to a minimum length, a multiple length, and 
 * encrypted with authenticate encryption.
 * @param value The string to seal.
 * @param secret The secret to encrypt with. Must be at least 10 characters.
 * @returns The sealed string.
 */
export function seal(value: string, secret: string): string {
    if (!(secret && secret.length >= minSecretLength)) {
        throw new Error(`Secret is required and must be at least ${minSecretLength} characters`);
    }
    const hmac = createHmac(hmacAlgorithm, secret);
    const keyBuffer = hmac.digest();
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
    const results = [
        version, authTag, iv, encrypted,
    ].join(separator);
    return results;
}
