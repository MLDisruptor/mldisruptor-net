import { GitCommandRunner } from './git-command-runner';
import { SynchronousCommandRunner } from './synchronous-command-runner';
import { RunnerOptions } from './runner-options';
import { IGitOperation } from './git-operation-builder';

jest.mock('./synchronous-command-runner');
jest.mock('./runner-options');

describe('GitCommandRunner', () => {
    let gitCommandRunner: GitCommandRunner;
    let mockRunner: jest.Mocked<SynchronousCommandRunner>;

    beforeEach(() => {
        mockRunner = new SynchronousCommandRunner() as jest.Mocked<SynchronousCommandRunner>;
        (RunnerOptions.createDefaultOptions as jest.Mock).mockReturnValue({ someOption: true });
        gitCommandRunner = new GitCommandRunner(mockRunner);
    });

    it('should initialize with default options', () => {
        expect(RunnerOptions.createDefaultOptions).toHaveBeenCalled();
    });

    it('should run a valid git operation and return the result', () => {
        const operation: IGitOperation = { op: 'status', args: [] };
        const expected = Buffer.from('mocked git status output');
        mockRunner.run.mockReturnValue(expected);

        const result = gitCommandRunner.run(operation);

        expect(mockRunner.run).toHaveBeenCalledWith('git', ['status'], { someOption: true });
        expect(result).toBe(expected);
    });

    it('should handle git operations with arguments', () => {
        const operation: IGitOperation = { op: 'commit', args: ['-m', 'Initial commit'] };
        const expected = Buffer.from('mocked git commit output');
        mockRunner.run.mockReturnValue(expected);

        const result = gitCommandRunner.run(operation);

        expect(mockRunner.run).toHaveBeenCalledWith('git', ['commit', '-m', 'Initial commit'], { someOption: true });
        expect(result).toBe(expected);
    });

    it('should throw an error if the runner fails', () => {
        const operation: IGitOperation = { op: 'push', args: [] };
        mockRunner.run.mockImplementation(() => {
            throw new Error('mocked error');
        });

        expect(() => gitCommandRunner.run(operation)).toThrow('mocked error');
    });

    it('should handle empty operation arguments gracefully', () => {
        const operation: IGitOperation = { op: 'log', args: [] };
        const expected = Buffer.from('mocked git log output');
        mockRunner.run.mockReturnValue(expected);

        const result = gitCommandRunner.run(operation);

        expect(mockRunner.run).toHaveBeenCalledWith('git', ['log'], { someOption: true });
        expect(result).toBe(expected);
    });

    it('should handle invalid operation input gracefully', () => {
        const operation: IGitOperation = { op: '', args: [] };

        expect(() => gitCommandRunner.run(operation)).toThrow();
        expect(mockRunner.run).not.toHaveBeenCalled();
    });

    it('should handle null operation input gracefully', () => {
        expect(() => gitCommandRunner.run(null as unknown as IGitOperation)).toThrow();
        expect(mockRunner.run).not.toHaveBeenCalled();
    });

    it('should handle undefined operation input gracefully', () => {
        expect(() => gitCommandRunner.run(undefined as unknown as IGitOperation)).toThrow();
        expect(mockRunner.run).not.toHaveBeenCalled();
    });
});