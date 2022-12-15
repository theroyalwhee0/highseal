import { Readable, Writable } from 'node:stream';
import readline from 'readline';

/**
 * readInput options.
 */
export type ReadInputOptions = {
    output: Writable,
    input: Readable,
}

/**
 * Read input from stdin.
 * @param prompt A prompt to write to stdout.
 * @returns The sting read from stdin.
 */
export function readInput(prompt = '', options?: ReadInputOptions): Promise<string> {
    const output = options?.output ?? process.stdout;
    const input = options?.input ?? process.stdin;
    return new Promise<string>((resolve) => {
        if (prompt) {
            output.write(prompt);
        }
        const rl = readline.createInterface({
            input: input,
            output: output,
        });
        rl.on('line', (line) => {
            resolve(line);
            rl.close();
        });
    });
}
