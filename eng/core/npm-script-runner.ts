import { ProcessOperations } from '../core/process-operations';
import { RunnerOptions } from '../core/runner-options';
import { SynchronousCommandRunner } from '../core/synchronous-command-runner';
import { StdioOptions } from './stdio-builder';

export class NpmScriptRunner {
    private readonly command: string;

    constructor(private readonly commandRunner: SynchronousCommandRunner = new SynchronousCommandRunner(), private readonly env: Record<string, string> = {}) {
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
            console.log(`Running script: ${script}`);
            this.commandRunner.run(this.command, args, options);
            console.log(`Running script: ${script} completed successfully.`);
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
            console.error('Error running script:', error.message);
        } else {
            console.error('Error running script:', error);
        }
        ProcessOperations.exit(1);
    }
}