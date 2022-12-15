import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ArgvShape } from '../src/argv';
import { getInputSource } from '../src/input';

describe('input', () => {
    describe('getInputSource', () => {
        it('should be a function', () => {
            expect(getInputSource).to.be.a('function');
        });
        it('should support input-value target', () => {
            const argv = {
                inputValue: 'password1',
            } as ArgvShape;
            const result = getInputSource(argv);
            expect(result).to.equal('value');
        });
        it('should support input-terminal target', () => {
            const argv = {
                inputTerminal: true,
            } as ArgvShape;
            const result = getInputSource(argv);
            expect(result).to.equal('terminal');
        });
        it('should support input-file target', () => {
            const argv = {
                inputFile: './input.txt',
            } as ArgvShape;
            const result = getInputSource(argv);
            expect(result).to.equal('file');
        });
        it('should support input-generate target', () => {
            const argv = {
                inputGenerate: 20,
            } as ArgvShape;
            const result = getInputSource(argv);
            expect(result).to.equal('generate');
        });
        it('should default to input-env if no other input sources are specified', () => {
            const argv = {} as ArgvShape;
            const result = getInputSource(argv);
            expect(result).to.equal('env');
        });
    });
});
