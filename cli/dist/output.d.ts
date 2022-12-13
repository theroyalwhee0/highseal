import { ArgvShape } from './argv';
export type OutputTarget = 'terminal' | 'file' | 'dotenv';
export declare function getOutputTarget(argv: ArgvShape): OutputTarget;
export declare function writeOutput(argv: ArgvShape, sealed: string): Promise<[Error | undefined]>;
