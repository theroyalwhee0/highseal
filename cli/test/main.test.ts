import { expect } from 'chai';
import { describe, it } from 'mocha';
import { main } from '../src/main';

describe('main', () => {
    it('should be a function', () => {
        expect(main).to.be.a('function');
        expect(main.length).to.equal(0);
    });
});
