"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeDotenv = exports.writeDotenv = exports.setDotenvValue = exports.readDotenv = exports.re_parse = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
exports.re_parse = /^([\w.-]+)(?:\s*=\s*?|:\s+?)/;
async function readDotenv() {
    const config = {
        lines: [],
        mapping: {}
    };
    try {
        const filePath = node_path_1.default.resolve(process.cwd(), '.env');
        const content = await promises_1.default.readFile(filePath, 'utf8');
        const lines = content.split('\n');
        config.lines = lines;
        for (let idx = 0; idx < lines.length; idx++) {
            const value = lines[idx];
            const match = exports.re_parse.exec(value);
            if (match) {
                const key = match[1];
                config.mapping[key] = idx;
            }
        }
    }
    catch (err) {
        return [err, config];
    }
    return [undefined, config];
}
exports.readDotenv = readDotenv;
function setDotenvValue(config, key, value) {
    const line = `${key}=${value}`;
    if (key in config.mapping) {
        const idx = config.mapping[key];
        config.lines[idx] = line;
    }
    else {
        config.lines.push(line);
    }
}
exports.setDotenvValue = setDotenvValue;
async function writeDotenv(config) {
    const output = serializeDotenv(config);
    const filePath = node_path_1.default.resolve(process.cwd(), '.env');
    await promises_1.default.writeFile(filePath, output, 'utf8');
}
exports.writeDotenv = writeDotenv;
function serializeDotenv(config) {
    let output = '';
    for (let idx in config.lines) {
        const line = config.lines[idx];
        if (line) {
            output += line + '\n';
        }
    }
    return output;
}
exports.serializeDotenv = serializeDotenv;
//# sourceMappingURL=index.js.map