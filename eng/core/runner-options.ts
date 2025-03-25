import { EnvironmentRecordBuilder } from "./environment-record-builder";
import { StdioBuilder, StdioOption, StdioOptions } from "./stdio-builder";
import { ISynchronousCommandRunnerOptions } from "./synchronous-command-runner";

export class RunnerOptions {
    private readonly stdio: StdioBuilder;
    private readonly env: EnvironmentRecordBuilder;

    public static createDefaultOptions(): ISynchronousCommandRunnerOptions {
        const stdio = new StdioBuilder()
            .input('pipe') // Ignore input
            .output('pipe') // Capture output
            .error('inherit') // Print errors to the console
            .build();
        const env = new EnvironmentRecordBuilder().build();
        const options = {
            stdio: stdio,
            env: env,
        };
        return options;
    }

    public constructor() {
        this.stdio = new StdioBuilder();
        this.env = new EnvironmentRecordBuilder();
    }

    public input(option: StdioOption): this {
        this.stdio.input(option);
        return this;
    }

    public output(option: StdioOption): this {
        this.stdio.output(option);
        return this;
    }

    public error(option: StdioOption): this {
        this.stdio.error(option);
        return this;
    }

    public apply(): this {
        this.env.apply();
        return this;
    }

    public adopt(env: NodeJS.ProcessEnv): this {
        this.env.adopt(env);
        return this;
    }

    public append(key: string, value: string): this {
        this.env.append(key, value);
        return this;
    }

    public delete(key: string): this {
        this.env.delete(key);
        return this;
    }

    public build(): { stdio: StdioOptions; env: Record<string, string>; } {
        return {
            stdio: this.stdio.build(),
            env: this.env.build(),
        };
    }

}