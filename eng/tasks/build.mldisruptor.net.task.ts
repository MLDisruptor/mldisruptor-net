import { runNpmScript } from "../lib/npm-script-runner";

const version = process.env.VERSION;

if (!version) {
    throw new Error('VERSION environment variable is not set.');
}

console.log(`Building ML Disruptor .NET with version: ${version}`);

runNpmScript(`build:mldisruptor-net`, { VERSION: version });