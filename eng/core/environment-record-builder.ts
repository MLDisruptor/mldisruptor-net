export class EnvironmentRecordBuilder {
    private _env: Record<string, string>;

    public constructor() {
        this._env = {};
    }

    public clear() {
        this._env = {};
        return this;
    }
    public apply() {
        process.env = { ...process.env, ...this._env };
        return this;
    }
    public adopt(env: NodeJS.ProcessEnv) {
        this._env = {
            ...this._env,
            ...Object.fromEntries(
                Object.entries(env).filter(([_, value]) => value !== undefined) as [string, string][]
            )
        };
        return this;
    }
    public delete(key: string) {
        delete this._env[key];
        return this;
    }
    public append(key: string, value: string) {
        this._env[key] = value;
        return this;
    }
    public build(): Record<string, string> {
        return this._env;
    }
}