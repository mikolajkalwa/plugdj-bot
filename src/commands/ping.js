const bot = require('../../lib/bot.js');

module.exports = {
    command: 'ping',
    execute: () => {
        bot.sendChat('Pong!');
    },
};
