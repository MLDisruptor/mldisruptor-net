import fs from 'fs';

export class FileWriter {
    public appendToFile(filePath: string, content: string): void {
        this.validateInputs(filePath, content);

        try {
            fs.appendFileSync(filePath, content);
        } catch (error) {
            this.handleError(error);
        }
    }

    private validateInputs(filePath: string, content: string): void {
        if (!filePath) {
            throw new Error("File path cannot be empty.");
        }
        if (!content) {
            throw new Error("Content cannot be empty.");
        }
    }

    private handleError(error: unknown): void {
        if (error instanceof Error) {
            throw new Error(`Failed to append to file: ${error.message}`);
        } else {
            throw new Error(`Failed to append to file due to an unknown error: ${error}`);
        }
    }
}