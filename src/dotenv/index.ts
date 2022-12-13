import fs from 'node:fs/promises';
import path from 'node:path';

export type DotenvContent = {
    lines: (string | undefined)[],
    mapping: Record<string, number>,
};

export const re_parse = /^([\w.-]+)(?:\s*=\s*?|:\s+?)/;

export async function readDotenv(): Promise<[Error | undefined, DotenvContent]> {
    const config: DotenvContent = {
        lines: [],
        mapping: {}
    };
    try {
        const filePath = path.resolve(process.cwd(), '.env');
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.split('\n');
        config.lines = lines;
        for (let idx = 0; idx < lines.length; idx++) {
            const value = lines[idx];
            const match = re_parse.exec(value);
            if (match) {
                const key = match[1];
                config.mapping[key] = idx;
            }
        }
    } catch (err) {
        return [err, config];
    }
    return [undefined, config];
}

export function setDotenvValue(config: DotenvContent, key: string, value: string) {
    const line = `${key}=${value}`;
    if (key in config.mapping) {
        const idx = config.mapping[key];
        config.lines[idx] = line;
    } else {
        config.lines.push(line);
    }
}


export async function writeDotenv(config: DotenvContent) {
    const output = serializeDotenv(config);
    const filePath = path.resolve(process.cwd(), '.env');
    await fs.writeFile(filePath, output, 'utf8');
}

export function serializeDotenv(config: DotenvContent): string {
    let output = '';
    for (let idx in config.lines) {
        const line = config.lines[idx];
        if (line) {
            output += line + '\n';
        }
    }
    return output;
}
