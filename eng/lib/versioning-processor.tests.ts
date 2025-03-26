import { VersioningProcessor } from './versioning-processor';
import { RecordProvider } from '../core/record-provider';
import { GithubOutputWriter } from '../core/github-output-writer';
import { GitCommandRunner } from '../core/git-command-runner';
import { ConsoleLogger } from '../core/console-logger';
import { VersionManager } from '../core/version-manager';

describe('VersioningProcessor', () => {
    let provider: jest.Mocked<RecordProvider>;
    let writer: jest.Mocked<GithubOutputWriter>;
    let runner: jest.Mocked<GitCommandRunner>;
    let logger: jest.Mocked<ConsoleLogger>;
    let processor: VersioningProcessor;

    beforeEach(() => {
        provider = {
            set: jest.fn(),
            apply: jest.fn(),
            has: jest.fn()
        } as unknown as jest.Mocked<RecordProvider>;

        writer = {
            write: jest.fn(),
        } as unknown as jest.Mocked<GithubOutputWriter>;

        runner = {
            run: jest.fn(),
        } as unknown as jest.Mocked<GitCommandRunner>;

        logger = {
            log: jest.fn(),
            warn: jest.fn(),
        } as unknown as jest.Mocked<ConsoleLogger>;

        processor = new VersioningProcessor(provider, writer, runner, logger);
    });

    describe('isAct', () => {
        it('should default the version if running under act', () => {
            provider.has.mockReturnValue(true);

            processor.process();

            expect(provider.has).toHaveBeenCalledWith('ACT');
            expect(provider.set).toHaveBeenCalledWith('version', VersionManager.defaultVersion);
            expect(provider.apply).toHaveBeenCalled();
            expect(writer.write).toHaveBeenCalledWith('version', VersionManager.defaultVersion);
            expect(logger.log.mock.calls[0][0]).toEqual(`version=${VersionManager.defaultVersion}`);
            expect(logger.log.mock.calls[1][0]).toEqual('Skipping versioning because the environment is running under act.');
        });
    });

    describe('getLatest error', () => {
        it('should default the version if no tags found', () => {
            runner.run
                .mockImplementationOnce(() => { throw new Error(); })
                .mockImplementationOnce(() => 'feat: new feature');

            processor.process();

            expect(logger.warn).toHaveBeenCalledWith(`No tags found. Defaulting to version "${VersionManager.defaultVersion}".`)
        });
    });

    describe('incrementType', () => {
        it('should return major if commit message includes BREAKING CHANGE', () => {
            runner.run
                .mockImplementationOnce(() => VersionManager.defaultVersion)
                .mockImplementationOnce(() => 'BREAKING CHANGE: something');

            processor.process();

            expect(provider.set.mock.calls[1][1]).toEqual('major');
        });

        it('should return major if commit message starts with DEPRECATED', () => {
            runner.run
                .mockImplementationOnce(() => VersionManager.defaultVersion)
                .mockImplementationOnce(() => 'DEPRECATED: something');

            processor.process();

            expect(provider.set.mock.calls[1][1]).toEqual('major');
        });

        it('should return major if commit message starts with SECURITY', () => {
            runner.run
                .mockImplementationOnce(() => VersionManager.defaultVersion)
                .mockImplementationOnce(() => 'SECURITY: something');

            processor.process();

            expect(provider.set.mock.calls[1][1]).toEqual('major');
        });

        it('should return minor if commit message starts with feat', () => {
            runner.run
                .mockImplementationOnce(() => VersionManager.defaultVersion)
                .mockImplementationOnce(() => 'feat: something');

            processor.process();

            expect(provider.set.mock.calls[1][1]).toEqual('minor');
        });

        it('should return patch if commit message does not match any of the above', () => {
            runner.run
                .mockImplementationOnce(() => VersionManager.defaultVersion)
                .mockImplementationOnce(() => 'something');

            processor.process();

            expect(provider.set.mock.calls[1][1]).toEqual('patch');
        });
    });

    describe('version', () => {
        it('should increment the version', () => {
            runner.run
                .mockImplementationOnce(() => VersionManager.defaultVersion)
                .mockImplementationOnce(() => 'feat: something');

            processor.process();

            expect(provider.set.mock.calls[2][1]).toEqual('0.1.0.0');
        });

        it('should write the version to the provider', () => {
            runner.run
                .mockImplementationOnce(() => VersionManager.defaultVersion)
                .mockImplementationOnce(() => 'feat: something');

            processor.process();

            expect(provider.set.mock.calls[2][0]).toEqual('version');
        });
    });
});