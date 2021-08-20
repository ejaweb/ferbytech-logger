"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerbyTechLogger = void 0;
const fs = __importStar(require("fs"));
class FerbyTechLogger {
    constructor(options) {
        this.options = options;
        this.history = [];
        this.cachedDate = new Date();
        this.recordHistoryFlag = false;
        this.logLevels = ["debug", "info", "warn", "error"];
        this.logGroups = {
            1: [this.logLevels[0], this.logLevels[1], this.logLevels[2], this.logLevels[3]],
            2: [this.logLevels[1], this.logLevels[2], this.logLevels[3]],
            3: [this.logLevels[2], this.logLevels[3]],
            4: [this.logLevels[3]],
        };
        this.colorsByLevel = {
            debug: "\x1b[36m%s\x1b[0m",
            info: "\x1b[32m%s\x1b[0m",
            warn: "\x1b[33m%s\x1b[0m",
            error: "\x1b[31m%s\x1b[0m",
        };
        this.initWriteStream();
    }
    initWriteStream(cb) {
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
            if (cb)
                cb(this.writeStream);
        }
    }
    validateLogLevel(level) {
        if (process.env.LOG_GROUP && this.logGroups[process.env.LOG_GROUP]) {
            return this.logGroups[process.env.LOG_GROUP].includes(level);
        }
        return !process.env.LOG_LEVEL || process.env.LOG_LEVEL.toLowerCase() === level;
    }
    write(json, level) {
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
                    console[level](this.colorsByLevel[level], json);
                }
                else {
                    console[level](json);
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
                }
                else {
                    this.writeStream.write(JSON.stringify(json) + "\n", "utf-8");
                }
            }
            if (this.recordHistoryFlag) {
                this.history.push(json);
            }
        }
    }
    formatDate(date) {
        let month = `${date.getMonth() + 1}`;
        let day = `${date.getDate()}`;
        /* istanbul ignore next */
        if (month.length < 2)
            month = "0" + month;
        /* istanbul ignore next */
        if (day.length < 2)
            day = "0" + day;
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
    recordHistory(active) {
        this.recordHistoryFlag = active;
        return this;
    }
    setLogLevel(level) {
        const lvl = level.toLowerCase();
        if (!this.logLevels.includes(lvl)) {
            throw new Error(`Supported log levels (${this.logLevels})`);
        }
        process.env.LOG_LEVEL = lvl;
        return this;
    }
    setLogGroup(group) {
        if (!this.logGroups[group]) {
            throw new Error(`Supported log groups (${Object.keys(this.logGroups)})`);
        }
        process.env.LOG_GROUP = group;
        return this;
    }
    debug(json) {
        this.write(json, this.logLevels[0]);
        return this;
    }
    info(json) {
        this.write(json, this.logLevels[1]);
        return this;
    }
    warn(json) {
        this.write(json, this.logLevels[2]);
        return this;
    }
    error(json) {
        this.write(json, this.logLevels[3]);
        return this;
    }
    log(json) {
        this.info(json);
        return this;
    }
}
exports.FerbyTechLogger = FerbyTechLogger;
