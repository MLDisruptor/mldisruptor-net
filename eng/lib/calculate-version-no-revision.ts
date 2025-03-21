import fs from 'fs';

const version = process.env.VERSION ?? '';
const githubOutput = process.env.GITHUB_OUTPUT;

if (!version) {
    console.error('VERSION environment variable is not set.');
    process.exit(1);
}

if (!githubOutput) {
    console.error('GITHUB_OUTPUT environment variable is not set.');
    process.exit(1);
}

try {
    // Remove the last ".0" from the version
    const versionNoRevision = version.split('.').slice(0, -1).join('.');
    fs.appendFileSync(githubOutput, `VERSION_NO_REVISION=${versionNoRevision}\n`);
    console.log(`VERSION_NO_REVISION=${versionNoRevision}`);
} catch (error) {
    console.error('Error while calculating version without revision:', error);
    process.exit(1);
}