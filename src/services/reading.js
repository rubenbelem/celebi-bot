const { bibleBooks } = require("../utils/constants");
const _ = require("lodash");
const DbErrors = require("../errors/database");
const { CustomError, CustomInternalError } = require("../errors");

class ReadingService {
    constructor(bot) {
        this.bot = bot;
    }

    async registerReading(message, reading) {
        //readingList = reading.spli
    }
}

module.exports = {};
