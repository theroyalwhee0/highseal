"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeOutput = exports.getOutputTarget = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const dotenv_1 = require("./dotenv");
const error_1 = require("./error");
function getOutputTarget(argv) {
    if (argv.outputTerminal !== undefined) {
        return 'terminal';
    }
    else if (argv.outputFile !== undefined) {
        return 'file';
    }
    else if (argv.outputDotenv !== undefined) {
        return 'dotenv';
    }
    throw new Error('Expected valid output target to be supplied.');
}
exports.getOutputTarget = getOutputTarget;
async function writeOutput(argv, sealed) {
    let err;
    const { overwrite } = argv;
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
                err = new error_1.HighSealError('Expected output file to be specified');
            }
            else {
                try {
                    await promises_1.default.writeFile(argv.outputFile, sealed, 'utf8');
                }
                catch {
                    err = new error_1.HighSealError(`An error occurred writing file "${argv.outputFile}"`);
                }
            }
            break;
        }
        case 'dotenv': {
            console.info('> Writing output to dotenv file');
            const key = argv.outputDotenv;
            if (key === undefined) {
                err = new error_1.HighSealError('Expected dotenv file key to be specified');
            }
            else {
                const [_err, config] = await (0, dotenv_1.readDotenv)();
                if (key in config.mapping) {
                    if (overwrite) {
                        console.warn(`> Overwriting key "${key}" in dotfile`);
                    }
                    else {
                        err = new error_1.HighSealError(`Key "${key}" already defined in dotfile`);
                        break;
                    }
                }
                (0, dotenv_1.setDotenvValue)(config, key, sealed);
                try {
                    await (0, dotenv_1.writeDotenv)(config);
                }
                catch {
                    err = new error_1.HighSealError('An error occurred writing dotenv file');
                }
            }
            break;
        }
        default: {
            throw new Error(`Unrecognized output target "${outputTarget}"`);
        }
    }
    return [err];
}
exports.writeOutput = writeOutput;
//# sourceMappingURL=output.js.map