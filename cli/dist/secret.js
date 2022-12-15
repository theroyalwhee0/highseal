"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = exports.getSecretSource = exports.re_valid_secret = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const error_1 = require("./error");
const input_1 = require("./utilities/input");
exports.re_valid_secret = /^.{10,}$/m;
function getSecretSource(argv) {
    if (argv.secretValue !== undefined) {
        return 'value';
    }
    else if (argv.secretFile !== undefined) {
        return 'file';
    }
    else if (argv.secretTerminal !== undefined) {
        return 'terminal';
    }
    return 'env';
}
exports.getSecretSource = getSecretSource;
async function getSecret(argv) {
    const secretSource = getSecretSource(argv);
    let err;
    let secret = '';
    switch (secretSource) {
        case 'env': {
            const secretEnvName = argv.secretEnv ?? 'HISE_SECRET';
            console.info(`> Pulling secret from environment variable "${secretEnvName}"`);
            const secretEnv = process.env[secretEnvName];
            if (secretEnv === undefined) {
                err = new error_1.HighSealError(`Environment variable "${secretEnvName}" is undefined`);
            }
            else {
                secret = secretEnv;
            }
            break;
        }
        case 'value': {
            console.info('> Pulling secret from command line value');
            const secretValue = argv.secretValue;
            if (secretValue === undefined) {
                err = new error_1.HighSealError('Expected secret value to be specified');
            }
            else {
                secret = secretValue;
            }
            break;
        }
        case 'file': {
            console.log('> Pulling secret from file');
            if (argv.secretFile === undefined) {
                err = new error_1.HighSealError('Expected secret file to be specified');
            }
            else {
                try {
                    secret = await promises_1.default.readFile(argv.secretFile, 'utf8');
                }
                catch {
                    err = new error_1.HighSealError(`An error occurred reading file "${argv.secretFile}"`);
                }
            }
            break;
        }
        case 'terminal': {
            console.info('> Prompting for secret');
            secret = await (0, input_1.readInput)('> Please enter the secret: ');
            break;
        }
        default: {
            throw new Error(`Unrecognized secret source "${secretSource}"`);
        }
    }
    if (!err && !exports.re_valid_secret.test(secret)) {
        err = new error_1.HighSealError('Secret is required and must be at least 10 characters');
    }
    return [err, secret];
}
exports.getSecret = getSecret;
//# sourceMappingURL=secret.js.map