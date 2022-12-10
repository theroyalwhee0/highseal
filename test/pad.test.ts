import { expect } from 'chai';
import { describe, it } from 'mocha';
import { padValue } from '../src/pad';

function arrayOf(length: number) {
    return Array(length).fill(length);
}

describe('pad', () => {
    describe('padValue', () => {
        it('should be a function', () => {
            expect(padValue).to.be.a('function');
        });
        it('should pad zero byte value', () => {
            const result = padValue('');
            expect(result).to.be.instanceOf(Buffer);
            expect(result.length).to.equal(32);
            expect(Array.from(result)).to.eql(
                arrayOf(32),
            );
        });
        it('should pad one byte value', () => {
            const result = padValue('A');
            expect(result).to.be.instanceOf(Buffer);
            expect(result.length).to.equal(32);
            expect(Array.from(result)).to.eql([
                65, // Content
                ...arrayOf(31), // Padding
            ]);
        });
        it('should pad seven byte value', () => {
            const result = padValue('Rabbits');
            expect(result).to.be.instanceOf(Buffer);
            expect(result.length).to.equal(32);
            expect(Array.from(result)).to.eql([
                82, 97, 98, 98, 105, 116, 115, // Content
                ...arrayOf(25), // Padding
            ]);
        });
        it('should pad eight byte value', () => {
            const result = padValue('Flapjack');
            expect(result).to.be.instanceOf(Buffer);
            expect(result.length).to.equal(32);
            expect(Array.from(result)).to.eql([
                70, 108, 97, 112, 106, 97, 99, 107, // Content
                ...arrayOf(24) // Padding
            ]);
        });
        it('should pad always values', () => {
            for (let idx = 0; idx < 150; idx++) {
                const value = '.'.repeat(idx);
                const result = padValue(value);
                expect(result).to.be.instanceOf(Buffer);
                expect(result.length).to.be.greaterThan(idx);
                expect(result.length % 8).to.equal(0);
                const last = result.at(-1);
                expect(last).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(32);
            }
        });
    });
});