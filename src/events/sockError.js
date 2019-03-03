const bot = require('../../lib/bot.js');
const logger = require('../../lib/logger.js');

module.exports = {
    event: bot.CONN_PART,
    handler: (err) => {
        logger.error(`Socket error has occured! ${JSON.stringify(err)}`);
        process.exit(1);
    },
};
