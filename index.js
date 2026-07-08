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
    GatewayIntentBits.GuildVoiceStates
  ]
});

let config = {
  canal: "",
  mensagem: "✨ Bem-vindo {user} ao servidor!"
};

if (fs.existsSync("./config.json")) {
  config = JSON.parse(
    fs.readFileSync("./config.json", "utf8")
  );
}

// Dashboard
require("./dashboard")(app, config);


// Carregar sistemas
require("./ticket")(client);
require("./pet")(client);
require("./rpg")(client);
require("./rpg_extra")(client);
require("./rpg_dungeo_raid")(client);
require("./canalplayer")(client);


// Quando o bot ligar
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
      ),


    new SlashCommandBuilder()
      .setName("ticketpainel")
      .setDescription("Enviar painel de ticket")

  ].map(command => command.toJSON());


  const rest = new REST({
    version: "10"
  }).setToken(process.env.TOKEN);


  await rest.put(
    Routes.applicationCommands(bot.user.id),
    {
      body: commands
    }
  );


  console.log("✅ Comandos registrados!");
});client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isChatInputCommand()) return;


  if (interaction.commandName === "painel") {

    await interaction.deferReply({
      ephemeral: true
    });


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
      .setTitle("✅ Painel atualizado")
      .setDescription(
        `Canal: ${canal}\nMensagem: ${mensagem}`
      );


    await interaction.editReply({
      embeds: [embed]
    });

  }


  if (interaction.commandName === "ticketpainel") {

    try {

      const ticket = require("./ticket");

      if (ticket && ticket.painel) {

        await ticket.painel(interaction);

      } else {

        await interaction.reply({
          content:
            "❌ O painel de ticket não foi encontrado.",
          ephemeral: true
        });

      }

    } catch (err) {

      console.log(err);

      await interaction.reply({
        content:
          "❌ Erro ao abrir painel de ticket.",
        ephemeral: true
      });

    }

  }

});



// Sistema de boas-vindas

client.on(Events.GuildMemberAdd, async member => {

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
        dynamic: true
      })
    );


  await canal.send({

    content: `${member}`,

    embeds: [embed]

  });

});const token = process.env.TOKEN;


console.log("TOKEN existe:", !!token);
console.log(
  "TOKEN tamanho:",
  token ? token.length : 0
);


if (!token) {

  console.error(
    "❌ TOKEN não encontrado no Render!"
  );

  process.exit(1);

}


client.login(token)

  .then(() => {

    console.log(
      "✅ Login realizado com sucesso!"
    );

  })

  .catch(err => {

    console.error(
      "❌ Erro ao conectar no Discord:"
    );

    console.error(err);

  });



// Captura erros para o Render não fechar silenciosamente

process.on(
  "unhandledRejection",
  error => {

    console.error(
      "Erro não tratado:",
      error
    );

  }
);


process.on(
  "uncaughtException",
  error => {

    console.error(
      "Erro crítico:",
      error
    );

  }
);
