import { PassThrough } from 'node:stream';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { readInput } from '../../src/utilities/input';

describe('input utility', () => {
    describe('readInput', () => {
        it('should be a function', () => {
            expect(readInput).to.be.a('function');
        });
        it('should read a value', async () => {
            const output = new PassThrough();
            const input = new PassThrough();
            let writeData = '';
            output.on('data', (buffer: Buffer) => {
                writeData += buffer.toString();
            });
            input.write('Marabou frequently follow vultures');
            input.end();
            const result = await readInput('Feeding', {
                input, output,
            });
            expect(result).to.equal('Marabou frequently follow vultures');
            expect(writeData).to.equal('Feeding');
        });
    });
});
