const { PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === ",meucanal") {
      const guild = message.guild;
      const member = message.member;

      const nomeCanal = `player-${message.author.username}`.toLowerCase();

      const jaExiste = guild.channels.cache.find(c =>
        c.name === nomeCanal && c.type === ChannelType.GuildText
      );

      if (jaExiste) {
        return message.reply(`❌ Você já tem um canal: ${jaExiste}`);
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
        `${message.author}, esse é seu canal privado.\n` +
        `Só você e a staff/bot podem ver esse espaço.`
      );

      return message.reply(`✅ Seu canal privado foi criado: ${canal}`);
    }
  });
};
