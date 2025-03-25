import { EnvironmentRecordBuilder } from "./environment-record-builder";

describe("EnvironmentRecordBuilder", () => {
    let builder: EnvironmentRecordBuilder;

    beforeEach(() => {
        builder = new EnvironmentRecordBuilder();
    });

    it("should initialize with an empty environment record", () => {
        const result = builder.build();
        expect(result).toEqual({});
    });

    it("should clear the environment record", () => {
        builder.append("KEY", "VALUE");
        builder.clear();
        const result = builder.build();
        expect(result).toEqual({});
    });

    it("should apply the environment record to process.env", () => {
        builder.append("TEST_KEY", "TEST_VALUE").apply();
        expect(process.env.TEST_KEY).toBe("TEST_VALUE");

        // Cleanup
        delete process.env.TEST_KEY;
    });

    it("should adopt values from a provided environment object", () => {
        const env = { KEY1: "VALUE1", KEY2: "VALUE2", KEY3: undefined };
        builder.adopt(env);
        const result = builder.build();
        expect(result).toEqual({ KEY1: "VALUE1", KEY2: "VALUE2" }); // Undefined values should be filtered out
    });

    it("should delete a key from the environment record", () => {
        builder.append("KEY_TO_DELETE", "VALUE").delete("KEY_TO_DELETE");
        const result = builder.build();
        expect(result).toEqual({});
    });

    it("should append a key-value pair to the environment record", () => {
        builder.append("NEW_KEY", "NEW_VALUE");
        const result = builder.build();
        expect(result).toEqual({ NEW_KEY: "NEW_VALUE" });
    });

    it("should overwrite an existing key when appending the same key", () => {
        builder.append("OVERWRITE_KEY", "OLD_VALUE").append("OVERWRITE_KEY", "NEW_VALUE");
        const result = builder.build();
        expect(result).toEqual({ OVERWRITE_KEY: "NEW_VALUE" });
    });

    it("should handle multiple operations in sequence", () => {
        builder
            .append("KEY1", "VALUE1")
            .append("KEY2", "VALUE2")
            .delete("KEY1")
            .append("KEY3", "VALUE3");
        const result = builder.build();
        expect(result).toEqual({ KEY2: "VALUE2", KEY3: "VALUE3" });
    });

    it("should not modify process.env when building the environment record", () => {
        const originalEnv = { ...process.env };
        builder.append("TEST_KEY", "TEST_VALUE").build();
        expect(process.env).toEqual(originalEnv); // process.env should remain unchanged
    });

    it("should handle adopting an empty environment object", () => {
        builder.adopt({});
        const result = builder.build();
        expect(result).toEqual({});
    });

    it("should handle deleting a non-existent key gracefully", () => {
        builder.delete("NON_EXISTENT_KEY");
        const result = builder.build();
        expect(result).toEqual({});
    });

    it("should merge existing environment variables when applying", () => {
        process.env.EXISTING_KEY = "EXISTING_VALUE";
        builder.append("NEW_KEY", "NEW_VALUE").apply();
        expect(process.env.EXISTING_KEY).toBe("EXISTING_VALUE");
        expect(process.env.NEW_KEY).toBe("NEW_VALUE");

        // Cleanup
        delete process.env.EXISTING_KEY;
        delete process.env.NEW_KEY;
    });
});