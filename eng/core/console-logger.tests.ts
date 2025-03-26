import { ConsoleLogger } from './console-logger';

describe('ConsoleLogger', () => {
    let consoleLog: jest.MockedFunction<typeof console.log>;
    let consoleError: jest.MockedFunction<typeof console.error>;
    let consoleWarn: jest.MockedFunction<typeof console.warn>;

    beforeEach(() => {
        consoleLog = jest.fn();
        consoleError = jest.fn();
        consoleWarn = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should provide a singleton instance', () => {
        const logger1 = ConsoleLogger.instance;
        const logger2 = ConsoleLogger.instance;
        expect(logger1).toBe(logger2);
    });

    it('should call console.log when log is invoked', () => {
        const message = 'Test log message';
        const optionalParams = [1, 2, 3];

        const logger = ConsoleLogger.create(consoleLog, consoleError, consoleWarn);

        logger.log(message, ...optionalParams);

        expect(consoleLog).toHaveBeenCalledWith(message, optionalParams);
    });

    it('should call console.error when error is invoked', () => {
        const message = 'Test error message';
        const optionalParams = ['error', 'details'];

        const logger = ConsoleLogger.create(consoleLog, consoleError, consoleWarn);

        logger.error(message, ...optionalParams);

        expect(consoleError).toHaveBeenCalledWith(message, optionalParams);
    });

    it('should call console.warn when warn is invoked', () => {
        const message = 'Test warn message';
        const optionalParams = ['warn', 'details'];

        const logger = ConsoleLogger.create(consoleLog, consoleError, consoleWarn);

        logger.warn(message, ...optionalParams);

        expect(consoleWarn).toHaveBeenCalledWith(message, optionalParams);
    });
});