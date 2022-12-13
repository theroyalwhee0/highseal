"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgv = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const helpers_2 = require("./helpers");
function getArgv(value, exit = true) {
    value = value ?? process.argv;
    return (0, yargs_1.default)((0, helpers_1.hideBin)(value))
        .scriptName('highseal')
        .usage('Usage: $0 <command>')
        .command('seal [options]', 'Seal a value', (yargs) => {
        return yargs
            // General.
            .option('overwrite', {
            describe: 'Overwrite target key or file.',
            type: 'boolean',
            default: false,
        })
            .option('dotenv', {
            describe: 'Load environment variables from .env file.',
            type: 'boolean',
            default: true,
        })
            // Secret Source.
            .option('secret-env', {
            describe: 'Specify the name of the environment variable to get the secret from.',
            type: 'string',
        })
            .option('secret-value', {
            describe: 'Specify the secret value directly. This is not suggested as it may leak the secret to the system state.',
            type: 'string',
        })
            .option('secret-file', {
            describe: 'Specify that the secret should be read from a file.',
            type: 'string',
        })
            .option('secret-terminal', {
            describe: 'Specify that the secret should be read from the user terminal.',
            type: 'boolean',
        })
            .check((0, helpers_2.exclusiveOptions)('secret-env', 'secret-value', 'secret-file', 'secret-prompt'))
            // Input Source.
            .option('input-env', {
            describe: 'Specify the name of the environment variable to get the input from.',
            type: 'string',
        })
            .option('input-value', {
            describe: 'Specify the input value directly. This is not suggested as it may leak the secret to the system state.',
            type: 'string',
        })
            .option('input-file', {
            describe: 'Specify that the input should be read from a file.',
            type: 'string',
        })
            .option('input-terminal', {
            describe: 'Specify that the input should be read from the terminal.',
            type: 'boolean',
        })
            .option('input-generate', {
            describe: 'Specify that the input should be a generated secret.',
            type: 'number',
        })
            .check((0, helpers_2.demandExclusiveOptions)('input-env', 'input-value', 'input-file', 'input-terminal', 'input-generate'))
            // Output Target.
            .option('output-terminal', {
            describe: 'Specify that the results should be written to the terminal.',
            type: 'boolean',
        })
            .option('output-file', {
            describe: 'Specify that the input should be written to a file.',
            type: 'string',
        })
            .option('output-dotenv', {
            describe: 'Specify that the input should be written to a .env file.',
            type: 'string',
        })
            .check((0, helpers_2.demandExclusiveOptions)('output-terminal', 'output-file', 'output-dotenv'));
    })
        .command('unseal [options]', 'Unseal a value', (yargs) => {
        return yargs;
    })
        .demandCommand()
        .help()
        .alias('h', 'help')
        .exitProcess(exit)
        .strict()
        .parseSync();
}
exports.getArgv = getArgv;
//# sourceMappingURL=argv.js.map