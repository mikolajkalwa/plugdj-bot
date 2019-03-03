const bot = require('../../lib/bot.js');
const db = require('../../lib/db.js');
const logger = require('../../lib/logger.js');

module.exports = {
    event: bot.VOTE,
    handler: async () => {
        try {
            const votesToSkip = db.get('votesToSkip').value();
            const room = await bot.getRoomStatsAsync();
            let { votes } = room;
            const { booth: { dj } } = room;
            votes = votes.map(vote => vote.direction);
            const mehs = votes.filter(n => n === -1);

            if (mehs.length === votesToSkip && bot.getDJ().id !== bot.getSelf().id) {
                bot.skipDJ(dj, (err) => {
                    if (err) {
                        logger.error(err);
                    } else {
                        bot.sendChat(`@${bot.getUserById(dj).username} your song has been skipped. Reason: too many mehs.`);
                    }
                });
            }
        } catch (e) {
            logger.error(`Vote event error: ${JSON.stringify(e)}`);
        }
    },
};
