const bunyan = require('bunyan');
const path = require('path');

const logger = bunyan.createLogger({
    name: 'plugdjbot',
    src: true,
    streams: [{
        stream: process.stdout,
        level: 'debug',
    }, {
        path: path.resolve(__dirname, '..', 'plugdjbot.log'),
        level: 'debug',

    }],
});

module.exports = logger;
