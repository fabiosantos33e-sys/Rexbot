const {
  PermissionFlagsBits,
  ChannelType
} = require("discord.js");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(",meucanal")) return;

    const guild = message.guild;
    const member = message.member;

    let minutos = parseInt(message.content.split(" ")[1]);

    if (isNaN(minutos) || minutos < 1) {
      minutos = 60; // padrão 1 hora
    }

    if (minutos > 180) {
      return message.reply("❌ O tempo máximo é 180 minutos (3 horas).");
    }

    const nomeCanal = `player-${message.author.username}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    const existe = guild.channels.cache.find(
      c => c.name === nomeCanal
    );

    if (existe) {
      return message.reply(`❌ Você já possui um canal privado: ${existe}`);
    }

    const canal = await guild.channels.create({
      name: nomeCanal,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: member.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },
        {
          id: client.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageChannels
          ]
        }
      ]
    });

    await canal.send(
      `🌑 **Tum tum... Mostrinho apareceu!**\n\n` +
      `Olá ${message.author}!\n\n` +
      `Este é seu canal privado.\n` +
      `⏳ Tempo restante: **${minutos} minutos**\n\n` +
      `Quando o tempo acabar, o canal será apagado automaticamente.`
    );

    message.reply(
      `✅ Canal criado: ${canal}\n⏳ Duração: ${minutos} minutos`
    );

    setTimeout(async () => {
      try {
        await canal.send(
          "⚠️ O tempo acabou. Este canal será apagado em instantes..."
        );

        setTimeout(async () => {
          try {
            await canal.delete();
          } catch {}
        }, 5000);

      } catch {}
    }, minutos * 60 * 1000);
  });
};
