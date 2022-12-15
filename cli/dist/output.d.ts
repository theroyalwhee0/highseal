import { ArgvShape } from './argv';
/**
 * Types of output targets.
 */
export type OutputTarget = 'terminal' | 'file' | 'dotenv';
/**
 * Get the output target from argv.
 * @param argv The argv to use.
 * @returns The output target.
 */
export declare function getOutputTarget(argv: ArgvShape): OutputTarget;
export declare function writeOutput(argv: ArgvShape, value: string | undefined): Promise<[Error | undefined]>;
