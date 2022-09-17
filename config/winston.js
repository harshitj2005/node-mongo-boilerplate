"use strict";

var winston = require("winston");
// var logger = new (winston.Logger)();

// logger.add(winston.transports.Console, {
//     level: "verbose",
//     prettyPrint: true,
//     colorize: true,
//     silent: false,
//     timestamp: false
// });

// logger.stream = {
//     write: function(message){
//         logger.info(message);
//     }
// };

const logger = winston.createLogger({
    level: "verbose",
    colorize: true,
    silent: false,
    prettyPrint: true,
    timestamp: true,
    transports: [
      new winston.transports.Console({format: winston.format.simple()})
    ],
});
module.exports = logger;
