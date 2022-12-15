/**
 * Q: Why not use the dotenv library?
 * A: The goal here is to be able to add to or override individual keys and
 * write them back out to a file. Reading the dotenv file with the dotenv library 
 * would discard the comments and reformat lines.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * The dotenv document.
 * Lines and key-to-line mapping.
 */
export type DotenvDocument = {
    lines: (string | undefined)[],
    mapping: Record<string, number>,
};


/**
 * Parse the key from a line.
 */
export const re_parse = /^([\w.-]+)(?:\s*=\s*?|:\s+?)/;

/**
 * Read a dotenv file getting it's keys without throwing away or 
 * resolving any values or lines.
 * @returns A tuple with an error if one occured and the parsed dotenv
 * document.
 */
export async function readDotenv(): Promise<[Error | undefined, DotenvDocument]> {
    try {
        const filePath = path.resolve(process.cwd(), '.env');
        const content = await fs.readFile(filePath, 'utf8');
        return parseDotenv(content);
    } catch (err) {
        const document: DotenvDocument = {
            lines: [],
            mapping: {},
        };
        return [err, document];
    }
}

/**
 * Write the dotenv document out to a dotenv file inth current working
 * directory.
 * @param document The dotenv document.
 */
export async function writeDotenv(document: DotenvDocument): Promise<void> {
    const output = serializeDotenv(document);
    const filePath = path.resolve(process.cwd(), '.env');
    await fs.writeFile(filePath, output, 'utf8');
}

/**
 * Parse a dotenv string getting it's keys without throwing away or resolving
 * any values or lines.
 * @returns A tuple with an error if one occured and the parsed dotenv
 * document.
 */
export function parseDotenv(content: string): [Error | undefined, DotenvDocument] {
    let lines = content === '' ? [] : content.split('\n');
    if (lines.at(-1) === '') {
        // Remove trailing empty lines.
        lines = lines.slice(0, -1);
    }
    const document: DotenvDocument = {
        lines,
        mapping: {},
    };
    for (let idx = 0; idx < lines.length; idx++) {
        const value = lines[idx];
        const match = re_parse.exec(value);
        if (match) {
            const key = match[1];
            document.mapping[key] = idx;
        }
    }
    return [undefined, document];
}

/**
 * Set a key/value pair in a dotenv document. Replaces matching keys or appends
 * to the end of the document.
 * @param document The dotenv document.
 * @param key The key to set.
 * @param value The value to set.
 */
export function setDotenvValue(document: DotenvDocument, key: string, value: string) {
    const line = `${key}=${value}`;
    if (key in document.mapping) {
        const idx = document.mapping[key];
        document.lines[idx] = line;
    } else {
        document.mapping[key] = document.lines.length;
        document.lines.push(line);
    }
}

/**
 * Serialize a dotenv document to a string.
 * @param document The document to serialize.
 * @returns The resulting string.
 */
export function serializeDotenv(document: DotenvDocument): string {
    let output = '';
    for (const line of document.lines) {
        // NOTE: Lines that equal undefined are skipped.
        if (line) {
            output += line + '\n';
        }
    }
    return output;
}
