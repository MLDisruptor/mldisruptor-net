import { RecordProvider } from "./record-provider";

describe("RecordProvider", () => {
    let provider: RecordProvider;

    beforeEach(() => {
        provider = new RecordProvider({ TEST_KEY: "TEST_VALUE" });
    });

    it("should provide access to a value by key", () => {
        expect(provider.get("TEST_KEY")).toBe("TEST_VALUE");
    });

    it("should return empty string for a non-existent key", () => {
        expect(provider.get("NON_EXISTENT_KEY")).toBe('');
    });

    it("should allow setting a value by key", () => {
        provider.set("NEW_KEY", "NEW_VALUE");
        expect(provider.get("NEW_KEY")).toBe("NEW_VALUE");
    });

    it("should allow overriding a value by key", () => {
        provider.set("TEST_KEY", "UPDATED_VALUE");
        expect(provider.get("TEST_KEY")).toBe("UPDATED_VALUE");
    });

    it("should allow checking if a key exists", () => {
        expect(provider.has("TEST_KEY")).toBe(true);
        expect(provider.has("NON_EXISTENT_KEY")).toBe(false);
    });

    it("should allow deleting a key", () => {
        provider.delete("TEST_KEY");
        expect(provider.get("TEST_KEY")).toBe('');
        expect(provider.has("TEST_KEY")).toBe(false);
    });

    it("should return all key-value pairs as a copy", () => {
        const all = provider.getAll();
        expect(all).toEqual({ TEST_KEY: "TEST_VALUE" });

        // Ensure the returned object is a copy
        all.TEST_KEY = "MODIFIED";
        expect(provider.get("TEST_KEY")).toBe("TEST_VALUE");
    });

    it("should allow clearing all keys", () => {
        provider.clear();
        expect(provider.getAll()).toEqual({});
    });

    it("should not mutate the original record passed to the constructor", () => {
        const original = { ORIGINAL_KEY: "ORIGINAL_VALUE" };
        const customProvider = new RecordProvider(original);

        customProvider.set("NEW_KEY", "NEW_VALUE");
        expect(original).toEqual({ ORIGINAL_KEY: "ORIGINAL_VALUE" }); // Ensure original is unchanged
    });

    it("should default to wrapping process.env if no record is provided", () => {
        process.env.TEST_KEY = "PROCESS_ENV_VALUE";
        const envProvider = new RecordProvider();
        expect(envProvider.get("TEST_KEY")).toBe(process.env.TEST_KEY);
    });

    it("should treat keys as case-sensitive", () => {
        provider.set("KEY", "VALUE1");
        provider.set("key", "VALUE2");
        expect(provider.get("KEY")).toBe("VALUE1");
        expect(provider.get("key")).toBe("VALUE2");
    });

    it("should handle empty keys and values", () => {
        provider.set("", "EMPTY_KEY");
        provider.set("EMPTY_VALUE", "");
        expect(provider.get("")).toBe("EMPTY_KEY");
        expect(provider.get("EMPTY_VALUE")).toBe("");
    });

    it("should apply the changes to process.env", () => {
        provider.set("NEW_KEY", "NEW_VALUE");
        provider.apply();
        expect(process.env.NEW_KEY).toBe("NEW_VALUE");
    });
});