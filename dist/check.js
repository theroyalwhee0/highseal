"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSealed = void 0;
/**
 * Is the value formatted as a sealed value.
 * @param value The value to check.
 * @returns True if formatted like a sealed value, otherwise false.
 */
function isSealed(value) {
    // NOTE: Lengths comes from floor(4*(n/3)) < ceil(4*(n/3)) since padding is stripped.
    return /^A\.[a-zA-Z0-9/+]{21,22}\.[a-zA-Z0-9/+]{16}\.[a-zA-Z0-9/+]{42,}$/.test(value);
}
exports.isSealed = isSealed;
//# sourceMappingURL=check.js.map