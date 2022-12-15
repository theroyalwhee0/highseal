import { Arguments } from 'yargs';

/**
 * A function for use with yargs.check.
 */
export type CheckFunction = (argv: Arguments) => boolean;

/**
 * Build a function for use with yargs.check that enforces given options are
 * mutually exclusive.
 * @param options The options that are mutually exclusive.
 * @returns A function for use with yargs.check.
 */
export function exclusiveOptions(...options: string[]): CheckFunction {
    return (argv: Record<string, unknown>): boolean => {
        const count = options.filter(option => option in argv).length;
        const lastOption = options.pop();
        if (count > 1) {
            throw new Error(`Arguments ${options.join(', ')} and ${lastOption} are mutually exclusive`);
        }
        return true;
    };
}

/**
 * Build a function for use with yargs.check that enforces given options are
 * mutually exclusive and that at least one of them is specified.
 * @param options The options that are mutually exclusive.
 * @returns A function for use with yargs.check.
 */
export function demandExclusiveOptions(...options: string[]): CheckFunction {
    return (argv: Record<string, unknown>): boolean => {
        const count = options.filter(option => option in argv).length;
        const lastOption = options.pop();
        if (count < 0) {
            throw new Error(`At least 1 arguments of ${options.join(', ')} and ${lastOption} is required`);
        } else if (count > 1) {
            throw new Error(`Arguments ${options.join(', ')} and ${lastOption} are mutually exclusive`);
        }
        return true;
    };
}
