import { runNpmScript } from '../lib/npm-script-runner';
import { NpmScriptRunner } from '../core/npm-script-runner';
import { SynchronousCommandRunner } from '../core/synchronous-command-runner';

jest.mock('../core/npm-script-runner');
jest.mock('../core/synchronous-command-runner');

describe('runNpmScript', () => {
    let mockRun: jest.Mock;
    let mockNpmScriptRunner: jest.Mock;

    beforeEach(() => {
        mockRun = jest.fn();
        mockNpmScriptRunner = jest.fn().mockImplementation(() => ({
            run: mockRun,
        }));

        (NpmScriptRunner as jest.Mock).mockImplementation(mockNpmScriptRunner);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an NpmScriptRunner and call its run method with the given script', () => {
        const script = 'test-script';
        const env = { NODE_ENV: 'test' };
        const mockSyncRunner = new SynchronousCommandRunner();

        runNpmScript(script, env, mockSyncRunner);

        expect(NpmScriptRunner).toHaveBeenCalledWith(mockSyncRunner, env);
        expect(mockRun).toHaveBeenCalledWith(script);
    });

    it('should use default parameters if none are provided', () => {
        const script = 'default-script';

        runNpmScript(script);

        expect(NpmScriptRunner).toHaveBeenCalledWith(expect.any(SynchronousCommandRunner), {});
        expect(mockRun).toHaveBeenCalledWith(script);
    });
});