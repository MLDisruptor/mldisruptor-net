import { VersionManager } from './version-manager';

describe('VersionManager', () => {
    describe('parseVersion', () => {
        it('should correctly parse a valid version string', () => {
            const result = VersionManager.parseVersion('1.2.3.4');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, revision: 4 });
        });

        it('should handle missing revision by defaulting to 0', () => {
            const result = VersionManager.parseVersion('1.2.3');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, revision: 0 });
        });

        it('should throw an error for an invalid version string', () => {
            expect(() => VersionManager.parseVersion('invalid')).toThrow();
        });

        it('should throw an error for an empty version string', () => {
            expect(() => VersionManager.parseVersion('')).toThrow();
        });
    });

    describe('formatVersion', () => {
        it('should correctly format a valid VersionParts object', () => {
            const result = VersionManager.formatVersion({ major: 1, minor: 2, patch: 3, revision: 4 });
            expect(result).toBe('1.2.3.4');
        });
    });

    describe('incrementVersion', () => {
        it('should correctly increment the major version', () => {
            const result = VersionManager.incrementVersion({ major: 1, minor: 2, patch: 3, revision: 4 }, 'major');
            expect(result).toEqual({ major: 2, minor: 0, patch: 0, revision: 0 });
        });

        it('should correctly increment the minor version', () => {
            const result = VersionManager.incrementVersion({ major: 1, minor: 2, patch: 3, revision: 4 }, 'minor');
            expect(result).toEqual({ major: 1, minor: 3, patch: 0, revision: 0 });
        });

        it('should correctly increment the patch version', () => {
            const result = VersionManager.incrementVersion({ major: 1, minor: 2, patch: 3, revision: 4 }, 'patch');
            expect(result).toEqual({ major: 1, minor: 2, patch: 4, revision: 0 });
        });

        it('should correctly increment the revision version', () => {
            const result = VersionManager.incrementVersion({ major: 1, minor: 2, patch: 3, revision: 4 }, 'revision');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, revision: 5 });
        });

        it('should default to revision increment for an invalid increment type', () => {
            const result = VersionManager.incrementVersion({ major: 1, minor: 2, patch: 3, revision: 4 }, 'invalid' as any);
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, revision: 5 });
        });
    });

    describe('defaultVersion', () => {
        it('should have the correct default version', () => {
            expect(VersionManager.defaultVersion).toBe('0.0.10.0');
        });
    });
});