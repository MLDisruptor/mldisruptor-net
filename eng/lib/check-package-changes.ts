import fs from 'fs';
import { execSync } from 'child_process';

const isAct = process.env.ISACT === 'true';
const githubOutput = process.env.GITHUB_OUTPUT;

if (!githubOutput) {
    console.error('GITHUB_OUTPUT environment variable is not set.');
    process.exit(1);
}

try {
    let changesDetected = false;

    if (isAct) {
        // ACT detected, check for local changes
        const statusOutput = execSync(
            'git status --porcelain ./src/packages/MLDisruptor.NET ./src/packages/MLDisruptor.NET.PerformancePredictor'
        ).toString();
        changesDetected = /^[AMRD]/m.test(statusOutput);
    } else {
        // Normal GitHub Actions behavior
        try {
            execSync(
                'git diff --quiet HEAD ./src/packages/MLDisruptor.NET ./src/packages/MLDisruptor.NET.PerformancePredictor'
            );
        } catch {
            changesDetected = true;
        }
    }

    fs.appendFileSync(githubOutput, `CHANGES=${changesDetected ? 'true' : 'false'}\n`);
} catch (error) {
    console.error('Error while checking for changes:', error);
    process.exit(1);
}