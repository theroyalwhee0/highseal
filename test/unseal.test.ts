import { expect } from 'chai';
import { describe, it } from 'mocha';
import { unseal } from '../src/unseal';

// NOTE: See unseal-deprecated.test.ts for deprecated seal versions.

describe('unseal', () => {
    it('should be a function', () => {
        expect(unseal).to.be.a('function');
    });
    it('should unseal an empty value', () => {
        const secret = 'marabou stork';
        const sealed = 'B.cOe0e/HEfA6Ao7j7rzjwgQ.ABXCBD5NYHr4lvlp.LtpCMzPk7yi2bPq/c0VPGBW3MgNGOF3zKEq2JQEZvH8';
        const result = unseal(sealed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(undefined);
        expect(value).to.equal('');
    });
    it('should unseal a value smaller than minimum padding', () => {
        const secret = 'marabou stork';
        const sealed = 'B.jqlL0Y4p93Ld1zw6++fGlg.ABXCBSZAIs1Di0+U.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U';
        const result = unseal(sealed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(undefined);
        expect(value).to.equal('stork family');
    });
    it('should unseal a value with a prefix', () => {
        const secret = 'marabou stork';
        const sealed = 'highseal://B.jqlL0Y4p93Ld1zw6++fGlg.ABXCBSZAIs1Di0+U.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U';
        const result = unseal(sealed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(undefined);
        expect(value).to.equal('stork family');
    });
    it('should unseal a value larger than minimum padding', () => {
        const secret = 'marabou stork';
        const sealed = 'B.Y2j7r5vURzn2uaq5YBNvjA.ABXCBZ4H2i3wwqWK.bZsXchluxpJBQ4OlUrYKL1emvt05+MAroyGRctO50zOZuCgBh+uRX6VY8hP4KxB8Ud6MgBZTncSUmQnR9vDr4Q';
        const result = unseal(sealed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.equal(undefined);
        expect(value).to.equal('The marabou stork is a large wading bird in the stork family');
    });
    it('should fail to unseal given wrong password', () => {
        const wrongSecret = 'few natural enemies';
        const sealed = 'B.jqlL0Y4p93Ld1zw6++fGlg.ABXCBSZAIs1Di0+U.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U';
        const result = unseal(sealed, wrongSecret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.be.an.instanceOf(Error);
        expect(err?.message).to.match(/Unsupported state or unable to authenticate/);
        expect(value).to.equal('');
    });
    it('should fail to unseal given corrupted AuthTag', () => {
        const secret = 'marabou stork';
        const originalAuthTag = 'jqlL0Y4p93Ld1zw6++fGlg';
        const corruptedAuthTag = '++' + originalAuthTag.slice(2);
        const malformed = `B.${corruptedAuthTag}.ABXCBSZAIs1Di0+U.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U`;
        expect(corruptedAuthTag.length).to.equal(originalAuthTag.length);
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.be.an.instanceOf(Error);
        expect(err?.message).to.match(/Unsupported state or unable to authenticate/);
        expect(value).to.equal('');
    });
    it('should fail to unseal given shortened AuthTag', () => {
        const secret = 'marabou stork';
        const originalAuthTag = 'jqlL0Y4p93Ld1zw6++fGlg';
        const corruptedAuthTag = originalAuthTag.slice(0, 10);
        const malformed = `B.${corruptedAuthTag}.ABXCBSZAIs1Di0+U.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U`;
        expect(corruptedAuthTag.length).to.lessThan(originalAuthTag.length);
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.be.an.instanceOf(Error);
        expect(err?.message).to.match(/Invalid formatting/);
        expect(value).to.equal('');
    });
    it('should fail to unseal given corrupted IV', () => {
        const secret = 'marabou stork';
        const originalIV = 'ABXCBSZAIs1Di0+U';
        const corruptedIV = '++' + originalIV.slice(2);
        const malformed = `B.jqlL0Y4p93Ld1zw6++fGlg.${corruptedIV}.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U`;
        expect(corruptedIV.length).to.equal(originalIV.length);
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.be.an.instanceOf(Error);
        expect(err?.message).to.match(/Unsupported state or unable to authenticate/);
        expect(value).to.equal('');
    });
    it('should fail to unseal given shortened IV', () => {
        const secret = 'marabou stork';
        const originalIV = 'ABXCBSZAIs1Di0+U';
        const corruptedIV = originalIV.slice(0, 10);
        const malformed = `B.jqlL0Y4p93Ld1zw6++fGlg.${corruptedIV}.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U`;
        expect(corruptedIV.length).to.lessThan(originalIV.length);
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.be.an.instanceOf(Error);
        expect(err?.message).to.match(/Invalid formatting/);
        expect(value).to.equal('');
    });
    it('should fail to unseal given corrupted Content', () => {
        const secret = 'marabou stork';
        const originalContent = 'kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U';
        const corruptedContent = '++' + originalContent.slice(2);
        const malformed = `B.jqlL0Y4p93Ld1zw6++fGlg.ABXCBSZAIs1Di0+U.${corruptedContent}`;
        expect(corruptedContent.length).to.equal(originalContent.length);
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.be.an.instanceOf(Error);
        expect(err?.message).to.match(/Unsupported state or unable to authenticate/);
        expect(value).to.equal('');
    });
    it('should fail to unseal given malformed input', () => {
        const secret = 'marabou stork';
        const original = 'B.jqlL0Y4p93Ld1zw6++fGlg.ABXCBSZAIs1Di0+U.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U';
        // The thrid '.' was removed.
        const malformed = original.replace(/\+U\.ky/, '+Uky');
        expect(malformed.length + 1).to.equal(original.length);
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.be.an.instanceOf(Error);
        expect(err?.message).to.match(/Invalid formatting/);
        expect(value).to.equal('');
    });
    it('should fail to unseal given invalid version', () => {
        const secret = 'marabou stork';
        const original = 'B.jqlL0Y4p93Ld1zw6++fGlg.ABXCBSZAIs1Di0+U.kyUx0IIQOjJZ3ukpsCsQCGNDMF23NOzCgmuQ+M1Np+U';
        // Version 'B' was replaced with '+'.
        const malformed = original.replace(/^B/, '+');
        const result = unseal(malformed, secret);
        expect(result).to.be.an('array');
        expect(result.length).to.equal(2);
        const [err, value] = result;
        expect(err).to.be.an.instanceOf(Error);
        expect(err?.message).to.match(/Invalid formatting/);
        expect(value).to.equal('');
    });
});
