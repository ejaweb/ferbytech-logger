import * as fs from "fs";

export type json = {
    [k: string]: any;
};

export interface FerbyTechLoggerOptions {
    console: boolean;
    file?: {
        dir: string;
        logName: string;
    };
}

export class FerbyTechLogger {
    private history: string[] = [];
    private recordHistoryFlag: boolean = false;
    private writeStream: fs.WriteStream | undefined;
    private logLevels = ["info", "warn", "error", "debug"];

    constructor(private readonly options: FerbyTechLoggerOptions) {
        if (options.file) {
            /* istanbul ignore else */
            if (!fs.existsSync(options.file.dir)) {
                fs.mkdirSync(options.file.dir);
            }

            this.writeStream = fs.createWriteStream(`${options.file.dir}/${options.file.logName}.json`);
        }
    }

    private write(json: json | string, level: string) {
        if (typeof json !== "object") {
            json = { message: json };
        }

        if (!process.env.LOG_LEVEL || process.env.LOG_LEVEL.toLowerCase() === level) {
            json.level = level;
            json.timestamp = new Date();

            const logMessage = JSON.stringify(json);

            if (this.options.console) {
                (console as any)[level](logMessage);
            }

            if (this.writeStream) {
                this.writeStream.write(logMessage + "\n");
            }

            if (this.recordHistoryFlag) {
                this.history.push(logMessage);
            }
        }
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history.splice(0, this.history.length);
    }

    recordHistory(active: boolean) {
        this.recordHistoryFlag = active;
    }

    setLogLevel(level: string) {
        const lvl = level.toLowerCase();

        if (!this.logLevels.includes(lvl)) {
            throw new Error(`Supported log levels (${this.logLevels})`);
        }

        process.env.LOG_LEVEL = lvl;
    }

    info(json: json | string) {
        this.write(json, this.logLevels[0]);
    }

    warn(json: json | string) {
        this.write(json, this.logLevels[1]);
    }

    error(json: json | string) {
        this.write(json, this.logLevels[2]);
    }

    debug(json: json | string) {
        this.write(json, this.logLevels[3]);
    }
}
