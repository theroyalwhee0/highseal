
import { seal, unseal } from '@theroyalwhee0/highseal';
import * as dotenv from 'dotenv';
import { getArgv } from './argv';
import { HighSealError } from './error';
import { getInput } from './input';
import { writeOutput } from './output';
import { getSecret } from './secret';

export async function main() {
    try {
        // Get command line.
        const argv = getArgv();
        // Load configuration.
        if (argv.dotenv) {
            dotenv.config();
        }
        // Get the secret.
        const [err, secret] = await getSecret(argv);
        if (err) {
            throw err;
        }
        // Get the command.
        const command = argv._.length === 1 ? argv._[0] : undefined;
        if (!command) {
            throw new Error('There should be one command specified');
        }
        // Process the command.
        switch (command) {
            case 'seal': {
                // Process seal commands.
                const [inputErr, unsealed] = await getInput(argv);
                if (inputErr) {
                    throw inputErr;
                }
                const sealed = seal(unsealed, secret);
                const [outputErr] = await writeOutput(argv, sealed);
                if (outputErr) {
                    throw outputErr;
                }
                break;
            }
            case 'unseal': {
                // Process unseal commands.
                const [err, sealed] = await getInput(argv);
                if (err) {
                    throw err;
                }
                const [unsealErr, unsealed] = unseal(sealed, secret);
                if (unsealErr || unsealed === undefined) {
                    throw new HighSealError('Unable to unseal the given value.');
                }
                const [outputErr] = await writeOutput(argv, unsealed);
                if (outputErr) {
                    throw outputErr;
                }
                break;
            }
        }
    } catch (err) {
        if (HighSealError.isHighSealError(err)) {
            console.error(`> ERROR: ${err.message}`);
            return process.exit(1);
        } else {
            throw err;
        }
    }
    console.info('> Done');
    return process.exit(0);
}