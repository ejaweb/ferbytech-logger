import rimraf from "rimraf";
import FerbyTechLogger from "../src/index";

describe("should work", () => {
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
        expect(logger.getHistory).toBeDefined();
        expect(logger.setLogLevel).toBeDefined();
        expect(logger.setLogGroup).toBeDefined();
        expect(logger.clearHistory).toBeDefined();
        expect(logger.recordHistory).toBeDefined();
        expect(logger.validateLogLevel).toBeDefined();
    });

    it("should test file log levels and history", () => {
        const fileOptions = { dir: logDirectory, logName: "ferbyTechLogger" };
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

        logger.clearHistory();
        logger.recordHistory(false);
        expect(logger.getHistory().length).toEqual(0);
    });

    it("should test console logging", () => {
        const logger = new FerbyTechLogger({ console: true });
        const consoleSpy = jest.spyOn(console, "info");
        logger.info({ message: "spy console testing" });
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("should test log groups and history", () => {
        const logger = new FerbyTechLogger({ console: true });

        logger.recordHistory(true);
        expect(() => logger.setLogGroup("FAIL")).toThrow("Supported log groups (1,2,3,4)");

        logger.setLogGroup("1");
        expect(process.env.LOG_GROUP).toEqual("1");
        
        logger.info("info");
        logger.warn("warn");
        logger.error("error");
        logger.debug("debug");
        expect(logger.getHistory().length).toEqual(4);
        expect(JSON.stringify(logger.getHistory())).toEqual(JSON.stringify([
            { message: "info", level: "info" },
            { message: "warn", level: "warn" },
            { message: "error", level: "error" },
            { message: "debug", level: "debug" },
        ]));

        logger.clearHistory();

        logger.setLogGroup("2");
        expect(process.env.LOG_GROUP).toEqual("2");
        
        logger.info("info");
        logger.warn("warn");
        logger.error("error");
        logger.debug("debug");
        expect(logger.getHistory().length).toEqual(3);
        expect(JSON.stringify(logger.getHistory())).toEqual(JSON.stringify([
            { message: "info", level: "info" },
            { message: "warn", level: "warn" },
            { message: "error", level: "error" },
        ]));

        logger.clearHistory();
        logger.recordHistory(false);
        expect(logger.getHistory().length).toEqual(0);
    });
});
