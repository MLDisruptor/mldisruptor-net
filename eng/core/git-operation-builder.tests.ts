import { GitOperationBuilder } from './git-operation-builder';

describe('GitOperationBuilder', () => {
    let builder: GitOperationBuilder;

    beforeEach(() => {
        builder = new GitOperationBuilder();
    });

    it('should build a Git operation with a command and arguments', () => {
        const operation = builder
            .op('status')
            .args('--porcelain')
            .args('./path')
            .build();

        expect(operation).toEqual({
            op: 'status',
            args: ['--porcelain', './path'],
        });
    });

    it('should reset arguments when the command is changed', () => {
        builder.op('status').args('--porcelain', './path');
        const operation = builder.op('diff').args('--quiet', 'HEAD').build();

        expect(operation).toEqual({
            op: 'diff',
            args: ['--quiet', 'HEAD'],
        });
    });

    it('should throw an error if the command is not set', () => {
        expect(() => builder.args('--porcelain').build()).toThrow('Git Operation Command must be set');
    });

    it('should allow chaining multiple arguments', () => {
        const operation = builder
            .op('log')
            .args('--oneline')
            .args('--graph')
            .build();

        expect(operation).toEqual({
            op: 'log',
            args: ['--oneline', '--graph'],
        });
    });
});