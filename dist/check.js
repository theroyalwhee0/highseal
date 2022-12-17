"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSealed = void 0;
const constants_1 = require("./constants");
/**
 * Is the value formatted as a sealed value.
 * @param value The value to check.
 * @returns True if formatted like a sealed value, otherwise false.
 */
function isSealed(value) {
    // NOTE: Lengths comes from floor(4*(n/3)) < ceil(4*(n/3)) since padding is stripped.
    return constants_1.re_valid_sealed.test(value);
}
exports.isSealed = isSealed;
//# sourceMappingURL=check.js.map