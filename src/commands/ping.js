module.exports = (bot => ({
    command: 'ping',
    execute: () => {
        bot.sendChat('Pong!');
    },
}));
