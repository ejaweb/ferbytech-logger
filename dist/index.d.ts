export interface FerbyTechLoggerOptions {
    dir: string;
    logName: string;
}
export declare class FerbyTechLogger {
    private readonly options;
    private writeStream;
    private logLevels;
    constructor(options: FerbyTechLoggerOptions);
    private write;
    setLogLevel(level: string): void;
    info(json: any): void;
    warn(json: any): void;
    error(json: any): void;
    debug(json: any): void;
}
