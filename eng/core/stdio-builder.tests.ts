import { StdioBuilder, StdioOptions } from "./stdio-builder";

describe("StdioBuilder", () => {
    let builder: StdioBuilder;

    beforeEach(() => {
        builder = new StdioBuilder();
    });

    it("should default to 'inherit' when built without modifications", () => {
        const result: StdioOptions = builder.build();
        expect(result).toBe("inherit");
    });

    it("should set stdio to 'inherit' when inherit() is called", () => {
        const result: StdioOptions = builder.inherit().build();
        expect(result).toBe("inherit");
    });

    it("should set stdio to 'pipe' when pipe() is called", () => {
        const result: StdioOptions = builder.pipe().build();
        expect(result).toBe("pipe");
    });

    it("should set stdio to 'ignore' when ignore() is called", () => {
        const result: StdioOptions = builder.ignore().build();
        expect(result).toBe("ignore");
    });

    it("should set error stream correctly when error() is called", () => {
        const result: StdioOptions = builder.error("pipe").build();
        expect(result).toEqual(["inherit", "inherit", "pipe"]);
    });

    it("should set input stream correctly when input() is called", () => {
        const result: StdioOptions = builder.input("pipe").build();
        expect(result).toEqual(["pipe", "inherit", "inherit"]);
    });

    it("should set output stream correctly when output() is called", () => {
        const result: StdioOptions = builder.output("pipe").build();
        expect(result).toEqual(["inherit", "pipe", "inherit"]);
    });

    it("should allow chaining multiple methods", () => {
        const result: StdioOptions = builder
            .input("pipe")
            .output("ignore")
            .error("inherit")
            .build();
        expect(result).toEqual(["pipe", "ignore", "inherit"]);
    });

    it("should override previous stdio settings when methods are called multiple times", () => {
        const result: StdioOptions = builder
            .input("pipe")
            .output("ignore")
            .input("inherit")
            .build();
        expect(result).toEqual(["inherit", "ignore", "inherit"]);
    });
});