import { execSync, ExecSyncOptions } from "child_process";
import { StdioOptions } from "./stdio-builder";

export interface ISynchronousCommandRunnerOptions {
    stdio: StdioOptions;
    env?: Record<string, string>;
    encoding?: BufferEncoding;
}

export class SynchronousCommandRunner {
    run(command: string, args: string[], options: ISynchronousCommandRunnerOptions): string | Buffer {
        const fullCommand = `${command} ${args.join(' ')}`;
        return execSync(fullCommand, <ExecSyncOptions>{
            stdio: options.stdio,
            env: options.env,
            encoding: options.encoding
        });
    }
}