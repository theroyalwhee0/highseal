import { expect } from 'chai';
import { describe, it } from 'mocha';
import { exclusiveOptions, demandExclusiveOptions } from '../../src/utilities/yargs';

describe('yargs utility', () => {
    describe('exclusiveOptions', () => {
        it('should be a function', () => {
            expect(exclusiveOptions).to.be.a('function');
        });
    });
    describe('demandExclusiveOptions', () => {
        it('should be a function', () => {
            expect(demandExclusiveOptions).to.be.a('function');
        });
    });
});
