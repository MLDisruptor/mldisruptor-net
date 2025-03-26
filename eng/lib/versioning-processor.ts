import { GitOperationsRepository } from './git-operations-repository';
import { GitCommandRunner } from '../core/git-command-runner';
import { IncrementType, VersionManager } from '../core/version-manager';
import { GithubOutputWriter } from '../core/github-output-writer';
import { RecordProvider } from '../core/record-provider';
import { ConsoleLogger } from '../core/console-logger';

export class VersioningProcessor {
    private readonly defaultVersion = VersionManager.defaultVersion;

    private static readonly ACT_KEY = 'ACT';

    constructor(
        private readonly provider: RecordProvider,
        private readonly writer: GithubOutputWriter,
        private readonly runner: GitCommandRunner,
        private readonly logger: ConsoleLogger = ConsoleLogger.instance
    ) { }

    public process(): void {
        if (this.isAct()) {
            this.writeOutput('version', this.defaultVersion);
            this.logger.log('Skipping versioning because the environment is running under act.');
            return;
        }

        const latestTag = this.getLatestTag();
        this.writeOutput('latesttag', latestTag);

        const incrementType = this.determineIncrementType();
        this.writeOutput('increment', incrementType);

        const currentVersionParts = VersionManager.parseVersion(latestTag);
        const newVersionParts = VersionManager.incrementVersion(currentVersionParts, incrementType);
        const newVersion = VersionManager.formatVersion(newVersionParts);

        this.writeOutput('version', newVersion);
    }

    private isAct(): boolean {
        return this.provider.has(VersioningProcessor.ACT_KEY);
    }

    private getLatestTag(): string {
        try {
            return this.runner.run(GitOperationsRepository.describeTags()).toString().trim();
        } catch {
            this.logger.warn(`No tags found. Defaulting to version "${this.defaultVersion}".`);
            return this.defaultVersion;
        }
    }

    private determineIncrementType(): IncrementType {
        const commitMessage = this.runner.run(GitOperationsRepository.latestCommitMessage()).toString().trim();
        const isMajor = commitMessage.includes('BREAKING CHANGE') || commitMessage.startsWith('DEPRECATED') || commitMessage.startsWith('SECURITY');
        const isMinor = commitMessage.startsWith('feat');

        if (isMajor) {
            return 'major';
        } else if (isMinor) {
            return 'minor';
        } else {
            return 'patch';
        }
    }

    private writeOutput(key: string, value: string): void {
        this.provider.set(key, value);
        this.provider.apply();
        this.writer.write(key, value);
        this.logger.log(`${key}=${value}`);
    }
}