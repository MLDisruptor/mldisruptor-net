import { GitCommandRunner } from '../core/git-command-runner';
import { RecordProvider } from '../core/record-provider';
import { ProcessOperations } from '../core/process-operations';
import { GitOperationsRepository } from './git-operations-repository';
import { GithubOutputWriter } from '../core/github-output-writer';
import { ConsoleLogger } from '../core/console-logger';

export class PackageChangeDetector {
    private static readonly ISACT_KEY = 'ISACT';
    private static readonly CHANGES_KEY = 'CHANGES';

    constructor(
        private readonly provider: RecordProvider,
        private readonly writer: GithubOutputWriter,
        private readonly gitRunner: GitCommandRunner,
        private readonly processExit: typeof ProcessOperations.exit = ProcessOperations.exit,
        private readonly logger: ConsoleLogger = ConsoleLogger.instance
    ) { }

    private isActTest(): boolean {
        return this.provider.has(PackageChangeDetector.ISACT_KEY) && this.provider.get(PackageChangeDetector.ISACT_KEY) === 'true';
    }

    private hasLocalChanges(): boolean {
        const operation = GitOperationsRepository.checkLocalChanges();
        const output = this.gitRunner.run(operation).toString();
        return /^[AMRD]/m.test(output);
    }

    private hasGitDiffChanges(): boolean {
        const operation = GitOperationsRepository.checkGitDiffChanges();

        try {
            this.gitRunner.run(operation);
            return false; // No changes detected
        } catch {
            return true; // Changes detected
        }
    }

    private detectChanges(): boolean {
        return this.isActTest() ? this.hasLocalChanges() : this.hasGitDiffChanges();
    }

    private outputChanges(changesDetected: boolean): void {
        const changesDetectedString = changesDetected ? 'true' : 'false';
        this.provider.set(PackageChangeDetector.CHANGES_KEY, changesDetectedString);
        this.provider.apply();
        this.writer.write(PackageChangeDetector.CHANGES_KEY, changesDetectedString, true);
        this.logger.log(`${PackageChangeDetector.CHANGES_KEY}=${changesDetected}`);
    }

    private handleError(error: unknown): void {
        this.logger.error('Error while checking for changes:', error);
        this.processExit(1);
    }

    public process(): void {
        try {
            const changesDetected = this.detectChanges();
            this.outputChanges(changesDetected);
        } catch (error) {
            this.handleError(error);
        }
    }
}