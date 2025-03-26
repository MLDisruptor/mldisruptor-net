import { GitOperationsRepository } from './git-operations-repository';
import { GitCommandRunner } from '../core/git-command-runner';
import { ProcessOperations } from '../core/process-operations';
import { RecordProvider } from '../core/record-provider';
import { ConsoleLogger } from '../core/console-logger';

export class TaggingProcessor {
    private static readonly ACT_KEY = 'ACT';
    private static readonly CHANGES_KEY = 'CHANGES';
    private static readonly VERSION_KEY = 'version';
    private static readonly GITHUB_TOKEN_KEY = 'GITHUB_TOKEN';

    constructor(
        private readonly provider: RecordProvider,
        private readonly runner: GitCommandRunner,
        private readonly logger: ConsoleLogger = ConsoleLogger.instance
    ) { }

    public process(): void {
        try {
            const version = this.getVersionFromEnv();
            this.createAndPushGitTag(version);
        } catch (error) {
            this.logger.error('Error while creating and pushing the tag:', error);
            ProcessOperations.exit(1);
        }
    }

    private getVersionFromEnv(): string {
        const version = this.provider.get(TaggingProcessor.VERSION_KEY);
        if (!version) {
            throw new Error('VERSION environment variable is not set.');
        }
        return version;
    }

    private createAndPushGitTag(version: string): void {
        const shouldSkip = this.shouldSkip();
        if (shouldSkip) {
            this.logger.log('Skipping tag creation and push.');
            return;
        }

        const githubToken = this.provider.get(TaggingProcessor.GITHUB_TOKEN_KEY);
        if (!githubToken) {
            throw new Error('GITHUB_TOKEN is not set.');
        }

        this.runner.run(GitOperationsRepository.configureUserName());
        this.runner.run(GitOperationsRepository.configureUserEmail());
        this.runner.run(GitOperationsRepository.configureRemoteUrl(githubToken));

        this.runner.run(GitOperationsRepository.createTag(version));
        this.runner.run(GitOperationsRepository.pushTag(version));

        this.logger.log(`Created and pushed new tag: ${version}`);
    }

    private shouldSkip(): boolean {
        const noChanges = !this.hasChanges();
        const isAct = this.isAct();
        return isAct || noChanges;
    }

    private isAct(): boolean {
        return this.provider.has(TaggingProcessor.ACT_KEY);
    }

    private hasChanges(): boolean {
        return this.provider.get(TaggingProcessor.CHANGES_KEY) === 'true';
    }
}