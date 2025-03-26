export type IncrementType = 'major' | 'minor' | 'patch' | 'revision';

export interface VersionParts {
    major: number;
    minor: number;
    patch: number;
    revision: number;
}

export class VersionManager {
    static readonly defaultVersion = '0.0.10.0';

    static parseVersion(version: string): VersionParts {
        const [major, minor, patch, revision] = version.split('.').map(v => parseInt(v, 10));
        const anyNaN = [major, minor, patch].some(isNaN);
        if (anyNaN) {
            throw new Error(`Invalid version string: "${version}".`);
        }
        return { major, minor, patch, revision: revision || 0 };
    }

    static formatVersion(parts: VersionParts): string {
        return `${parts.major}.${parts.minor}.${parts.patch}.${parts.revision ?? 0}`;
    }

    static incrementVersion(parts: VersionParts, incrementType: IncrementType): VersionParts {
        switch (incrementType) {
            case 'major':
                return { major: parts.major + 1, minor: 0, patch: 0, revision: 0 };
            case 'minor':
                return { major: parts.major, minor: parts.minor + 1, patch: 0, revision: 0 };
            case 'patch':
                return { major: parts.major, minor: parts.minor, patch: parts.patch + 1, revision: 0 };
            case 'revision':
            default:
                return { major: parts.major, minor: parts.minor, patch: parts.patch, revision: parts.revision + 1 };
        }
    }

    static calculateVersionNoRevision(version: string): string {
        const versionParts = version.split('.');
        if (versionParts.length < 4) {
            return version;
        } else {
            return versionParts.slice(0, -1).join('.');
        }
    }
}