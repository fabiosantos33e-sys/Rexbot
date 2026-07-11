require("dotenv").config();
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

const app = express();

app.get("/", (req, res) => {
  res.send("Mostrinho online 😎🔥");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Porta aberta ${PORT}`);
});


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});


// DEBUG DISCORD
client.on("debug", (info) => {
  console.log("[DEBUG]", info);
});

client.on("warn", (info) => {
  console.log("[WARN]", info);
});

client.on("error", (err) => {
  console.log("[ERROR]", err);
});

client.on("shardError", (err) => {
  console.log("[SHARD ERROR]", err);
});


let config = {
  canal: "",
  mensagem: "✨ Bem-vindo {user} ao servidor!"
};


if (fs.existsSync("./config.json")) {
  config = JSON.parse(
    fs.readFileSync("./config.json")
  );
}


// BOT ONLINE
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
      )

  ].map(command => command.toJSON());


  try {

    const rest = new REST({
      version: "10"
    }).setToken(process.env.TOKEN);


    await rest.put(
      Routes.applicationCommands(bot.user.id),
      {
        body: commands
      }
    );


    console.log("✅ Comandos slash registrados!");

  } catch(err) {

    console.log("Erro registrando comandos:");
    console.log(err);

  }

});



// INTERAÇÕES
client.on(
  Events.InteractionCreate,
  async interaction => {


  if (!interaction.isChatInputCommand())
    return;


  if (interaction.commandName === "painel") {


    await interaction.deferReply({
      ephemeral: true
    });


    const canal =
      interaction.options.getChannel("canal");


    const mensagem =
      interaction.options.getString("mensagem");


    config.canal = canal.id;
    config.mensagem = mensagem;


    fs.writeFileSync(
      "./config.json",
      JSON.stringify(config, null, 2)
    );


    const embed = new EmbedBuilder()
      .setColor("#00ff88")
      .setTitle("✅ Painel Atualizado")
      .setDescription(
        `Canal: ${canal}\nMensagem: ${mensagem}`
      );


    await interaction.editReply({
      embeds: [embed]
    });

  }

});



// BOAS VINDAS
client.on(
  Events.GuildMemberAdd,
  async member => {


  const canal =
    member.guild.channels.cache.get(config.canal);


  if (!canal) return;


  const embed = new EmbedBuilder()
    .setColor("#00ff88")
    .setTitle("✨ Novo membro")
    .setDescription(
      config.mensagem.replace(
        "{user}",
        `${member}`
      )
    )
    .setThumbnail(
      member.user.displayAvatarURL({
        dynamic:true
      })
    );


  canal.send({
    content:"@here",
    embeds:[embed]
  });


});



// SISTEMAS
console.log("PASSOU ANTES DOS SISTEMAS");

require("./rpg")(client);
console.log("RPG OK");


require("./rpg_extra")(client);
console.log("RPG EXTRA OK");


require("./rpg_dungeo_raid")(client);
console.log("DUNGEON OK");


require("./canalplayer")(client);
console.log("CANALPLAYER OK");



console.log("VAI FAZER LOGIN");


client.login(process.env.TOKEN)
.then(() => {

  console.log("✅ TOKEN ACEITO PELO DISCORD");

})
.catch(err => {

  console.error("❌ ERRO LOGIN:");
  console.error(err);

});
