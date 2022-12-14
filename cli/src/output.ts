import fs from 'node:fs/promises';
import { readDotenv, setDotenvValue, writeDotenv } from './dotenv';
import { ArgvShape } from './argv';
import { HighSealError } from './error';

/**
 * Types of output targets.
 */
export type OutputTarget = 'terminal' | 'file' | 'dotenv';

/**
 * Get the output target from argv.
 * @param argv The argv to use.
 * @returns The output target.
 */
export function getOutputTarget(argv: ArgvShape): OutputTarget {
    if (argv.outputTerminal !== undefined) {
        return 'terminal';
    } else if (argv.outputFile !== undefined) {
        return 'file';
    } else if (argv.outputDotenv !== undefined) {
        return 'dotenv';
    }
    throw new Error('Expected valid output target to be supplied.');
}

export async function writeOutput(argv: ArgvShape, value: string | undefined): Promise<[Error | undefined]> {
    let err: Error | undefined;
    const { overwrite } = argv;
    if (value === undefined) {
        err = new HighSealError('Expected output value to be a string');
    } else {
        const outputTarget = getOutputTarget(argv);
        switch (outputTarget) {
            case 'terminal': {
                console.info('> Writing output to terminal');
                console.info('> Value:', value);
                break;
            }
            case 'file': {
                console.info('> Writing output to file');
                if (argv.outputFile === undefined) {
                    err = new HighSealError('Expected output file to be specified');
                } else {
                    try {
                        await fs.writeFile(argv.outputFile, value, 'utf8');
                    } catch {
                        err = new HighSealError(`An error occurred writing file "${argv.outputFile}"`);
                    }
                }
                break;
            }
            case 'dotenv': {
                console.info('> Writing output to dotenv file');
                const key = argv.outputDotenv;
                if (key === undefined) {
                    err = new HighSealError('Expected dotenv file key to be specified');
                } else {
                    const [_err, config] = await readDotenv();
                    if (key in config.mapping) {
                        if (overwrite) {
                            console.warn(`> Overwriting key "${key}" in dotfile`);
                        } else {
                            err = new HighSealError(`Key "${key}" already defined in dotfile`);
                            break;
                        }
                    }
                    setDotenvValue(config, key, value);
                    try {
                        await writeDotenv(config);
                    } catch {
                        err = new HighSealError('An error occurred writing dotenv file');
                    }
                }
                break;
            }
            default: {
                throw new Error(`Unrecognized output target "${outputTarget}"`);
            }
        }
    }
    return [err];
}