const logger = require('../../lib/logger.js');

const { prefix } = require('../../config.js');

function handleCommand(bot, data) {
    const command = data.message.slice(prefix.length).split(' ')[0];

    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).execute(data);
    } catch (error) {
        logger.error(`There was an error trying to execute ${command} command! ${JSON.stringify(error, null, 4)}`);
        bot.sendChat(`There was an error trying to execute ${command} command!`);
    }
}

module.exports = (bot => ({
    event: bot.CHAT,
    handler: (chat) => {
        if (chat.message.startsWith(prefix)) {
            handleCommand(bot, chat);
        } else if (chat.message === `@${bot.getSelf().username}`) {
            bot.sendChat(`@${chat.username} my prefix is: ${prefix}`);
        }
    },
}));
