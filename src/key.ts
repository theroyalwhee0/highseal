import { createHmac, pbkdf2Sync } from 'node:crypto';
import { hmacAlgorithm, keyIterations, keySalt, keySize, minSecretLength } from './constants';

/**
 * Derive a key buffer from a secret string for version A seal.
 * Version A seals and keys are deprecated.
 * @param secret The secret to use.
 * @returns The key buffer.
 */
export function deriveKeyA(secret: string): Buffer {
    if (!(secret && secret.length >= minSecretLength)) {
        throw new Error(`Secret is required and must be at least ${minSecretLength} characters`);
    }
    const hmac = createHmac(hmacAlgorithm, secret);
    return hmac.digest();
}

/**
 * Derive a key buffer from a secret string for version B seal.
 * @param secret The secret to use.
 * @param salt The salt to use. If not supplied defaults to HighSeal key salt.
 * @returns The key buffer.
 */
export function deriveKeyB(secret: string, salt: string = keySalt): Buffer {
    if (!(secret && secret.length >= minSecretLength)) {
        throw new Error(`Secret is required and must be at least ${minSecretLength} characters`);
    }
    return pbkdf2Sync(secret, salt, keyIterations, keySize, hmacAlgorithm);
}

/**
 * Default key deriviation for new seals.
 */
export const deriveKey = deriveKeyB;
