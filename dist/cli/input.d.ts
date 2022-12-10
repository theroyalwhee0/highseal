import { ArgvShape } from "./argv";
export type InputSource = 'env' | 'file' | 'terminal' | 'value';
export declare function getInputSource(argv: ArgvShape): InputSource;
export declare function getInput(argv: ArgvShape): Promise<[Error | undefined, string]>;
