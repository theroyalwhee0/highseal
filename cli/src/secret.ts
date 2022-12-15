import fs from 'node:fs/promises';
import { ArgvShape } from './argv';
import { HighSealError } from './error';
import { readInput } from './utilities/input';

export type SecretSource = 'env' | 'value' | 'file' | 'terminal';

export const re_valid_secret = /^.{10,}$/m;

export function getSecretSource(argv: ArgvShape): SecretSource {
    if (argv.secretValue !== undefined) {
        return 'value';
    } else if (argv.secretFile !== undefined) {
        return 'file';
    } else if (argv.secretTerminal !== undefined) {
        return 'terminal';
    }
    return 'env';
}

export async function getSecret(argv: ArgvShape): Promise<[Error | undefined, string]> {
    const secretSource = getSecretSource(argv);
    let err: Error | undefined;
    let secret = '';
    switch (secretSource) {
        case 'env': {
            const secretEnvName = argv.secretEnv ?? 'HISE_SECRET';
            console.info(`> Pulling secret from environment variable "${secretEnvName}"`);
            const secretEnv = process.env[secretEnvName];
            if (secretEnv === undefined) {
                err = new HighSealError(`Environment variable "${secretEnvName}" is undefined`);
            } else {
                secret = secretEnv;
            }
            break;
        }
        case 'value': {
            console.info('> Pulling secret from command line value');
            const secretValue = argv.secretValue;
            if (secretValue === undefined) {
                err = new HighSealError('Expected secret value to be specified');
            } else {
                secret = secretValue;
            }
            break;
        }
        case 'file': {
            console.log('> Pulling secret from file');
            if (argv.secretFile === undefined) {
                err = new HighSealError('Expected secret file to be specified');
            } else {
                try {
                    secret = await fs.readFile(argv.secretFile, 'utf8');
                } catch {
                    err = new HighSealError(`An error occurred reading file "${argv.secretFile}"`);
                }
            }
            break;
        }
        case 'terminal': {
            console.info('> Prompting for secret');
            secret = await readInput('> Please enter the secret: ');
            break;
        }
        default: {
            throw new Error(`Unrecognized secret source "${secretSource}"`);
        }
    }
    if (!err && !re_valid_secret.test(secret)) {
        err = new HighSealError('Secret is required and must be at least 10 characters');
    }
    return [err, secret];
}