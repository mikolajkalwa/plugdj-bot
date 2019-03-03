const moment = require('moment');
const bot = require('../lib/bot.js');
const db = require('../lib/db.js');
const logger = require('../lib/logger.js');
const config = require('../config.js');

function isExpired(lastSeenInWaitlist) {
    if (moment().diff(lastSeenInWaitlist, 'minutes') <= config.maxDcTime) {
        return false;
    }
    return true;
}

async function dcLookUp(userID) {
    const { username } = bot.getUserById(userID);

    if (db.get('waitlist').find({ id: userID }).value()) {
        const { lastKnownPosition, lastSeenInWaitlist } = db.get('waitlist').find({ id: userID }).value();
        if (!isExpired(lastSeenInWaitlist)) {
            bot.sendChat(`@${username} you've disconnected ${moment().diff(lastSeenInWaitlist, 'minutes')}. minutes ago. You were ${lastKnownPosition + 1}. in queue.`);
            try {
                await bot.addToWaitlistAsync(userID);
                await bot.moveDJAsync(userID, lastKnownPosition);
            } catch (e) {
                logger.error(e);
            }
        } else {
            db.get('waitlist').remove({ id: userID }).write();
        }
    }
}

module.exports = dcLookUp;
