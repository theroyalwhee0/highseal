"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInput = exports.getInputSource = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_crypto_1 = __importDefault(require("node:crypto"));
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
    else if (argv.inputGenerate !== undefined) {
        return 'generate';
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
            console.info(`> Reading input from environment variable '${inputEnvName}'`);
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
            console.info('> Reading input from command line value');
            const inputValue = argv.inputValue;
            if (inputValue === undefined) {
                err = new error_1.HighSealError('Expected input value to be specified');
            }
            else {
                input = inputValue;
            }
            break;
        }
        case 'file': {
            const { inputFile } = argv;
            console.info(`> Reading input from file "${inputFile}"`);
            if (inputFile === undefined) {
                err = new error_1.HighSealError('Expected input file to be specified');
            }
            else {
                try {
                    input = await promises_1.default.readFile(inputFile, 'utf8');
                }
                catch {
                    err = new error_1.HighSealError(`An error occurred reading file "${inputFile}"`);
                }
            }
            break;
        }
        case 'terminal': {
            console.info('> Prompting for input');
            input = await (0, helpers_1.readInput)('> Please enter the input: ');
            break;
        }
        case 'generate': {
            const generateLength = argv.inputGenerate;
            console.info(`> Generating random input of length ${generateLength}`);
            if (generateLength === undefined || generateLength < 1 || generateLength > Number.MAX_SAFE_INTEGER) {
                err = new error_1.HighSealError('Expected input generate length to be specified and valid');
            }
            else {
                let generated = '';
                while (generated.length < generateLength) {
                    generated += node_crypto_1.default.randomBytes(6).toString('base64').replace(/[+/]/g, '');
                }
                generated = generated.slice(0, generateLength);
                input = 'key_' + generated;
            }
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