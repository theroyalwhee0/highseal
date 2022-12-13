import { expect } from 'chai';
import { describe, it } from 'mocha';
import { unseal } from '../src/unseal';

describe('unseal', () => {
    it('should be a function', () => {
        expect(unseal).to.be.a('function');
    });
    it('should unseal an empty value', () => {
        const secret = 'marabou stork';
        const sealed = 'A.9DXhmSdywgfFt+Jta0uIaQ.ABWSkxaLf4oAwwFq.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM';
        const result = unseal(sealed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(false);
        expect(value).to.equal('');
    });
    it('should unseal a value smaller than minimum padding', () => {
        const secret = 'marabou stork';
        const sealed = 'A.d6W3PyrUh6DdJ2GfKC0hAQ.ABWSoStmRYlIBaDb.MSjvAT3cyg/asL2/TAGWDzBIGG5dBg5F2K32OyifkiA';
        const result = unseal(sealed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(false);
        expect(value).to.equal('stork family');
    });
    it('should unseal a value larger than minimum padding', () => {
        const secret = 'marabou stork';
        const sealed = 'A.OnqEwy9m5g7xbr0/mfQ+Cg.ABWSofwLVz7YqNet.bg0aWzvIALhE13bBq3zJiqtXGdSugifSVXl9dz7wRksfUjfRTGWq6Y1IS3CELGCFcppvS5BG9yHRgjjdiksi1A';
        const result = unseal(sealed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(false);
        expect(value).to.equal('The marabou stork is a large wading bird in the stork family');
    });
    it('should fail to unseal given wrong password', () => {
        const wrongSecret = 'few natural enemies';
        const sealed = 'A.9DXhmSdywgfFt+Jta0uIaQ.ABWSkxaLf4oAwwFq.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM';
        const result = unseal(sealed, wrongSecret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(true);
        expect(value).to.equal('');
    });
    it('should fail to unseal given corrupted AuthTag', () => {
        const secret = 'marabou stork';
        const corruptedAuthTag = '++XhmSdywgfFt+Jta0uIa'; // Originally '9DXhmSdywgfFt+Jta0uIaQ'
        const malformed = `A.${corruptedAuthTag}.ABWSkxaLf4oAwwFq.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM`;
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(true);
        expect(value).to.equal('');
    });
    it('should fail to unseal given shortened AuthTag', () => {
        const secret = 'marabou stork';
        const corruptedAuthTag = '9DXhmSdywg'; // Originally '9DXhmSdywgfFt+Jta0uIaQ'
        const malformed = `A.${corruptedAuthTag}.ABWSkxaLf4oAwwFq.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM`;
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(true);
        expect(value).to.equal('');
    });
    it('should fail to unseal given corrupted IV', () => {
        const secret = 'marabou stork';
        const corruptedIV = '++WSkxaLf4oAwwFq'; // Originally 'ABWSkxaLf4oAwwFq'
        const malformed = `A.9DXhmSdywgfFt+Jta0uIaQ.${corruptedIV}.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM`;
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(true);
        expect(value).to.equal('');
    });
    it('should fail to unseal given shortened IV', () => {
        const secret = 'marabou stork';
        const corruptedIV = 'ABWSkxaL'; // Originally 'ABWSkxaLf4oAwwFq'
        const malformed = `A.9DXhmSdywgfFt+Jta0uIaQ.${corruptedIV}.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM`;
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(true);
        expect(value).to.equal('');
    });
    it('should fail to unseal given corrupted Content', () => {
        const secret = 'marabou stork';
        const corruptedContent = '++e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM'; // Originally 'o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM'
        const malformed = `A.9DXhmSdywgfFt+Jta0uIaQ.ABWSkxaLf4oAwwFq.${corruptedContent}`;
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(true);
        expect(value).to.equal('');
    });
    it('should fail to unseal given malformed input', () => {
        const secret = 'marabou stork';
        // The thrid '.' was removed.
        const malformed = 'A.9DXhmSdywgfFt+Jta0uIaQ.ABWSkxaLf4oAwwFqo2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM';
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(true);
        expect(value).to.equal('');
    });
    it('should fail to unseal given invalid version', () => {
        const secret = 'marabou stork';
        // Version 'A' was replaced with '+'.
        const malformed = '+.9DXhmSdywgfFt+Jta0uIaQ.ABWSkxaLf4oAwwFqo2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM';
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(true);
        expect(value).to.equal('');
    });
});
