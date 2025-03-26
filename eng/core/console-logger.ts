export class ConsoleLogger {
    public static readonly instance: ConsoleLogger = new ConsoleLogger();

    public static create(
        consoleLog: typeof console.log = console.log,
        consoleError: typeof console.error = console.error,
        consoleWarn: typeof console.warn = console.warn
    ): ConsoleLogger {
        return new ConsoleLogger(consoleLog, consoleError, consoleWarn);
    }

    private constructor(
        private readonly consoleLog: typeof console.log = console.log,
        private readonly consoleError: typeof console.error = console.error,
        private readonly consoleWarn: typeof console.warn = console.warn) {
    }

    public log(message: string | undefined, ...optionalParams: any[]): void {
        this.consoleLog(message, optionalParams);
    }

    public error(message: string | undefined, ...optionalParams: any[]): void {
        this.consoleError(message, optionalParams);
    }

    public warn(message: string | undefined, ...optionalParams: any[]): void {
        this.consoleWarn(message, optionalParams);
    }
}