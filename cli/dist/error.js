"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighSealError = void 0;
class HighSealError extends Error {
    static isHighSealError(value) {
        return value instanceof HighSealError;
    }
}
exports.HighSealError = HighSealError;
//# sourceMappingURL=error.js.map