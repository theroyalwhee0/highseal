"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demandExclusiveOptions = exports.exclusiveOptions = exports.readInput = void 0;
const readline_1 = __importDefault(require("readline"));
function readInput(prompt) {
    return new Promise((resolve) => {
        process.stdout.write(prompt);
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.on('line', (line) => {
            resolve(line);
        });
        rl.once('close', () => {
            resolve('');
        });
    });
}
exports.readInput = readInput;
function exclusiveOptions(...options) {
    return (argv) => {
        const count = options.filter(option => option in argv).length;
        const lastOption = options.pop();
        if (count > 1) {
            throw new Error(`Arguments ${options.join(', ')} and ${lastOption} are mutually exclusive`);
        }
        return true;
    };
}
exports.exclusiveOptions = exclusiveOptions;
function demandExclusiveOptions(...options) {
    return (argv) => {
        const count = options.filter(option => option in argv).length;
        const lastOption = options.pop();
        if (count < 0) {
            throw new Error(`At least 1 arguments of ${options.join(', ')} and ${lastOption} is required`);
        }
        else if (count > 1) {
            throw new Error(`Arguments ${options.join(', ')} and ${lastOption} are mutually exclusive`);
        }
        return true;
    };
}
exports.demandExclusiveOptions = demandExclusiveOptions;
//# sourceMappingURL=helpers.js.map