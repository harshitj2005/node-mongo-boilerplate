const mongoose = require('mongoose');

const config = require('./config');
const logger = require('./winston');

let returnObj;
mongoose.connect(config.db.url, config.db.options).then((connectResp) => {
    logger.info('Connected to MongoDB');
    returnObj = connectResp
});

module.exports = returnObj;