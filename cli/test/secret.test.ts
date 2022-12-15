import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ArgvShape } from '../src/argv';
import { getSecretSource } from '../src/secret';

describe('secret', () => {
    describe('getSecretSource', () => {
        it('should be a function', () => {
            expect(getSecretSource).to.be.a('function');
        });
        it('should support secret-value target', () => {
            const argv = {
                secretValue: 'password1',
            } as ArgvShape;
            const result = getSecretSource(argv);
            expect(result).to.equal('value');
        });
        it('should support secret-terminal target', () => {
            const argv = {
                secretTerminal: true,
            } as ArgvShape;
            const result = getSecretSource(argv);
            expect(result).to.equal('terminal');
        });
        it('should support secret-file target', () => {
            const argv = {
                secretFile: './secret.txt',
            } as ArgvShape;
            const result = getSecretSource(argv);
            expect(result).to.equal('file');
        });
        it('should default to secret-env if no other secret sources are specified', () => {
            const argv = {} as ArgvShape;
            const result = getSecretSource(argv);
            expect(result).to.equal('env');
        });
    });
});
