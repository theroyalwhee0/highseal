"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighSealError = void 0;
/**
 * Used to indicate non-fatal errors.
 */
class HighSealError extends Error {
    /**
     * Type Guard HighSealError
     * @param value Value to check.
     * @returns True if HighSealError.
     */
    static isHighSealError(value) {
        return value instanceof HighSealError;
    }
}
exports.HighSealError = HighSealError;
//# sourceMappingURL=error.js.map