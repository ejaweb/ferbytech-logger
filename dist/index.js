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
        this.recording = false;
        this.logLevels = ["info", "warn", "error", "debug"];
        if (options.file) {
            /* istanbul ignore else  */
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
        if (!process.env.LOG_LEVEL || process.env.LOG_LEVEL.toLowerCase() === level) {
            json.level = level;
            json.timestamp = new Date();
            const logMessage = JSON.stringify(json);
            if (this.options.console) {
                console[level](logMessage);
            }
            if (this.writeStream) {
                this.writeStream.write(logMessage + "\n");
            }
            if (this.recording) {
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
    setRecording(active) {
        this.recording = active;
    }
    setLogLevel(level) {
        const lvl = level.toLowerCase();
        if (!this.logLevels.includes(lvl)) {
            throw new Error(`Supported log levels (${this.logLevels})`);
        }
        process.env.LOG_LEVEL = lvl;
    }
    info(json) {
        this.write(json, this.logLevels[0]);
    }
    warn(json) {
        this.write(json, this.logLevels[1]);
    }
    error(json) {
        this.write(json, this.logLevels[2]);
    }
    debug(json) {
        this.write(json, this.logLevels[3]);
    }
}
exports.FerbyTechLogger = FerbyTechLogger;
