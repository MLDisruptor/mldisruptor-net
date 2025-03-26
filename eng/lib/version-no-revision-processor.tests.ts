import { VersionNoRevisionProcessor } from '../lib/version-no-revision-processor';
import { ConsoleLogger } from '../core/console-logger';
import { GithubOutputWriter } from '../core/github-output-writer';
import { ProcessOperations } from '../core/process-operations';
import { RecordProvider } from '../core/record-provider';
import { VersionManager } from '../core/version-manager';

jest.mock('../core/console-logger');
jest.mock('../core/github-output-writer');
jest.mock('../core/process-operations');
jest.mock('../core/record-provider');
jest.mock('../core/version-manager');

describe('VersionNoRevisionProcessor', () => {
    let provider: jest.Mocked<RecordProvider>;
    let writer: jest.Mocked<GithubOutputWriter>;
    let logger: jest.Mocked<ConsoleLogger>;
    let processor: VersionNoRevisionProcessor;

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

        logger = {
            error: jest.fn(),
            log: jest.fn(),
        } as unknown as jest.Mocked<ConsoleLogger>;

        processor = new VersionNoRevisionProcessor(provider, writer, logger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should exit if VERSION is missing', () => {
        provider.has.mockReturnValueOnce(false);

        processor.process();

        expect(logger.error).toHaveBeenCalledWith('VERSION environment variable is not set.');
        expect(ProcessOperations.exit).toHaveBeenCalledWith(1);
    });

    it('should exit if GITHUB_OUTPUT is missing', () => {
        provider.has.mockReturnValueOnce(true).mockReturnValueOnce(false);

        processor.process();

        expect(logger.error).toHaveBeenCalledWith('GITHUB_OUTPUT environment variable is not set.');
        expect(ProcessOperations.exit).toHaveBeenCalledWith(1);
    });

    it('should retrieve the VERSION value from the provider', () => {
        provider.has.mockReturnValue(true);
        provider.get.mockReturnValue('1.2.3');

        processor.process();

        expect(provider.get).toHaveBeenCalledWith('version');
    });

    it('should calculate VERSION_NO_REVISION using VersionManager', () => {
        provider.has.mockReturnValue(true);
        provider.get.mockReturnValue('1.2.3');
        jest.spyOn(VersionManager, 'calculateVersionNoRevision').mockReturnValue('1.2');

        processor.process();

        expect(VersionManager.calculateVersionNoRevision).toHaveBeenCalledWith('1.2.3');
    });

    it('should set the calculated VERSION_NO_REVISION in the provider', () => {
        provider.has.mockReturnValue(true);
        provider.get.mockReturnValue('1.2.3');
        jest.spyOn(VersionManager, 'calculateVersionNoRevision').mockReturnValue('1.2');

        processor.process();

        expect(provider.set).toHaveBeenCalledWith('VERSION_NO_REVISION', '1.2');
    });

    it('should apply the provider after setting VERSION_NO_REVISION', () => {
        provider.has.mockReturnValue(true);
        provider.get.mockReturnValue('1.2.3');
        jest.spyOn(VersionManager, 'calculateVersionNoRevision').mockReturnValue('1.2');

        processor.process();

        expect(provider.apply).toHaveBeenCalled();
    });

    it('should write VERSION_NO_REVISION to the GitHub output writer', () => {
        provider.has.mockReturnValue(true);
        provider.get.mockReturnValue('1.2.3');
        jest.spyOn(VersionManager, 'calculateVersionNoRevision').mockReturnValue('1.2');

        processor.process();

        expect(writer.write).toHaveBeenCalledWith('VERSION_NO_REVISION', '1.2');
    });

    it('should log the VERSION_NO_REVISION value', () => {
        provider.has.mockReturnValue(true);
        provider.get.mockReturnValue('1.2.3');
        jest.spyOn(VersionManager, 'calculateVersionNoRevision').mockReturnValue('1.2');

        processor.process();

        expect(logger.log).toHaveBeenCalledWith('VERSION_NO_REVISION=1.2');
    });

    it('should handle errors by logging and exiting', () => {
        const error = new Error('Test error');
        provider.has.mockImplementation(() => {
            throw error;
        });

        processor.process();

        expect(logger.error).toHaveBeenCalledWith('Error while calculating version without revision:', error);
        expect(ProcessOperations.exit).toHaveBeenCalledWith(1);
    });
});