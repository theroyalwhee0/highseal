import { Arguments } from "yargs";
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
export declare function exclusiveOptions(...options: string[]): CheckFunction;
/**
 * Build a function for use with yargs.check that enforces given options are
 * mutually exclusive and that at least one of them is specified.
 * @param options The options that are mutually exclusive.
 * @returns A function for use with yargs.check.
 */
export declare function demandExclusiveOptions(...options: string[]): CheckFunction;
