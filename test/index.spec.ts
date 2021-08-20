import * as fs from "fs";
import rimraf from "rimraf";
import { exec } from "child_process";
import { performance } from "perf_hooks";
import { FerbyTechLogger, FTLFileOptions } from "../src/index";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

describe("FerbyTechLogger Test Suite", () => {
    const logDirectory = "logs";

    beforeAll(() => {
        rimraf.sync(logDirectory);
    });

    beforeEach(() => {
        delete process.env.LOG_LEVEL;
        delete process.env.LOG_GROUP;
    });

    it("should be defined", () => {
        const logger = new FerbyTechLogger({ console: false });

        expect(logger).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.error).toBeDefined();
        expect(logger.debug).toBeDefined();
        expect(logger.formatDate).toBeDefined();
        expect(logger.getHistory).toBeDefined();
        expect(logger.setLogLevel).toBeDefined();
        expect(logger.setLogGroup).toBeDefined();
        expect(logger.clearHistory).toBeDefined();
        expect(logger.shouldRotate).toBeDefined();
        expect(logger.recordHistory).toBeDefined();
        expect(logger.getCachedDate).toBeDefined();
    });

    it("should test file log levels and history", () => {
        const fileOptions: FTLFileOptions = { dir: logDirectory, logName: "ferbyTechLogger" };
        const logger = new FerbyTechLogger({ console: false, file: fileOptions, timestamp: true });

        logger.recordHistory(true);
        expect(() => logger.setLogLevel("FAIL")).toThrow("Supported log levels (debug,info,warn,error)");

        logger.setLogLevel("INFO");
        expect(process.env.LOG_LEVEL).toEqual("info");

        logger.warn("warn");
        logger.error("error");
        logger.debug("debug");
        expect(logger.getHistory().length).toEqual(0);

        logger.info({ message: "info" });
        expect(logger.getHistory().length).toEqual(1);

        logger.clearHistory().recordHistory(false);
        expect(logger.getHistory().length).toEqual(0);
    });

    it("should test console logging", () => {
        const logger = new FerbyTechLogger({ console: true });
        const consoleSpy = jest.spyOn(console, "info");
        logger.info({ message: "spy console testing" });
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("should test log groups and history", () => {
        const logger = new FerbyTechLogger({ console: true, consoleColors: true });

        logger.recordHistory(true);
        expect(() => logger.setLogGroup("FAIL")).toThrow("Supported log groups (1,2,3,4)");

        logger.setLogGroup("1");
        expect(process.env.LOG_GROUP).toEqual("1");

        logger.debug("1").info("2").warn("3").error("4");
        expect(logger.getHistory().length).toEqual(4);
        expect(JSON.stringify(logger.getHistory())).toEqual(
            JSON.stringify([
                { message: "1", level: "debug" },
                { message: "2", level: "info" },
                { message: "3", level: "warn" },
                { message: "4", level: "error" },
            ])
        );

        logger.clearHistory().setLogGroup("2");
        expect(process.env.LOG_GROUP).toEqual("2");

        logger.debug("1").info("2").warn("3").error("4");
        expect(logger.getHistory().length).toEqual(3);
        expect(JSON.stringify(logger.getHistory())).toEqual(
            JSON.stringify([
                { message: "2", level: "info" },
                { message: "3", level: "warn" },
                { message: "4", level: "error" },
            ])
        );

        logger.clearHistory().recordHistory(false);
        expect(logger.getHistory().length).toEqual(0);
    });

    it("should append different logs to same file", async () => {
        const logName = "logAggregates";
        const fileOptions: FTLFileOptions = { dir: logDirectory, logName };
        const logger = new FerbyTechLogger({ console: false, file: fileOptions });
        const loggerTwo = new FerbyTechLogger({ console: false, file: fileOptions });

        logger.info({ id: 123 });
        loggerTwo.warn({ id: 456 });

        await sleep(100); // stream write drain
        const logContents = fs.readFileSync(`${logDirectory}/${logName}.json`, "utf-8");
        expect(logContents).toEqual(`{"id":123,"level":"info"}\n{"id":456,"level":"warn"}\n`);
    });

    it("should validate daily rotate file", async () => {
        const logName = "dailyRotate";
        const fileOptions: FTLFileOptions = { dir: logDirectory, logName, dailyRotate: true };
        const logger = new FerbyTechLogger({ console: false, file: fileOptions });
        logger.info({ id: 123 });

        const mockDate = "2021-00-00";
        jest.spyOn(logger, "getCachedDate").mockReturnValue(0);
        jest.spyOn(logger, "formatDate").mockReturnValue(mockDate);
        logger.info({ id: 456 });

        await sleep(100); // stream write drain
        const logDate = logger.formatDate(new Date());
        expect(fs.readFileSync(`${logDirectory}/${logName}-${logDate}.json`, "utf-8")).toBeDefined();
        expect(fs.readFileSync(`${logDirectory}/${logName}-${mockDate}.json`, "utf-8")).toBeDefined();
    });

    it("should perform fast writes to daily rotate file", async () => {
        const logName = "dailyRotatePerformance";
        const fileOptions: FTLFileOptions = { dir: logDirectory, logName, dailyRotate: true };
        const logger = new FerbyTechLogger({ console: false, file: fileOptions, timestamp: true });
        const records = 10000;

        const t1 = performance.now();
        for (let i = 0; i < records; i++) {
            logger.log({ message: "performance testing", nested: { test: true, validate: "testing" } });
        }
        const t2 = performance.now();

        // validate miliseconds
        expect(t2 - t1).toBeLessThan(90);

        // validate no dropped logs
        function getRecordCount(path: string) {
            return new Promise((resolve) => {
                exec(`wc -l < ${path}`, (err, res) => {
                    return resolve(Number(res.trim()));
                });
            });
        }

        await sleep(10); // stream write delay
        const logDate = logger.formatDate(new Date());
        const recordCount = await getRecordCount(`${logDirectory}/${logName}-${logDate}.json`);
        expect(recordCount).toEqual(records);
    });
});
