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

app.get("/", (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Mostrinho Dashboard</title>

<style>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  background:#0f172a;
  font-family:Arial,sans-serif;
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:100vh;
}

.card{
  width:450px;
  background:#1e293b;
  padding:30px;
  border-radius:20px;
  box-shadow:0 0 30px rgba(0,0,0,.4);
}

h1{
  text-align:center;
  margin-bottom:20px;
}

label{
  display:block;
  margin-bottom:8px;
}

input{
  width:100%;
  padding:12px;
  border:none;
  border-radius:10px;
  margin-bottom:15px;
}

button{
  width:100%;
  padding:12px;
  border:none;
  border-radius:10px;
  cursor:pointer;
  font-size:16px;
}

button:hover{
  opacity:.9;
}

.info{
  text-align:center;
  margin-bottom:20px;
  color:#94a3b8;
}
</style>
</head>

<body>

<div class="card">

<h1>🤖 Mostrinho Dashboard</h1>

<div class="info">
Configure a mensagem de boas-vindas
</div>

<label>Mensagem:</label>

<input
id="msg"
value="${config.mensagem}"
>

<button onclick="salvar()">
💾 Salvar Configuração
</button>

</div>

<script>
async function salvar() {

 await fetch('/salvar',{
  method:'POST',
  headers:{
   'Content-Type':'application/json'
  },
  body:JSON.stringify({
   mensagem:document.getElementById('msg').value
  })
 });

 alert('Configuração salva!');
}
</script>

</body>
</html>
`;

  res.send(html);
});

app.post("/salvar", (req, res) => {
  config.mensagem = req.body.mensagem;

  fs.writeFileSync(
    "./config.json",
    JSON.stringify(config, null, 2)
  );

  res.json({ ok: true });
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

let config = {
  canal: "",
  mensagem: "✨ Bem-vindo {user} ao servidor!"
};

if (fs.existsSync("./config.json")) {
  config = JSON.parse(fs.readFileSync("./config.json"));
}

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
