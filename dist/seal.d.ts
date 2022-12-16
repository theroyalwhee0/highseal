/**
 * Seal a string with a secret.
 * The value will be padded to a minimum length, a multiple length, and
 * encrypted with authenticate encryption.
 * @param value The string to seal.
 * @param secret The secret to encrypt with. Must be at least 10 characters.
 * @returns The sealed string.
 */
export declare function seal(value: string, secret: string): string;
