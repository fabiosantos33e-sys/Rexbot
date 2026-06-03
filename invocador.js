module.exports = (client) => {

  const pessoasImportantes = {
    "1053803800340746261": {
      nome: "Naechi",
      titulo: "Senhor",
      gif: "https://cdn.discordapp.com/attachments/1495896642904129676/1511835497121579178/Isseis_useless_brother.gif"
    }
  };

  client.on("messageCreate", async (message) => {

    if (message.author.bot) return;
    if (!message.guild) return;

    if (!message.mentions.users.size) return;

    for (const [id, config] of Object.entries(pessoasImportantes)) {

      if (!message.mentions.users.has(id)) continue;

      await message.channel.send(
`🌑 O silêncio tomou conta do chat.

Uma presença antiga acaba de despertar.

👁️ O ${config.titulo} ${config.nome} foi invocado.

⚔️ Chamado por: ${message.author}

🖤 Nem todos compreendem sua presença.

Mas aqueles que já cruzaram seu caminho...

sabem exatamente o que significa vê-lo aparecer.

Aguardem.

Ele decidirá quando responder.`
      );

      await message.channel.send(config.gif);
    }

  });

};
