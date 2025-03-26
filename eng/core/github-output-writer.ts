import { ConsoleLogger } from "./console-logger";
import { FileWriter } from "./file-writer";
import { ProcessOperations } from "./process-operations";
import { RecordProvider } from "./record-provider";

export class GithubOutputWriter {
    private static readonly GITHUB_OUTPUT_KEY = 'GITHUB_OUTPUT';

    public constructor(
        private readonly provider: RecordProvider,
        private readonly logger: ConsoleLogger = ConsoleLogger.instance) { }

    public write(key: string, value: string, shouldExitOnFailure: boolean = false): void {
        const githubOutput = this.provider.get(GithubOutputWriter.GITHUB_OUTPUT_KEY);

        const result = this.safeExecute(() => {
            if (!this.isValidGitHubOutputPath(githubOutput)) {
                return { isError: true, message: 'Invalid GITHUB_OUTPUT path' };
            }
            this.appendKeyValueToGithubOutput(key, value, githubOutput);
            return { isError: false };
        });

        if (result.isError) {
            this.logger.error(result.message);
            if (shouldExitOnFailure) {
                ProcessOperations.exit(1);
            }
        }
    }

    private appendKeyValueToGithubOutput(key: string, value: string, githubOutput: string): void {
        const formattedEntry = this.formatKeyValue(key, value);
        this.writeToFile(githubOutput, formattedEntry);
    }

    private formatKeyValue(key: string, value: string): string {
        return `${key}=${value}\n`;
    }

    private writeToFile(filePath: string, content: string): void {
        const fs = new FileWriter();
        fs.appendToFile(filePath, content);
    }

    private isValidGitHubOutputPath(githubOutput: string): boolean {
        return !!githubOutput?.trim();
    }

    private safeExecute(action: () => { isError: boolean; message?: string }): { isError: boolean; message?: string } {
        try {
            return action();
        } catch (error) {
            return { isError: true, message: `Unexpected error: ${error}` };
        }
    }
}