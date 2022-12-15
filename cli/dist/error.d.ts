/**
 * Used to indicate non-fatal errors.
 */
export declare class HighSealError extends Error {
    /**
     * Type Guard HighSealError
     * @param value Value to check.
     * @returns True if HighSealError.
     */
    static isHighSealError(value: unknown): value is HighSealError;
}
