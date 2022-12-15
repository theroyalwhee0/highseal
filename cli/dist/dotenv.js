"use strict";
/**
 * Q: Why not use the dotenv library?
 * A: The goal here is to be able to add to or override individual keys and
 * write them back out to a file. Reading the dotenv file with the dotenv library
 * would discard the comments and reformat lines.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeDotenv = exports.setDotenvValue = exports.parseDotenv = exports.writeDotenv = exports.readDotenv = exports.re_parse = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Parse the key from a line.
 */
exports.re_parse = /^([\w.-]+)(?:\s*=\s*?|:\s+?)/;
/**
 * Read a dotenv file getting it's keys without throwing away or
 * resolving any values or lines.
 * @returns A tuple with an error if one occured and the parsed dotenv
 * document.
 */
async function readDotenv() {
    try {
        const filePath = node_path_1.default.resolve(process.cwd(), '.env');
        const content = await promises_1.default.readFile(filePath, 'utf8');
        return parseDotenv(content);
    }
    catch (err) {
        const document = {
            lines: [],
            mapping: {},
        };
        return [err, document];
    }
}
exports.readDotenv = readDotenv;
/**
 * Write the dotenv document out to a dotenv file inth current working
 * directory.
 * @param document The dotenv document.
 */
async function writeDotenv(document) {
    const output = serializeDotenv(document);
    const filePath = node_path_1.default.resolve(process.cwd(), '.env');
    await promises_1.default.writeFile(filePath, output, 'utf8');
}
exports.writeDotenv = writeDotenv;
/**
 * Parse a dotenv string getting it's keys without throwing away or resolving
 * any values or lines.
 * @returns A tuple with an error if one occured and the parsed dotenv
 * document.
 */
function parseDotenv(content) {
    let lines = content === '' ? [] : content.split('\n');
    if (lines.at(-1) === '') {
        // Remove trailing empty lines.
        lines = lines.slice(0, -1);
    }
    const document = {
        lines,
        mapping: {},
    };
    for (let idx = 0; idx < lines.length; idx++) {
        const value = lines[idx];
        const match = exports.re_parse.exec(value);
        if (match) {
            const key = match[1];
            document.mapping[key] = idx;
        }
    }
    return [undefined, document];
}
exports.parseDotenv = parseDotenv;
/**
 * Set a key/value pair in a dotenv document. Replaces matching keys or appends
 * to the end of the document.
 * @param document The dotenv document.
 * @param key The key to set.
 * @param value The value to set.
 */
function setDotenvValue(document, key, value) {
    const line = `${key}=${value}`;
    if (key in document.mapping) {
        const idx = document.mapping[key];
        document.lines[idx] = line;
    }
    else {
        document.mapping[key] = document.lines.length;
        document.lines.push(line);
    }
}
exports.setDotenvValue = setDotenvValue;
/**
 * Serialize a dotenv document to a string.
 * @param document The document to serialize.
 * @returns The resulting string.
 */
function serializeDotenv(document) {
    let output = '';
    for (const line of document.lines) {
        // NOTE: Lines that equal undefined are skipped.
        if (line) {
            output += line + '\n';
        }
    }
    return output;
}
exports.serializeDotenv = serializeDotenv;
//# sourceMappingURL=dotenv.js.map