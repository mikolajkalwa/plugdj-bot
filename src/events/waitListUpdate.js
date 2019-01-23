const moment = require('moment');
const db = require('../../lib/db.js');
const logger = require('../../lib/logger.js');

module.exports = (bot => ({
    event: [
        bot.WAITLIST_UPDATE,
        bot.MOD_SKIP,
        bot.SKIP,
        bot.ADVANCE,
    ],
    handler: () => {
        bot.getRoomStats((err, room) => {
            if (err) {
                logger.error(err);
            } else {
                const { waitlist } = room.booth;

                waitlist.forEach((user, index) => {
                    if (db.get('waitlist').find({ id: user }).value()) {
                        db.get('waitlist').find({ id: user }).assign({
                            lastKnownPosition: index,
                            lastSeen: moment(),
                        }).write();
                    } else {
                        db.get('waitlist').push({
                            id: user,
                            lastKnownPosition: index,
                            lastSeen: moment(),
                        }).write();
                    }
                });
            }
        });
    },
}));
