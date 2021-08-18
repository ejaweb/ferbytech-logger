# FerbyTech Logger
Typescript logging library for Node.js (Zero Dependencies).

## Installation
```bash
$ npm install ferbytech-logger
```

## Usage
```js
import { FerbyTechLogger, FerbyTechLoggerOptions } from "ferbytech-logger";

const options: FerbyTechLoggerOptions = {
    console: true,
    file: {
        dir: "logs",
        logName: "app-log"
    },
    timestamp: true
};

const logger = new FerbyTechLogger(options);

logger.info("test");
logger.info({ message: "test" });
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

// write logs to file (optional)
file: {
    dir: string,
    logName: string
}

// add timestamp to logs (optional)
timestamp: boolean
```
