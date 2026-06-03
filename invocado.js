const pessoasImportantes = {
  "1053803800340746261": {
    nome: "Naechi",
    titulo: "Senhor",
    gif: "https://cdn.discordapp.com/attachments/1495896642904129676/1511872152813437058/VID_20260603_161904_328.mp4?ex=6a22082a&is=6a20b6aa&hm=b5be74ec8066d2a11871f3ab8faef336985b9c862545509113feb7f24573dd27&"
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
