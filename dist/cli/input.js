"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInput = exports.getInputSource = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const error_1 = require("./error");
const helpers_1 = require("./helpers");
function getInputSource(argv) {
    if (argv.inputValue !== undefined) {
        return 'value';
    }
    else if (argv.inputFile !== undefined) {
        return 'file';
    }
    else if (argv.inputTerminal !== undefined) {
        return 'terminal';
    }
    return 'env';
}
exports.getInputSource = getInputSource;
async function getInput(argv) {
    const inputSource = getInputSource(argv);
    let err;
    let input = '';
    switch (inputSource) {
        case 'env': {
            const inputEnvName = argv.inputEnv ?? 'HISE_INPUT';
            console.info(`> Pulling input from environment variable '${inputEnvName}'`);
            const inputEnv = process.env[inputEnvName];
            if (inputEnv === undefined) {
                err = new error_1.HighSealError(`Environment variable '${inputEnvName}' is undefined.`);
            }
            else {
                input = inputEnv;
            }
            break;
        }
        case 'value': {
            console.info(`> Pulling input from command line value`);
            const inputValue = argv.inputValue;
            if (inputValue === undefined) {
                err = new error_1.HighSealError(`Expected input value to be specified`);
            }
            else {
                input = inputValue;
            }
            break;
        }
        case 'file': {
            console.info(`> Pulling input from file`);
            if (argv.inputFile === undefined) {
                err = new error_1.HighSealError(`Expected input file to be specified`);
            }
            else {
                try {
                    input = await promises_1.default.readFile(argv.inputFile, 'utf8');
                }
                catch {
                    err = new error_1.HighSealError(`An error occurred reading file "${argv.inputFile}"`);
                }
            }
            break;
        }
        case 'terminal': {
            console.info(`> Prompting for input`);
            input = await (0, helpers_1.readInput)('> Please enter the input: ');
            break;
        }
        default: {
            throw new Error(`Unrecognized input source "${inputSource}"`);
        }
    }
    return [err, input];
}
exports.getInput = getInput;
//# sourceMappingURL=input.js.map