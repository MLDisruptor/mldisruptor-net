export type StdioOption = 'inherit' | 'pipe' | 'ignore' | number;
export type StdioOptionsArray = [StdioOption, StdioOption?, StdioOption?];
export type StdioOptions = StdioOption | StdioOptionsArray;

export const StdioInput = 0;
export const StdioOutput = 1;
export const StdioError = 2;

export class StdioBuilder {
    private _stdio: StdioOptions;

    constructor() {
        this._stdio = 'inherit';
    }

    public build(): StdioOptions {
        return this._stdio;
    }

    public inherit(): this {
        this._stdio = 'inherit';
        return this;
    }

    public pipe(): this {
        this._stdio = 'pipe';
        return this;
    }

    public ignore(): this {
        this._stdio = 'ignore';
        return this;
    }

    public error(option: StdioOption): this {
        const isArray = Array.isArray(this._stdio);
        if (isArray) {
            (this._stdio as StdioOptionsArray)[StdioError] = option;
        } else {
            this._stdio = ['inherit', 'inherit', option];
        }
        return this;
    }

    public input(option: StdioOption): this {
        const isArray = Array.isArray(this._stdio);
        if (isArray) {
            (this._stdio as StdioOptionsArray)[StdioInput] = option;
        } else {
            this._stdio = [option, 'inherit', 'inherit'];
        }
        return this;
    }

    public output(option: StdioOption): this {
        const isArray = Array.isArray(this._stdio);
        if (isArray) {
            (this._stdio as StdioOptionsArray)[StdioOutput] = option;
        } else {
            this._stdio = ['inherit', option, 'inherit'];
        }
        return this;
    }
}