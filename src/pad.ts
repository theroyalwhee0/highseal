import { padMinLength, padSize } from './constants';

/**
 * Convert a string to a buffer and pad it with bytes
 * equal to the padding size. Pads to a minimum size and 
 * to a multiple.
 * @param value The string to pad.
 * @returns The padded buffer.
 */
export function padValue(value: string): Buffer {
    const mod = value.length % padSize;
    let paddingLength = mod === 0 ? padSize : padSize - mod;
    if (value.length + paddingLength < padMinLength) {
        paddingLength = padMinLength - value.length;
    }
    const padding = Buffer.alloc(paddingLength).fill(paddingLength);
    return Buffer.concat([
        Buffer.from(value, 'utf8'),
        padding,
    ]);
}