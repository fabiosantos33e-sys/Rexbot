const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "petdata.json");

let dados = {
  pet: {
    nome: "Mostrinho",
    fome: 100,
    energia: 100,
    felicidade: 100,
    sono: 100,
    nivel: 1,
    xp: 0
  },
  usuarios: {},
  frases: []
};

if (fs.existsSync(arquivo)) {
  try {
    dados = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  } catch {
    console.log("Erro lendo JSON, criando novo.");
  }
}

function salvar() {
  fs.writeFileSync(
    arquivo,
    JSON.stringify(dados, null, 2)
  );
}

function ganharXP(user) {
  if (!dados.usuarios[user.id]) {
    dados.usuarios[user.id] = {
      nome: user.username,
      amizade: 0
    };
  }

  dados.usuarios[user.id].amizade += 1;

  dados.pet.xp += 5;

  if (dados.pet.xp >= 100) {
    dados.pet.xp = 0;
    dados.pet.nivel++;
  }
}

function horario() {
  let h = new Date().getHours();

  if (h >= 6 && h < 12) return "bom dia";
  if (h >= 12 && h < 18) return "boa tarde";
  if (h >= 18 && h < 24) return "boa noite";

  return "madrugada";
}

const respostas = [
  "hehe, eu estou feliz hoje 🦖",
  "você é meu amigo favorito 💚",
  "estou passeando pelo servidor 👀",
  "quer brincar comigo?",
  "eu ainda estou aprendendo coisas novas!"
];

module.exports = (client) => {

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  let texto = message.content.toLowerCase();

  ganharXP(message.author);

  // conversa natural
  if (
    texto.includes("oi") ||
    texto.includes("olá") ||
    texto.includes("ola") ||
    texto.includes("mostrinho")
  ) {

    dados.pet.felicidade += 2;

    let resposta =
      respostas[Math.floor(Math.random()*respostas.length)];

    message.reply(
      `🦖 ${horario()}! Eu sou o Mostrinho.\n${resposta}`
    );

    salvar();
  }


  // alimentar
  if (texto.includes("alimentar") || texto.includes("comida")) {

    dados.pet.fome = Math.min(
      100,
      dados.pet.fome + 20
    );

    dados.pet.felicidade += 5;

    message.reply(
      "🍖 Obrigado pela comida! Meu barriguinha está feliz 🦖"
    );

    salvar();
  }


  // brincar
  if (texto.includes("brincar")) {

    dados.pet.energia -= 10;
    dados.pet.felicidade += 10;

    message.reply(
      "🎮 Amei brincar com você! Foi divertido 🦖"
    );

    salvar();
  }


  // dormir
  if (texto.includes("dormir")) {

    dados.pet.sono = 100;
    dados.pet.energia = 100;

    message.reply(
      "😴 Zzz... Dormi e recuperei minhas energias."
    );

    salvar();
  }


});

};
// ===============================
// APRENDER FRASES
// ===============================

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  let texto = message.content;

  // ensinar o pet
  if (texto.toLowerCase().startsWith("ensine ")) {

    let frase = texto.slice(7);

    if (!dados.frases.includes(frase)) {
      dados.frases.push(frase);
      salvar();

      return message.reply(
        `🧠 Aprendi uma coisa nova!\n"${frase}"`
      );
    }

    return message.reply(
      "🦖 Eu já sei essa frase!"
    );
  }


  // pet aprende conversas normais
  if (
    texto.length > 5 &&
    !texto.startsWith(",")
  ) {

    if (Math.random() < 0.10) {

      if (!dados.frases.includes(texto)) {

        dados.frases.push(texto);
        salvar();

        message.channel.send(
          "🧠 Guardarei isso na minha memória!"
        );

      }

    }

  }


  // usar frases aprendidas
  if (
    texto.toLowerCase().includes("lembra") ||
    texto.toLowerCase().includes("fala algo")
  ) {

    if (dados.frases.length > 0) {

      let frase =
        dados.frases[
          Math.floor(Math.random()*dados.frases.length)
        ];

      message.reply(
        `🧠 Eu lembro disso:\n"${frase}"`
      );

    } else {

      message.reply(
        "🦖 Ainda não aprendi muitas coisas."
      );

    }

  }


});


// ===============================
// STATUS DO PET
// ===============================

setInterval(() => {

  dados.pet.fome -= 1;
  dados.pet.energia -= 1;
  dados.pet.sono -= 1;

  if (dados.pet.fome < 0)
    dados.pet.fome = 0;

  if (dados.pet.energia < 0)
    dados.pet.energia = 0;

  if (dados.pet.sono < 0)
    dados.pet.sono = 0;


  salvar();

}, 60000);


// ===============================
// EVENTOS ALEATÓRIOS
// ===============================

const eventos = [

"🦖 Eu encontrei uma pedra brilhante no mapa!",
"🎁 Achei um presente misterioso!",
"😂 Eu estava andando e tropecei kkk",
"🌟 Hoje parece um dia especial!",
"🍃 Estou explorando o servidor!"

];


setInterval(() => {

  let guilds = client.guilds.cache;

  guilds.forEach(guild => {

    let canais =
      guild.channels.cache.filter(
        c => c.isTextBased()
      );

    let canal =
      canais.random();

    if (canal) {

      canal.send(
        eventos[
          Math.floor(Math.random()*eventos.length)
        ]
      );

    }

  });

}, 60 * 60 * 1000);


// ===============================
// HUMOR DO PET
// ===============================

function humorPet(){

 if(dados.pet.fome < 30)
   return "com fome 🍖";

 if(dados.pet.energia < 30)
   return "cansado 😴";

 if(dados.pet.felicidade > 70)
   return "muito feliz 😄";

 return "normal 🙂";

}
// ===============================
// INTERAÇÕES DE CARINHO
// ===============================

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  let texto = message.content.toLowerCase();

  if (texto.includes("carinho")) {

    dados.pet.felicidade += 10;

    ganharXP(message.author);

    message.reply(
      "💚 *recebe carinho* Obrigado por cuidar de mim 🦖"
    );

    salvar();
  }


  if (texto.includes("abraço") || texto.includes("abraco")) {

    dados.pet.felicidade += 8;

    ganharXP(message.author);

    message.reply(
      "🤗 Abraço recebido! Você é um ótimo amigo."
    );

    salvar();
  }



  // ===============================
  // STATUS DO PET
  // ===============================

  if (
    texto === "status pet" ||
    texto === "pet status"
  ) {

    let usuario =
      dados.usuarios[message.author.id];

    message.reply(
`🦖 **Status do Mostrinho**

❤️ Felicidade: ${dados.pet.felicidade}
🍖 Fome: ${dados.pet.fome}
⚡ Energia: ${dados.pet.energia}
😴 Sono: ${dados.pet.sono}

🏆 Nível: ${dados.pet.nivel}
✨ XP: ${dados.pet.xp}

👤 Amizade:
${usuario ? usuario.amizade : 0}

Humor: ${humorPet()}`
    );

  }


});


// ===============================
// FALA SOZINHO
// ===============================

setInterval(() => {

  let mensagens = [

    "🦖 Estou passeando pelo servidor!",
    "💚 Alguém quer conversar comigo?",
    "🍖 Estou pensando em comida...",
    "⭐ Estou ficando mais inteligente!",
    "😴 Acho que preciso descansar um pouco."

  ];


  client.guilds.cache.forEach(guild => {

    let canais =
      guild.channels.cache.filter(
        c => c.isTextBased()
      );


    let canal = canais.random();


    if(canal){

      canal.send(
        mensagens[
          Math.floor(
            Math.random()*mensagens.length
          )
        ]
      );

    }

  });


}, 30 * 60 * 1000);


// ===============================
// RANKING DE AMIZADE
// ===============================

client.on("messageCreate", async(message)=>{

 if(message.author.bot) return;

 if(message.content.toLowerCase()
 .startsWith("amizades")){


 let lista =
 Object.values(dados.usuarios)
 .sort(
 (a,b)=>b.amizade-a.amizade
 )
 .slice(0,5);


 let texto =
 "🏆 **Melhores amigos do Mostrinho**\n\n";


 lista.forEach((u,i)=>{

 texto +=
 `${i+1}º ${u.nome} - ${u.amizade} pontos 💚\n`;

 });


 message.reply(texto);

 }

});


// salvar antes de desligar

process.on("exit", salvar);

process.on("SIGINT", ()=>{

 salvar();

 process.exit();

});
