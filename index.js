console.log("🚀 INDEX INICIOU");

require("dotenv").config();

const express = require("express");
const fs = require("fs");

const {
  Client,
  GatewayIntentBits,
  Events,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder
} = require("discord.js");


const app = express();

app.get("/", (req, res) => {
  res.send("Mostrinho online 😎🔥");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Porta aberta ${PORT}`);
});


// CLIENT DISCORD

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});


// ERROS

process.on("uncaughtException", (err) => {
  console.error("❌ ERRO GERAL:");
  console.error(err);
});


process.on("unhandledRejection", (err) => {
  console.error("❌ PROMISE ERRO:");
  console.error(err);
});


client.on("error", (err) => {
  console.error("❌ CLIENT ERROR:");
  console.error(err);
});


client.on("shardError", (err) => {
  console.error("❌ SHARD ERROR:");
  console.error(err);
});


// CONFIG

let config = {
  canal: "",
  mensagem: "✨ Bem-vindo {user} ao servidor!"
};


if (fs.existsSync("./config.json")) {

  try {

    config = JSON.parse(
      fs.readFileSync("./config.json")
    );

    console.log("✅ Config carregada");

  } catch(err) {

    console.log("❌ Erro lendo config.json");

  }

}



// ONLINE

client.once(Events.ClientReady, async (bot) => {

  console.log(`✅ Bot online como ${bot.user.tag}`);


  const commands = [

    new SlashCommandBuilder()
      .setName("painel")
      .setDescription("Configurar boas-vindas")
      .addChannelOption(option =>
        option
          .setName("canal")
          .setDescription("Canal de boas-vindas")
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


    console.log("✅ Slash registrados");


  } catch(err) {

    console.error("❌ Erro slash:");
    console.error(err);

  }

});



// PAINEL

client.on(
  Events.InteractionCreate,
  async interaction => {


    if (!interaction.isChatInputCommand())
      return;


    if (interaction.commandName !== "painel")
      return;



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

      .setTitle("✅ Painel atualizado")

      .setDescription(
        `Canal: ${canal}\nMensagem: ${mensagem}`
      );



    await interaction.editReply({

      embeds:[embed]

    });


});




// BOAS VINDAS

client.on(
  Events.GuildMemberAdd,
  async member => {


    const canal =
      member.guild.channels.cache.get(config.canal);



    if (!canal)
      return;



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


try {

require("./pet")(client);
console.log("PET OK");


require("./rpg")(client);
console.log("RPG OK");


require("./rpg_extra")(client);
console.log("RPG EXTRA OK");


require("./rpg_dungeo_raid")(client);
console.log("DUNGEON OK");


require("./canalplayer")(client);
console.log("CANALPLAYER OK");


} catch(err) {

console.error("❌ ERRO NOS SISTEMAS:");
console.error(err);

}



// LOGIN

console.log("VAI FAZER LOGIN");


console.log(
  "TOKEN EXISTE:",
  !!process.env.TOKEN
);


console.log(
  "TOKEN TAMANHO:",
  process.env.TOKEN?.length
);



client.login(process.env.TOKEN)

.then(() => {

 console.log("✅ LOGIN OK");

})


.catch(err => {

 console.error("❌ LOGIN FALHOU");

 console.error(err.message);

});
