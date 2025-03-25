
export type ProcessExitCode = number | string | undefined;

export class ProcessOperations {
    public static get(key: string): string {
        return process.env[key] ?? '';
    }

    public static has(key: string): boolean {
        return key in process.env;
    }

    public static set(key: string, value: string): void {
        process.env[key] = value;
    }

    public static exit(code?: ProcessExitCode): void {
        process.exit(code);
    }
}