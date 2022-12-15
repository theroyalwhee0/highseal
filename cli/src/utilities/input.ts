import readline from 'readline';

/**
 * Read input from stdin.
 * @param prompt A prompt to write to stdout.
 * @returns The sting read from stdin.
 */
export function readInput(prompt: string = ''): Promise<string> {
    return new Promise<string>((resolve) => {
        if (prompt) {
            process.stdout.write(prompt);
        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.on('line', (line) => {
            resolve(line);
        });
        rl.once('close', () => {
            resolve('');
        });
    });
}
