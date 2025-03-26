import { GithubOutputWriter } from "../core/github-output-writer";
import { RecordProvider } from "../core/record-provider";

export class ActCheckProcessor {
    private static readonly ACT_KEY = 'ACT';
    private static readonly ISACT_KEY = 'ISACT';
    private static readonly shouldExitOnFailure = true;

    constructor(
        private readonly recordProvider: RecordProvider,
        private readonly writer: GithubOutputWriter
    ) { }

    private determineIsAct(): string {
        return this.recordProvider.get(ActCheckProcessor.ACT_KEY) ? 'true' : 'false';
    }

    private writeIsAct(isAct: string): void {
        this.recordProvider.set(ActCheckProcessor.ISACT_KEY, isAct);
        this.recordProvider.apply();
        this.writer.write(ActCheckProcessor.ISACT_KEY, isAct, ActCheckProcessor.shouldExitOnFailure);
    }

    public process(): void {
        const isAct = this.determineIsAct();
        this.writeIsAct(isAct);
    }
}