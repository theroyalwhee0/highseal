"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const highseal_1 = require("@theroyalwhee0/highseal");
const argv_1 = require("./argv");
const error_1 = require("./error");
const input_1 = require("./input");
const output_1 = require("./output");
const secret_1 = require("./secret");
async function main() {
    try {
        // Get command line.
        const argv = (0, argv_1.getArgv)();
        // Get the secret.
        const [err, secret] = await (0, secret_1.getSecret)(argv);
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
                const [inputErr, unsealed] = await (0, input_1.getInput)(argv);
                if (inputErr) {
                    throw inputErr;
                }
                const sealed = (0, highseal_1.seal)(unsealed, secret);
                const [outputErr] = await (0, output_1.writeOutput)(argv, sealed);
                if (outputErr) {
                    throw outputErr;
                }
                break;
            }
            case 'unseal': {
                // Process unseal commands.
                const [err, sealed] = await (0, input_1.getInput)(argv);
                if (err) {
                    throw err;
                }
                const _unsealed = (0, highseal_1.unseal)(sealed, secret);
                break;
            }
        }
    }
    catch (err) {
        if (error_1.HighSealError.isHighSealError(err)) {
            console.error(`> ERROR: ${err.message}`);
            return process.exit(1);
        }
        else {
            throw err;
        }
    }
    console.info('> Done');
    return process.exit(0);
}
exports.main = main;
//# sourceMappingURL=main.js.map