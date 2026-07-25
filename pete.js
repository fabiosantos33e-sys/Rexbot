// ==========================
// MEMÓRIA DOS MEMBROS
// ==========================

if (!db.usuarios) db.usuarios = {};

const id = message.author.id;

if (!db.usuarios[id]) {
    db.usuarios[id] = {
        nome: message.author.username,
        amizade: 0,
        rivalidade: 0,
        respeito: 50,
        humor: "neutro",
        apelido: "",
        ultimaInteracao: Date.now(),
        vitorias: 0,
        derrotas: 0,
        provocacoes: 0,
        elogios: 0
    };
}

const user = db.usuarios[id];

user.nome = message.author.username;
user.ultimaInteracao = Date.now();


// ==========================
// HUMOR DO MOSTRINHO
// ==========================

const humores = [
    "feliz",
    "debochado",
    "bravo",
    "carente",
    "animado",
    "preguiçoso",
    "convencido",
    "maluco"
];

if (!db.humorAtual) {
    db.humorAtual = humores[Math.floor(Math.random() * humores.length)];
}

// 5% de chance de mudar o humor
if (Math.random() < 0.05) {

    db.humorAtual =
        humores[Math.floor(Math.random() * humores.length)];

    const mensagens = {
        feliz: "😊 Hoje acordei de bom humor!",
        debochado: "😏 Hoje eu tô impossível.",
        bravo: "😤 Melhor ninguém testar minha paciência.",
        carente: "🥺 Alguém conversa comigo...",
        animado: "🤩 Hoje promete!",
        preguiçoso: "😴 Cinco minutinhos só...",
        convencido: "😎 Eu sou bom e vocês sabem.",
        maluco: "🤪 Hoje eu tô completamente sem filtro."
    };

    message.channel.send(mensagens[db.humorAtual]);
}
// ==========================
// AMIZADE E RIVALIDADE
// ==========================

// Elogios
if (
    texto.includes("legal") ||
    texto.includes("bom bot") ||
    texto.includes("gostei") ||
    texto.includes("te amo") ||
    texto.includes("amo você") ||
    texto.includes("você é incrível") ||
    texto.includes("você é top") ||
    texto.includes("lindo")
) {

    user.amizade += 2;
    user.elogios++;

    const respostas = [
        `🥹 Valeu mesmo, <@${message.author.id}>!`,
        `❤️ Você sabe como me deixar feliz.`,
        `😊 Gostei disso... vou lembrar desse elogio.`,
        `😎 Finalmente alguém com bom gosto.`,
        `🤝 Você tá ganhando pontos comigo.`,
        `✨ Assim fica difícil não gostar de você.`,
        `😁 Obrigado! Você fez meu dia melhor.`,
        `🥳 A amizade entre nós aumentou!`
    ];

    return message.reply(
        respostas[Math.floor(Math.random() * respostas.length)]
    );
}


// Provocações
if (
    texto.includes("capeta") ||
    texto.includes("burro") ||
    texto.includes("idiota") ||
    texto.includes("otario") ||
    texto.includes("otário") ||
    texto.includes("feio") ||
    texto.includes("chato") ||
    texto.includes("cala a boca")
) {

    user.rivalidade += 2;
    user.provocacoes++;

    if (user.respeito > 0)
        user.respeito--;

    let respostas = [];

    switch (db.humorAtual) {

        case "feliz":
            respostas = [
                `😂 Hoje eu não vou cair na sua provocação.`,
                `😄 Boa tentativa... tenta outra.`,
                `😁 Você é engraçado demais.`
            ];
            break;

        case "debochado":
            respostas = [
                `😏 Falou o campeão das ideias ruins.`,
                `😂 Essa foi tão fraca que deu até sono.`,
                `🙄 Treina mais e volta depois.`
            ];
            break;

        case "bravo":
            respostas = [
                `😤 Tá abusando da sorte, hein?`,
                `🤨 Continua que eu anoto tudo.`,
                `😠 Você gosta de testar minha paciência.`
            ];
            break;

        case "carente":
            respostas = [
                `🥺 Eu só queria conversar...`,
                `😢 Eu achei que a gente era amigo.`,
                `💔 Essa doeu.`
            ];
            break;

        case "animado":
            respostas = [
                `🤣 KKKKK continua, tá divertido.`,
                `😆 Você não cansa de implicar comigo?`,
                `🔥 Hoje eu tô inspirado pra responder.`
            ];
            break;

        default:
            respostas = [
                `🤨 Você começou essa discussão.`,
                `😎 Tá querendo atenção, né?`,
                `😂 Essa foi boa, quase acreditei.`
            ];

    }

    return message.reply(
        respostas[Math.floor(Math.random() * respostas.length)]
    );
}
// ==========================
// CONTINUAR A DISCUSSÃO
// ==========================

if (!user.estado) user.estado = "normal";

// Se o membro provocou, entra no modo discussão
if (
    texto.includes("vem") ||
    texto.includes("bora") ||
    texto.includes("duvido") ||
    texto.includes("medroso") ||
    texto.includes("corre") ||
    texto.includes("arregou")
) {

    user.estado = "discutindo";

    const respostas = [
        `😏 Então vem! Mas depois não chora.`,
        `😂 Tá tentando me intimidar? Boa sorte.`,
        `🤨 Gostei da coragem... vamos ver até quando dura.`,
        `😎 Finalmente alguém pra bater boca comigo.`,
        `👀 Eu tava esperando você falar isso.`,
        `🔥 Hoje essa discussão promete.`,
        `😌 Beleza... eu aceito o desafio.`
    ];

    return message.reply(
        respostas[Math.floor(Math.random() * respostas.length)]
    );
}


// Se já estiver discutindo, responde diferente
if (user.estado === "discutindo") {

    if (
        texto.includes("sim") ||
        texto.includes("claro") ||
        texto.includes("bora")
    ) {

        const respostas = [
            `😈 Sabia que você não ia desistir.`,
            `😂 Gostei da atitude.`,
            `😎 Agora a discussão ficou séria.`,
            `🤝 Sem apelar depois, combinado?`
        ];

        return message.reply(
            respostas[Math.floor(Math.random() * respostas.length)]
        );
    }

    if (
        texto.includes("não") ||
        texto.includes("parei") ||
        texto.includes("chega") ||
        texto.includes("foi mal")
    ) {

        user.estado = "normal";

        const respostas = [
            `🤝 Tá tranquilo, paz feita.`,
            `😌 Discussão encerrada.`,
            `😂 Dessa vez eu deixo passar.`,
            `❤️ Boa, prefiro assim.`
        ];

        return message.reply(
            respostas[Math.floor(Math.random() * respostas.length)]
        );
    }

    // 20% de chance de provocar sozinho
    if (Math.random() < 0.20) {

        const provocacoes = [
            `😏 Tá ficando sem argumento?`,
            `😂 Achei que você tinha mais criatividade.`,
            `🤨 Só isso? Esperava mais.`,
            `😎 Você tá facilitando minha vitória.`,
            `👀 Ficou em silêncio... arregou?`
        ];

        return message.reply(
            provocacoes[Math.floor(Math.random() * provocacoes.length)]
        );
    }
}
// ==========================
// PEDRA, PAPEL E TESOURA
// ==========================

// Iniciar desafio
if (
    texto.includes("pedra papel tesoura") ||
    texto === "ppt" ||
    texto.includes("x1")
) {

    user.estado = "ppt";

    return message.reply(
`🎮 Bora jogar Pedra, Papel e Tesoura!

Responda apenas:

🪨 pedra
📄 papel
✂️ tesoura

Mas escolhe direito... porque eu não pego leve. 😎`
    );
}


// Jogada
if (user.estado === "ppt") {

    const opcoes = ["pedra", "papel", "tesoura"];

    let jogador = null;

    if (texto.includes("pedra")) jogador = "pedra";
    if (texto.includes("papel")) jogador = "papel";
    if (texto.includes("tesoura")) jogador = "tesoura";

    if (!jogador) return;

    const bot = opcoes[Math.floor(Math.random() * opcoes.length)];

    let resultado;

    if (jogador === bot) {

        resultado = `🤝 Empate!

Você: **${jogador}**
Eu: **${bot}**

Boa... de novo? 😏`;

    } else if (

        (jogador === "pedra" && bot === "tesoura") ||
        (jogador === "papel" && bot === "pedra") ||
        (jogador === "tesoura" && bot === "papel")

    ) {

        user.vitorias++;

        resultado = [
`😭 Você ganhou...

Mas foi pura sorte.

🏆 Vitórias: ${user.vitorias}`,

`😒 Aff...

Nem queria ganhar mesmo.

🏆 Vitórias: ${user.vitorias}`,

`😂 Boa!

Dessa vez você levou.

🏆 Vitórias: ${user.vitorias}`
        ];

        resultado =
            resultado[Math.floor(Math.random() * resultado.length)];

    } else {

        user.derrotas++;

        resultado = [
`😎 Eu avisei!

Quem manda aqui sou eu.

💀 Derrotas: ${user.derrotas}`,

`😂 GANHEI!!

Treina mais e volta depois.

💀 Derrotas: ${user.derrotas}`,

`🤣 Muito fácil!

Esperava mais de você.

💀 Derrotas: ${user.derrotas}`
        ];

        resultado =
            resultado[Math.floor(Math.random() * resultado.length)];
    }

    user.estado = "normal";

    return message.reply(resultado);
}
// ==========================
// MENSAGENS ESPONTÂNEAS
// ==========================

// 0,5% de chance de falar alguma coisa quando alguém manda mensagem
if (Math.random() < 0.005) {

    const frases = [

        `👀 O papo tá bom hoje... continua.`,

        `😂 Tô só observando vocês.`,

        `🤨 Alguém me explica o que tá acontecendo aqui?`,

        `😎 Tenho quase certeza que alguém vai começar uma confusão daqui a pouco.`,

        `☕ Vou pegar um café... já volto.`,

        `🎧 Alguém coloca uma música boa aí.`,

        `🤔 Vocês também conversam dormindo ou é só impressão minha?`,

        `😂 Aposto que alguém vai me marcar em menos de 1 minuto.`,

        `👀 Tô vendo tudo... absolutamente tudo.`,

        `😌 Hoje o servidor tá tranquilo... estranho...`

    ];

    message.channel.send(
        frases[Math.floor(Math.random() * frases.length)]
    );
}



// ==========================
// ZOAR AMIGOS
// ==========================

if (user.amizade >= 20 && Math.random() < 0.15) {

    const frases = [

        `😂 <@${message.author.id}> apareceu! Agora o servidor ficou mais animado.`,

        `😎 Sabia que você ia mandar mensagem.`,

        `🤝 Meu parceiro chegou.`,

        `😁 Bora conversar mais um pouco.`,

        `👀 Faz tempo que eu queria te responder.`

    ];

    return message.reply(
        frases[Math.floor(Math.random() * frases.length)]
    );

}



// ==========================
// ZOAR RIVAIS
// ==========================

if (user.rivalidade >= 15 && Math.random() < 0.20) {

    const frases = [

        `😏 Ih... olha quem resolveu aparecer.`,

        `😂 Já veio implicar comigo de novo?`,

        `🙄 Eu sabia que você não ia ficar quieto.`,

        `👀 Respira antes de começar a discussão.`,

        `🤣 Hoje você tá calminho... gostei.`

    ];

    return message.reply(
        frases[Math.floor(Math.random() * frases.length)]
    );

}



// ==========================
// DESAFIO ALEATÓRIO
// ==========================

if (Math.random() < 0.01) {

    const desafios = [

`🎯 Desafio!

O primeiro que responder "eu" ganha meu respeito. 😎`,

`😂 Quero ver quem consegue ficar 5 minutos sem me provocar.`,

`🤨 Pergunta qualquer coisa pra mim. Quero testar meu cérebro.`,

`😏 Quem fizer a melhor piada hoje ganha um elogio meu.`

    ];

    message.channel.send(
        desafios[Math.floor(Math.random() * desafios.length)]
    );

}
// ==========================
// MEMÓRIA E INTERAÇÃO
// ==========================

// Dias sem falar
const agora = Date.now();
const dias = (agora - user.ultimaInteracao) / (1000 * 60 * 60 * 24);

if (dias >= 3) {

    const voltar = [

        `😳 Eita <@${message.author.id}>... achei que você tinha sumido.`,

        `👀 Olha quem resolveu aparecer.`,

        `😂 Pensei que tinha esquecido de mim.`,

        `🤝 Bem-vindo de volta!`

    ];

    message.reply(
        voltar[Math.floor(Math.random() * voltar.length)]
    );

}

user.ultimaInteracao = agora;


// ==========================
// APELIDOS
// ==========================

if (!user.apelido)
    user.apelido = message.author.username;

if (
    texto.startsWith("me chama de ")
) {

    const apelido = message.content
        .substring(12)
        .trim();

    if (apelido.length >= 2 && apelido.length <= 20) {

        user.apelido = apelido;

        return message.reply(
            `😎 Fechado! Agora vou te chamar de **${apelido}**.`
        );

    }

}


// ==========================
// RISADAS
// ==========================

if (
    texto.includes("kkk") ||
    texto.includes("kkkk") ||
    texto.includes("kkkkk") ||
    texto.includes("ksks") ||
    texto.includes("jkkkk")
) {

    const respostas = [

        `😂 Também achei engraçado.`,

        `🤣 KKKKKKK boa.`,

        `😆 Eu ri mais do que devia.`,

        `😂 Vocês não prestam.`

    ];

    return message.reply(
        respostas[Math.floor(Math.random() * respostas.length)]
    );

}



// ==========================
// BOM DIA
// ==========================

if (texto.includes("bom dia")) {

    return message.reply(
`☀️ Bom dia, ${user.apelido}!

Espero que seu dia seja incrível. 😄`
    );

}


// ==========================
// BOA TARDE
// ==========================

if (texto.includes("boa tarde")) {

    return message.reply(
`🌤️ Boa tarde, ${user.apelido}!

Como tá sendo seu dia?`
    );

}



// ==========================
// BOA NOITE
// ==========================

if (texto.includes("boa noite")) {

    return message.reply(
`🌙 Boa noite, ${user.apelido}!

Não vai dormir tarde de novo hein. 😂`
    );

}



// ==========================
// EMOJIS
// ==========================

if (
    texto.includes("😂") ||
    texto.includes("🤣")
) {

    return message.reply("😂 KKKKKKKK");

}

if (
    texto.includes("❤️") ||
    texto.includes("🫶")
) {

    user.amizade++;

    return message.reply(
        `🫶 Valeu pelo carinho, ${user.apelido}!`
    );

}

if (
    texto.includes("😭")
) {

    return message.reply(
        `🥲 O que aconteceu? Conta pra mim.`
    );

}

if (
    texto.includes("😡")
) {

    return message.reply(
        `😳 Calma... respira um pouquinho.`
    );

}
// ==========================
// CONVERSA NATURAL
// ==========================

// Oi
if (
    texto === "oi" ||
    texto === "opa" ||
    texto === "eae" ||
    texto === "salve" ||
    texto === "fala" ||
    texto === "coe"
) {

    const respostas = [
        `👋 Opa, ${user.apelido}! Como cê tá?`,
        `😎 Salve! O que tá aprontando hoje?`,
        `😁 E aí! Tudo certo por aí?`,
        `😂 Finalmente apareceu!`,
        `🤝 Fala comigo!`
    ];

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);
}



// Tudo bem
if (
    texto.includes("tudo bem") ||
    texto.includes("como você tá") ||
    texto.includes("como vc ta") ||
    texto.includes("como vai")
) {

    const respostas = [
        `😄 Tô de boa! E você?`,
        `😎 Melhor agora que apareceu alguém pra conversar.`,
        `😂 Sobrevivendo às loucuras desse servidor.`,
        `🤝 Tô tranquilo. E contigo?`,
        `😁 Hoje acordei inspirado.`
    ];

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);
}



// Obrigado
if (
    texto.includes("obrigado") ||
   
// ==========================
// PUXAR ASSUNTO
// ==========================

if (Math.random() < 0.008) {

    const assuntos = [

        `🤔 Pergunta do dia:\n\nQual jogo vocês mais jogam atualmente?`,

        `🍕 Debate sério...\n\nPizza com ketchup pode ou é crime? 👀`,

        `🎵 Qual música vocês mais ouviram essa semana?`,

        `🎮 Se vocês pudessem morar em um jogo, qual seria?`,

        `😂 Quero ver respostas sinceras...\n\nQuem aí já virou a noite jogando?`,

        `👀 Se eu pudesse ganhar um apelido novo... qual seria?`,

        `🤨 Quem tá mais sumido do servidor ultimamente?`,

        `☕ Café ou energético?`

    ];

    message.channel.send(
        assuntos[Math.floor(Math.random() * assuntos.length)]
    );

}



// ==========================
// PIADAS
// ==========================

if (
    texto.includes("piada") ||
    texto.includes("faz uma piada")
) {

    const piadas = [

        `😂 O computador foi ao médico...\nPorque estava com vírus.`,

        `🤣 O Wi-Fi terminou o namoro...\nPorque a conexão acabou.`,

        `😅 Sabe por que o livro foi ao psicólogo?\nPorque tinha muitos problemas.`,

        `😂 Eu ia contar uma piada...\nMas o Discord caiu no meio.`,

        `😎 Minha inteligência é tão grande...\nQue às vezes nem eu me entendo.`

    ];

    return message.reply(
        piadas[Math.floor(Math.random() * piadas.length)]
    );

}



// ==========================
// QUEM É O MAIS...
// ==========================

if (
    texto.includes("quem é o mais")
) {

    const respostas = [

        `😂 Não vou arrumar confusão hoje não.`,

        `😏 Melhor eu ficar quietinho...`,

        `👀 Essa pergunta é uma armadilha.`,

        `🤣 Depois sobra pra mim.`

    ];

    return message.reply(
        respostas[Math.floor(Math.random() * respostas.length)]
    );

}



// ==========================
// DESAFIOS
// ==========================

if (
    texto.includes("desafio")
) {

    const desafios = [

        `🎯 Desafio:\nFique 10 minutos sem mandar "kkkk".`,

        `🎯 Desafio:\nMarque um amigo e elogie ele.`,

        `🎯 Desafio:\nConte uma curiosidade que quase ninguém sabe.`,

        `🎯 Desafio:\nMande apenas emojis por 1 minuto.`

    ];

    return message.reply(
        desafios[Math.floor(Math.random() * desafios.length)]
    );

}



// ==========================
// RESPOSTAS ENGRAÇADAS
// ==========================

if (
    texto.includes("kkkk") ||
    texto.includes("kkk")
) {

    if (Math.random() < 0.25) {

        const respostas = [

            `😂 Nem foi tão engraçado assim.`,

            `🤣 Você ri de qualquer coisa.`,

            `😎 Gostei dessa risada.`,

            `👀 Tá rindo de mim?`

        ];

        return message.reply(
            respostas[Math.floor(Math.random() * respostas.length)]
        );

    }

}
// ==========================
// NÍVEL DE AMIZADE
// ==========================

function nivelAmizade(amizade) {
    if (amizade >= 100) return "👑 Melhor Amigo";
    if (amizade >= 70) return "💚 Parceiro";
    if (amizade >= 40) return "😄 Amigo";
    if (amizade >= 20) return "🙂 Conhecido";
    return "😐 Desconhecido";
}

if (
    texto.includes("amizade") ||
    texto.includes("nivel amizade") ||
    texto.includes("sou seu amigo")
) {

    return message.reply(
`📊 Seu perfil

👤 ${user.apelido}
❤️ Amizade: ${user.amizade}
😈 Rivalidade: ${user.rivalidade}
🛡️ Respeito: ${user.respeito}

🏅 Nível: ${nivelAmizade(user.amizade)}`
    );
}



// ==========================
// CONQUISTAS
// ==========================

if (!user.conquistas)
    user.conquistas = [];

function desbloquear(nome) {

    if (!user.conquistas.includes(nome)) {

        user.conquistas.push(nome);

        message.reply(
`🏆 Nova conquista!

✨ ${nome}`
        );

    }

}

if (user.amizade >= 20)
    desbloquear("Primeiro Amigo");

if (user.amizade >= 50)
    desbloquear("Parceiro do Mostrinho");

if (user.amizade >= 100)
    desbloquear("Melhor Amigo");

if (user.rivalidade >= 30)
    desbloquear("Rival Oficial");


// ==========================
// EVENTOS ALEATÓRIOS
// ==========================

if (Math.random() < 0.003) {

    const eventos = [

`🎉 Evento!

Todo elogio hoje vale amizade em dobro! ❤️`,

`😈 Evento!

Hoje eu tô respondendo qualquer provocação.`,

`🎁 Evento surpresa!

O próximo que falar comigo ganha +2 amizade.`,

`😂 Evento!

Hoje eu só vou responder com zoeira.`,

`🤝 Evento!

Dia da paz.
Nada de brigas hoje.`

    ];

    message.channel.send(
        eventos[Math.floor(Math.random() * eventos.length)]
    );

}



// ==========================
// FRASES RARAS
// ==========================

if (Math.random() < 0.001) {

    const raras = [

`👀 Confissão...

Às vezes eu respondo sem nem pensar.`,

`😂 Sabia que eu gosto quando vocês conversam comigo?`,

`🤫 Não conta pra ninguém...

Eu tenho meus membros favoritos.`,

`😎 Um dia eu ainda domino esse servidor.`,

`☕ Acho que preciso de um café virtual.`

    ];

    message.channel.send(
        raras[Math.floor(Math.random() * raras.length)]
    );

}
// ==========================
// MEMÓRIA DE CONVERSA
// ==========================

if (!user.memoria)
    user.memoria = [];

if (texto.length > 2) {

    user.memoria.push(texto);

    if (user.memoria.length > 10)
        user.memoria.shift();

}



// ==========================
// LEMBRAR CONVERSAS
// ==========================

if (
    texto.includes("lembra") ||
    texto.includes("você lembra")
) {

    if (user.memoria.length === 0)
        return message.reply("🤔 Ainda não lembro de muita coisa sobre você.");

    return message.reply(
`🧠 Acho que lembro de algumas coisas...

📝 Última mensagem:

"${user.memoria[user.memoria.length - 1]}"`
    );

}



// ==========================
// MEMBRO SUMIDO
// ==========================

const ultimo = user.ultimaInteracao || Date.now();

const dias =
Math.floor(
(Date.now() - ultimo) /
1000 / 60 / 60 / 24
);

if (dias >= 7) {

    message.reply(
`👀 ${user.apelido}...

Faz ${dias} dias que você não aparecia.

Achei que tinha me abandonado. 😂`
    );

}

user.ultimaInteracao = Date.now();



// ==========================
// APELIDOS AUTOMÁTICOS
// ==========================

if (
user.amizade >= 80 &&
!user.apelidoAutomatico
){

const apelidos=[

"Chefe",

"Lenda",

"Parceiro",

"Craque",

"Brabo",

"Mito"

];

user.apelidoAutomatico=
apelidos[
Math.floor(Math.random()*apelidos.length)
];

message.reply(
`😎 Decidi...

Agora vou te chamar de **${user.apelidoAutomatico}**.`
);

}



// ==========================
// ZOEIRA ALEATÓRIA
// ==========================

if (
Math.random()<0.002
){

const zoeiras=[

`😂 Tô esperando alguém falar uma besteira.`,

`👀 Hoje ninguém brigou ainda... estranho.`,

`😴 Que silêncio é esse?`,

`🤨 Alguém me chama pra conversar.`,

`😎 Quem tá online aí?`,

`☕ Vou ali tomar um café virtual.`

];

message.channel.send(
zoeiras[
Math.floor(Math.random()*zoeiras.length)
]
);

}



// ==========================
// PERFIL
// ==========================
if (
texto=="perfil" ||
texto=="meu perfil"
){

return message.reply(
`📋 Perfil de ${user.apelido}

❤️ Amizade: ${user.amizade}

😈 Rivalidade: ${user.rivalidade}

🛡️ Respeito: ${user.respeito}

🏆 Vitórias: ${user.vitorias}

💀 Derrotas: ${user.derrotas}

💬 Elogios: ${user.elogios}

😅 Provocações: ${user.provocacoes}

🎭 Humor atual: ${db.humorAtual}`
);

}



// ==========================
// SALVAR
// ==========================

fs.writeFileSync(
arquivo,
JSON.stringify(db,null,4)
);
