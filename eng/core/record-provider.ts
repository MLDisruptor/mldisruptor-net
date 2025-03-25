import { ProcessOperations } from "./process-operations";

export function filterUndefinedRecordValues(record: Record<string, string | undefined>): Record<string, string> {
    return Object.fromEntries(
        Object.entries(record).filter(([_, value]) => value !== undefined) as [string, string][]
    );
}

export class RecordProvider {
    private record: Record<string, string>;

    constructor(record: Record<string, string> = filterUndefinedRecordValues(process.env)) {
        this.record = { ...record };
    }

    public get(key: string): string {
        return this.has(key) ? this.record[key] : '';
    }

    public set(key: string, value: string): void {
        this.record[key] = value;
    }

    public has(key: string): boolean {
        return Object.hasOwn(this.record, key);
    }

    public delete(key: string): void {
        delete this.record[key];
    }

    public getAll(): Record<string, string> {
        return { ...this.record };
    }

    public clear(): void {
        this.record = {};
    }

    public apply() {
        Object.entries(this.record).forEach(([key, value]) => ProcessOperations.set(key, value));
    }
}