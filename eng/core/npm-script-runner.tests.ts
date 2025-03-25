import { NpmScriptRunner } from './npm-script-runner';
import { SynchronousCommandRunner } from '../core/synchronous-command-runner';
import { ProcessOperations } from '../core/process-operations';

jest.mock('../core/synchronous-command-runner');
jest.mock('../core/process-operations');

describe('NpmScriptRunner', () => {
    let mockRunner: jest.Mocked<SynchronousCommandRunner>;
    let exitSpy: jest.SpyInstance;
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockRunner = new SynchronousCommandRunner() as jest.Mocked<SynchronousCommandRunner>;
        exitSpy = jest.spyOn(ProcessOperations, 'exit').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should execute the given npm script', () => {
        const runner = new NpmScriptRunner(mockRunner);
        runner.run('test-script');

        expect(mockRunner.run).toHaveBeenCalledWith(
            'npm',
            ['run', 'test-script'],
            expect.objectContaining({
                stdio: ['inherit', 'inherit', 'inherit'],
                env: expect.objectContaining(process.env)
            })
        );
    });

    it('should merge provided env variables with process.env', () => {
        const customEnv = { CUSTOM_VAR: 'value' };
        const runner = new NpmScriptRunner(mockRunner, customEnv);
        runner.run('test-script');

        expect(mockRunner.run).toHaveBeenCalledWith(
            'npm',
            ['run', 'test-script'],
            expect.objectContaining({
                env: expect.objectContaining({
                    ...process.env,
                    CUSTOM_VAR: 'value'
                })
            })
        );
    });

    it('should log the start and successful completion of the script execution', () => {
        const runner = new NpmScriptRunner(mockRunner);
        runner.run('test-script');

        expect(consoleLogSpy).toHaveBeenCalledWith('Running script: test-script');
        expect(consoleLogSpy).toHaveBeenCalledWith('Running script: test-script completed successfully.');
    });

    it('should log an error and exit with status code 1 if an error occurs', () => {
        mockRunner.run.mockImplementation(() => {
            throw new Error('Test error');
        });

        const runner = new NpmScriptRunner(mockRunner);
        runner.run('test-script');

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error running script:', 'Test error');
        expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the script name is empty', () => {
        const runner = new NpmScriptRunner(mockRunner);

        runner.run('');

        expect(mockRunner.run).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error running script:', 'Script name is required.');
        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});