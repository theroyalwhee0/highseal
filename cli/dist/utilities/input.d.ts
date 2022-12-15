/// <reference types="node" />
import { Readable, Writable } from 'node:stream';
/**
 * readInput options.
 */
export type ReadInputOptions = {
    output: Writable;
    input: Readable;
};
/**
 * Read input from stdin.
 * @param prompt A prompt to write to stdout.
 * @returns The sting read from stdin.
 */
export declare function readInput(prompt?: string, options?: ReadInputOptions): Promise<string>;
