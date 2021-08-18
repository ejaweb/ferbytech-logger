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
const fs = __importStar(require("fs"));
class FerbyTechLogger {
    constructor(options) {
        this.options = options;
        this.history = [];
        this.recordHistoryFlag = false;
        this.logLevels = ["debug", "info", "warn", "error"];
        this.logGroups = {
            1: [this.logLevels[0], this.logLevels[1], this.logLevels[2], this.logLevels[3]],
            2: [this.logLevels[1], this.logLevels[2], this.logLevels[3]],
            3: [this.logLevels[2], this.logLevels[3]],
            4: [this.logLevels[3]],
        };
        if (options.file) {
            /* istanbul ignore else */
            if (!fs.existsSync(options.file.dir)) {
                fs.mkdirSync(options.file.dir);
            }
            this.writeStream = fs.createWriteStream(`${options.file.dir}/${options.file.logName}.json`);
        }
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
                console[level](json);
            }
            if (this.writeStream) {
                this.writeStream.write(JSON.stringify(json) + "\n");
            }
            if (this.recordHistoryFlag) {
                this.history.push(json);
            }
        }
    }
    validateLogLevel(level) {
        if (process.env.LOG_GROUP && this.logGroups[process.env.LOG_GROUP]) {
            return this.logGroups[process.env.LOG_GROUP].includes(level);
        }
        return !process.env.LOG_LEVEL || process.env.LOG_LEVEL.toLowerCase() === level;
    }
    getHistory() {
        return this.history;
    }
    clearHistory() {
        this.history.splice(0, this.history.length);
    }
    recordHistory(active) {
        this.recordHistoryFlag = active;
    }
    setLogLevel(level) {
        const lvl = level.toLowerCase();
        if (!this.logLevels.includes(lvl)) {
            throw new Error(`Supported log levels (${this.logLevels})`);
        }
        process.env.LOG_LEVEL = lvl;
    }
    setLogGroup(group) {
        if (!this.logGroups[group]) {
            throw new Error(`Supported log groups (${Object.keys(this.logGroups)})`);
        }
        process.env.LOG_GROUP = group;
    }
    debug(json) {
        this.write(json, this.logLevels[0]);
    }
    info(json) {
        this.write(json, this.logLevels[1]);
    }
    warn(json) {
        this.write(json, this.logLevels[2]);
    }
    error(json) {
        this.write(json, this.logLevels[3]);
    }
}
exports.default = FerbyTechLogger;
