export declare function readInput(prompt: string): Promise<string>;
export type ExclusiveOption = (argv: Record<string, unknown>) => boolean;
export declare function exclusiveOptions(...options: string[]): ExclusiveOption;
export declare function demandExclusiveOptions(...options: string[]): ExclusiveOption;
