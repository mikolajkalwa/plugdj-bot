const db = require('../../lib/db.js');
const logger = require('../../lib/logger.js');

const { autowoot, historyskip } = require('../../config.js');

function isTheSame(historyMedia, currentMedia) {
    if ((historyMedia.cid === currentMedia.cid) && (historyMedia.format === currentMedia.format)) {
        return true;
    }
    return false;
}

module.exports = (bot => ({
    event: bot.ADVANCE,
    handler: (booth, playback) => {
        if (autowoot) {
            bot.woot((err) => {
                if (err) {
                    logger.error(`Can't vote ${err}`);
                }
            });
        }

        if (historyskip) {
            bot.getRoomHistory((err, history) => {
                if (err) {
                    logger.error(`Can't get room history ${err}`);
                } else {
                    history.forEach((song) => {
                        if (isTheSame(song.media, playback.media)) {
                            bot.skipDJ(booth.dj, (skipErr) => {
                                if (skipErr) {
                                    logger.error(`Can't skip ${JSON.stringify(skipErr, null, 4)}`);
                                }
                            });
                        }
                    });
                }
            });
        }

        if (db.get('waitlist').find({ id: booth.dj }).value()) {
            db.get('waitlist').remove({ id: booth.dj }).write();
        }
    },
}));
