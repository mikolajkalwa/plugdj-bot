const bot = require('../../lib/bot.js');
const logger = require('../../lib/logger.js');

module.exports = {
    event: bot.CONN_PART,
    handler: () => {
        logger.error('Lost connection!');
        process.exit(1);
    },
};
