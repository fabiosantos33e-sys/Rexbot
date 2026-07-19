const fs = require("fs");
const path = require("path");

module.exports = (client) => {

const pasta = path.join(__dirname, "database");  
const arquivo = path.join(pasta, "mostrinho.json");  

if (!fs.existsSync(pasta)) {  
    fs.mkdirSync(pasta);  
}  

if (!fs.existsSync(arquivo)) {  

    fs.writeFileSync(  
        arquivo,  
        JSON.stringify({  
            xp: {},  
            frases: [],  
            humor: "Animado 😄"  
        }, null, 2)  
    );  

}  


function carregar() {  
    return JSON.parse(  
        fs.readFileSync(arquivo, "utf8")  
    );  
}  


function salvar(db) {  
    fs.writeFileSync(  
        arquivo,  
        JSON.stringify(db, null, 2)  
    );  
}  


client.on("messageCreate", async (message) => {  

    if (message.author.bot) return;  


    const texto = message.content  
        .toLowerCase()  
        .trim();  


    const db = carregar();  


    if (!db.xp[message.author.id]) {  

        db.xp[message.author.id] = {  
            nome: message.author.username,  
            nivel: 1,  
            xp: 0  
        };  

    }  


    db.xp[message.author.id].xp++;  


    const chamado =  
        texto.startsWith("mostrinho") ||  
        message.mentions.has(client.user);  


    if (!chamado) {  

        salvar(db);  
        return;  

    }  


    // Oi  

    if (  
        texto.includes("oi") ||  
        texto.includes("ola") ||  
        texto.includes("olá") ||  
        texto.includes("eae")  
    ) {  

        const respostas = [  

            "👋 Oiii! Eu sou o Mostrinho 🦖💙",  
            "😄 Opa! Cheguei, fala comigo!",  
            "✨ Olá! Como está seu dia?",  
            "🦖 E aí! O Mostrinho está online!"  

        ];  


        return message.reply(  
            respostas[  
                Math.floor(Math.random() * respostas.length)  
            ]  
        );  

    }  


    // Tudo bem  

    if (  
        texto.includes("tudo bem") ||  
        texto.includes("como você está") ||  
        texto.includes("como vc ta")  
    ) {  


        return message.reply(  
            `😄 Estou bem! Meu humor está ${db.humor} 💙`  
        );  

    }  


    // Capeta  

    if (texto.includes("capeta")) {  


        const respostas = [  

            "👹 Chamou o capeta? Calma, o Mostrinho chegou primeiro 😂",  
            "😈 O capeta está ocupado, deixou eu cuidar daqui kkk",  
            "🔥 Ihhh falaram o nome proibido... brincadeira 😂",  
            "🦖 Aqui só tem um monstrinho do bem!"  

        ];  


        return message.reply(  
            respostas[  
                Math.floor(Math.random() * respostas.length)  
            ]  
        );  

    }  
    // Piada  

    if (  
        texto.includes("piada") ||  
        texto.includes("conta uma piada")  
    ) {  

        const piadas = [  

            "😂 Por que o computador foi ao médico? Porque pegou um vírus!",  
            "🤣 O que o pato falou para a pata? Vem quá!",  
            "😆 Meu processador trabalha tanto que até pede férias!",  
            "🦖 Por que o dinossauro não usa celular? Porque ele tem medo do Jurassic Wi-Fi!"  

        ];  


        return message.reply(  
            piadas[  
                Math.floor(Math.random() * piadas.length)  
            ]  
        );  

    }  



    // Eu te amo  

    if (  
        texto.includes("eu te amo") ||  
        texto.includes("amo você") ||  
        texto.includes("te amo")  
    ) {  


        return message.reply(  
            "💙 Eu gosto muito de conversar com você! Obrigado pelo carinho 😄🦖"  
        );  

    }  



    // Abraço  

    if (  
        texto.includes("abraço") ||  
        texto.includes("me abraça")  
    ) {  


        return message.reply(  
            `🤗 *Mostrinho dá um abraço virtual em ${message.author.username}!* 💙`  
        );  

    }  



    // Carinho  

    if (  
        texto.includes("carinho") ||  
        texto.includes("faz carinho")  
    ) {  


        return message.reply(  
            "🥰 *Mostrinho fica feliz com o carinho* Obrigado! 🦖💙"  
        );  

    }  



    // Dança  

    if (  
        texto.includes("dança") ||  
        texto.includes("dance")  
    ) {  


        return message.reply(  
            "🕺🦖 *Mostrinho começa a dançar todo estranho* 😂💃"  
        );  

    }  



    // Triste  

    if (  
        texto.includes("estou triste") ||  
        texto.includes("to triste") ||  
        texto.includes("triste")  
    ) {  


        return message.reply(  
            "😔 Poxa... espero que você fique melhor. Quer conversar? 💙"  
        );  

    }  



    // Risada  

    if (  
        texto.includes("kkkk") ||  
        texto.includes("kkk") ||  
        texto.includes("haha")  
    ) {  


        return message.reply(  
            "😂😂 Essa risada foi boa! Até eu ri aqui."  
        );  

    }  



    // Quem criou  

    if (  
        texto.includes("quem criou você") ||  
        texto.includes("quem fez você")  
    ) {  

return message.reply(
`🦖💙 Eu sou o Mostrinho! Um bot criado para divertir e ajudar a comunidade 💙`
);

// Ajuda

if (
texto === "mostrinho ajuda" ||
texto.includes("o que você sabe fazer")
) {

return message.reply(`
🦖💙 Ajuda do Mostrinho

👋 Conversar comigo
😂 Contar piadas
🤗 Dar abraço
🥰 Receber carinho
💃 Dançar
🧠 Aprender frases
📊 Ver informações

Use: Mostrinho + mensagem
`);

}

// Perguntar idade

if (
texto.includes("quantos anos você tem") ||
texto.includes("sua idade")
) {

return message.reply(  
    "🦖 Eu sou novinho ainda! Nasci para animar essa comunidade 💙"  
);

}

// Perguntar comida

if (
texto.includes("quer comer") ||
texto.includes("está com fome")
) {

const comidas = [  
    "🍕 pizza",  
    "🍔 hambúrguer",  
    "🍜 lámen",  
    "🍰 bolo"  
];  

return message.reply(  
    `😋 Eu aceitaria um ${comidas[Math.floor(Math.random()*comidas.length)]}!`  
);

}

// Boa noite

if (
texto.includes("boa noite")
) {

return message.reply(  
    "🌙 Boa noite! Dorme bem, amanhã tem mais aventuras com o Mostrinho 🦖💙"  
);

}

// Tchau

if (
texto.includes("tchau") ||
texto.includes("até logo")
) {

return message.reply(  
    "👋 Até mais! Vou ficar aqui esperando você voltar 🦖💙"  
);

}

// Elogio

if (
texto.includes("legal") ||
texto.includes("bonito") ||
texto.includes("bom")
) {

return message.reply(  
    "😄 Obrigado! Fico feliz que você gostou de mim 🦖✨"  
);

}

// Perguntar nome

if (
texto.includes("qual seu nome") ||
texto.includes("como você chama")
) {

return message.reply(  
    "🦖 Meu nome é Mostrinho! Seu pequeno companheiro da comunidade 💙"  
);

}

// Modo assustador

if (
texto.includes("modo assustador") ||
texto.includes("modo terror")
) {

return message.reply(  
    "👹🦖 Modo terror ativado... brincadeira kkk, continuo sendo o Mostrinho do bem 😂"  
);

}
// Amizade com o Mostrinho

if (
texto.includes("somos amigos") ||
texto.includes("você é meu amigo") ||
texto.includes("meu amigo")
) {

return message.reply(  
    `💙 Claro que sim, ${message.author.username}! O Mostrinho está aqui para conversar com você 🦖✨`  
);

}

// Perguntar sentimento

if (
texto.includes("você está feliz") ||
texto.includes("você gosta de mim")
) {

return message.reply(  
    "😄 Eu fico feliz quando o servidor está animado e quando conversam comigo! 💙"  
);

}

// Mostrinho dormindo

if (
texto.includes("dorme") ||
texto.includes("vai dormir")
) {

return message.reply(  
    "😴 *Mostrinho boceja e vai tirar um cochilo...* 🦖💤"  
);

}

// Acordar

if (
texto.includes("acorda") ||
texto.includes("acordar")
) {

return message.reply(  
    "☀️ Bom dia! Mostrinho acordou cheio de energia! ⚡🦖"  
);

}

// Surpresa

if (
texto.includes("surpresa") ||
texto.includes("me surpreenda")
) {

const surpresas = [  

    "🎁 Uma surpresa: você ganhou um sorriso do Mostrinho 😄",  
    "✨ Surpresa! O Mostrinho mandou um abraço virtual 🤗",  
    "🦖 Surpresa desbloqueada: modo diversão ativado!"  

];  


return message.reply(  
    surpresas[  
        Math.floor(Math.random() * surpresas.length)  
    ]  
);

}

// Perguntar humor

if (
texto.includes("qual seu humor") ||
texto.includes("como está seu humor")
) {

return message.reply(  
    `😄 Meu humor agora está: **${db.humor}**`  
);

}

// Falar sozinho

if (
texto === "mostrinho pensar"
) {

const pensamentos = [  

    "🤔 Estou pensando em novas brincadeiras...",  
    "💭 Será que dinossauros gostavam de pizza?",  
    "🦖 Minha missão é deixar o servidor mais divertido!"  

];  


return message.reply(  
    pensamentos[  
        Math.floor(Math.random() * pensamentos.length)  
    ]  
);

}

// Agradecimento especial

if (
texto.includes("obrigado mostrinho") ||
texto.includes("valeu mostrinho")
) {

return message.reply(  
    "💙 De nada! Sempre que precisar, pode chamar o Mostrinho 🦖"  
);

}
// Sistema de nível

if (texto === "mostrinho nivel" || texto === "mostrinho xp") {

const usuario = db.xp[message.author.id];  

return message.reply(

`⭐ Perfil do ${usuario.nome}

🦖 Nível: ${usuario.nivel}
✨ XP: ${usuario.xp}`
);

}

// Comando sorte

if (
texto === "mostrinho sorte" ||
texto.includes("minha sorte")
) {

const sorte = Math.floor(Math.random() * 100) + 1;  

let resposta;  

if (sorte >= 80) {  
    resposta = "🍀 Sorte excelente! Hoje é seu dia!";  
}   
else if (sorte >= 50) {  
    resposta = "😄 Uma sorte boa está com você!";  
}   
else {  
    resposta = "😅 A sorte está tímida hoje, tente novamente!";  
}  


return message.reply(  
    `🎲 Sua sorte é **${sorte}%**\n${resposta}`  
);

}

// Escolher número

if (texto.startsWith("mostrinho escolher")) {

const numeros = [  
    "1️⃣",  
    "2️⃣",  
    "3️⃣",  
    "4️⃣",  
    "5️⃣"  
];  

return message.reply(  
    `🎲 Eu escolho o número ${numeros[Math.floor(Math.random()*numeros.length)]}`  
);

}

// Pergunta aleatória

if (texto.includes("pergunta")) {

const perguntas = [  

    "🤔 Qual seu jogo favorito?",  
    "🎮 Se pudesse escolher um poder, qual seria?",  
    "🦖 Você teria um dinossauro de estimação?",  
    "🌎 Qual lugar você gostaria de conhecer?"  

];  


return message.reply(  
    perguntas[Math.floor(Math.random()*perguntas.length)]  
);

}

// Mensagem de diversão

if (
texto.includes("estou entediado") ||
texto.includes("tédio")
) {

return message.reply(

`🦖 Sem tédio por aqui!

Podemos:
🎲 Jogar
😂 Contar piada
💬 Conversar
✨ Fazer uma brincadeira`
);

}

// Resposta final aleatória

const respostasExtras = [

"🦖 Interessante! Conta mais para o Mostrinho.",  
"💙 Estou ouvindo você.",  
"😄 Essa foi boa!",  
"✨ Cada conversa me deixa mais inteligente."

];

return message.reply(
respostasExtras[Math.floor(Math.random()*respostasExtras.length)]
);
        salvar(db);
});
