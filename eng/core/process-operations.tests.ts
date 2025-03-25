import { ProcessOperations } from './process-operations';

describe('ProcessOperations', () => {
    afterEach(() => {
        // Clean up any environment variables set during tests
        delete process.env.TEST_VAR;
    });

    describe('get', () => {
        it('should return the value of an existing environment variable', () => {
            process.env.TEST_VAR = 'test_value';
            expect(ProcessOperations.get('TEST_VAR')).toBe('test_value');
        });

        it('should return an empty string if the environment variable does not exist', () => {
            expect(ProcessOperations.get('NON_EXISTENT_VAR')).toBe('');
        });
    });

    describe('has', () => {
        it('should return true if the environment variable exists', () => {
            process.env.TEST_VAR = 'test_value';
            expect(ProcessOperations.has('TEST_VAR')).toBe(true);
        });

        it('should return false if the environment variable does not exist', () => {
            expect(ProcessOperations.has('NON_EXISTENT_VAR')).toBe(false);
        });
    });

    describe('set', () => {
        it('should set the value of an environment variable', () => {
            ProcessOperations.set('TEST_VAR', 'new_value');
            expect(process.env.TEST_VAR).toBe('new_value');
        });
    });

    describe('exit', () => {
        it('should exit the process with the specified exit code', () => {
            const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number | string | null | undefined) => {
                throw new Error(`Process exited with code: ${code}`);
            });

            try {
                ProcessOperations.exit(0);
            } catch (e: any) {
                expect(e.message).toBe('Process exited with code: 0');
            }

            expect(mockExit).toHaveBeenCalledWith(0);
            mockExit.mockRestore();
        });
    });
});