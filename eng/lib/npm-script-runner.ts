import { NpmScriptRunner } from '../core/npm-script-runner';
import { SynchronousCommandRunner } from '../core/synchronous-command-runner';

export function runNpmScript(script: string, env: Record<string, string> = {}, syncRunner: SynchronousCommandRunner = new SynchronousCommandRunner()): void {
    const runner = new NpmScriptRunner(syncRunner, env);
    runner.run(script);
}