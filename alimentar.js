const fs = require("fs");
const path = require("path");

module.exports = (client) => {

const pasta = path.join(__dirname, "database");
const arquivo = path.join(pasta, "mostrinho.json");

function carregarDB() {
return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}

function salvarDB(db) {
fs.writeFileSync(arquivo, JSON.stringify(db, null, 4));
}

// Cria os dados caso não existam
let db = carregarDB();

if (db.fome === undefined) db.fome = 100;
if (db.ultimaRefeicao === undefined) db.ultimaRefeicao = Date.now();
if (db.cuidadores === undefined) db.cuidadores = {};

salvarDB(db);

// A cada 30 minutos perde fome
setInterval(() => {

let db = carregarDB();  

if (db.fome > 0) {  

    db.fome -= 5;  

    if (db.fome < 0)  
        db.fome = 0;  

}  

salvarDB(db);

}, 30 * 60 * 1000);

client.on("messageCreate", async (message) => {

if (message.author.bot) return;  

const texto = message.content.toLowerCase();  

let db = carregarDB();  

// ==========================  
// COMANDO .fome  
// ==========================  

if (texto === ".fome") {  

    let estado = "😊 Estou satisfeito.";  

    if (db.fome <= 20)  
        estado = "🥺 Estou morrendo de fome...";  

    else if (db.fome <= 50)  
        estado = "🍖 Estou começando a ficar com fome.";  

    return message.reply(

`🍽️ Status da minha fome

🍖 Fome: ${db.fome}/100

${estado}`
);

}  

// A Parte 2 começa aqui...  
// ==========================  
// COMANDO .alimentar  
// ==========================  

if (texto.startsWith(".alimentar")) {  

    const comida = texto.replace(".alimentar", "").trim();  

    if (!comida) {  
        return message.reply(

`🍽️ Você esqueceu de dizer a comida!

Exemplo:
`.alimentar pizza`
`.alimentar café`
`.alimentar hambúrguer`
);
}

if (db.fome >= 100) {  

        const cheio = [  

            "😅 Minha barriguinha já está cheia. Vamos guardar essa comida para depois?",  

            "🖤 Obrigado pelo carinho, mas agora não consigo comer mais.",  

            "🤍 Acho melhor esperar um pouco antes da próxima refeição."  

        ];  

        return message.reply(  
            cheio[Math.floor(Math.random() * cheio.length)]  
        );  

    }  

    if (!db.cuidadores[message.author.id]) {  

        db.cuidadores[message.author.id] = {  
            nome: message.author.username,  
            refeicoes: 0  
        };  

    }  

    db.cuidadores[message.author.id].nome = message.author.username;  
    db.cuidadores[message.author.id].refeicoes++;  

    db.fome += 20;  

    if (db.fome > 100)  
        db.fome = 100;  

    db.ultimaRefeicao = Date.now();  

    let respostas = [];  

    switch (comida) {  

        case "pizza":  

            respostas = [  

                "🍕 Hummm... Essa pizza estava deliciosa! Muito obrigado por lembrar de mim. 🖤",  

                "😋 Fazia um tempinho que eu não comia pizza. Você acertou em cheio!",  

                "🖤 Você sempre sabe como me deixar feliz. Essa pizza estava incrível!"  

            ];  

            break;  

        case "hamburguer":  
        case "hambúrguer":  

            respostas = [  

                "🍔 Nossa! Que hambúrguer gostoso! Minha barriguinha está feliz.",  

                "🤍 Obrigado! Depois dessa refeição estou cheio de energia.",  

                "😋 Esse hambúrguer estava perfeito! Valeu por cuidar de mim."  

            ];  

            break;  

        case "café":  
        case "cafe":  

            respostas = [  

                "☕ Aaah... Agora sim acordei de verdade!",  

                "🖤 Esse café caiu muito bem. Obrigado!",  

                "😄 Café quentinho é sempre uma ótima escolha."  

            ];  

            break;  

        case "bolo":  

            respostas = [  

                "🎂 Humm... Um bolo! Você fez meu dia mais feliz!",  

                "🖤 Adoro um docinho de vez em quando.",  

                "🍰 Estava delicioso! Muito obrigado."  

            ];  

            break;  

        case "pão":  
        case "pao":  

            respostas = [  

                "🍞 Um pão quentinho! Muito obrigado.",  

                "🤍 Gostei bastante dessa refeição.",  

                "🖤 Você sempre cuida de mim."  

            ];  

            break;  

        case "carne":  

            respostas = [  

                "🥩 Que refeição caprichada! Agora estou satisfeito.",  

                "💪 Obrigado! Acho que fiquei até mais forte.",  

                "🖤 Estava muito gostosa!"  

            ];  

            break;  

        case "peixe":  

            respostas = [  

                "🐟 Gostei bastante desse peixe!",  

                "🤍 Estava muito saboroso.",  

                "😋 Obrigado pela refeição."  

            ];  

            break;  

        case "água":  
        case "agua":  

            respostas = [  

                "💧 Obrigado! Agora estou hidratado.",  

                "🤍 Água também faz muito bem.",  

                "🖤 Valeu por cuidar de mim."  

            ];  

            break;  

        case "maçã":  
        case "maca":  

            respostas = [  

                "🍎 Adorei essa maçã!",  

                "🤍 Frutinhas fazem muito bem.",  

                "🖤 Obrigado por cuidar da minha saúde."  

            ];  

            break;  

        case "macarrão":  
        case "macarrao":  

            respostas = [  

                "🍝 Humm... Esse macarrão estava uma delícia!",  

                "🖤 Muito obrigado pela refeição.",  

                "😋 Acho que vou querer mais depois."  

            ];  

            break;  

        case "arroz":  

            respostas = [  

                "🍚 Arroz quentinho! Gostei muito.",  

                "🤍 Simples, mas delicioso!",  

                "🖤 Muito obrigado por lembrar de mim."  

            ];  

            break;  

        default:  

            respostas = [  

                `😋 Obrigado pela ${comida}! Gostei bastante.`,  

                `🖤 A ${comida} estava muito gostosa!`,  

                `🤍 Valeu por cuidar de mim com ${comida}.`  

            ];  

    }  

    salvarDB(db);  

    return message.reply(  
        respostas[Math.floor(Math.random() * respostas.length)] +  
        `\n\n🍖 Minha fome agora está em **${db.fome}/100**.`  
    );  

}  

// A Parte 3 começa abaixo...  
// ==========================  
// RANKING DE CUIDADORES  
// ==========================  

if (texto === ".cuidadores") {  

    const ranking = Object.values(db.cuidadores)  
        .sort((a, b) => b.refeicoes - a.refeicoes)  
        .slice(0, 10);  

    if (ranking.length === 0) {  
        return message.reply("🖤 Ninguém cuidou de mim ainda...");  
    }  

    let msg = "🏆 **Quem mais cuida de mim**\n\n";  

    ranking.forEach((user, i) => {  

        const medalha =  
            i === 0 ? "🥇" :  
            i === 1 ? "🥈" :  
            i === 2 ? "🥉" : "🔹";  

        msg += `${medalha} **${user.nome}** — ${user.refeicoes} refeições\n`;  

    });  

    return message.reply(msg);  

}  

// ==========================  
// MENSAGENS AUTOMÁTICAS  
// ==========================  

if (db.fome <= 20 && Math.random() < 0.15) {  

    const falas = [  

        "🥺 Minha barriga está roncando... Será que alguém pode me alimentar?",  

        "🍖 Faz um tempinho que não como nada...",  

        "🖤 Estou com bastante fome... alguém pode cuidar de mim?",  

        "🤍 Aceito qualquer comidinha com carinho. 😊"  

    ];  

    return message.reply(  
        falas[Math.floor(Math.random() * falas.length)]  
    );  

}  

// ==========================  
// AGRADECIMENTO ESPECIAL  
// ==========================  

if (  
    db.cuidadores[message.author.id] &&  
    db.cuidadores[message.author.id].refeicoes % 10 === 0  
) {  

    return message.reply(

`💜 Muito obrigado, ${message.author.username}!

Você já me alimentou ${db.cuidadores[message.author.id].refeicoes} vezes.

Fico muito feliz por você sempre cuidar de mim. 🖤`
);

}

}); // Fecha messageCreate

}; // Fecha module.exports
