export class HighSealError extends Error {
    static isHighSealError(value: any): value is HighSealError {
        return value instanceof HighSealError;
    }
}