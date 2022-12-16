import { re_valid_sealed } from './constants';

/**
 * Is the value formatted as a sealed value.
 * @param value The value to check.
 * @returns True if formatted like a sealed value, otherwise false.
 */
export function isSealed(value: string): boolean {
    // NOTE: Lengths comes from floor(4*(n/3)) < ceil(4*(n/3)) since padding is stripped.
    return re_valid_sealed.test(value);
}
