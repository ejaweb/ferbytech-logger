import rimraf from "rimraf";
import { FerbyTechLogger } from "../src/index";

describe("should work", () => {
    const logDirectory = `${__dirname}/logs`;

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
        expect(logger.setLogLevel).toBeDefined();
        expect(logger.setRecording).toBeDefined();
        expect(logger.clearHistory).toBeDefined();
    });

    it("should validate file log levels", () => {
        const fileOptions = { dir: logDirectory, logName: "myLog" };
        const loggerOptions = { console: false, file: fileOptions };
        const logger = new FerbyTechLogger(loggerOptions);

        logger.setRecording(true);
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
        expect(logger.getHistory().length).toEqual(0);
    });

    it("should validate console", () => {
        const logger = new FerbyTechLogger({ console: true });
        const consoleSpy = jest.spyOn(console, "info");
        logger.info({ message: "spy console testing" });
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
});
