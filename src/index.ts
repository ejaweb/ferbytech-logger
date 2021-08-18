import * as fs from "fs";

type json = {
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
    private history: json[] = [];
    private recordHistoryFlag: boolean = false;
    private writeStream: fs.WriteStream | undefined;
    private logLevels = ["debug", "info", "warn", "error"];
    private logGroups = {
        1: [this.logLevels[0], this.logLevels[1], this.logLevels[2], this.logLevels[3]],
        2: [this.logLevels[1], this.logLevels[2], this.logLevels[3]],
        3: [this.logLevels[2], this.logLevels[3]],
        4: [this.logLevels[3]],
    };

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

        if (this.validateLogLevel(level)) {
            json.level = level;

            if (this.options.timestamp) {
                json.timestamp = new Date();
            }

            if (this.options.console) {
                (console as any)[level](json);
            }

            if (this.writeStream) {
                this.writeStream.write(JSON.stringify(json) + "\n");
            }

            if (this.recordHistoryFlag) {
                this.history.push(json);
            }
        }
    }

    validateLogLevel(level: string) {
        if (process.env.LOG_GROUP && (this.logGroups as any)[process.env.LOG_GROUP]) {
            return (this.logGroups as any)[process.env.LOG_GROUP].includes(level);
        }

        return !process.env.LOG_LEVEL || process.env.LOG_LEVEL.toLowerCase() === level;
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

    setLogGroup(group: string) {
        if (!(this.logGroups as any)[group]) {
            throw new Error(`Supported log groups (${Object.keys(this.logGroups)})`);
        }

        process.env.LOG_GROUP = group;
    }

    debug(json: json | string) {
        this.write(json, this.logLevels[0]);
    }

    info(json: json | string) {
        this.write(json, this.logLevels[1]);
    }

    warn(json: json | string) {
        this.write(json, this.logLevels[2]);
    }

    error(json: json | string) {
        this.write(json, this.logLevels[3]);
    }
}
