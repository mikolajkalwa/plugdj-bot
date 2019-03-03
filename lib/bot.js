const Promise = require('bluebird');
const Plugged = require('plugged');

const bot = new Plugged();

Promise.promisifyAll(bot);

bot.commands = new Map();

module.exports = bot;
