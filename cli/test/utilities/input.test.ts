import { expect } from 'chai';
import { describe, it } from 'mocha';
import { readInput } from '../../src/utilities/input';

describe('input utility', () => {
    describe('readInput', () => {
        it('should be a function', () => {
            expect(readInput).to.be.a('function');
        });
    });
});
