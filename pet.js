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



// Status diminuindo com o tempo

setInterval(()=>{

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




// Mensagens automáticas

setInterval(()=>{

const mensagens = [
"🦖 Alguém quer brincar comigo?",
"👀 Estou observando vocês",
"🍖 Não esqueçam de me alimentar",
"❤️ Estou muito feliz hoje",
"🦖 Vocês são minha família"
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



// Criar usuário

if(!db.usuarios[message.author.id]){

db.usuarios[message.author.id] = {
nome: message.author.username,
xp:0
};

}


db.usuarios[message.author.id].xp++;





// PET - frase aprendida aleatória

if(texto === "pet"){

if(db.frases.length > 0){

let frase = db.frases[
Math.floor(Math.random()*db.frases.length)
];


return message.reply(
"🦖 " + frase
);


}else{

return message.reply(
"🦖 Ainda não aprendi nenhuma frase 😢"
);

}

}





// Palavrões

const proibidas = [
"porra",
"caralho",
"puta",
"fdp",
"merda",
"desgraça",
"buceta"
];


if(proibidas.some(p => texto.includes(p))){

return message.reply(
"🦖 Ei! Sem palavrão, vamos manter o servidor tranquilo ❤️"
);

}





// Capeta

if(texto.includes("capeta")){


const respostas = [
"🦖 Capeta? E tu? 😂",
"👀 Ih, chamou quem?",
"😂 Eu sou o Mostrinho, não o capeta",
"🦖 Cuidado com essas palavras kkk"
];


return message.reply(
respostas[Math.floor(Math.random()*respostas.length)]
);


}





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
"🦖 Oiii! Eu sou o Mostrinho ❤️"
);

}




if(texto.includes("tudo bem")){

return message.reply(
"🦖 Estou ótimo! Minha energia está em "+db.energia+"% ⚡"
);

}





// Brincar

if(texto === "mostrinho brincar"){

db.felicidade = Math.min(100, db.felicidade + 10);

db.energia = Math.max(0, db.energia - 10);

salvar(db);


return message.reply(
"🎉 Eu adorei brincar com você! 🦖❤️"
);

}





// Alimentar

if(texto === "mostrinho alimentar"){

db.fome = 100;

salvar(db);


return message.reply(
"🍖 Obrigado pela comida! Estou cheio!"
);

}





// Dormir

if(texto === "mostrinho dormir"){

db.energia = 100;

salvar(db);


return message.reply(
"😴 Zzz... Agora estou descansado!"
);

}





// Status

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





// Fala frases aprendidas aleatoriamente

if(db.frases.length > 0 && Math.random() < 0.15){

return message.reply(
db.frases[Math.floor(Math.random()*db.frases.length)]
);

}



salvar(db);


});


};
