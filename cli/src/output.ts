import fs from 'node:fs/promises';
import { readDotenv, setDotenvValue, writeDotenv } from './dotenv';
import { ArgvShape } from './argv';
import { HighSealError } from './error';

export type OutputTarget = 'terminal' | 'file' | 'dotenv';

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

export async function writeOutput(argv: ArgvShape, sealed: string | undefined): Promise<[Error | undefined]> {
    let err: Error | undefined;
    const { overwrite } = argv;
    if (sealed === undefined) {
        err = new HighSealError('Expected sealed value to be a string');
    } else {
        const outputTarget = getOutputTarget(argv);
        switch (outputTarget) {
            case 'terminal': {
                console.info('> Writing output to terminal');
                console.info('> Sealed Value:', sealed);
                break;
            }
            case 'file': {
                console.info('> Writing output to file');
                if (argv.outputFile === undefined) {
                    err = new HighSealError('Expected output file to be specified');
                } else {
                    try {
                        await fs.writeFile(argv.outputFile, sealed, 'utf8');
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
                    setDotenvValue(config, key, sealed);
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