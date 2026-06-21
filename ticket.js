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

client.on(Events.InteractionCreate, async interaction => {

  // PAINEL
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === "ticketpainel") {

      const embed = new EmbedBuilder()
      .setColor("#39ff14")
      .setTitle("🦖💚 Central de Ajuda Rex 💚🦖")
      .setDescription(`
🦖💚 Oiii! Eu sou o Mostrinho da Central de Ajuda 💚🦖

Escolha uma opção abaixo para abrir um ticket!

🔧 Suporte
🚨 Denúnia
🤝 Parcerias
⚙️ Funções
      `)
      .setImage("https://cdn.discordapp.com/attachments/1513675524013166753/1518283925666136218/075c2e1b-9769-41a5-954c-fdfc69f2ded6.png?ex=6a395b98&is=6a380a18&hm=083ac874bb0dc61e72e1b88130805f5337d286e9ecc3c9fcb250062b7c77aea2&.png");

      const row = new ActionRowBuilder()
      .addComponents(

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

      const canal = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,

        permissionOverwrites: [

        {
  id: interaction.user.id,
  allow: [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory
  ]
},

{
  id: "1485441258204823603", // ID do cargo suporte
  allow: [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory
  ]
}
        ]

      });

      const embed = new EmbedBuilder()
      .setColor("#39ff14")
      .setTitle(`🎫 Ticket ${tipo}`)
      .setDescription(`
💚 Olá ${interaction.user}!

Seu ticket foi aberto com sucesso 🦖

Explique seu problema e aguarde a equipe responder.
      `)
      .setImage("https://cdn.discordapp.com/attachments/1513675524013166753/1518285973375680693/e9ea2be9-ab6e-496e-a9d4-a29f687522e8.png?ex=6a395d80&is=6a380c00&hm=42de35a0a0f916694e21cf6264568d53e7d1ebac37e6ebf59c08c306df53c683&. png");
      const fechar = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
        .setCustomId("fechar_ticket")
        .setLabel("Fechar Ticket")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🔒")

      );

      const cargoSuporte = "1485441258204823603"; // ID do cargo

await canal.send({
  content: `${interaction.user} <@&${cargoSuporte}>`,
  embeds: [embed],
  components: [fechar]
});

      return interaction.editReply({
        content: `✅ Ticket criado: ${canal}`
      });

    }

  }

  // FECHAR
  if (interaction.isButton()) {

    if (interaction.customId === "fechar_ticket") {

      await interaction.reply({
        content: "🔒 Fechando ticket em 5 segundos...",
        ephemeral: true
      });

      setTimeout(async () => {

        try {
          await interaction.channel.delete();
        } catch(err) {
          console.log(err);
        }

      }, 5000);

    }

  }

});

};
