const _ = require("lodash");
const requestPromise = require("request-promise");

const TOKEN = process.env.BOT_TOKEN;
const apiUrl = "https://api.telegram.org/bot" + TOKEN;

let TelegramService = {
    async getMembersOfChat(chatId) {
        let fullChat = await requestPromise(`${apiUrl}/messages.getFullChat?chat_id=${chatId}`);
        return fullChat;
    }
};

module.exports = TelegramService;
