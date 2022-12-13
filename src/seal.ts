import { createCipheriv, createHmac } from 'node:crypto';
import { version, cipherAlgorithm, hmacAlgorithm, minSecretLength, separator } from './constants';
import { createIv } from './iv';
import { padValue } from './pad';

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

