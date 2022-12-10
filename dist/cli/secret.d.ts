import { ArgvShape } from "./argv";
export type SecretSource = 'env' | 'value' | 'file' | 'terminal';
export declare const re_valid_secret: RegExp;
export declare function getSecretSource(argv: ArgvShape): SecretSource;
export declare function getSecret(argv: ArgvShape): Promise<[Error | undefined, string]>;
