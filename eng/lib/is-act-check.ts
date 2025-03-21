import fs from 'fs';

const isAct = process.env.ACT ? 'true' : 'false';
const githubOutput = process.env.GITHUB_OUTPUT;

if (githubOutput) {
    fs.appendFileSync(githubOutput, `ISACT=${isAct}\n`);
} else {
    console.error('GITHUB_OUTPUT environment variable is not set.');
    process.exit(1);
}