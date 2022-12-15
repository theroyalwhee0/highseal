/**
 * Used to indicate non-fatal errors.
 */
export class HighSealError extends Error {
    /**
     * Type Guard HighSealError
     * @param value Value to check.
     * @returns True if HighSealError.
     */

    static isHighSealError(value: unknown): value is HighSealError {
        return value instanceof HighSealError;
    }
}