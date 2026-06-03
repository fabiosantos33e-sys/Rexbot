const pessoasImportantes = {
  "1053803800340746261": {
    nome: "Naechi",
    titulo: "Senhor",
    gif: "https://cdn.discordapp.com/attachments/1495896642904129676/1511855805115142203/28d29881-f097-4610-b7ae-5da6fa1ae6fb.gif?ex=6a21f8f0&is=6a20a770&hm=799600fb9325c38ae27cfd42362e7a0512c0acc1c75b7a2d6a1a8ebf7f0bb74c&"
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
