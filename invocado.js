const pessoasImportantes = {
  "1053803800340746261": {
    nome: "Naechi",
    titulo: "Senhor",
    gif: "https://cdn.discordapp.com/attachments/1495896642904129676/1511835497121579178/Isseis_useless_brother.gif?ex=6a21e607&is=6a209487&hm=31a0c400daec4cd480e0790a14b94aac5d069c0548298edcf8eb78f044ed944f"
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
