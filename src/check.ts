/**
 * Is the value formatted as a sealed value.
 * @param value The value to check.
 * @returns True if formatted like a sealed value, otherwise false.
 */
export function isSealed(value: string): boolean {
    // NOTE: Lengths comes from floor(4*(n/3)) < ceil(4*(n/3)) since padding is stripped.
    return /^A\.[a-zA-Z0-9/+]{21,22}\.[a-zA-Z0-9/+]{16}\.[a-zA-Z0-9/+]{42,}$/.test(value);
}
