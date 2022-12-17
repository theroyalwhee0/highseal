/// <reference types="node" />
/**
 * Derive a key buffer from a secret string for version A seal.
 * Version A seals and keys are deprecated.
 * @param secret The secret to use.
 * @returns The key buffer.
 */
export declare function deriveKeyA(secret: string): Buffer;
/**
 * Derive a key buffer from a secret string for version B seal.
 * @param secret The secret to use.
 * @param salt The salt to use. If not supplied defaults to HighSeal key salt.
 * @returns The key buffer.
 */
export declare function deriveKeyB(secret: string, salt?: string): Buffer;
/**
 * Default key deriviation for new seals.
 */
export declare const deriveKey: typeof deriveKeyB;
