import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ArgvShape } from '../src/argv';
import { getOutputTarget } from '../src/output';

describe('output', () => {
    describe('getOutputTarget', () => {
        it('should be a function', () => {
            expect(getOutputTarget).to.be.a('function');
        });
        it('should throw if no output target is supplied', () => {
            const argv = {} as ArgvShape;
            expect(() => {
                getOutputTarget(argv);
            }).to.throw(/Expected valid output target to be supplied/i);
        });
        it('should support output-terminal target', () => {
            const argv = {
                outputFile: './output.txt',
            } as ArgvShape;
            const result = getOutputTarget(argv);
            expect(result).to.equal('file');
        });
        it('should support output-terminal target', () => {
            const argv = {
                outputDotenv: '.env',
            } as ArgvShape;
            const result = getOutputTarget(argv);
            expect(result).to.equal('dotenv');
        });
        it('should support output-terminal target', () => {
            const argv = {
                outputTerminal: true,
            } as ArgvShape;
            const result = getOutputTarget(argv);
            expect(result).to.equal('terminal');
        });
    });
});
