export default {
  ATIVAR: {
    command: "/ativar",
    description: `ativar o bot, para realizar o recebimento dos resultados da eleição a cada ${
      process.env.TIMER ? Number.parseInt(process.env.TIMER / 1000) : 10
    } segundos`,
  },
  DESATIVAR: {
    command: "/desativar",
    description: `desativa o bot, para realizar o envio dos resultados`,
  },
  RESULTADOS: {
    command: "/resultados",
    description: `obtém resultado das eleições`,
  },
  COMANDOS: {
    command: "/comandos",
    description: `
  /ativar = ativar o bot, para realizar o recebimento dos resultados da eleição a cada ${
    process.env.TIMER ? Number.parseInt(process.env.TIMER / 1000) : 10
  } segundos\n
  /desativar = desativa o bot, para realizar o envio dos resultados\n
  /resultados = obtém resultado das eleições
  `,
  },
};
