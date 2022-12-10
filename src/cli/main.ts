
import { seal, unseal } from "..";
import { getArgv } from "./argv";
import { HighSealError } from "./error";
import { getInput } from "./input";
import { writeOutput } from "./output";
import { getSecret } from './secret';

export async function main() {
    try {
        // Get command line.
        const argv = getArgv();
        // Get the secret.
        const [err, secret] = await getSecret(argv);
        if (err) {
            throw err;
        }
        // Get the command.
        const command = argv._.length === 1 ? argv._[0] : undefined;
        if (!command) {
            throw new Error(`There should be one command specified`);
        }
        // Process the command.
        switch (command) {
            case 'seal': {
                // Process seal commands.
                const [err, unsealed] = await getInput(argv);
                if (err) {
                    throw err;
                }
                const sealed = seal(unsealed, secret);
                await writeOutput(argv, sealed);
                break;
            }
            case 'unseal': {
                // Process unseal commands.
                const [err, sealed] = await getInput(argv);
                if (err) {
                    throw err;
                }
                const unsealed = unseal(sealed, secret);
                console.log("@@ unsealed:", err, unsealed);
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
    console.info('> Done')
    return process.exit(0);
}