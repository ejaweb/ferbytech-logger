declare type json = {
    [k: string]: any;
};
export interface FTLFileOptions {
    dir: string;
    logName: string;
    dailyRotate?: boolean;
}
export interface FTLOptions {
    console: boolean;
    consoleColors?: boolean;
    file?: FTLFileOptions;
    timestamp?: boolean;
}
export declare class FerbyTechLogger {
    private readonly options;
    private history;
    private cachedDate;
    private recordHistoryFlag;
    private writeStream;
    private logLevels;
    private logGroups;
    private colorsByLevel;
    constructor(options: FTLOptions);
    private initWriteStream;
    private validateLogLevel;
    private write;
    formatDate(date: Date): string;
    getCachedDate(): number;
    shouldRotate(): boolean | undefined;
    getHistory(): json[];
    clearHistory(): this;
    recordHistory(active: boolean): this;
    setLogLevel(level: string): this;
    setLogGroup(group: string): this;
    debug(json: json | string): this;
    info(json: json | string): this;
    warn(json: json | string): this;
    error(json: json | string): this;
    log(json: json | string): this;
}
export {};
