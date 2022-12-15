import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { ArgvShape } from './argv';
import { HighSealError } from './error';
import { readInput } from './utilities/input';
import { defaultGenerateLength } from './constants';

export type InputSource = 'env' | 'file' | 'terminal' | 'value' | 'generate'

export function getInputSource(argv: ArgvShape): InputSource {
    if (argv.inputValue !== undefined) {
        return 'value';
    } else if (argv.inputFile !== undefined) {
        return 'file';
    } else if (argv.inputTerminal !== undefined) {
        return 'terminal';
    } else if (argv.inputGenerate !== undefined) {
        return 'generate';
    }
    return 'env';
}

export async function getInput(argv: ArgvShape): Promise<[Error | undefined, string]> {
    const inputSource = getInputSource(argv);
    let err: Error | undefined;
    let input = '';
    switch (inputSource) {
        case 'env': {
            const inputEnvName = argv.inputEnv ?? 'HISE_INPUT';
            console.info(`> Reading input from environment variable '${inputEnvName}'`);
            const inputEnv = process.env[inputEnvName];
            if (inputEnv === undefined) {
                err = new HighSealError(`Environment variable '${inputEnvName}' is undefined.`);
            } else {
                input = inputEnv;
            }
            break;
        }
        case 'value': {
            console.info('> Reading input from command line value');
            const inputValue = argv.inputValue;
            if (inputValue === undefined) {
                err = new HighSealError('Expected input value to be specified');
            } else {
                input = inputValue;
            }
            break;
        }
        case 'file': {
            const { inputFile } = argv;
            console.info(`> Reading input from file "${inputFile}"`);
            if (inputFile === undefined) {
                err = new HighSealError('Expected input file to be specified');
            } else {
                try {
                    input = await fs.readFile(inputFile, 'utf8');
                } catch {
                    err = new HighSealError(`An error occurred reading file "${inputFile}"`);
                }
            }
            break;
        }
        case 'terminal': {
            console.info('> Prompting for input');
            input = await readInput('> Please enter the input: ');
            break;
        }
        case 'generate': {
            const generateLength = argv.inputGenerate ?? defaultGenerateLength;
            console.info(`> Generating random input of length ${generateLength}`);
            if (generateLength === undefined || generateLength < 1 || generateLength > Number.MAX_SAFE_INTEGER) {
                err = new HighSealError('Expected input generate length to be specified and valid');
            } else {
                let generated = '';
                while (generated.length < generateLength) {
                    generated += crypto.randomBytes(6).toString('base64').replace(/[+/]/g, '');
                }
                generated = generated.slice(0, generateLength);
                input = 'key_' + generated;
            }
            break;
        }
        default: {
            throw new Error(`Unrecognized input source "${inputSource}"`);
        }
    }
    return [err, input];
}