import * as fs from "fs";

type json = {
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

export class FerbyTechLogger {
    private history: json[] = [];
    private cachedDate: Date = new Date();
    private recordHistoryFlag: boolean = false;
    private writeStream: fs.WriteStream | undefined;
    private logLevels = ["debug", "info", "warn", "error"];
    private logGroups = {
        1: [this.logLevels[0], this.logLevels[1], this.logLevels[2], this.logLevels[3]],
        2: [this.logLevels[1], this.logLevels[2], this.logLevels[3]],
        3: [this.logLevels[2], this.logLevels[3]],
        4: [this.logLevels[3]],
    };
    private colorsByLevel = {
        debug: "\x1b[36m%s\x1b[0m",
        info: "\x1b[32m%s\x1b[0m",
        warn: "\x1b[33m%s\x1b[0m",
        error: "\x1b[31m%s\x1b[0m",
    };

    constructor(private readonly options: FTLOptions) {
        this.initWriteStream();
    }

    private initWriteStream(cb?: (writeStream: fs.WriteStream) => void) {
        if (this.options.file) {
            const fileOptions = this.options.file;

            /* istanbul ignore next */
            if (!fs.existsSync(fileOptions.dir)) {
                fs.mkdirSync(fileOptions.dir);
            }

            const logName = fileOptions.logName;
            const formattedDate = this.formatDate(this.cachedDate);
            const fileName = fileOptions.dailyRotate ? `${logName}-${formattedDate}` : logName;
            this.writeStream = fs.createWriteStream(`${fileOptions.dir}/${fileName}.json`, { flags: "a" });
            if (cb) cb(this.writeStream);
        }
    }

    private validateLogLevel(level: string) {
        if (process.env.LOG_GROUP && (this.logGroups as any)[process.env.LOG_GROUP]) {
            return (this.logGroups as any)[process.env.LOG_GROUP].includes(level);
        }

        return !process.env.LOG_LEVEL || process.env.LOG_LEVEL.toLowerCase() === level;
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
                if (this.options.consoleColors) {
                    (console as any)[level]((this.colorsByLevel as any)[level], json);
                } else {
                    (console as any)[level](json);
                }
            }

            if (this.writeStream) {
                if (this.shouldRotate()) {
                    this.cachedDate = new Date();
                    this.writeStream.end(() => {
                        this.initWriteStream((writeStream) => {
                            writeStream.write(JSON.stringify(json) + "\n", "utf-8");
                        });
                    });
                } else {
                    this.writeStream.write(JSON.stringify(json) + "\n", "utf-8");
                }
            }

            if (this.recordHistoryFlag) {
                this.history.push(json);
            }
        }
    }

    formatDate(date: Date) {
        let month = `${date.getMonth() + 1}`;
        let day = `${date.getDate()}`;

        /* istanbul ignore next */
        if (month.length < 2) month = "0" + month;

        /* istanbul ignore next */
        if (day.length < 2) day = "0" + day;

        return `${date.getFullYear()}-${month}-${day}`;
    }

    getCachedDate() {
        return this.cachedDate.getDate();
    }

    shouldRotate() {
        return this.options.file?.dailyRotate && this.getCachedDate() < new Date().getDate();
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history.splice(0, this.history.length);
        return this;
    }

    recordHistory(active: boolean) {
        this.recordHistoryFlag = active;
        return this;
    }

    setLogLevel(level: string) {
        const lvl = level.toLowerCase();

        if (!this.logLevels.includes(lvl)) {
            throw new Error(`Supported log levels (${this.logLevels})`);
        }

        process.env.LOG_LEVEL = lvl;
        return this;
    }

    setLogGroup(group: string) {
        if (!(this.logGroups as any)[group]) {
            throw new Error(`Supported log groups (${Object.keys(this.logGroups)})`);
        }

        process.env.LOG_GROUP = group;
        return this;
    }

    debug(json: json | string) {
        this.write(json, this.logLevels[0]);
        return this;
    }

    info(json: json | string) {
        this.write(json, this.logLevels[1]);
        return this;
    }

    warn(json: json | string) {
        this.write(json, this.logLevels[2]);
        return this;
    }

    error(json: json | string) {
        this.write(json, this.logLevels[3]);
        return this;
    }

    log(json: json | string) {
        this.info(json);
        return this;
    }
}
