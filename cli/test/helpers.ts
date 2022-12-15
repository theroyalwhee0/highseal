import { stderr } from 'test-console';

/**
 * The inspect callback type.
 */
export type InspectFn<T> = () => T;

/**
 * Run a function, capturing stderr, exceptions, and return values.
 * @param fn The function to call.
 * @returns A tuple of error, stderr output, and the return value.
 */
export function inspect<T>(fn: InspectFn<T>): [Error | undefined, Readonly<string[]>, T | undefined] {
    let err: Error | undefined;
    let result: T | undefined;
    const errOutput: Readonly<string[]> = stderr.inspectSync(() => {
        try {
            result = fn();
        } catch (caught) {
            if (caught instanceof Error) {
                err = caught;
            } else {
                err = new Error(`Caught value was not an Error "${caught.toString().slice(0, 20)}" (${typeof caught})`);
            }
        }
    });
    return [err, errOutput, result];
}