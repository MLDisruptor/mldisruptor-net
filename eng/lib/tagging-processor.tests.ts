import { TaggingProcessor } from './tagging-processor';
import { GitCommandRunner } from '../core/git-command-runner';
import { RecordProvider } from '../core/record-provider';
import { ConsoleLogger } from '../core/console-logger';
import { ProcessOperations } from '../core/process-operations';

describe('TaggingProcessor', () => {
    let provider: jest.Mocked<RecordProvider>;
    let runner: jest.Mocked<GitCommandRunner>;
    let logger: jest.Mocked<ConsoleLogger>;
    let processor: TaggingProcessor;

    const expectedConfigureUserName = { op: 'config', args: ['user.name', 'github-actions[bot]'] };
    const expectedConfigureUserEmail = { op: 'config', args: ['user.email', 'github-actions[bot]@users.noreply.github.com'] };

    jest.mock('./git-operations-repository', () => ({
        GitOperationsRepository: {
            createTag: jest.fn((version: string) => ({ op: 'tag', args: [version] })),
            pushTag: jest.fn((version: string) => ({ op: 'push', args: [version] })),
            configureUserName: jest.fn(() => (expectedConfigureUserName)),
            configureUserEmail: jest.fn(() => (expectedConfigureUserEmail)),
            configureRemoteUrl: jest.fn((token: string) => ({ op: 'config', args: ['remote.url', token] })),
        },
    }));

    beforeEach(() => {
        provider = {
            has: jest.fn(),
            get: jest.fn(),
        } as unknown as jest.Mocked<RecordProvider>;

        runner = {
            run: jest.fn(),
        } as unknown as jest.Mocked<GitCommandRunner>;

        logger = {
            log: jest.fn(),
            error: jest.fn(),
        } as unknown as jest.Mocked<ConsoleLogger>;

        processor = new TaggingProcessor(provider, runner, logger);
    });

    it('should exit when version is not set', () => {
        provider.get.mockReturnValue('');
        jest.spyOn(ProcessOperations, 'exit').mockImplementation(() => { });

        processor.process();

        expect(logger.error).toHaveBeenCalledWith('Error while creating and pushing the tag:', new Error('VERSION environment variable is not set.'));
        expect(ProcessOperations.exit).toHaveBeenCalledWith(1);
    });

    it('should exit when GITHUB_TOKEN is not set', () => {
        provider.has.mockReturnValue(false); // not act
        provider.get.mockImplementation((key) => {
            if (key === 'version') return '1.0.0'; // has version
            else if (key === 'CHANGES') return 'true'; // has changes
            else return undefined as unknown as any;
        });
        jest.spyOn(ProcessOperations, 'exit').mockImplementation(() => { });

        processor.process();

        expect(logger.error).toHaveBeenCalledWith('Error while creating and pushing the tag:', new Error('GITHUB_TOKEN is not set.'));
        expect(ProcessOperations.exit).toHaveBeenCalledWith(1);
    });

    const setupProviderMock = (hasValue: boolean, mockValues: Record<string, string>) => {
        provider.has.mockReturnValue(hasValue);
        provider.get.mockImplementation((key) => mockValues[key] || '');
    };

    it('should skip processing when ACT is set', () => {
        setupProviderMock(true, { version: '1.0.0' });
        jest.spyOn(ProcessOperations, 'exit').mockImplementation(() => { });

        processor.process();

        expect(logger.log).toHaveBeenCalledWith('Skipping tag creation and push.');
        expect(runner.run).not.toHaveBeenCalled();
    });

    it('should skip processing when CHANGES is false', () => {
        setupProviderMock(false, { version: '1.0.0', CHANGES: 'false' });
        jest.spyOn(ProcessOperations, 'exit').mockImplementation(() => { });

        processor.process();

        expect(logger.log).toHaveBeenCalledWith('Skipping tag creation and push.');
        expect(runner.run).not.toHaveBeenCalled();
    });

    it('should perform git operations', () => {
        provider.has.mockReturnValue(false);
        provider.get.mockImplementation((key) => {
            if (key === 'version') return '1.0.0';
            else if (key === 'CHANGES') return 'true';
            else if (key === 'GITHUB_TOKEN') return 'token';
            else return undefined as unknown as any;
        });

        processor.process();

        expect(runner.run).toHaveBeenCalledTimes(5);

        const configureUserName = runner.run.mock.calls[0];
        expect(configureUserName[0]).toEqual(expectedConfigureUserName);
        const configureUserEmail = runner.run.mock.calls[1];
        expect(configureUserEmail[0]).toEqual(expectedConfigureUserEmail);
        const configureRemoteUrl = runner.run.mock.calls[2];
        expect(configureRemoteUrl[0]).toEqual({ op: 'remote', args: ['set-url', 'origin', 'https://x-access-token:token@github.com/MLDisruptor/mldisruptor-net.git'] });
        const createTag = runner.run.mock.calls[3];
        expect(createTag[0]).toEqual({ op: 'tag', args: ['1.0.0'] });
        const pushTag = runner.run.mock.calls[4];
        expect(pushTag[0]).toEqual({ op: 'push', args: ['origin', '1.0.0'] });

        expect(logger.log).toHaveBeenCalledWith('Created and pushed new tag: 1.0.0');
    });
});