const { EmbedBuilder } = require("discord.js");

const pessoasImportantes = {
  "1053803800340746261": {
    nome: "Naechi",
    titulo: "Senhor",
    cor: "#2b003d",
    imagem: "https://cdn.discordapp.com/attachments/1495896642904129676/1511835497121579178/Isseis_useless_brother.gif?ex=6a21e607&is=6a209487&hm=31a0c400daec4cd480e0790a14b94aac5d069c0548298edcf8eb78f044ed944f&.png"
  }
};

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.mentions.users.size) return;

    for (const [id, config] of Object.entries(pessoasImportantes)) {
      if (!message.mentions.users.has(id)) continue;

      const embed = new EmbedBuilder()
        .setColor(config.cor)
        .setTitle(`🌑 ${config.titulo} ${config.nome} foi invocado!`)
        .setDescription(
          `Tum tum...\n\n` +
          `O silêncio foi quebrado.\n` +
          `As sombras se moveram lentamente...\n\n` +
          `👁️ ${config.titulo} **${config.nome}** foi mencionado por ${message.author}.\n\n` +
          `⚠️ Agora todos aguardam sua presença.`
        )
        .setTimestamp();

      if (config.imagem && config.imagem !== "https://cdn.discordapp.com/attachments/1495896642904129676/1511835497121579178/Isseis_useless_brother.gif?ex=6a21e607&is=6a209487&hm=31a0c400daec4cd480e0790a14b94aac5d069c0548298edcf8eb78f044ed944f&.png") {
        embed.setImage(config.imagem);
      }

      await message.channel.send({ embeds: [embed] });
    }
  });
};
