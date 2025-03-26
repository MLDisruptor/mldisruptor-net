import { GitCommandRunner } from "../core/git-command-runner";
import { GithubOutputWriter } from "../core/github-output-writer";
import { RecordProvider } from "../core/record-provider";
import { VersionNoRevisionProcessor } from "../lib/version-no-revision-processor";
import { PackageChangeDetector } from "../lib/package-change-detector";
import { ActCheckProcessor } from "../lib/act-check-processor";
import { TaggingProcessor } from "../lib/tagging-processor";
import { VersioningProcessor } from "../lib/versioning-processor";

function githubOuput(): void {
    const runner = new GitCommandRunner();
    const recordProvider = new RecordProvider();
    const gitRunner = new GitCommandRunner();
    const outputWriter = new GithubOutputWriter(recordProvider);

    const processors = [
        new ActCheckProcessor(recordProvider, outputWriter),
        new PackageChangeDetector(recordProvider, outputWriter, gitRunner),
        new VersioningProcessor(recordProvider, outputWriter, runner),
        new VersionNoRevisionProcessor(recordProvider, outputWriter),
        new TaggingProcessor(recordProvider, runner)
    ];

    processors.forEach(processor => processor.process());
}

githubOuput();