import { ProcessOperations } from '../core/process-operations';
import { RunnerOptions } from '../core/runner-options';
import { SynchronousCommandRunner } from '../core/synchronous-command-runner';
import { ConsoleLogger } from './console-logger';
import { StdioOptions } from './stdio-builder';

export class NpmScriptRunner {
    private readonly command: string;

    constructor(
        private readonly commandRunner: SynchronousCommandRunner = new SynchronousCommandRunner(),
        private readonly env: Record<string, string> = {},
        private readonly logger: ConsoleLogger = ConsoleLogger.instance) {
        this.command = 'npm';
    }

    public run(script: string): void {
        if (!script || script.trim().length === 0) {
            this.handleError(new Error('Script name is required.'));
            return;
        }

        const args = ['run', script];
        const options = this.buildRunnerOptions();

        try {
            this.logger.log(`Running script: ${script}`);
            this.commandRunner.run(this.command, args, options);
            this.logger.log(`Running script: ${script} completed successfully.`);
        } catch (error: unknown) {
            this.handleError(error);
        }
    }

    private buildRunnerOptions(): { stdio: StdioOptions; env: Record<string, string> } {
        return new RunnerOptions()
            .input('inherit')
            .output('inherit')
            .error('inherit')
            .adopt(process.env)
            .adopt(this.env)
            .apply()
            .build();
    }

    private handleError(error: unknown): void {
        if (error instanceof Error) {
            this.logger.error('Error running script:', error.message);
        } else {
            this.logger.error('Error running script:', error);
        }
        ProcessOperations.exit(1);
    }
}