const moment = require('moment');
const winston = require('winston');

const myFormat = winston.format.printf(info => `${moment(info.timestamp).format('YYYY-MM-DD HH:mm:ss')} [${info.level}] ${info.message}`);

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.prettyPrint(),
                myFormat,
            ),
        }),
        new winston.transports.File({
            filename: 'combined.log',
            format: winston.format.combine(
                winston.format.prettyPrint(),
                winston.format.timestamp(),
                myFormat,
            ),
        }),
    ],
});

module.exports = logger;
