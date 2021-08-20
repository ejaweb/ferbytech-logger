# FerbyTech Logger
TypeScript logging library for Node.js (`Zero Dependencies`).

## Features
- Tested thoroughly w/ 100% code coverage
- Written entirely in TypeScript (builds to es2020)
- Zero Dependencies (hand written for production performance)
- Writes up to 10,000 log messages to a daily rotating file in under ~90 ms (NVMe)

## Installation
```bash
$ npm install ferbytech-logger
```

## Usage
```js
import { FerbyTechLogger, FTLOptions } from "ferbytech-logger";

const options: FTLOptions = {
    console: true,
    consoleColors: true,
    file: {
        dir: "logs",
        logName: "applog",
        dailyRotate: true
    },
    timestamp: true
};

const logger = new FerbyTechLogger(options);

logger.debug("testing");
logger.info({ message: "request complete" });
logger.warn({ message: "retrying..." });
logger.error({ message: "failed to process" });

// defaults to logger.info
logger.log("test");
```

## Log Levels / Groups
There are two ways you can set which logs get written, via `LOG_LEVEL` or `LOG_GROUP` process env variables.
```js
// process.env.LOG_LEVEL="info"
logger.info("test") // will write
logger.warn("test") // wont write
logger.error("test") // wont write
logger.debug("test") // wont write

+++++++++++++++++++++++++++++++++
|   1   |   2   |   3   |   4   |
|-------|-------|-------|-------|
| debug | info  | warn  | error |
| info  | warn  | error |       |
| warn  | error |       |       |
| error |       |       |       |
+++++++++++++++++++++++++++++++++

// process.env.LOG_GROUP="3"
logger.info("test") // wont write
logger.warn("test") // will write
logger.error("test") // will write
logger.debug("test") // wont write

// helper methods
logger.setLogLevel("info")
logger.setLogGroup("3")
```

## Options
```js
// print logs to console
console: boolean

// colors log messages based on level
consoleColors: boolean

// write logs to file (optional)
file?: {
    // directory of the logs
    dir: string,

    // name of the log file
    logName: string,

    // will generate a new file daily (optional)
    // will append file name with `YYYY-MM-DD`
    dailyRotate?: boolean
}

// add timestamp to logs (optional)
timestamp?: boolean
```
