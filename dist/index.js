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
        this.logLevels = ["info", "warn", "error", "debug"];
        if (!fs.existsSync(options.dir)) {
            fs.mkdirSync(options.dir);
        }
        this.writeStream = fs.createWriteStream(`${options.dir}/${options.logName}.json`);
    }
    write(json, level) {
        if (!process.env.LOG_LEVEL || process.env.LOG_LEVEL.toLowerCase() === level) {
            json.level = level;
            json.timestamp = new Date();
            this.writeStream.write(JSON.stringify(json) + "\n");
        }
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
