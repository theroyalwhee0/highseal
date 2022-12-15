import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
    DotenvDocument, parseDotenv, readDotenv,
    serializeDotenv, setDotenvValue, writeDotenv,
} from '../src/dotenv';

describe('dotenv', () => {
    describe('parseDotenv', () => {
        it('should be a function', () => {
            expect(parseDotenv).to.be.a('function');
            expect(parseDotenv.length).to.equal(1);
        });
        it('should parse an empty dotenv', () => {
            const result = parseDotenv('');
            expect(result).to.be.an('array');
            expect(result.length).to.equal(2);
            const [err, document] = result;
            expect(err).to.equal(undefined);
            expect(document).to.eql({
                lines: [],
                mapping: {},
            });
        });
        it('should parse a simple dotenv', () => {
            const input = '# Marabou Stork\n' +
                'height=152\n' +
                'weight=9\n' +
                'wingspan="3.7 m"\n';
            const result = parseDotenv(input);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(2);
            const [err, document] = result;
            expect(err).to.equal(undefined);
            expect(document).to.eql({
                lines: [
                    '# Marabou Stork',
                    'height=152',
                    'weight=9',
                    'wingspan="3.7 m"',
                ],
                mapping: {
                    'height': 1,
                    'weight': 2,
                    'wingspan': 3,
                },
            });
        });
    });
    describe('serializeDotenv', () => {
        it('should be a function', () => {
            expect(serializeDotenv).to.be.a('function');
        });
        it('should serialize an empty dotenv', () => {
            const document: DotenvDocument = {
                lines: [],
                mapping: {},
            };
            const result = serializeDotenv(document);
            expect(result).to.be.a('string');
            expect(result).to.equal('');
        });
        it('should serialize a simple dotenv', () => {
            const document: DotenvDocument = {
                lines: [
                    '# Marabou Stork',
                    'height=152',
                    'weight=9',
                    'wingspan="3.7 m"',
                ],
                mapping: {
                    'height': 1,
                    'weight': 2,
                    'wingspan': 3,
                },
            };
            const result = serializeDotenv(document);
            expect(result).to.be.a('string');
            expect(result).to.equal(
                '# Marabou Stork\n' +
                'height=152\n' +
                'weight=9\n' +
                'wingspan="3.7 m"\n'
            );
        });
    });
    describe('setDotenvValue', () => {
        it('should be a function', () => {
            expect(setDotenvValue).to.be.a('function');
        });
        it('should append a new key to the document', () => {
            const document: DotenvDocument = {
                lines: [
                    '# Marabou Stork',
                    'height=152',
                    'weight=9',
                    'wingspan="3.7 m"',
                ],
                mapping: {
                    'height': 1,
                    'weight': 2,
                    'wingspan': 3,
                },
            };
            setDotenvValue(document, 'species', 'L. crumenifer');
            expect(document).to.eql({
                lines: [
                    '# Marabou Stork',
                    'height=152',
                    'weight=9',
                    'wingspan="3.7 m"',
                    'species=L. crumenifer',
                ],
                mapping: {
                    'height': 1,
                    'weight': 2,
                    'wingspan': 3,
                    'species': 4,
                },
            });
        });
        it('should overwrite an existing key in the document', () => {
            const document: DotenvDocument = {
                lines: [
                    '# Marabou Stork',
                    'species=unknown',
                    'height=152',
                    'weight=9',
                    'wingspan="3.7 m"',
                ],
                mapping: {
                    'species': 1,
                    'height': 2,
                    'weight': 3,
                    'wingspan': 4,
                },
            };
            setDotenvValue(document, 'species', 'L. crumenifer');
            expect(document).to.eql({
                lines: [
                    '# Marabou Stork',
                    'species=L. crumenifer',
                    'height=152',
                    'weight=9',
                    'wingspan="3.7 m"',
                ],
                mapping: {
                    'species': 1,
                    'height': 2,
                    'weight': 3,
                    'wingspan': 4,
                },
            });
        });
    });
    describe('readDotenv', () => {
        it('should be a function', () => {
            expect(readDotenv).to.be.a('function');
        });
    });
    describe('writeDotenv', () => {
        it('should be a function', () => {
            expect(writeDotenv).to.be.a('function');
        });
    });
});
