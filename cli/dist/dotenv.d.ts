/**
 * Q: Why not use the dotenv library?
 * A: The goal here is to be able to add to or override individual keys and
 * write them back out to a file. Reading the dotenv file with the dotenv library
 * would discard the comments and reformat lines.
 */
/**
 * The dotenv document.
 * Lines and key-to-line mapping.
 */
export type DotenvDocument = {
    lines: (string | undefined)[];
    mapping: Record<string, number>;
};
/**
 * Parse the key from a line.
 */
export declare const re_parse: RegExp;
/**
 * Read a dotenv file getting it's keys without throwing away or
 * resolving any values or lines.
 * @returns A tuple with an error if one occured and the parsed dotenv
 * document.
 */
export declare function readDotenv(): Promise<[Error | undefined, DotenvDocument]>;
/**
 * Write the dotenv document out to a dotenv file inth current working
 * directory.
 * @param document The dotenv document.
 */
export declare function writeDotenv(document: DotenvDocument): Promise<void>;
/**
 * Parse a dotenv string getting it's keys without throwing away or resolving
 * any values or lines.
 * @returns A tuple with an error if one occured and the parsed dotenv
 * document.
 */
export declare function parseDotenv(content: string): [Error | undefined, DotenvDocument];
/**
 * Set a key/value pair in a dotenv document. Replaces matching keys or appends
 * to the end of the document.
 * @param document The dotenv document.
 * @param key The key to set.
 * @param value The value to set.
 */
export declare function setDotenvValue(document: DotenvDocument, key: string, value: string): void;
/**
 * Serialize a dotenv document to a string.
 * @param document The document to serialize.
 * @returns The resulting string.
 */
export declare function serializeDotenv(document: DotenvDocument): string;
