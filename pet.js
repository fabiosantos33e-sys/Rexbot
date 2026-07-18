const fs = require("fs");
const path = require("path");

module.exports = (client) => {

const pasta = path.join(__dirname, "database");
const arquivo = path.join(pasta, "pet.json");

if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, JSON.stringify({
        nome: "Mostrinho",
        fome: 100,
        felicidade: 100,
        energia: 100,
        humor: "Feliz",
        frases: [],
        usuarios: {}
    }, null, 2));
}

function salvar(db){
    fs.writeFileSync(arquivo, JSON.stringify(db, null, 2));
}

function carregar(){
    return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}


// Diminui status com o tempo
setInterval(() => {

    let db = carregar();

    db.fome = Math.max(0, db.fome - 2);
    db.energia = Math.max(0, db.energia - 1);

    if(db.fome < 30){
        db.humor = "Com fome 🍖";
    } 
    else if(db.energia < 30){
        db.humor = "Com sono 😴";
    }
    else{
        db.humor = "Feliz ❤️";
    }

    salvar(db);

},60000);


// Mensagens aleatórias
setInterval(()=>{

const mensagens = [
"Alguém quer brincar comigo? 🦖",
"Estou andando pelo servidor 👀",
"Não esqueçam de cuidar de mim 🍖",
"Hoje estou muito feliz ❤️",
"Vocês são minha família 🦖💚"
];


const guild = client.guilds.cache.first();

if(!guild) return;


const canal = guild.channels.cache.find(c=>c.isTextBased());


if(canal){
canal.send(
mensagens[Math.floor(Math.random()*mensagens.length)]
);
}


},900000);



client.on("messageCreate", async message=>{


if(message.author.bot) return;


let texto = message.content.toLowerCase();

let db = carregar();



if(!db.usuarios[message.author.id]){

db.usuarios[message.author.id]={
nome: message.author.username,
xp:0
};

}


db.usuarios[message.author.id].xp++;



// Aprender

if(texto.startsWith("mostrinho aprender ")){

let frase = message.content.slice(19);


if(!frase) return;


db.frases.push(frase);

salvar(db);


return message.reply(
"🧠 Aprendi uma coisa nova!"
);


}



// Conversa


if(
texto.includes("oi") ||
texto.includes("oii") ||
texto.includes("olá") ||
texto.includes("ola")
){

return message.reply(
"🦖 Oiii! Eu sou o Mostrinho ❤️ Estou bem e você?"
);

}



if(texto.includes("tudo bem")){

return message.reply(
"🦖 Estou ótimo! Minha energia está em "+db.energia+"% ⚡"
);

}



// Comandos do Mostrinho


if(texto === "mostrinho brincar"){


db.felicidade=Math.min(100,db.felicidade+10);

db.energia=Math.max(0,db.energia-10);


salvar(db);


return message.reply(
"🎉 Eu adorei brincar com você! 🦖❤️"
);

}



if(texto === "mostrinho alimentar"){


db.fome=100;

salvar(db);


return message.reply(
"🍖 Obrigado pela comida! Agora estou cheio!"
);

}



if(texto === "mostrinho dormir"){


db.energia=100;

salvar(db);


return message.reply(
"😴 Zzz... Agora estou descansado!"
);

}



if(texto === "mostrinho status"){


return message.reply(
`🦖 **Mostrinho**

❤️ Humor: ${db.humor}

🍖 Fome: ${db.fome}%

⚡ Energia: ${db.energia}%

😊 Felicidade: ${db.felicidade}%

🧠 Frases aprendidas: ${db.frases.length}`
);


}



// Respostas aprendidas

if(db.frases.length > 0 && Math.random() < 0.15){

return message.reply(
db.frases[Math.floor(Math.random()*db.frases.length)]
);

}



salvar(db);


});

};
