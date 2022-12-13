import readline from 'readline';
import { boolean } from 'yargs';

export function readInput(prompt: string) {
    return new Promise<string>((resolve) => {
        process.stdout.write(prompt);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.on('line', (line) => {
            resolve(line);
        });
        rl.once('close', () => {
            resolve('');
        });
    });
}


export type ExclusiveOption = (argv: Record<string, unknown>) => boolean;

export function exclusiveOptions(...options: string[]): ExclusiveOption {
    return (argv: Record<string, unknown>): boolean => {
        const count = options.filter(option => option in argv).length;
        const lastOption = options.pop();
        if (count > 1) {
            throw new Error(`Arguments ${options.join(', ')} and ${lastOption} are mutually exclusive`);
        }
        return true;
    }
}

export function demandExclusiveOptions(...options: string[]): ExclusiveOption {
    return (argv: Record<string, unknown>): boolean => {
        const count = options.filter(option => option in argv).length;
        const lastOption = options.pop();
        if (count < 0) {
            throw new Error(`At least 1 arguments of ${options.join(', ')} and ${lastOption} is required`);
        } else if (count > 1) {
            throw new Error(`Arguments ${options.join(', ')} and ${lastOption} are mutually exclusive`);
        }
        return true;
    }
}
