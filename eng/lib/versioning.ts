import { execSync } from 'child_process';

const defaultVersion = '0.0.10';
type IncrementType = 'major' | 'minor' | 'patch';

// Get the latest Git tag
function getLatestTag() {
    try {
        return execSync('git describe --tags --abbrev=0').toString().trim();
    } catch (error) {
        console.warn(`No tags found. Defaulting to version "${defaultVersion}".`);
        return defaultVersion; // Default version if no tags exist
    }
}

// Increment the version based on SemVer rules
function incrementVersion(currentVersion: string, incrementType: IncrementType) {
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    switch (incrementType) {
        case 'major':
            return `${major + 1}.0.0`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'patch':
        default:
            return `${major}.${minor}.${patch + 1}`;
    }
}

// Analyze commit messages to determine the increment type
function determineIncrementType(): IncrementType {
    const commitMessages = execSync('git log -1 --pretty=%B').toString().trim();

    const isMajor = commitMessages.includes('BREAKING CHANGE')
        || commitMessages.startsWith('DEPRECATED')
        || commitMessages.startsWith('SECURITY');
    const isMinor = commitMessages.startsWith('feat');

    if (isMajor) {
        return 'major';
    } else if (isMinor) {
        return 'minor';
    } else {
        return 'patch';
    }
}

// Create a new Git tag
function createGitTag(newVersion: string) {
    execSync(`git tag ${newVersion}`);
    execSync('git push --tags');
    console.log(`Created and pushed new tag: ${newVersion}`);
}

// Main function
function main() {
    // Check if running in the act environment
    if (process.env.ACT) {
        console.log(`::set-output name=version::${defaultVersion}`);
        console.log('Skipping versioning because the environment is running under act.');
        return;
    }

    const latestTag = getLatestTag();
    console.log(`Latest tag: ${latestTag}`);

    const incrementType = determineIncrementType();
    console.log(`Determined increment type: ${incrementType}`);

    const newVersion = incrementVersion(latestTag, incrementType);
    console.log(`New version: ${newVersion}`);

    createGitTag(newVersion);

    // Output the version for GitHub Actions
    console.log(`::set-output name=version::${newVersion}`);
}

// Run the script
main();