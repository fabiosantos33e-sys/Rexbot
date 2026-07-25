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
                humor: "feliz",
                usuarios: {}
            }, null, 4)
        );
    }


    let db = JSON.parse(
        fs.readFileSync(arquivo, "utf8")
    );


    function salvar() {
        fs.writeFileSync(
            arquivo,
            JSON.stringify(db, null, 4)
        );
    }


    function pegarUsuario(message) {

        const id = message.author.id;

        if (!db.usuarios[id]) {

            db.usuarios[id] = {

                nome: message.author.username,

                apelido: "",

                amizade: 0,

                rivalidade: 0,

                respeito: 50,

                vitorias: 0,

                derrotas: 0,

                mensagens: 0,

                ultimoChat: Date.now()

            };

            salvar();
        }

        return db.usuarios[id];
    }



    const humores = [
        "feliz 😄",
        "debochado 😏",
        "animado 🔥",
        "preguiçoso 😴",
        "brincalhão 😂",
        "calmo 😌"
    ];


    function mudarHumor() {

        if (Math.random() < 0.03) {

            db.humor =
                humores[
                    Math.floor(Math.random() * humores.length)
                ];

            salvar();
        }
    }



    client.on("messageCreate", async (message) => {


        if (message.author.bot) return;


        const texto =
            message.content.toLowerCase();


        const user = pegarUsuario(message);


        user.mensagens++;
        user.ultimoChat = Date.now();


        mudarHumor();



        // continua na Parte 2...

// ==========================
// SISTEMA DE APELIDO
// ==========================

if (
    texto.startsWith("me chama de ")
) {

    const apelido =
        message.content
        .substring(12)
        .trim();


    if (apelido.length >= 2 && apelido.length <= 20) {

        user.apelido = apelido;

        salvar();

        return message.reply(
            `😎 Fechado! Agora vou te chamar de **${apelido}**.`
        );

    }

}



// ==========================
// SAUDAÇÕES
// ==========================

if (
    texto === "oi" ||
    texto === "olá" ||
    texto === "ola" ||
    texto === "eae" ||
    texto === "opa" ||
    texto === "salve"
) {

    const nome =
        user.apelido ||
        user.nome;


    const respostas = [

        `👋 Opa, ${nome}! Tudo certo?`,

        `😎 Salve ${nome}! Cheguei.`,

        `😂 Olha quem apareceu.`,

        `🤝 Fala comigo, ${nome}!`

    ];


    return message.reply(
        respostas[
            Math.floor(Math.random() * respostas.length)
        ]
    );

}



// ==========================
// COMO ESTÁ
// ==========================

if (
    texto.includes("tudo bem") ||
    texto.includes("como você está") ||
    texto.includes("como vc ta")
) {


    const respostas = [

        `😄 Estou bem! Meu humor está ${db.humor}.`,

        `😎 Tranquilo, só observando o servidor.`,

        `😂 Estou vivo e pronto pra conversar.`,

        `🔥 Hoje estou ${db.humor}.`

    ];


    return message.reply(
        respostas[
            Math.floor(Math.random() * respostas.length)
        ]
    );

}



// ==========================
// OBRIGADO
// ==========================

if (
    texto.includes("obrigado") ||
    texto.includes("valeu") ||
    texto.includes("tmj")
) {

    user.amizade += 2;

    salvar();


    const respostas = [

        "🤝 Tamo junto!",

        "😎 Sempre que precisar.",

        "🫶 Disponha!",

        "😂 É nóis!"

    ];


    return message.reply(
        respostas[
            Math.floor(Math.random() * respostas.length)
        ]
    );

}



// ==========================
// QUEM É
// ==========================

if (
    texto.includes("quem é você") ||
    texto.includes("quem é vc")
) {

    return message.reply(
`😎 Eu sou o Mostrinho.

Sou o bot que gosta de conversar,
brincar e zoar o pessoal do servidor.

Meu humor agora:
**${db.humor}**`
    );

}



// ==========================
// CONTINUA NA PARTE 3...

// ==========================
// BRIGA DE BRINCADEIRA
// ==========================

if (
    texto.includes("briga") ||
    texto.includes("me xinga") ||
    texto.includes("zoa eu")
) {

    user.rivalidade += 2;

    salvar();


    const zoeiras = [

        `😂 ${user.apelido || user.nome}, você pediu né...

Mas vou pegar leve porque sou educado. 😎`,

        `😏 Cuidado, você chamou o Mostrinho pra batalha de zoeira.`,

        `🤣 Você tem coragem de pedir isso? Interessante...`,

        `🙄 Eu ia responder sério, mas lembrei que você é você.`

    ];


    return message.reply(
        zoeiras[
            Math.floor(Math.random() * zoeiras.length)
        ]
    );

}



// ==========================
// RISADAS
// ==========================

if (
    texto.includes("kkk") ||
    texto.includes("kkkk") ||
    texto.includes("kkkkk") ||
    texto.includes("ksks")
) {

    const respostas = [

        "😂 KKKKK boa essa.",

        "🤣 Vocês não têm jeito.",

        "😆 Essa foi boa.",

        "👀 Estou vendo essa risada aí."

    ];


    return message.reply(
        respostas[
            Math.floor(Math.random() * respostas.length)
        ]
    );

}



// ==========================
// BOM DIA / TARDE / NOITE
// ==========================

if (texto.includes("bom dia")) {

    return message.reply(
        `☀️ Bom dia, ${user.apelido || user.nome}! Que seu dia seja bom 😄`
    );

}


if (texto.includes("boa tarde")) {

    return message.reply(
        `🌤️ Boa tarde, ${user.apelido || user.nome}! Tudo tranquilo?`
    );

}


if (texto.includes("boa noite")) {

    return message.reply(
        `🌙 Boa noite, ${user.apelido || user.nome}! Descansa aí 😴`
    );

}



// ==========================
// PERFIL DO MEMBRO
// ==========================

if (
    texto === "perfil" ||
    texto === "meu perfil" ||
    texto.includes("minha amizade")
) {


    return message.reply(
`📋 Perfil do ${user.apelido || user.nome}

❤️ Amizade: ${user.amizade}

😈 Rivalidade: ${user.rivalidade}

🛡️ Respeito: ${user.respeito}

🏆 Vitórias: ${user.vitorias}

💀 Derrotas: ${user.derrotas}

💬 Mensagens: ${user.mensagens}

🎭 Humor do Mostrinho:
${db.humor}`
    );

}



// ==========================
// PEDRA PAPEL TESOURA
// ==========================

if (
    texto === "ppt" ||
    texto.includes("pedra papel tesoura")
) {

    user.jogando = true;

    salvar();


    return message.reply(
`🎮 Bora jogar!

Responda:

🪨 pedra
📄 papel
✂️ tesoura`
    );

}



if (user.jogando) {

    const opcoes = [
        "pedra",
        "papel",
        "tesoura"
    ];


    let escolha;


    if (texto.includes("pedra"))
        escolha = "pedra";

    if (texto.includes("papel"))
        escolha = "papel";

    if (texto.includes("tesoura"))
        escolha = "tesoura";



    if (escolha) {


        const bot =
            opcoes[
                Math.floor(Math.random() * opcoes.length)
            ];


        user.jogando = false;



        if (escolha === bot) {

            salvar();

            return message.reply(
`🤝 Empate!

Você: ${escolha}
Eu: ${bot}`
            );

        }


        const ganhou =
            (escolha === "pedra" && bot === "tesoura") ||
            (escolha === "papel" && bot === "pedra") ||
            (escolha === "tesoura" && bot === "papel");



        if (ganhou) {

            user.vitorias++;

            user.amizade++;

            salvar();


            return message.reply(
`😂 Você ganhou dessa vez!

Você: ${escolha}
Eu: ${bot}

🏆 Vitórias: ${user.vitorias}`
            );

        } else {

            user.derrotas++;

            user.rivalidade++;

            salvar();


            return message.reply(
`😎 Eu ganhei!

Você: ${escolha}
Eu: ${bot}

💀 Derrotas: ${user.derrotas}`
            );

        }

    }

}



// continua na Parte 4...

// ==========================
// MEMÓRIA DE CONVERSA
// ==========================

if (!user.memoria) {
    user.memoria = [];
}


if (texto.length > 3) {

    user.memoria.push(
        message.content
    );


    if (user.memoria.length > 10) {
        user.memoria.shift();
    }

}



// ==========================
// LEMBRAR
// ==========================

if (
    texto.includes("lembra") ||
    texto.includes("você lembra")
) {


    if (user.memoria.length === 0) {

        return message.reply(
            "🤔 Ainda não lembro de muita coisa sobre você."
        );

    }


    return message.reply(
`🧠 Eu lembro de algumas coisas...

Última mensagem sua:

"${user.memoria[user.memoria.length - 1]}"`
    );

}



// ==========================
// ESTOU TRISTE
// ==========================

if (
    texto.includes("estou triste") ||
    texto.includes("to triste") ||
    texto.includes("tô triste")
) {


    user.amizade++;

    salvar();


    const respostas = [

        "🥺 Quer conversar? Estou aqui.",

        "🤝 Espero que seu dia melhore.",

        "❤️ Força aí. Vai passar.",

        "😔 Dias ruins acontecem. Não desiste."

    ];


    return message.reply(
        respostas[
            Math.floor(Math.random() * respostas.length)
        ]
    );

}



// ==========================
// ESTOU FELIZ
// ==========================

if (
    texto.includes("estou feliz") ||
    texto.includes("to feliz") ||
    texto.includes("tô feliz")
) {


    user.amizade += 2;

    salvar();


    return message.reply(
`😄 Aí sim!

Gosto de ver você feliz, ${user.apelido || user.nome}.`
    );

}



// ==========================
// TÉDIO
// ==========================

if (
    texto.includes("tédio") ||
    texto.includes("tedio") ||
    texto.includes("estou entediado")
) {


    const respostas = [

        "🎮 Bora jogar alguma coisa?",

        "😂 Quer uma piada?",

        "🤔 Me pergunta alguma coisa.",

        "😎 Vamos conversar."

    ];


    return message.reply(
        respostas[
            Math.floor(Math.random() * respostas.length)
        ]
    );

}



// ==========================
// PIADAS
// ==========================

if (
    texto.includes("piada")
) {


    const piadas = [

        "😂 Por que o computador foi ao médico? Porque pegou um vírus.",

        "🤣 O Wi-Fi terminou o namoro porque perdeu a conexão.",

        "😆 O teclado foi descansar porque estava sem espaço.",

        "😂 Eu ia contar uma piada melhor, mas meu código ficou com vergonha."

    ];


    return message.reply(
        piadas[
            Math.floor(Math.random() * piadas.length)
        ]
    );

}



// ==========================
// PERGUNTAS ALEATÓRIAS
// ==========================

if (
    texto.includes("pergunta")
) {


    const perguntas = [

        "🤔 Qual jogo você nunca enjoa?",

        "🎮 Qual seu personagem favorito?",

        "🔥 Qual foi o melhor momento que você viveu jogando?",

        "😂 Qual foi a coisa mais engraçada que já aconteceu com você?"

    ];


    return message.reply(
        perguntas[
            Math.floor(Math.random() * perguntas.length)
        ]
    );

}



// ==========================
// MOSTRINHO FALA SOZINHO
// ==========================

if (
    Math.random() < 0.005
) {


    const frases = [

        "👀 Estou observando o chat.",

        "😂 Esse servidor é uma loucura.",

        "☕ Preciso de um café virtual.",

        "😎 Alguém quer conversar?",

        "🤔 Estou pensando aqui..."

    ];


    message.channel.send(
        frases[
            Math.floor(Math.random() * frases.length)
        ]
    );

}



// continua na Parte 5..

// ==========================
// EVENTOS ALEATÓRIOS
// ==========================

if (Math.random() < 0.003) {

    const eventos = [

        "🎉 Evento aleatório: Hoje estou mais animado que o normal!",

        "😈 Evento aleatório: Hoje vou aceitar provocações.",

        "😂 Evento aleatório: Dia oficial da zoeira.",

        "🤝 Evento aleatório: Todo mundo merece um elogio hoje."

    ];


    message.channel.send(
        eventos[
            Math.floor(Math.random() * eventos.length)
        ]
    );

}



// ==========================
// AUMENTAR RESPEITO
// ==========================

if (
    texto.includes("obrigado") ||
    texto.includes("parabéns") ||
    texto.includes("boa")
) {

    user.respeito += 1;

    if (user.respeito > 100) {
        user.respeito = 100;
    }

    salvar();

}



// ==========================
// DESPEDIDA
// ==========================

if (
    texto === "tchau" ||
    texto === "falou" ||
    texto === "até mais" ||
    texto === "ate mais"
) {

    const respostas = [

        "👋 Até mais! Volta depois.",

        "😎 Falou! Foi bom conversar.",

        "🤝 Tamo junto!",

        "😂 Não some hein."

    ];


    return message.reply(
        respostas[
            Math.floor(Math.random() * respostas.length)
        ]
    );

}



// ==========================
// SALVAR DADOS
// ==========================

salvar();


    });

};
