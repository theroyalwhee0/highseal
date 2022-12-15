"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const highseal_1 = require("@theroyalwhee0/highseal");
const dotenv = __importStar(require("dotenv"));
const argv_1 = require("./argv");
const error_1 = require("./error");
const input_1 = require("./input");
const output_1 = require("./output");
const secret_1 = require("./secret");
async function main() {
    try {
        // Get command line.
        const argv = (0, argv_1.getArgv)();
        // Load configuration.
        if (argv.dotenv) {
            dotenv.config();
        }
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
                const [unsealErr, unsealed] = (0, highseal_1.unseal)(sealed, secret);
                if (unsealErr || unsealed === undefined) {
                    throw new error_1.HighSealError(`Unable to unseal the given value.`);
                }
                const [outputErr] = await (0, output_1.writeOutput)(argv, unsealed);
                if (outputErr) {
                    throw outputErr;
                }
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