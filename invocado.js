const pessoasImportantes = {
  "1053803800340746261": {
    nome: "Naechi",
    titulo: "Senhor",
    gif: "https://cdn.discordapp.com/attachments/1513675524013166753/1517943859529650206/Death_Note_GIF.gif?ex=6a381ee2&is=6a36cd62&hm=cfab480c6122bba6e5ae97cf119bf050671bca230ff6887ba3c963b7002d17bf&"
  }
};

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.mentions.users.size) return;

    for (const [id, config] of Object.entries(pessoasImportantes)) {
      if (!message.mentions.users.has(id)) continue;

      await message.channel.send(
        `🌑 O ar ficou pesado...\n\n` +
        `As luzes do chat parecem se apagar lentamente.\n` +
        `Uma presença sombria acaba de ser chamada.\n\n` +
        `🖤 **${config.titulo} ${config.nome} foi invocado.**\n` +
        `⚔️ Chamado por: ${message.author}\n\n` +
        `Todos aguardam em silêncio...`
      );

      await message.channel.send({
        files: [config.gif]
      });
    }
  });
};
