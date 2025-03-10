import { execSync } from 'child_process';

export function runNpmScript(script: string): void {
    const command = `npm run ${script}`;

    try {
        console.log(`Running script: ${script}`);
        execSync(command, { stdio: 'inherit' });
        console.log('Run completed successfully.');
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error running script:', error.message);
        } else {
            console.error('Error running script:', error);
        }
        process.exit(1);
    }
}