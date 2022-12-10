import { ArgvShape } from "./argv";
import { HighSealError } from "./error";
import fs from 'node:fs/promises';

export type OutputTarget = 'terminal' | 'file';

export function getOutputTarget(argv: ArgvShape): OutputTarget {
    if (argv.outputTerminal !== undefined) {
        return 'terminal';
    } else if (argv.outputFile !== undefined) {
        return 'file';
    }
    throw new Error(`Expected valid output target to be supplied.`);
}

export async function writeOutput(argv: ArgvShape, sealed: string): Promise<[Error | undefined]> {
    let err: Error | undefined;
    const outputTarget = getOutputTarget(argv);
    switch (outputTarget) {
        case 'terminal': {
            console.info(`> Writing output to terminal`);
            console.info('> Sealed Value:', sealed);
            break;
        }
        case 'file': {
            console.info(`> Writing output to file`);
            if (argv.outputFile === undefined) {
                err = new HighSealError(`Expected output file to be specified`);
            } else {
                try {
                    await fs.writeFile(argv.outputFile, sealed, 'utf8');
                } catch {
                    err = new HighSealError(`An error occurred writing file "${argv.outputFile}"`);
                }
            }
            break;
            break;
        }
        default: {
            throw new Error(`Unrecognized output target "${outputTarget}"`);
        }
    }
    return [err];
}