import TelegramBot from "node-telegram-bot-api";
import * as Service from "./services.js";
import * as dotenv from "dotenv";

dotenv.config();

//TELEGRAM TOKEN: 5609854716:AAGvZwAs8I51IPmXV1n7pQlEvZG-88BHKEg
const token = process.env.TELEGRAM_TOKEN || "";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

let isActive = true;

let resultadoInicial = [
  {
    candidato: "",
    percentual: "",
    votos: "",
  },
];

// bot.onText(
//   /\/resultados/,
//   Service.resultados(bot, resultadoInicial, isActive, func)
// );

bot.onText(/\/desativar/, Service.desativar(bot));
bot.onText(/\/resultados/, Service.resultados(bot));
bot.onText(/\/start/, Service.start(bot));
bot.onText(/\/ajuda/, Service.ajuda(bot));

bot.on("poll_answer", (msg, match) => {
  msg.bot.sendMessage(JSON.stringify());
});

console.log("Bot has been started");

// (async () => {
//   const mybot = await bot.getMe();
//   bot.sendMessage(mybot.id, "Bot has been started");
// })();

Service.main(bot, resultadoInicial);
