import { GitOperationsRepository } from './git-operations-repository';
import { IGitOperation } from '../core/git-operation-builder'; // Assuming IGitOperation is defined here

describe('GitOperationsRepository', () => {
    test('describeTags should return correct IGitOperation', () => {
        const result = GitOperationsRepository.describeTags();
        const expectedOperation: IGitOperation = {
            op: 'describe',
            args: ['--tags', '--abbrev=0'],
        };
        expect(result).toEqual(expectedOperation);
    });

    test('latestCommitMessage should return correct IGitOperation', () => {
        const result = GitOperationsRepository.latestCommitMessage();
        const expectedOperation: IGitOperation = {
            op: 'log',
            args: ['-1', '--pretty=%B'],
        };
        expect(result).toEqual(expectedOperation);
    });

    test('configureUserName should return correct IGitOperation', () => {
        const result = GitOperationsRepository.configureUserName();
        const expectedOperation: IGitOperation = {
            op: 'config',
            args: ['user.name', 'github-actions[bot]'],
        };
        expect(result).toEqual(expectedOperation);
    });

    test('configureUserEmail should return correct IGitOperation', () => {
        const result = GitOperationsRepository.configureUserEmail();
        const expectedOperation: IGitOperation = {
            op: 'config',
            args: ['user.email', 'github-actions[bot]@users.noreply.github.com'],
        };
        expect(result).toEqual(expectedOperation);
    });

    test('configureRemoteUrl should return correct IGitOperation', () => {
        const githubToken = 'test-token';
        const result = GitOperationsRepository.configureRemoteUrl(githubToken);
        const expectedOperation: IGitOperation = {
            op: 'remote',
            args: ['set-url', 'origin', `https://x-access-token:${githubToken}@github.com/MLDisruptor/mldisruptor-net.git`],
        };
        expect(result).toEqual(expectedOperation);
    });

    test('createTag should return correct IGitOperation', () => {
        const newVersion = 'v1.0.0';
        const result = GitOperationsRepository.createTag(newVersion);
        const expectedOperation: IGitOperation = {
            op: 'tag',
            args: [newVersion],
        };
        expect(result).toEqual(expectedOperation);
    });

    test('pushTag should return correct IGitOperation', () => {
        const newVersion = 'v1.0.0';
        const result = GitOperationsRepository.pushTag(newVersion);
        const expectedOperation: IGitOperation = {
            op: 'push',
            args: ['origin', newVersion],
        };
        expect(result).toEqual(expectedOperation);
    });

    test('checkLocalChanges should return correct IGitOperation', () => {
        const result = GitOperationsRepository.checkLocalChanges();
        const expectedOperation: IGitOperation = {
            op: 'status',
            args: ['--porcelain', './src/packages/MLDisruptor.NET', './src/packages/MLDisruptor.NET.PerformancePredictor'],
        };
        expect(result).toEqual(expectedOperation);
    });

    test('checkGitDiffChanges should return correct IGitOperation', () => {
        const result = GitOperationsRepository.checkGitDiffChanges();
        const expectedOperation: IGitOperation = {
            op: 'diff',
            args: ['--quiet', 'HEAD', './src/packages/MLDisruptor.NET', './src/packages/MLDisruptor.NET.PerformancePredictor'],
        };
        expect(result).toEqual(expectedOperation);
    });
});