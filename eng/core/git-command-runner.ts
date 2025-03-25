import { ISynchronousCommandRunnerOptions, SynchronousCommandRunner } from './synchronous-command-runner';
import { RunnerOptions } from './runner-options';
import { IGitOperation } from './git-operation-builder';

export class GitCommandRunner {
    constructor(
        private readonly runner: SynchronousCommandRunner = new SynchronousCommandRunner(),
        private readonly options: ISynchronousCommandRunnerOptions = RunnerOptions.createDefaultOptions()) {
    }

    public run(operation: IGitOperation): string | Buffer {
        this.validateOperation(operation);
        return this.runner.run('git', [operation.op, ...operation.args], this.options);
    }

    private validateOperation(operation: IGitOperation): void {
        if (!operation.op) {
            throw new Error('Git Operation Command must be set');
        }
    }
}