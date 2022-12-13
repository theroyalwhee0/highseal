export class HighSealError extends Error {
    static isHighSealError(value: unknown): value is HighSealError {
        return value instanceof HighSealError;
    }
}