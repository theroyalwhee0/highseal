import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getArgv } from '../src/argv';
import { inspect } from './helpers';
import { mockCommandLineArgs } from './mock';

// NOTE: When testing the exit parameter (2nd parameter) of getArgv must be set
// to false or mocha will exit.

describe('argv', () => {
    describe('getArgv', () => {
        it('should be a function', () => {
            expect(getArgv).to.be.a('function');
        });
        it('should parse an empty command line', () => {
            const args: string[] = [];
            const input = mockCommandLineArgs(args);
            const [err, errOutput, result] = inspect(() => {
                return getArgv(input, false);
            });
            expect(err).to.be.an.instanceOf(Error);
            if (err) {
                expect(err.message).to.match(/Not enough non-option arguments/i);
            }
            expect(errOutput).to.be.an('array');
            expect(errOutput.join('\n')).to.match(/Not enough non-option arguments/i);
            expect(result).to.equal(undefined);
        });
        it('should parse an seal command line', () => {
            const args: string[] = [
                'seal',
                '--secret-value=marabou',
                '--input-value=stork',
                '--output-terminal',
            ];
            const input = mockCommandLineArgs(args);
            const [err, errOutput, result] = inspect(() => {
                return getArgv(input, false);
            });
            expect(err).to.equal(undefined);
            expect(errOutput).to.be.an('array');
            expect(result).to.eql({
                '$0': 'highseal',
                '_': [
                    'seal',
                ],
                'dotenv': true,
                'overwrite': false,
                'secretValue': 'marabou',
                'secret-value': 'marabou',
                'inputValue': 'stork',
                'input-value': 'stork',
                'outputTerminal': true,
                'output-terminal': true,
            });
        });
        it('should fail if multiple exclusive flags are given', () => {
            const args: string[] = [
                'seal',
                '--secret-env',
                '--secret-value=marabou',
                '--input-value=stork',
                '--output-terminal',
            ];
            const input = mockCommandLineArgs(args);
            const [err, errOutput, result] = inspect(() => {
                return getArgv(input, false);
            });
            expect(err).to.be.an.instanceOf(Error);
            if (err) {
                expect(err.message).to.match(/Arguments secret-env, .+ are mutually exclusive/i);
            }
            expect(errOutput).to.be.an('array');
            expect(errOutput.join('\n')).to.match(/Arguments secret-env, .+ are mutually exclusive/i);
            expect(result).to.equal(undefined);
        });
    });
});