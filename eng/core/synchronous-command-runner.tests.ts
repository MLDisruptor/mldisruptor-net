import { execSync, ExecSyncOptionsWithBufferEncoding } from 'child_process';
import { ISynchronousCommandRunnerOptions, SynchronousCommandRunner } from './synchronous-command-runner';

jest.mock('child_process', () => ({
    execSync: jest.fn()
}));

describe('execSync', () => {
    it('should call execSync with the provided command, arguments, and I/O configuration', () => {
        // Arrange
        const command = 'echo';
        const args = ['Hello, World!'];
        const ioConfig: ExecSyncOptionsWithBufferEncoding = {
            stdio: ['inherit', 'inherit', 'inherit']
        };
        const fullCommand = `${command} ${args.join(' ')}`;

        // Act
        execSync(fullCommand, ioConfig);

        // Assert
        expect(execSync).toHaveBeenCalledWith(fullCommand, ioConfig);
    });
});

describe('SynchronousCommandRunner', () => {
    let runner: SynchronousCommandRunner;

    beforeEach(() => {
        runner = new SynchronousCommandRunner();
        jest.clearAllMocks();
    });

    describe('run', () => {
        it('should call execSync with the provided command, arguments, and I/O configuration', () => {
            // Given
            const command = 'echo';
            const args = ['Hello, World!'];
            const ioConfig = <ISynchronousCommandRunnerOptions>{ stdio: 'inherit' };
            const fullCommand = `${command} ${args.join(' ')}`;

            // When
            runner.run(command, args, ioConfig);

            // Then
            expect(execSync).toHaveBeenCalledWith(fullCommand, ioConfig);
        });
    });
});