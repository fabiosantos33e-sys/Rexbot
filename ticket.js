const {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

module.exports = (client) => {

client.on(Events.InteractionCreate, async (interaction) => {

  // PAINEL
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === "ticketpainel") {

      const embed = new EmbedBuilder()
        .setColor("#3d003f")
        .setTitle("💜 Central de Ajuda 👑")
        .setDescription(`
👑💜 Oiii! Eu sou o Mostrinho da Central de Ajuda 💜👑

Escolha uma opção abaixo para abrir um ticket.
        `)
        .setImage("https://cdn.discordapp.com/attachments/1513675524013166753/1518283925666136218/075c2e1b-9769-41a5-954c-fdfc69f2ded6.png");

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("menu_ticket")
          .setPlaceholder("Clique para escolher uma opção")
          .addOptions([
            {
              label: "Suporte",
              description: "Abrir ticket de suporte",
              value: "suporte",
              emoji: "🔧"
            },
            {
              label: "Denúncia",
              description: "Reportar algo",
              value: "denuncia",
              emoji: "🚨"
            },
            {
              label: "Parcerias",
              description: "Parcerias do servidor",
              value: "parcerias",
              emoji: "🤝"
            },
            {
              label: "Funções",
              description: "Dúvidas sobre cargos",
              value: "funcoes",
              emoji: "⚙️"
            }
          ])
      );

      return interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }

  // MENU TICKET
  if (interaction.isStringSelectMenu()) {

    if (interaction.customId === "menu_ticket") {

      await interaction.deferReply({ ephemeral: true });

      const tipo = interaction.values[0];

      const cargoSuporte = "1485441258204823603"; // ID cargo suporte
      const categoriaSuporte = "1485073639962447984";

      // Evita tickets duplicados
      const ticketExistente = interaction.guild.channels.cache.find(
        c =>
          c.parentId === categoriaSuporte &&
          c.name === interaction.user.username.toLowerCase()
      );

      if (ticketExistente) {
        return interaction.editReply({
          content: `❌ Você já possui um ticket aberto: ${ticketExistente}`
        });
      }

      const canal = await interaction.guild.channels.create({
        name: interaction.user.username
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .slice(0, 90),

        parent: categoriaSuporte,

        type: ChannelType.GuildText,

        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory
            ]
          },
          {
            id: cargoSuporte,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory
            ]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setColor("#3d003f")
        .setTitle(`🎫 Ticket ${tipo}`)
        .setDescription(`
Olá ${interaction.user}!

Seu ticket foi criado com sucesso.

Descreva sua situação detalhadamente e aguarde um membro da equipe responder.
        `)
        .setImage("https://cdn.discordapp.com/attachments/1513675524013166753/1518285973375680693/e9ea2be9-ab6e-496e-a9d4-a29f687522e8.png");

      const botoes = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("fechar_ticket")
          .setLabel("Fechar Ticket")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🔒")
      );

      try {
        await canal.send({
          content: `${interaction.user} <@&${cargoSuporte}>`,
          embeds: [embed],
          components: [botoes]
        });

        await interaction.editReply({
          content: `✅ Ticket criado com sucesso: ${canal}`
        });

      } catch (erro) {
        console.log("Erro ao enviar mensagem no ticket:", erro);

        await interaction.editReply({
          content: "❌ O ticket foi criado, mas ocorreu um erro ao enviar a mensagem inicial."
        });
      }
    }
  }

  // FECHAR TICKET
  if (interaction.isButton()) {

    if (interaction.customId === "fechar_ticket") {

      await interaction.reply({
        content: "🔒 Fechando ticket em 5 segundos...",
        ephemeral: true
      });

      setTimeout(async () => {
        try {
          await interaction.channel.delete();
        } catch (err) {
          console.log(err);
        }
      }, 5000);
    }
  }
});

};
