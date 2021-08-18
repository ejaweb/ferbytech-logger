declare type json = {
    [k: string]: any;
};
export interface FerbyTechLoggerOptions {
    console: boolean;
    file?: {
        dir: string;
        logName: string;
    };
    timestamp?: boolean;
}
export default class FerbyTechLogger {
    private readonly options;
    private history;
    private recordHistoryFlag;
    private writeStream;
    private logLevels;
    private logGroups;
    constructor(options: FerbyTechLoggerOptions);
    private write;
    validateLogLevel(level: string): any;
    getHistory(): json[];
    clearHistory(): void;
    recordHistory(active: boolean): void;
    setLogLevel(level: string): void;
    setLogGroup(group: string): void;
    debug(json: json | string): void;
    info(json: json | string): void;
    warn(json: json | string): void;
    error(json: json | string): void;
}
export {};
