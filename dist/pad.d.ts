/// <reference types="node" />
/**
 * Convert a string to a buffer and pad it with bytes
 * equal to the padding size. Pads to a minimum size and
 * to a multiple.
 * @param value The string to pad.
 * @returns The padded buffer.
 */
export declare function padValue(value: string): Buffer;
