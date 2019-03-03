const fs = require('fs');
const path = require('path');
const bot = require('./lib/bot.js');
const logger = require('./lib/logger.js');
const config = require('./config.js');

const validateConfig = require('./lib/validateConfig.js');

process.on('unhandledRejection', (reason, p) => {
    logger.error(`${JSON.stringify(reason)} Unhandled Rejection at Promise ${JSON.stringify(p)}`);
});

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception ${err}`);
    process.exit(1);
});

function initialize() {
    if (bot.getSelf().role < 3000) {
        logger.error('Bot have to has manager permissions to operate correctly! Please grant the bot account a manager role!!!');
        process.exit(1);
    }

    const eventsDir = path.resolve(__dirname, 'src', 'events');
    fs.readdir(eventsDir, (err, files) => {
        if (err) {
            logger.error(`Unable to load events ${JSON.stringify(err)}`);
            process.exit(1);
        } else {
            files.forEach((file) => {
                try {
                    const eventFile = require(path.resolve(eventsDir, file)); // eslint-disable-line
                    if (Array.isArray(eventFile.event)) {
                        eventFile.event.forEach((event) => {
                            bot.on(event, eventFile.handler);
                        });
                    } else {
                        bot.on(eventFile.event, eventFile.handler);
                    }
                    logger.info(`Loaded handler for event ${Array.isArray(eventFile.event) ? eventFile.event.join() : eventFile.event}`);
                } catch (e) {
                    logger.error(`Error occured while loading events: ${JSON.stringify(e)}`);
                    process.exit(1);
                }
            });
        }
    });

    const commandsDir = path.resolve(__dirname, 'src', 'commands');
    fs.readdir(commandsDir, (err, files) => {
        if (err) {
            logger.error(`Unable to load events ${JSON.stringify(err)}`);
            process.exit(1);
        } else {
            files.forEach((file) => {
                try {
                    const commandFile = require(path.resolve(commandsDir, file)); // eslint-disable-line
                    bot.commands.set(commandFile.command, commandFile);
                    logger.info(`Loaded command handler: ${commandFile.command}`);
                } catch (e) {
                    logger.error(`Error occured while loading command ${file}: ${JSON.stringify(e)}`);
                    process.exit(1);
                }
            });
        }
    });
}

(async () => {
    try {
        validateConfig();
        await bot.loginAsync({
            email: config.email,
            password: config.password,
        });
        const me = await bot.requestSelfAsync();
        bot.state.self = me; // without it bot.getSelf() returns object with default values
        await bot.connectAsync(config.room);
        bot.sock.on('message', () => bot._heartbeat()); //eslint-disable-line
        logger.info('connected to room!');
        initialize();
    } catch (e) {
        logger.error(e);
        process.exit(1); // proper execution of this function is required
    }
})();
