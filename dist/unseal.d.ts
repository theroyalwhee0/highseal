/**
 * Unseal a sealed value.
 * @param sealed The sealed value.
 * @param secret The secret to decrypt with.
 * @returns A tuple of an error boolean and the unsealed value.
 */
export declare function unseal(sealed: string, secret: string): [boolean, string | undefined];
