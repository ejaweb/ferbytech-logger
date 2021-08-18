import rimraf from "rimraf";
import FerbyTechLogger from "../src/index";

describe("should work", () => {
    const logDirectory = "logs";

    beforeAll(() => {
        rimraf.sync(logDirectory);
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
        expect(logger.clearHistory).toBeDefined();
        expect(logger.recordHistory).toBeDefined();
    });

    it("should test file log levels and history", () => {
        const fileOptions = { dir: logDirectory, logName: "ferbyTechLogger" };
        const logger = new FerbyTechLogger({ console: false, file: fileOptions });

        logger.recordHistory(true);
        expect(() => logger.setLogLevel("FAIL")).toThrow();

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
});
