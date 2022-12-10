import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { demandExclusiveOptions, exclusiveOptions } from './helpers';

export interface ArgvShape {
    [key: string]: unknown;
    _: (string)[];
    $0: string;
    // Secret Source.
    secretEnv: string, // This is the default secret source.
    secretValue?: string,
    secretFile?: string,
    secretTerminal?: boolean,
    // Input Source.
    inputEnv: string, // This is the default input source.
    inputValue?: string,
    inputFile?: string,
    inputTerminal?: boolean,
    // Output Target.
    outputTerminal?: boolean,
    outputFile?: string,
}

export function getArgv(value?: string[], exit = true): ArgvShape {
    value = value ?? process.argv;
    return yargs(hideBin(value))
        .scriptName('highseal')
        .usage('Usage: $0 <command>')
        .command('seal [options]', 'Seal a value',
            (yargs) => {
                return yargs
                    // Secret Source.
                    .option('secret-env', {
                        describe: 'Specify the name of the environment variable to get the secret from.',
                        type: 'string',
                    })
                    .option('secret-value', {
                        describe: 'Specify the secret value directly. This is not suggested as it may leak the secret to the system state.',
                        type: 'string'
                    })
                    .option('secret-file', {
                        describe: 'Specify that the secret should be read from a file.',
                        type: 'string'
                    })
                    .option('secret-terminal', {
                        describe: 'Specify that the secret should be pulled from the user terminal.',
                        type: 'boolean'
                    })
                    .check(exclusiveOptions('secret-env', 'secret-value', 'secret-file', 'secret-prompt'))
                    // Input Source.
                    .option('input-env', {
                        describe: 'Specify the name of the environment variable to get the input from.',
                        type: 'string'
                    })
                    .option('input-value', {
                        describe: 'Specify the input value directly. This is not suggested as it may leak the secret to the system state.',
                        type: 'string'
                    })
                    .option('input-file', {
                        describe: 'Specify that the input should be read from a file.',
                        type: 'string'
                    })
                    .option('input-terminal', {
                        describe: 'Specify that the input should be pulled from the terminal.',
                        type: 'boolean'
                    })
                    .check(demandExclusiveOptions('input-env', 'input-value', 'input-file', 'input-terminal'))
                    // Output Target.
                    .option('output-terminal', {
                        describe: 'Specify that the results should be written to the terminal.',
                        type: 'boolean'
                    })
                    .option('output-file', {
                        describe: 'Specify that the input should be read from a file.',
                        type: 'string'
                    })
                    .check(demandExclusiveOptions('output-terminal'))
                    ;
            })
        .command('unseal [options]', 'Unseal a value',
            (yargs) => {
                return yargs;
            })
        .demandCommand()
        .help()
        .alias('h', 'help')
        .exitProcess(exit)
        .strict()
        .parseSync() as ArgvShape;
}
