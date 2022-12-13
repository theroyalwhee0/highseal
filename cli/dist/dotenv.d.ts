export type DotenvContent = {
    lines: (string | undefined)[];
    mapping: Record<string, number>;
};
export declare const re_parse: RegExp;
export declare function readDotenv(): Promise<[Error | undefined, DotenvContent]>;
export declare function setDotenvValue(config: DotenvContent, key: string, value: string): void;
export declare function writeDotenv(config: DotenvContent): Promise<void>;
export declare function serializeDotenv(config: DotenvContent): string;
