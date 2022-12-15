/**
 * Mock command line arguments.
 * @returns Command line arguments.
 */
export function mockCommandLineArgs(args: string[] = []): string[] {
    return [
        '/home/user/.nvm/versions/node/v16.16.0/bin/node',
        '/home/user/projects/highseal-cli/cli/dist/cli.js',
        ...args,
    ];
}