"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readInput = void 0;
const readline_1 = __importDefault(require("readline"));
/**
 * Read input from stdin.
 * @param prompt A prompt to write to stdout.
 * @returns The sting read from stdin.
 */
function readInput(prompt = '', options) {
    const output = options?.output ?? process.stdout;
    const input = options?.input ?? process.stdin;
    return new Promise((resolve) => {
        if (prompt) {
            output.write(prompt);
        }
        const rl = readline_1.default.createInterface({
            input: input,
            output: output,
        });
        rl.on('line', (line) => {
            resolve(line);
            rl.close();
        });
    });
}
exports.readInput = readInput;
//# sourceMappingURL=input.js.map