const bot = require('../../lib/bot.js');
const logger = require('../../lib/logger.js');

module.exports = {
    event: bot.CONN_WARNING,
    handler: (time) => {
        logger.warn(`Connection is about to lose! Time since last server message: ${time}s.`);
    },
};
