export default `
  /start = ativa o bot, para realizar o recebimento dos resultados da eleição a cada ${
    process.env.TIMER ? Number.parseInt(process.env.TIMER / 1000) : 10
  } segundos\n
  /desativar = desativa o bot\n
  /resultados = obtém resultado das eleições\n
  /ajuda = exibe novamente este menu, para suporte.
  `;
