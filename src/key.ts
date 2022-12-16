import { createHmac } from 'node:crypto';
import { keyAHmacAlgorithm, minSecretLength } from './constants';

export function deriveKeyA(secret: string): Buffer {
    if (!(secret && secret.length >= minSecretLength)) {
        throw new Error(`Secret is required and must be at least ${minSecretLength} characters`);
    }
    const hmac = createHmac(keyAHmacAlgorithm, secret);
    const keyBuffer = hmac.digest();
    return keyBuffer;
}