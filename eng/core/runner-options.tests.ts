import { RunnerOptions } from "./runner-options";

describe("RunnerOptions", () => {
    let runnerOptions: RunnerOptions;

    beforeEach(() => {
        runnerOptions = new RunnerOptions();
    });

    describe("createDefaultOptions", () => {
        it("should create default runner options with stdio set to 'inherit'", () => {
            const result = RunnerOptions.createDefaultOptions();
            expect(result.stdio).toEqual(['pipe', 'pipe', 'inherit']);
        });

        it("should create default runner options with an empty environment (env)", () => {
            const result = RunnerOptions.createDefaultOptions();
            expect(result.env).toEqual({});
        });
    });

    describe("stdio", () => {
        it("should allow modifying the input stream (pipe, inherit, ignore, or a file descriptor)", () => {
            runnerOptions.input("pipe");
            expect(runnerOptions.build().stdio).toEqual(["pipe", "inherit", "inherit"]);
        });

        it("should allow modifying the output stream (pipe, inherit, ignore, or a file descriptor)", () => {
            runnerOptions.output("pipe");
            expect(runnerOptions.build().stdio).toEqual(["inherit", "pipe", "inherit"]);
        });

        it("should allow modifying the error stream (pipe, inherit, ignore, or a file descriptor)", () => {
            runnerOptions.error("pipe");
            expect(runnerOptions.build().stdio).toEqual(["inherit", "inherit", "pipe"]);
        });

        it("should allow chaining modifications to stdio options (e.g., input, output, error)", () => {
            runnerOptions.input("pipe").output("pipe").error("pipe");
            expect(runnerOptions.build().stdio).toEqual(["pipe", "pipe", "pipe"]);
        });

        it("should build the correct stdio configuration after modifications", () => {
            runnerOptions.input("pipe").output("pipe").error("pipe");
            expect(runnerOptions.build().stdio).toEqual(["pipe", "pipe", "pipe"]);
        });

        it("should handle invalid StdioOption values (e.g., null, undefined, or unsupported types)", () => {
            expect(() => runnerOptions.input(null as any)).not.toThrow();
            expect(() => runnerOptions.input(undefined as any)).not.toThrow();
            expect(() => runnerOptions.input("unsupported" as any)).not.toThrow();
        });
    });

    describe("env", () => {
        it("should allow appending new environment variables", () => {
            runnerOptions.append("KEY", "VALUE");
            expect(runnerOptions.build().env).toEqual({ KEY: "VALUE" });
        });

        it("should allow adopting an existing environment object (e.g., process.env)", () => {
            runnerOptions.adopt({ KEY: "VALUE" });
            expect(runnerOptions.build().env).toEqual({ KEY: "VALUE" });
        });

        it("should filter out undefined values when adopting an environment object", () => {
            runnerOptions.adopt({ KEY: undefined });
            expect(runnerOptions.build().env).toEqual({});
        });

        it("should allow applying the environment to process.env", () => {
            runnerOptions.append("KEY", "VALUE").apply();
            expect(process.env.KEY).toBe("VALUE");
        });

        it("should allow deleting environment variables", () => {
            runnerOptions.append("KEY", "VALUE").delete("KEY");
            expect(runnerOptions.build().env).toEqual({});
        });

        it('should build the correct environment configuration after modifications', () => {
            runnerOptions.append("KEY", "VALUE").delete("KEY").append("KEY2", "VALUE2");
            expect(runnerOptions.build().env).toEqual({ KEY2: "VALUE2" });
        });

        it("should handle invalid keys or values when appending (e.g., null, undefined, or empty strings)", () => {
            expect(() => runnerOptions.append(null as any, "VALUE")).not.toThrow();
            expect(() => runnerOptions.append(undefined as any, "VALUE")).not.toThrow();
            expect(() => runnerOptions.append("", "VALUE")).not.toThrow();
        });

        it("should handle cases where apply is called without any environment variables", () => {
            expect(() => runnerOptions.apply()).not.toThrow();
        });

        it("should handle cases where delete is called with a non-existent key", () => {
            expect(() => runnerOptions.delete("KEY")).not.toThrow();
        });
    });

    describe("combined", () => {
        it("should build combined options (stdio + env) correctly after modifications", () => {
            runnerOptions.input("pipe").output("pipe").error("pipe").append("KEY", "VALUE");
            const result = runnerOptions.build();
            expect(result.stdio).toEqual(["pipe", "pipe", "pipe"]);
            expect(result.env).toEqual({ KEY: "VALUE" });
        });

        it("should allow chaining modifications to both stdio and env options", () => {
            runnerOptions.input("pipe").output("pipe").error("pipe").append("KEY", "VALUE").delete("KEY");
            const result = runnerOptions.build();
            expect(result.stdio).toEqual(["pipe", "pipe", "pipe"]);
            expect(result.env).toEqual({});
        });

        it("should return a valid object with stdio and env when build is called", () => {
            const result = runnerOptions.build();
            expect(result).toEqual({ stdio: "inherit", env: {} });
        });
    });

});