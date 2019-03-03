const moment = require('moment');
const bot = require('../../lib/bot.js');
const db = require('../../lib/db.js');
const logger = require('../../lib/logger.js');

module.exports = {
    event: [
        bot.WAITLIST_UPDATE,
        bot.MOD_SKIP,
        bot.SKIP,
        bot.ADVANCE,
    ],
    handler: async () => {
        try {
            const room = await bot.getRoomStatsAsync();
            const { waitlist } = room.booth;
            waitlist.forEach((user, index) => {
                if (db.get('waitlist').find({ id: user }).value()) {
                    db.get('waitlist').find({ id: user }).assign({
                        lastKnownPosition: index,
                        lastSeenInWaitlist: moment(),
                    }).write();
                } else {
                    db.get('waitlist').push({
                        id: user,
                        lastKnownPosition: index,
                        lastSeenInWaitlist: moment(),
                    }).write();
                }
            });
        } catch (e) {
            logger.error(e);
        }
    },
};
