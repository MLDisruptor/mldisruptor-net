import { GithubOutputWriter } from "./github-output-writer";
import { FileWriter } from "./file-writer";
import { ProcessOperations } from "./process-operations";
import { RecordProvider } from "./record-provider";
import { ConsoleLogger } from "./console-logger";

jest.mock("./file-writer");
jest.mock("./process-operations");

describe("GithubOutputWriter", () => {
    let recordProviderMock: jest.Mocked<RecordProvider>;
    let fileWriterMock: jest.Mocked<FileWriter>;
    let logger: jest.Mocked<ConsoleLogger>;

    beforeEach(() => {
        recordProviderMock = {
            get: jest.fn(),
        } as unknown as jest.Mocked<RecordProvider>;

        fileWriterMock = new FileWriter() as jest.Mocked<FileWriter>;
        jest.spyOn(fileWriterMock, "appendToFile").mockImplementation();

        logger = {
            log: jest.fn(),
            error: jest.fn(),
        } as unknown as jest.Mocked<ConsoleLogger>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should write key-value pairs to the GitHub output file", () => {
        recordProviderMock.get.mockReturnValue("path/to/github-output");
        const writer = new GithubOutputWriter(recordProviderMock, logger);

        writer.write("key", "value");

        expect(recordProviderMock.get).toHaveBeenCalledWith("GITHUB_OUTPUT");

        fileWriterMock.appendToFile.mock.calls.forEach((call) => {
            expect(call[0][0]).toBe("path/to/github-output");
            expect(call[0][1]).toContain("key=value");
        });
    });

    it("should log an error if the GitHub output path is invalid", () => {
        recordProviderMock.get.mockReturnValue("");
        const writer = new GithubOutputWriter(recordProviderMock, logger);

        writer.write("key", "value");

        expect(logger.error).toHaveBeenCalledWith("Invalid GITHUB_OUTPUT path");
        expect(fileWriterMock.appendToFile).not.toHaveBeenCalled();
    });

    it("should exit the process if an error occurs and shouldExitOnFailure is true", () => {
        recordProviderMock.get.mockReturnValue("path/to/github-output");
        jest.spyOn(ProcessOperations, "exit").mockImplementation(() => { });

        const writer = new GithubOutputWriter(recordProviderMock, logger);
        jest.spyOn(writer as any, "safeExecute").mockReturnValue({ isError: true });

        writer.write("key", "value", true);

        expect(ProcessOperations.exit).toHaveBeenCalledWith(1);
    });

    it("should not exit the process if an error occurs and shouldExitOnFailure is false", () => {
        recordProviderMock.get.mockReturnValue("path/to/github-output");
        jest.spyOn(ProcessOperations, "exit").mockImplementation(() => { });

        const writer = new GithubOutputWriter(recordProviderMock, logger);
        jest.spyOn(writer as any, "safeExecute").mockReturnValue({ isError: true });

        writer.write("key", "value", false);

        expect(ProcessOperations.exit).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully during safe execution", () => {
        recordProviderMock.get.mockReturnValue("path/to/github-output");
        jest.spyOn(fileWriterMock, "appendToFile").mockImplementation(() => {
            throw new Error("Test Error");
        });

        const writer = new GithubOutputWriter(recordProviderMock, logger);

        expect(() => writer.write("key", "value")).not.toThrow();
    });
});