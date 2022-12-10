"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padValue = void 0;
const constants_1 = require("./constants");
function padValue(value) {
    const mod = value.length % constants_1.padSize;
    let paddingLength = mod === 0 ? constants_1.padSize : constants_1.padSize - mod;
    if (value.length + paddingLength < constants_1.padMinLength) {
        paddingLength = constants_1.padMinLength - value.length;
    }
    const padding = Buffer.alloc(paddingLength).fill(paddingLength);
    return Buffer.concat([
        Buffer.from(value, 'utf8'),
        padding,
    ]);
}
exports.padValue = padValue;
//# sourceMappingURL=pad.js.map