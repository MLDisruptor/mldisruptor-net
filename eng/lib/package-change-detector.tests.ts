import { PackageChangeDetector } from './package-change-detector';
import { RecordProvider } from '../core/record-provider';
import { GithubOutputWriter } from '../core/github-output-writer';
import { GitCommandRunner } from '../core/git-command-runner';
import { GitOperationsRepository } from './git-operations-repository';
import { ProcessOperations } from '../core/process-operations';
import { ConsoleLogger } from '../core/console-logger';

describe('PackageChangeDetector', () => {
    let provider: jest.Mocked<RecordProvider>;
    let writer: jest.Mocked<GithubOutputWriter>;
    let gitRunner: jest.Mocked<GitCommandRunner>;
    let processExit: jest.MockedFunction<typeof ProcessOperations.exit>;
    let logger: jest.Mocked<ConsoleLogger>;
    let detector: PackageChangeDetector;

    beforeEach(() => {
        provider = {
            has: jest.fn(),
            get: jest.fn(),
            set: jest.fn(),
            apply: jest.fn(),
        } as unknown as jest.Mocked<RecordProvider>;

        writer = {
            write: jest.fn(),
        } as unknown as jest.Mocked<GithubOutputWriter>;

        gitRunner = {
            run: jest.fn(),
        } as unknown as jest.Mocked<GitCommandRunner>;

        processExit = jest.fn();

        logger = {
            log: jest.fn(),
            error: jest.fn(),
        } as unknown as jest.Mocked<ConsoleLogger>;

        detector = new PackageChangeDetector(provider, writer, gitRunner, processExit, logger);
    });

    it('should detect changes using hasLocalChanges when isActTest is true', () => {
        provider.has.mockReturnValue(true);
        provider.get.mockReturnValue('true');
        gitRunner.run.mockReturnValue(Buffer.from('A file.txt'));

        detector.process();

        expect(gitRunner.run).toHaveBeenCalledWith(GitOperationsRepository.checkLocalChanges());
        expect(provider.set).toHaveBeenCalledWith('CHANGES', 'true');
        expect(writer.write).toHaveBeenCalledWith('CHANGES', 'true', true);
    });

    it('should detect changes using hasGitDiffChanges when isActTest is false', () => {
        provider.has.mockReturnValue(false);
        gitRunner.run.mockImplementation(() => {
            throw new Error('Changes detected');
        });

        detector.process();

        expect(gitRunner.run).toHaveBeenCalledWith(GitOperationsRepository.checkGitDiffChanges());
        expect(provider.set).toHaveBeenCalledWith('CHANGES', 'true');
        expect(writer.write).toHaveBeenCalledWith('CHANGES', 'true', true);
    });

    it('should output no changes when no changes are detected', () => {
        provider.has.mockReturnValue(false);
        gitRunner.run.mockReturnValue(Buffer.from(''));

        detector.process();

        expect(provider.set).toHaveBeenCalledWith('CHANGES', 'false');
        expect(writer.write).toHaveBeenCalledWith('CHANGES', 'false', true);
    });

    it('should log the CHANGES key and its value to the console', () => {
        provider.has.mockReturnValue(false);
        gitRunner.run.mockReturnValue(Buffer.from(''));

        detector.process();

        expect(logger.log).toHaveBeenCalledWith('CHANGES=false');
    });

    it('should handle errors during the process', () => {
        provider.has.mockReturnValue(false).mockImplementation(() => {
            throw new Error('Provider error');
        });
        gitRunner.run.mockImplementation(() => {
            throw new Error('Git error');
        });

        detector.process();

        expect(logger.error).toHaveBeenCalledWith('Error while checking for changes:', expect.any(Error));
        expect(processExit).toHaveBeenCalledWith(1);

        processExit.mockRestore();
    });
});