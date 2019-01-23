const { welcomeMessage } = require('../../config.js');

module.exports = (bot => ({
    event: bot.USER_JOIN,
    handler: (user) => {
        if (user.guest || user.id === bot.getSelf().id) return;
        if (welcomeMessage) {
            bot.sendChat(`Welcome @${user.username}`);
        }
    },
}));
