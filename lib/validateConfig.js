const fs = require('fs');
const path = require('path');

const Joi = require('joi');

const logger = require('./logger.js');

const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).regex(/[a-zA-Z]/)
        .required(),
    room: Joi.string().required(),
    prefix: Joi.string().length(1).required(),
    maxDcTime: Joi.number().positive().required(),
    welcomeMessage: Joi.string().required(),
    sendWelcomeMessage: Joi.boolean().required(),
    autowoot: Joi.boolean().required(),
    voteSkip: Joi.boolean().required(),
    precentageToSkip: Joi.number().precision(2).min(0).max(1)
        .required(),
    historySkip: Joi.boolean().required(),
    partyNeverEnds: Joi.boolean().required(),
});

function validateConfig() {
    let config;
    const configPath = path.resolve(__dirname, '..', 'config.js');
    if (fs.existsSync(configPath)) {
        config = require('../config.js'); // eslint-disable-line 
    } else {
        logger.error('No config file. Create config.js and insert required data.');
        process.exit(1);
    }

    const { error } = Joi.validate(config, schema);
    if (error) {
        const errorMessage = error.details.map(n => n.message).toString();
        logger.error(`Configuration file is not valid! ${errorMessage}`);
        process.exit(1);
    } else {
        console.log('Configuration file meets the requirements!');
    }
}

module.exports = validateConfig;
