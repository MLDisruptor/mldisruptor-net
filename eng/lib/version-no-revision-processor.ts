import { ConsoleLogger } from '../core/console-logger';
import { GithubOutputWriter } from '../core/github-output-writer';
import { ProcessOperations } from '../core/process-operations';
import { RecordProvider } from '../core/record-provider';
import { VersionManager } from '../core/version-manager';

export class VersionNoRevisionProcessor {
    private static readonly VERSION = 'version';
    private static readonly VERSION_NO_REVISION = 'VERSION_NO_REVISION';
    private static readonly GITHUB_OUTPUT = 'GITHUB_OUTPUT';

    constructor(
        private readonly provider: RecordProvider,
        private readonly writer: GithubOutputWriter,
        private readonly logger: ConsoleLogger = ConsoleLogger.instance
    ) { }

    public process(): void {
        try {
            this.exitIfMissing(VersionNoRevisionProcessor.VERSION, 'VERSION environment variable is not set.');
            this.exitIfMissing(VersionNoRevisionProcessor.GITHUB_OUTPUT, 'GITHUB_OUTPUT environment variable is not set.');

            const version = this.provider.get(VersionNoRevisionProcessor.VERSION);
            const versionNoRevision = VersionManager.calculateVersionNoRevision(version);
            this.outputVersionNoRevision(versionNoRevision);
        } catch (error) {
            this.handleError(error);
        }
    }

    private exitIfMissing(key: string, message: string): void {
        if (!this.provider.has(key)) {
            this.logger.error(message);
            ProcessOperations.exit(1);
        }
    }

    private outputVersionNoRevision(versionNoRevision: string): void {
        this.provider.set(VersionNoRevisionProcessor.VERSION_NO_REVISION, versionNoRevision);
        this.provider.apply();
        this.writer.write(VersionNoRevisionProcessor.VERSION_NO_REVISION, versionNoRevision);
        this.logger.log(`${VersionNoRevisionProcessor.VERSION_NO_REVISION}=${versionNoRevision}`);
    }

    private handleError(error: unknown): void {
        this.logger.error('Error while calculating version without revision:', error);
        ProcessOperations.exit(1);
    }
}