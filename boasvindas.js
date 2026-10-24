
const { EmbedBuilder } = require("discord.js");

// CONFIGURAÇÕES
const CANAL_BOAS_VINDAS = "1563578040846385163";
const CARGO_MEMBRO = "1563549638663872653";

module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    try {
      // ADICIONAR CARGO DE MEMBRO
      const cargo = member.guild.roles.cache.get(CARGO_MEMBRO);

      if (cargo) {
        await member.roles.add(cargo);
      }

      // BUSCAR CANAL DE BOAS-VINDAS
      const canal = member.guild.channels.cache.get(
        CANAL_BOAS_VINDAS
      );

      if (!canal || !canal.isTextBased()) return;

      // EMBED DE BOAS-VINDAS
      const embed = new EmbedBuilder()
        .setColor("#8B5CF6")
        .setTitle("╭・✦ SEJA BEM-VINDO(A)! ✦")
        .setDescription(
          `╭・Olá, ${member}!\n` +
          `╰・Seja muito bem-vindo(a) ao **${member.guild.name}**! 💜\n\n` +
          `✦ Esperamos que você se divirta e faça novas amizades!\n\n` +
          `╭・📜 Leia as regras do servidor.\n` +
          `├・💬 Interaja com a comunidade.\n` +
          `╰・✨ Aproveite sua estadia!\n\n` +
          `> 👥 **Membro número:** ${member.guild.memberCount}`
        )
        .setThumbnail(
          member.user.displayAvatarURL({ size: 256 })
        )
        .setImage(
          "https://cdn.discordapp.com/embed/avatars/0.png"
        )
        .setFooter({
          text: "Zuno • Sistema de Boas-Vindas",
          iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

      // MARCAR A PESSOA QUE ENTROU
      await canal.send({
        content: `🎉 Olá, ${member}! Seja bem-vindo(a)!`,
        embeds: [embed],
        allowedMentions: {
          users: [member.id]
        }
      });

      console.log(
        `${member.user.tag} entrou no servidor!`
      );

    } catch (error) {
      console.error(
        "Erro nas boas-vindas do Zuno:",
        error
      );
    }
  });
};

