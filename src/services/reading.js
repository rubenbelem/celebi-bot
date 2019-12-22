const { bibleBooks } = require("../utils/constants");
const _ = require("lodash");
const { CustomError, CustomInternalError } = require("../errors");

class ReadingService {
    constructor(bot) {
        this.bot = bot;
    }

    async registerReading(message, reading) {
        //readingList = reading.spli
    }
}

module.exports = ReadingService;
