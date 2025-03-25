import fs from 'fs';
import { FileWriter } from './file-writer';

jest.mock('fs');

describe('FileWriter', () => {
    let fileWriter: FileWriter;

    beforeEach(() => {
        fileWriter = new FileWriter();
        jest.clearAllMocks();
    });

    it('should append content to a file successfully', () => {
        const filePath = 'test-file.txt';
        const content = 'Test content';

        fileWriter.appendToFile(filePath, content);

        expect(fs.appendFileSync).toHaveBeenCalledWith(filePath, content);
    });

    it('should throw an error if filePath is empty', () => {
        const content = 'Test content';

        expect(() => fileWriter.appendToFile('', content)).toThrow("File path cannot be empty.");
        expect(fs.appendFileSync).not.toHaveBeenCalled();
    });

    it('should throw an error if content is empty', () => {
        const filePath = 'test-file.txt';

        expect(() => fileWriter.appendToFile(filePath, '')).toThrow("Content cannot be empty.");
        expect(fs.appendFileSync).not.toHaveBeenCalled();
    });

    it('should throw an error if fs.appendFileSync fails', () => {
        const filePath = 'test-file.txt';
        const content = 'Test content';

        (fs.appendFileSync as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Mocked fs error');
        });

        expect(() => fileWriter.appendToFile(filePath, content)).toThrow("Failed to append to file: Mocked fs error");
        expect(fs.appendFileSync).toHaveBeenCalledWith(filePath, content);
    });

    it('should handle appending to a file with special characters in the path', () => {
        const filePath = 'test-folder/special@file!.txt';
        const content = 'Special content';

        fileWriter.appendToFile(filePath, content);

        expect(fs.appendFileSync).toHaveBeenCalledWith(filePath, content);
    });

    it('should handle appending to a file with large content', () => {
        const filePath = 'large-file.txt';
        const content = 'A'.repeat(10_000); // 10,000 characters

        fileWriter.appendToFile(filePath, content);

        expect(fs.appendFileSync).toHaveBeenCalledWith(filePath, content);
    });

    it('should handle appending to a file with relative paths', () => {
        const filePath = './relative-path-file.txt';
        const content = 'Relative path content';

        fileWriter.appendToFile(filePath, content);

        expect(fs.appendFileSync).toHaveBeenCalledWith(filePath, content);
    });

    it('should handle appending to a file with absolute paths', () => {
        const filePath = 'C:/absolute-path-file.txt';
        const content = 'Absolute path content';

        fileWriter.appendToFile(filePath, content);

        expect(fs.appendFileSync).toHaveBeenCalledWith(filePath, content);
    });
});