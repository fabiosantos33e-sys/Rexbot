const express = require("express");

const {
  Client,
  GatewayIntentBits,
  Events,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const musica = require('./commands/musica');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Porta aberta ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

let config = {
  canal: "",
  mensagem: "✨ Bem-vindo {user} ao servidor!"
};

if (fs.existsSync("./config.json")) {
  config = JSON.parse(fs.readFileSync("./config.json"));
}
require("./dashboard")(app, config);

client.once(Events.ClientReady, async (bot) => {
  console.log(`✅ Bot online como ${bot.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName("painel")
      .setDescription("Configurar boas-vindas")
      .addChannelOption(option =>
        option
          .setName("canal")
          .setDescription("Canal")
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName("mensagem")
          .setDescription("Mensagem")
          .setRequired(true)
      ),

new SlashCommandBuilder()
  .setName("musica")
  .setDescription("Sistema de música")

  .addSubcommand(sub =>
    sub
      .setName("tocar")
      .setDescription("Tocar uma música")
      .addStringOption(option =>
        option
          .setName("nome")
          .setDescription("Nome da música")
          .setRequired(true)
      )
  )

  .addSubcommand(sub =>
    sub
      .setName("parar")
      .setDescription("Parar a música")
  ),

 new SlashCommandBuilder()
      .setName("ticketpainel")
      .setDescription("Enviar painel de ticket")
  ].map(command => command.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationCommands(bot.user.id),
    { body: commands }
  );

  console.log("✅ Comandos slash registrados!");
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "musica") {
  return musica.execute(interaction);
}
    if (interaction.commandName === "painel") {
      await interaction.deferReply({ ephemeral: true });

      const canal = interaction.options.getChannel("canal");
      const mensagem = interaction.options.getString("mensagem");

      config.canal = canal.id;
      config.mensagem = mensagem;

      fs.writeFileSync(
        "./config.json",
        JSON.stringify(config, null, 2)
      );

      const embed = new EmbedBuilder()
        .setColor("#00ff88")
        .setTitle("✅ Painel Atualizado")
        .setDescription(`Canal: ${canal}\nMensagem: ${mensagem}`);

      await interaction.editReply({
        embeds: [embed]
      });
    }
  }
});

client.on(Events.GuildMemberAdd, async member => {
  const canal = member.guild.channels.cache.get(config.canal);

  if (!canal) return;

  const embed = new EmbedBuilder()
    .setColor("#00ff88")
    .setTitle("✨ Novo membro")
    .setDescription(
      config.mensagem.replace("{user}", `${member}`)
    )
    .setThumbnail(
      member.user.displayAvatarURL({ dynamic: true })
    )
    .setImage("https://cdn.discordapp.com/attachments/1495896642904129676/1508278446160351322/d4533674-2366-4c03-8565-9ddd40dfc22a.png");

  canal.send({
    content: "@here",
    embeds: [embed]
  });
});

require("./ticket")(client);
require("./pet")(client);
require("./rpg")(client);
require("./rpg_extra")(client);
require("./rpg_dungeo_raid")(client);
require("./canalplayer")(client);

const token = process.env.TOKEN;

console.log("TOKEN existe:", !!token);
console.log("TOKEN tamanho:", token ? token.length : 0);
console.log("TOKEN começo:", token ? token.slice(0, 5) : "nada");

client.login(token ? token.trim() : "");
