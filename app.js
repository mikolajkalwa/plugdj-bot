const fs = require('fs');
const path = require('path');

const bot = require('./lib/bot.js');
const logger = require('./lib/logger.js');
const config = require('./config.js');


function initialize() {
    if (bot.getSelf().role < 3000) {
        logger.error('Bot have to has manager permissions to operate correctly! Please grant the bot account a manager role!!!');
        process.exit(2);
    }
    const eventsDir = path.resolve(__dirname, 'src', 'events');

    fs.readdir(eventsDir, (err, files) => {
        if (err) {
            logger.error(`Unable to load events ${err}`);
            process.exit(1);
        } else {
            files.forEach((file) => {
                try {
                    const eventFile = require(path.resolve(eventsDir, file))(bot); // eslint-disable-line
                    if (Array.isArray(eventFile.event)) {
                        eventFile.event.forEach((event) => {
                            bot.on(event, eventFile.handler);
                        });
                    } else {
                        bot.on(eventFile.event, eventFile.handler);
                    }
                    logger.info(`Loaded handler for event ${Array.isArray(eventFile.event) ? eventFile.event.join() : eventFile.event}`);
                } catch (e) {
                    logger.error(`Error occured while loading events: ${e}`);
                    process.exit(1);
                }
            });
        }
    });

    const commandsDir = path.resolve(__dirname, 'src', 'commands');

    fs.readdir(commandsDir, (err, files) => {
        if (err) {
            logger.error(`Unable to load events ${err}`);
            process.exit(1);
        } else {
            files.forEach((file) => {
                try {
                    const commandFile = require(path.resolve(commandsDir, file))(bot); // eslint-disable-line
                    bot.commands.set(commandFile.command, commandFile);
                    logger.info(`Loaded command handler: ${commandFile.command}`);
                } catch (e) {
                    logger.error(`Error occured while loading command ${file}: ${e}`);
                    process.exit(1);
                }
            });
        }
    });
}

function joinedRoom(err) {
    if (!err) {
        logger.info('connected to room!');
        initialize();
    } else {
        logger.error(err);
    }
}

function loggedIn(err) {
    if (!err) {
        bot.connect(config.room, joinedRoom);
    } else {
        logger.error(err);
    }
}


bot.login({
    email: config.email,
    password: config.password,
}, loggedIn);
