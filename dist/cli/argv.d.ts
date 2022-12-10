export interface ArgvShape {
    [key: string]: unknown;
    _: (string)[];
    $0: string;
    secretEnv: string;
    secretValue?: string;
    secretFile?: string;
    secretTerminal?: boolean;
    inputEnv: string;
    inputValue?: string;
    inputFile?: string;
    inputTerminal?: boolean;
    outputTerminal?: boolean;
    outputFile?: string;
}
export declare function getArgv(value?: string[], exit?: boolean): ArgvShape;
