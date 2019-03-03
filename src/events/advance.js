const bot = require('../../lib/bot.js');
const db = require('../../lib/db.js');
const logger = require('../../lib/logger.js');

const {
    voteSkip, precentageToSkip, autowoot, historySkip, partyNeverEnds,
} = require('../../config.js');

function isTheSame(historyMedia, currentMedia) {
    if ((historyMedia.cid === currentMedia.cid) && (historyMedia.format === currentMedia.format)) {
        return true;
    }
    return false;
}

module.exports = {
    event: bot.ADVANCE,
    handler: async (booth, playback) => {
        if (booth.dj === -1 || playback.media.format === -1) return;

        if (partyNeverEnds) {
            try {
                const { booth: { waitlist } } = await bot.getRoomStatsAsync();

                if (waitlist.length === 0 && booth.dj !== bot.getSelf().id) {
                    bot.joinWaitlistAsync();
                }

                if (waitlist.length > 1) {
                    if (waitlist.includes(bot.getSelf().id)) {
                        bot.leaveWaitlistAsync();
                    }
                }
            } catch (e) {
                logger.error(e);
            }
        }

        if (autowoot) {
            bot.woot();
        }

        const nowPlaying = playback.media;
        setTimeout(() => {
            const nextMedia = bot.getMedia();
            if (nextMedia.format === -1) return;
            if (Object.is(nowPlaying, nextMedia)) {
                bot.skipDJ(booth.dj, (err) => {
                    if (err) {
                        logger.error(err);
                    } else {
                        bot.sendChat('Skipped stuck song!');
                    }
                });
            }
        }, (playback.media.duration + 10) * 1000);

        if (historySkip && booth.dj !== bot.getSelf().id) {
            try {
                const history = await bot.getRoomHistoryAsync();
                history.some((song) => {
                    if (isTheSame(song.media, playback.media)) {
                        bot.skipDJ(booth.dj, (err) => {
                            if (err) {
                                logger.error(err);
                            } else {
                                bot.sendChat(`@${bot.getUserById(booth.dj).username} your song has been skipped. Reason: song is in history.`);
                            }
                        });
                        return true;
                    }
                    return false;
                });
            } catch (e) {
                logger.error(`An error has occured while trying to perform history skip: ${JSON.stringify(e)}`);
            }
        }

        if (voteSkip) {
            const votesToSkip = Math.ceil(precentageToSkip * bot.getUsers().length);
            db.update('votesToSkip', () => votesToSkip).write();
            bot.sendChat(`Votes to skip: ${votesToSkip}`);
        }

        if (db.get('waitlist').find({ id: booth.dj }).value()) {
            db.get('waitlist').remove({ id: booth.dj }).write();
        }
    },
};
