export interface ArgvShape {
    [key: string]: unknown;
    _: (string)[];
    $0: string;
    overwrite: boolean;
    secretEnv: string;
    secretValue?: string;
    secretFile?: string;
    secretTerminal?: boolean;
    inputEnv: string;
    inputValue?: string;
    inputFile?: string;
    inputTerminal?: boolean;
    inputGenerate?: number;
    outputTerminal?: boolean;
    outputFile?: string;
    outputDotenv?: string;
}
export declare function getArgv(value?: string[], exit?: boolean): ArgvShape;
