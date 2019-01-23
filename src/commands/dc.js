const moment = require('moment');
const db = require('../../lib/db.js');
const logger = require('../../lib/logger.js');

const { maxDcTime } = require('../../config.js');

function isExpired(lastSeen) {
    if (maxDcTime === -1 || moment().diff(lastSeen, 'minutes') <= maxDcTime) {
        return false;
    }
    return true;
}


module.exports = (bot => ({
    command: 'dc',
    execute: (chat) => {
        if (db.get('waitlist').find({ id: chat.id }).value()) {
            const { lastKnownPosition, lastSeen } = db.get('waitlist').find({ id: chat.id }).value();
            if (!isExpired(lastSeen)) {
                bot.sendChat(`@${chat.username} you've disconnected ${moment().diff(lastSeen, 'minutes')}. minutes ago. You were ${lastKnownPosition + 1}. in queue.`);
                bot.addToWaitlist(chat.id, (addErr) => {
                    if (addErr) {
                        logger.error(`Cant add user to waitlist ${JSON.stringify(addErr, null, 4)}`);
                    } else {
                        bot.moveDJ(chat.id, lastKnownPosition, (moveErr) => {
                            if (moveErr) {
                                logger.error(`Cant move user in waitlist ${JSON.stringify(moveErr, null, 4)}`);
                            }
                        });
                    }
                });
            } else {
                bot.sendChat(`${chat.username} has disconnected too long ago. (${moment().diff(lastSeen, 'minutes')}. minutes ago)`);
            }
            db.get('waitlist').remove({ id: chat.id }).write();
        } else {
            bot.sendChat(`${chat.username} hasn't disconnect since I'm here.`);
        }
    },
}));
