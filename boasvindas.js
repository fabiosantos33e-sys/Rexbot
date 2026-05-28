const {
  EmbedBuilder
} = require("discord.js");

module.exports = (client) => {

  client.on("guildMemberAdd", async member => {

    const canal =
      member.guild.channels.cache.find(
        c => c.name === "･ﾟ🦕-┊🌿┊💬◇『ℂ𝕙𝕒𝕥』◇💬┊🌿┊🦕･ﾟ"
      );

    if (!canal) return;

    const embed =
      new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("🌙 Tum tum... Mostrinho apareceu!")
        .setDescription(
          `👋 Olá ${member}!\n\n` +
          `✨ Seja muito bem-vindo(a) à nossa família.\n\n` +
          `💜 Esperamos que você faça novas amizades,\n` +
          `se divirta bastante\n` +
          `e aproveite cada momento aqui conosco.\n\n` +
          `🌑 O Mostrinho já está feliz com sua chegada!\n\n` +
          `🎉 @here vem dar boas-vindas pro nosso novo membro!`
        )
        .setThumbnail(
          member.user.displayAvatarURL({
            dynamic: true
          })
        )
        .setFooter({
          text:
            `Agora somos ${member.guild.memberCount} membros 💜`
        })
        .setTimestamp();

    canal.send({
      content: `💫 ${member}`,
      embeds: [embed]
    });

  });

};
