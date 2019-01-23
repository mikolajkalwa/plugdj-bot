module.exports = (bot => ({
    command: 'props',
    execute: (data) => {
        if (bot.getDJ().username) {
            bot.sendChat(`@${bot.getDJ().username} great song! ${data.username} likes it a lot!`);
        } else {
            bot.sendChat('There\'s no DJ');
        }
    },
}));
