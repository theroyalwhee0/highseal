import fs from 'node:fs/promises';
import { ArgvShape } from "./argv";
import { HighSealError } from './error';
import { readInput } from "./helpers";

export type InputSource = 'env' | 'file' | 'terminal' | 'value';

export function getInputSource(argv: ArgvShape): InputSource {
    if (argv.inputValue !== undefined) {
        return 'value';
    } else if (argv.inputFile !== undefined) {
        return 'file';
    } else if (argv.inputTerminal !== undefined) {
        return 'terminal';
    }
    return 'env';
}

export async function getInput(argv: ArgvShape): Promise<[Error | undefined, string]> {
    const inputSource = getInputSource(argv);
    let err: Error | undefined;
    let input: string = '';
    switch (inputSource) {
        case 'env': {
            const inputEnvName = argv.inputEnv ?? 'HISE_INPUT';
            console.info(`> Pulling input from environment variable '${inputEnvName}'`);
            const inputEnv = process.env[inputEnvName];
            if (inputEnv === undefined) {
                err = new HighSealError(`Environment variable '${inputEnvName}' is undefined.`);
            } else {
                input = inputEnv;
            }
            break;
        }
        case 'value': {
            console.info(`> Pulling input from command line value`);
            const inputValue = argv.inputValue;
            if (inputValue === undefined) {
                err = new HighSealError(`Expected input value to be specified`);
            } else {
                input = inputValue;
            }
            break;
        }
        case 'file': {
            console.info(`> Pulling input from file`);
            if (argv.inputFile === undefined) {
                err = new HighSealError(`Expected input file to be specified`);
            } else {
                try {
                    input = await fs.readFile(argv.inputFile, 'utf8');
                } catch {
                    err = new HighSealError(`An error occurred reading file "${argv.inputFile}"`);
                }
            }
            break;
        }
        case 'terminal': {
            console.info(`> Prompting for input`);
            input = await readInput('> Please enter the input: ');
            break;
        }
        default: {
            throw new Error(`Unrecognized input source "${inputSource}"`);
        }
    }
    return [err, input];
}