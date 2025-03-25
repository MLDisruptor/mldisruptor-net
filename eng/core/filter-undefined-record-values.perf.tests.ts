import { filterUndefinedRecordValues } from "./record-provider";

describe("filterUndefinedRecordValues:performance", () => {
    it("should handle a large number of keys efficiently", () => {
        const input = Object.fromEntries(
            Array.from({ length: 1000 }, (_, i) => [`key${i}`, i % 2 === 0 ? `value${i}` : undefined])
        );
        const result = filterUndefinedRecordValues(input);
        const expected = Object.fromEntries(
            Array.from({ length: 1000 }, (_, i) => (i % 2 === 0 ? [`key${i}`, `value${i}`] : []))
        );

        const missing = Object.entries(expected).filter(([key, value]) => result[key] !== value);
        const extra = Object.entries(result).filter(([key, value]) => expected[key] !== value);

        expect(missing).toEqual([]);
        expect(extra).toEqual([]);
    });
});