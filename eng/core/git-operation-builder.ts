export interface IGitOperation {
    op: string;
    args: string[];
}

export class GitOperationBuilder {
    private operation: string | null = null;
    private readonly opArguments: string[] = [];

    public op(command: string): this {
        this.operation = command;
        this.opArguments.length = 0;
        return this;
    }

    public args(...args: string[]): this {
        this.opArguments.push(...args);
        return this;
    }

    public build(): IGitOperation {
        if (this.operation === null) {
            throw new Error('Git Operation Command must be set');
        }

        return {
            op: this.operation,
            args: this.opArguments,
        };
    }
}