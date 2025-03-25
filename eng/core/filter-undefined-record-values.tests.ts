import { filterUndefinedRecordValues } from "./record-provider";

describe("filterUndefinedRecordValues", () => {
    it("should filter out keys with undefined values", () => {
        const input = { key1: "value1", key2: undefined, key3: "value3" };
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual({ key1: "value1", key3: "value3" });
    });

    it("should handle an empty object", () => {
        const input = {};
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual({});
    });

    it("should return an empty object when all values are undefined", () => {
        const input = { key1: undefined, key2: undefined };
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual({});
    });

    it("should return the same object when all values are valid strings", () => {
        const input = { key1: "value1", key2: "value2" };
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual(input);
    });

    it("should handle mixed values (strings and undefined)", () => {
        const input = { key1: "value1", key2: undefined, key3: "value3" };
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual({ key1: "value1", key3: "value3" });
    });

    it("should handle an object with no keys", () => {
        const input = {};
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual({});
    });

    it("should handle keys with special characters", () => {
        const input = { "key 1": "value1", "key@2": undefined, "key#3": "value3" };
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual({ "key 1": "value1", "key#3": "value3" });
    });

    it("should retain keys with empty string values", () => {
        const input = { key1: "", key2: undefined, key3: "value3" };
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual({ key1: "", key3: "value3" });
    });

    it("should retain keys with numeric string values", () => {
        const input = { key1: "123", key2: undefined, key3: "456" };
        const result = filterUndefinedRecordValues(input);
        expect(result).toEqual({ key1: "123", key3: "456" });
    });

    it("should not mutate the original input object", () => {
        const input = { key1: "value1", key2: undefined };
        const original = { ...input };
        filterUndefinedRecordValues(input);
        expect(input).toEqual(original);
    });
});