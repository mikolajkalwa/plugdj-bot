const bot = require('../../lib/bot.js');
const { welcomeMessage, sendWelcomeMessage } = require('../../config.js');
const dcLookUp = require('../dcLookUp.js');

module.exports = {
    event: [bot.USER_JOIN, bot.FRIEND_JOIN],
    handler: (user) => {
        if (user.id === bot.getSelf().id) return;
        if (sendWelcomeMessage) {
            bot.sendChat(`${welcomeMessage} @${user.username}`);
        }
        dcLookUp(user.id);
    },
};
