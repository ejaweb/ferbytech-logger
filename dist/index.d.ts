export declare type json = {
    [k: string]: any;
};
export interface FerbyTechLoggerOptions {
    console: boolean;
    file?: {
        dir: string;
        logName: string;
    };
}
export declare class FerbyTechLogger {
    private readonly options;
    private history;
    private recording;
    private writeStream;
    private logLevels;
    constructor(options: FerbyTechLoggerOptions);
    private write;
    getHistory(): string[];
    clearHistory(): void;
    setRecording(active: boolean): void;
    setLogLevel(level: string): void;
    info(json: json | string): void;
    warn(json: json | string): void;
    error(json: json | string): void;
    debug(json: json | string): void;
}
