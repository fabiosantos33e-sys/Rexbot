
const {
  EmbedBuilder,
  Events,
  PermissionFlagsBits
} = require("discord.js");

const CANAL_BOAS_VINDAS = "1563578040846385163";
const CARGO_MEMBRO = "1563549638663872653";

module.exports = (client) => {
  client.on(Events.GuildMemberAdd, async (member) => {
    try {
      // Ignora bots
      if (member.user.bot) return;

      // 1. ADICIONAR CARGO AUTOMATICAMENTE
      const cargo = await member.guild.roles
        .fetch(CARGO_MEMBRO)
        .catch(() => null);

      if (!cargo) {
        console.error(
          "[ZUNO] Cargo de membro não encontrado:",
          CARGO_MEMBRO
        );
      } else if (!cargo.editable) {
        console.error(
          "[ZUNO] Não consigo adicionar o cargo. " +
          "Coloque o cargo do Zuno acima do cargo MEMBRO."
        );
      } else {
        await member.roles.add(
          cargo,
          "Cargo automático de novo membro"
        );

        console.log(
          `[ZUNO] Cargo ${cargo.name} adicionado a ${member.user.tag}`
        );
      }

      // 2. BUSCAR O CANAL DE BOAS-VINDAS
      const canal = await member.guild.channels
        .fetch(CANAL_BOAS_VINDAS)
        .catch(() => null);

      if (!canal || !canal.isTextBased() || !canal.send) {
        console.error(
          "[ZUNO] Canal de boas-vindas não encontrado:",
          CANAL_BOAS_VINDAS
        );
        return;
      }

      // 3. CRIAR O EMBED
      const embed = new EmbedBuilder()
        .setColor("#8B5CF6")
        .setTitle("✦・SEJA BEM-VINDO(A)!・✦")
        .setDescription(
          `Olá, ${member}!! 💜\n\n` +
          `Seja muito bem-vindo(a) ao servidor **${member.guild.name}**!\n\n` +
          `╭・📜 Leia as regras do servidor.\n` +
          `├・💬 Conheça a comunidade.\n` +
          `╰・✨ Divirta-se com todos nós!\n\n` +
          `> 👥 **Você é nosso membro número ${member.guild.memberCount}!**`
        )
        .setThumbnail(
          member.user.displayAvatarURL({ size: 512 })
        )
        .setFooter({
          text: "Zuno • Sistema de Boas-Vindas",
          iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

      // 4. ENVIAR E MENCIONAR A PESSOA
      await canal.send({
        content: `🎉 | Seja bem-vindo(a), ${member}!`,
        embeds: [embed],
        allowedMentions: {
          users: [member.id]
        }
      });

      console.log(
        `[ZUNO] Boas-vindas enviadas para ${member.user.tag}`
      );

    } catch (error) {
      console.error(
        "[ZUNO] Erro no sistema de boas-vindas:",
        error
      );
    }
  });

  console.log("[ZUNO] Sistema de boas-vindas carregado!");
};

