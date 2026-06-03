const pessoasImportantes = {
  "1053803800340746261": {
    nome: "Naechi",
    titulo: "Senhor",
    gif: "https://cdn.discordapp.com/attachments/1454296377889919061/1511856666960728114/28d29881-f097-4610-b7ae-5da6fa1ae6fb.gif?ex=6a21f9be&is=6a20a83e&hm=d57a034be76345c838fbb982ae7da6888d1d1a1fe65a7941c26511f17509498e&"
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
