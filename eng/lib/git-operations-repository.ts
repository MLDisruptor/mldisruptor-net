import { GitOperationBuilder } from "../core/git-operation-builder";

export const GitOperationsRepository = {
    describeTags: () =>
        new GitOperationBuilder()
            .op('describe')
            .args('--tags', '--abbrev=0')
            .build(),

    latestCommitMessage: () =>
        new GitOperationBuilder()
            .op('log')
            .args('-1', '--pretty=%B')
            .build(),

    configureUserName: () =>
        new GitOperationBuilder()
            .op('config')
            .args('user.name', 'github-actions[bot]')
            .build(),

    configureUserEmail: () =>
        new GitOperationBuilder()
            .op('config')
            .args('user.email', 'github-actions[bot]@users.noreply.github.com')
            .build(),

    configureRemoteUrl: (githubToken: string) =>
        new GitOperationBuilder()
            .op('remote')
            .args('set-url', 'origin', `https://x-access-token:${githubToken}@github.com/MLDisruptor/mldisruptor-net.git`)
            .build(),

    createTag: (newVersion: string) =>
        new GitOperationBuilder()
            .op('tag')
            .args(newVersion)
            .build(),

    pushTag: (newVersion: string) =>
        new GitOperationBuilder()
            .op('push')
            .args('origin', newVersion)
            .build(),

    checkLocalChanges: () =>
        new GitOperationBuilder()
            .op('status')
            .args('--porcelain')
            .args('./src/packages/MLDisruptor.NET')
            .args('./src/packages/MLDisruptor.NET.PerformancePredictor')
            .build(),

    checkGitDiffChanges: () =>
        new GitOperationBuilder()
            .op('diff')
            .args('--quiet', 'HEAD')
            .args('./src/packages/MLDisruptor.NET')
            .args('./src/packages/MLDisruptor.NET.PerformancePredictor')
            .build(),
};