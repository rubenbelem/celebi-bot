const dotenv = require("dotenv");
dotenv.config();

let path = require("path");
let fs = require("fs");

const db = require("./models");
const { parseUserName } = require("./utils");
const requestPromise = require("request-promise");

const telegramBot = require(`node-telegram-bot-api`);

const TOKEN = `1030919218:AAHeLyr0-ksWqDOdDGe7yA2I30XIsM-S4gE`;
const bot = new telegramBot(TOKEN, { polling: true });
const starterKitFilePath = path.join(__dirname, "..\\files\\starter_kit");

const { ReadingService } = require("./services/reading");

async function sendStarterKit(chat) {
    await bot.sendMessage(chat.id, `https://youtu.be/hwBhA0mRlRs`);
    await bot.sendDocument(chat.id, `${starterKitFilePath}\\COMO-ESTUDAR-A-BIBLIA-SOZINHO.pdf`);
    await bot.sendDocument(chat.id, `${starterKitFilePath}\\Entendes O Que Lês - Gordon D. Fee & Douglas Stuart.pdf`);
    await bot.sendVideo(chat.id, `${starterKitFilePath}\\Leia a Bíblia contra você! - Jonathan Edwards.mp4`);
}

bot.on("new_chat_members", async message => {
    if (message.new_chat_member != undefined) {
        if (message.new_chat_member.is_bot) return;

        let messageText =
            `Olá ${message.new_chat_member.first_name}! ` +
            "Seja bem-vindo ao C Lê Bi 2.0, o grupo de leitura bíblica da <b>Igreja Batista em Dom Pedro</b>, com a ajuda de um pouquinho de tecnologia ;).\n\nEu sou o @clebi_bot, e minha missão é facilitar a atualização de leituras bíblicas nesse grupo :) !";

        await bot.sendMessage(message.chat.id, messageText, { parse_mode: "HTML" });

        await bot.sendMessage(
            message.chat.id,
            `Aqui no grupo nós temos o "Kit Iniciante", que é um conjunto de vídeos e leituras que recomendamos que você faça para ler a Bíblia com mais entendimento! Aqui está:`
        );

        await sendStarterKit(message.chat);
    }
});

bot.onText(/\/kit_iniciante/, async (message, match) => {
    await sendStarterKit(message.chat);
});

bot.onText(/\/leitura (.*)/, async (message, match) => {
    let username = parseUserName(message);
    let reading = match[1];

    await bot.sendMessage(message.chat.id, `Muito bem, ${username}! Sua leitura de "${reading}" será registrada!`);
    await ReadingService.registerReading(message, reading);
});

console.log("Bot iniciado com sucesso!");
