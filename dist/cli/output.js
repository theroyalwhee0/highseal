"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeOutput = exports.getOutputTarget = void 0;
const error_1 = require("./error");
const promises_1 = __importDefault(require("node:fs/promises"));
function getOutputTarget(argv) {
    if (argv.outputTerminal !== undefined) {
        return 'terminal';
    }
    else if (argv.outputFile !== undefined) {
        return 'file';
    }
    throw new Error(`Expected valid output target to be supplied.`);
}
exports.getOutputTarget = getOutputTarget;
async function writeOutput(argv, sealed) {
    let err;
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
                err = new error_1.HighSealError(`Expected output file to be specified`);
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