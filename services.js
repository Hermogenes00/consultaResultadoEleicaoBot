import fetch from "node-fetch";
import diff from "deep-diff";
import fs from "fs/promises";
import MENU_MESSAGE from "./constants/menu-message.js";
import { Console } from "console";

let chatMembersDataBase = [];
let idChatMembers;

fs.readFile("./chatIds.json", { encoding: "utf8" })
  .then((file) => {
    chatMembersDataBase = JSON.parse(file.toString()) ?? [];
    idChatMembers = new Set(chatMembersDataBase);
  })
  .catch((err) => {
    chatMembersDataBase = [];
    idChatMembers = new Set(chatMembersDataBase);
  });

const getResults = async () => {
  try {
    const url =
      "https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/br/br-c0001-e000544-r.json";
    const response = await fetch(url);
    const json = await response.json();

    const eleitores = json.cand.map(
      ({ nm: candidato, pvap: percentual, vap: votos }) => ({
        candidato,
        percentual,
        votos,
      })
    );

    return eleitores;
  } catch (error) {
    console.log(err);
  }
};

const TIMER = process.env?.TIMER ? Number.parseInt(process.env.TIMER) : 10000;

export const start = (bot, resultadoInicial) => async (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `Bot ativado para esta conversação, para desativar envie a mensagem /desativar\nPara mais opções digite /ajuda\nFonte dos dados: https://resultados.tse.jus.br/`
  );

  idChatMembers.add(chatId);

  fs.writeFile("./chatIds.json", JSON.stringify(Array.from(idChatMembers)))
    .then((value) => console.info("ChatId salvo nos logs"))
    .catch((err) => console.info("Falhou ao tentar gravar chatId nos logs"));
};

export const desativar = (bot) => async (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "Bot desativado, para esta conversação, para ativá-lo novamente envie a mensagem /start"
  );

  idChatMembers.delete(chatId);

  fs.writeFile("./chatIds.json", JSON.stringify(Array.from(idChatMembers)))
    .then((value) => console.info("ChatId salvo nos logs"))
    .catch((err) => console.info("Falhou ao tentar gravar chatId nos logs"));
};

export const ajuda = (bot) => async (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, MENU_MESSAGE);
};

export const resultados = (bot, resultadoInicial) => async (msg, match) => {
  const resultadoAtual = await getResults();
  let messageToSend = "";

  resultadoAtual.forEach(({ candidato, percentual, votos }) => {
    messageToSend += `\nNome: ${candidato} Percentual: ${percentual} Votos: ${votos}\n`;
  });

  const chatId = msg.chat.id;
  bot.sendMessage(chatId, messageToSend);
};

export const main = (bot, resultadoInicial) => {
  setInterval(async () => {
    const resultadoAtual = await getResults();

    const hasDiff = diff.diff(resultadoInicial, resultadoAtual);
    let messageToSend = "";
    console.log(
      "Quantidade de usuários conectados: ",
      Array.from(idChatMembers).length
    );
    if (hasDiff) {
      resultadoInicial = resultadoAtual;

      resultadoInicial.forEach(({ candidato, percentual, votos }) => {
        messageToSend += `\nNome: ${candidato} Percentual: ${percentual} Votos: ${votos}\n`;
      });

      Array.from(idChatMembers).forEach((id) => {
        bot.sendMessage(id, messageToSend);
      });
    }
  }, TIMER);
};
