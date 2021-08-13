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
    }
};

const logger = new FerbyTechLogger(options);

logger.info("test");
logger.info({ message: "test" });
```

## Options
```js
// print logs to console
console: boolean,

// write logs to file
file: {
    dir: string,
    logName: string
}
```
