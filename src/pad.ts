import { padMinLength, padSize } from './constants';

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