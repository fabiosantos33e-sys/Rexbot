const {
  Events,
  EmbedBuilder
} = require("discord.js");

// ===============================
// CONFIGURAÇÕES
// ===============================

const CANAL_BOAS_VINDAS = "1545947041216077955";
const CARGO_MEMBRO = "1546124481939111986";

// ===============================
// SISTEMA DE BOAS-VINDAS
// ===============================

module.exports = (client) => {

  client.on(Events.GuildMemberUpdate, async (membroAntigo, membroNovo) => {
    try {

      // Verifica se o membro acabou de receber o cargo Membro
      const recebeuCargo =
        !membroAntigo.roles.cache.has(CARGO_MEMBRO) &&
        membroNovo.roles.cache.has(CARGO_MEMBRO);

      if (!recebeuCargo) return;

      // Procura o canal geral
      const canal = membroNovo.guild.channels.cache.get(CANAL_BOAS_VINDAS);

      if (!canal) {
        console.log("❌ Canal de boas-vindas não encontrado.");
        return;
      }

      // Procura o cargo Membro
      const cargo = membroNovo.guild.roles.cache.get(CARGO_MEMBRO);

      if (!cargo) {
        console.log("❌ Cargo Membro não encontrado.");
        return;
      }

      // ===============================
      // EMBED
      // ===============================

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🏛️⚡ BEM-VINDO(A) AO GUARDIAN OF OLYMPUS ⚡🏛️")
        .setDescription(
          `**⚡ Os portões do Olimpo acabam de se abrir para você. ⚡**\n\n` +

          `🏛️ Entre os salões dos deuses, cada chegada marca o início de uma nova história.\n\n` +

          `⚔️ **Aqui, honra não é apenas uma palavra.**\n` +
          `É aquilo que carregamos em nossas atitudes.\n\n` +

          `⚡ **Aqui, cada membro representa uma força.**\n` +
          `Cada batalha pode escrever uma nova história.\n\n` +

          `🛡️ **Respeito, lealdade e união** são os pilares que mantêm nosso Olimpo de pé.\n\n` +

          `🌩️ Respeite seus companheiros.\n` +
          `⚔️ Siga as regras do reino.\n` +
          `🏛️ Ajude a fortalecer nossa comunidade.\n` +
          `⚡ E, acima de tudo, aproveite sua jornada.\n\n` +

          `━━━━━━━━━━━━━━━━━━━━\n\n` +

          `**🌩️ O destino reservou um lugar para você entre nós. 🌩️**\n\n` +

          `Que os céus reconheçam sua chegada,\n` +
          `que os deuses testemunhem sua jornada\n` +
          `e que seu nome seja lembrado pelos feitos que ainda estão por vir.\n\n` +

          `🏛️⚡ **Bem-vindo(a) ao Guardian of Olympus!** ⚡🏛️`
        )
        .setThumbnail(
          membroNovo.user.displayAvatarURL({
            dynamic: true,
            size: 256
          })
        )
        .setFooter({
          text: "Guardian of Olympus • O Olimpo recebe mais um guerreiro."
        })
        .setTimestamp();

      // ===============================
      // ENVIA NO CHAT GERAL
      // ===============================

      await canal.send({
        content: `${membroNovo} ${cargo}`,
        embeds: [embed],
        allowedMentions: {
          users: [membroNovo.id],
          roles: [CARGO_MEMBRO]
        }
      });

      console.log(
        `🏛️⚡ Boas-vindas enviadas para ${membroNovo.user.tag}`
      );

    } catch (erro) {
      console.error(
        "❌ Erro no sistema de boas-vindas:",
        erro
      );
    }
  });

  console.log("🏛️⚡ Sistema de boas-vindas do Guardian of Olympus carregado!");
};
