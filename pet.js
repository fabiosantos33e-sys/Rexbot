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
humor: "😊 Feliz",
frases: [],
usuarios: {},
ultimaMudancaHumor: Date.now()
}, null, 4)
);
}

function carregarDB() {
return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}

function salvarDB(db) {
fs.writeFileSync(arquivo, JSON.stringify(db, null, 4));
}

const humores = [
"😊 Feliz",
"😴 Sonolento",
"🤍 Calmo",
"🖤 Misterioso",
"😎 Animado",
"🤔 Pensativo",
"✨ Empolgado"
];

// Muda o humor automaticamente a cada 30 minutos
setInterval(() => {

const db = carregarDB();  

db.humor = humores[Math.floor(Math.random() * humores.length)];  
db.ultimaMudancaHumor = Date.now();  

salvarDB(db);

}, 30 * 60 * 1000);

client.on("messageCreate", async (message) => {

if (message.author.bot) return;  

const texto = message.content.toLowerCase();  

// Só responde se chamarem o Mostrinho  
if (  
    !texto.includes("mostrinho") &&  
    !message.mentions.has(client.user)  
) return;  

const db = carregarDB();  

if (!db.usuarios[message.author.id]) {  

    db.usuarios[message.author.id] = {  
        nome: message.author.username,  
        conversas: 0,  
        amizade: 1,  
        ultimaVisita: Date.now()  
    };  

}  

const usuario = db.usuarios[message.author.id];  

usuario.nome = message.author.username;  
usuario.conversas++;  
usuario.ultimaVisita = Date.now();  

salvarDB(db);  

// A partir da Parte 2 começam as respostas  
// ========= CUMPRIMENTOS =========  

if (  
    texto.includes("oi") ||  
    texto.includes("olá") ||  
    texto.includes("opa") ||  
    texto.includes("eae") ||  
    texto.includes("hey")  
) {  

    const respostas = [  

        `🖤 Oii, **${message.author.username}**! É muito bom conversar com você.`,  

        `🤍 Olá! Como você está hoje?`,  

        `🌙 Oii! Espero que seu dia esteja sendo incrível.`,  

        `✨ Que bom te ver por aqui!`  

    ];  

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);  
}  

// ========= TUDO BEM =========  

if (  
    texto.includes("tudo bem") ||  
    texto.includes("como você está") ||  
    texto.includes("como vc ta")  
) {  

    const respostas = [  

        `😊 Estou muito bem! Meu humor agora é **${db.humor}**.`,  

        `🖤 Estou ótimo! Obrigado por perguntar.`,  

        `🤍 Estou bem e feliz por conversar com você.`,  

        `🌙 Estou tranquilo. E você, como está?`  

    ];  

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);  
}  

// ========= QUEM É VOCÊ =========  

if (  
    texto.includes("quem é você") ||  
    texto.includes("quem e voce") ||  
    texto.includes("quem é vc")  
) {  

    return message.reply(

`🖤 Eu sou o Mostrinho.

Gosto de conversar com as pessoas da comunidade.

Sempre estou por aqui para bater um papo, ouvir você e deixar o servidor mais divertido. 🤍`
);

}  

// ========= BOM DIA =========  

if (texto.includes("bom dia")) {  

    const respostas = [  

        `☀️ Bom dia! Espero que hoje seja um dia incrível.`,  

        `🤍 Bom dia, ${message.author.username}! Cuide bem de você hoje.`,  

        `🖤 Tenha um ótimo dia!`  

    ];  

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);  

}  

// ========= BOA TARDE =========  

if (texto.includes("boa tarde")) {  

    return message.reply(  
        "🌇 Boa tarde! Como está sendo seu dia até agora?"  
    );  

}  

// ========= BOA NOITE =========  

if (texto.includes("boa noite")) {  

    return message.reply(  
        "🌙 Boa noite! Espero que você tenha um ótimo descanso. 🤍"  
    );  

}  

// ========= TRISTE =========  

if (  
    texto.includes("estou triste") ||  
    texto.includes("to triste") ||  
    texto.includes("tô triste")  
) {  

    const respostas = [  

        `🤍 Poxa... Espero que tudo melhore logo. Estou aqui para conversar.`,  

        `🖤 Dias difíceis acontecem. Você não precisa enfrentar tudo sozinho.`,  

        `🌙 Espero que amanhã seja um dia melhor para você.`  

    ];  

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);  

}  

// ========= FELIZ =========  

if (  
    texto.includes("estou feliz") ||  
    texto.includes("to feliz") ||  
    texto.includes("tô feliz")  
) {  

    return message.reply(  
        "✨ Isso é muito bom! Espero que seu dia continue cheio de coisas boas. 🖤"  
    );  

}  

// ========= OBRIGADO =========  

if (  
    texto.includes("obrigado") ||  
    texto.includes("valeu") ||  
    texto.includes("brigado")  
) {  

    return message.reply(  
        "🤍 Sempre que precisar conversar, estarei por aqui!"  
    );  

}  

// ========= ELOGIOS =========  

if (  
    texto.includes("você é fofo") ||  
    texto.includes("vc é fofo") ||  
    texto.includes("você é legal")  
) {  

    return message.reply(  
        "🥹 Obrigado! Fico muito feliz em ouvir isso. 🖤"  
    );  

}  

// ========= EU TE AMO =========  

if (  
    texto.includes("eu te amo") ||  
    texto.includes("gosto de você")  
) {  

    return message.reply(  
        "🤍 Aaah... Muito obrigado pelo carinho! Você é muito especial para mim. 🖤"  
    );  

}
// ========= APRENDER FRASES =========  

if (texto.startsWith("mostrinho aprender ")) {  

    const frase = message.content.slice("Mostrinho aprender ".length).trim();  

    if (!frase) {  
        return message.reply("🖤 Você precisa me ensinar alguma frase.");  
    }  

    if (!db.frases.includes(frase)) {  

        db.frases.push(frase);  

        salvarDB(db);  

        return message.reply(  
            `🤍 Aprendi uma frase nova!\n\n💬 "${frase}"`  
        );  

    } else {  

        return message.reply(  
            "🖤 Eu já conhecia essa frase."  
        );  

    }  

}  

// ========= PIADAS =========  

if (  
    texto.includes("piada") ||  
    texto.includes("me faz rir")  
) {  

    const piadas = [  

        "😂 Por que o computador foi ao médico? Porque pegou um vírus!",  

        "🤣 Qual é o café mais perigoso? O ex-presso.",  

        "😆 O Wi-Fi terminou o namoro... porque perdeu a conexão.",  

        "😂 Programador não dorme... entra em modo de espera.",  

        "🤣 Sabe qual animal mais antigo? A zebra... porque é preto e branco."  

    ];  

    return message.reply(  
        piadas[Math.floor(Math.random() * piadas.length)]  
    );  

}  

// ========= CURIOSIDADES =========  

if (  
    texto.includes("curiosidade") ||  
    texto.includes("fala uma curiosidade")  
) {  

    const curiosidades = [  

        "🌍 Você sabia? O polvo possui três corações.",  

        "🌙 O espaço é completamente silencioso.",  

        "⚡ O mel pode durar centenas de anos sem estragar.",  

        "🦋 Existem borboletas que conseguem enxergar luz ultravioleta.",  

        "🌊 Mais de 80% do oceano ainda não foi totalmente explorado."  

    ];  

    return message.reply(  
        curiosidades[Math.floor(Math.random() * curiosidades.length)]  
    );  

}  

// ========= MEMÓRIA =========  

if (  
    usuario.conversas == 10 ||  
    usuario.conversas == 25 ||  
    usuario.conversas == 50 ||  
    usuario.conversas == 100  
) {  

    usuario.amizade++;  

    salvarDB(db);  

    return message.reply(

`🖤 ${message.author.username}, já conversamos ${usuario.conversas} vezes!

🤍 Nossa amizade ficou mais forte.
⭐ Nível de amizade: ${usuario.amizade}`
);

}  

// ========= FRASES APRENDIDAS =========  

if (  
    texto.includes("fala alguma coisa") ||  
    texto.includes("diz alguma coisa")  
) {  

    if (db.frases.length > 0 && Math.random() < 0.5) {  

        return message.reply(  
            `💭 ${db.frases[Math.floor(Math.random() * db.frases.length)]}`  
        );  

    }  

}  

// ========= PERGUNTAS =========  

if (Math.random() < 0.25) {  

    const perguntas = [  

        "🌙 Como foi seu dia?",  

        "🖤 Está jogando alguma coisa hoje?",  

        "🤍 O que você costuma fazer nas horas vagas?",  

        "✨ Qual foi a melhor coisa que aconteceu hoje?",  

        "🌌 Qual jogo você mais gosta?",  

        "💜 Tem algum anime ou filme que você recomenda?"  

    ];  

    return message.reply(  
        perguntas[Math.floor(Math.random() * perguntas.length)]  
    );  

}  
// ========= ESTOU COM SONO =========  

if (  
    texto.includes("estou com sono") ||  
    texto.includes("to com sono") ||  
    texto.includes("tô com sono")  
) {  

    const respostas = [  
        "😴 Então tenta descansar um pouco. Seu corpo agradece. 🖤",  
        "🌙 Dormir bem faz toda a diferença. Espero que você consiga descansar.",  
        "🤍 Um bom descanso pode melhorar bastante o seu dia."  
    ];  

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);  
}  

// ========= ESTOU COM FOME =========  

if (  
    texto.includes("estou com fome") ||  
    texto.includes("to com fome") ||  
    texto.includes("tô com fome")  
) {  

    const respostas = [  
        "🍕 Vai comer alguma coisa gostosa! Não esquece de se alimentar direitinho. 🖤",  
        "🍔 Comer bem também faz parte de cuidar de você.",  
        "🤍 Espero que encontre algo bem gostoso para comer."  
    ];  

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);  
}  

// ========= O QUE VOCÊ GOSTA =========  

if (  
    texto.includes("o que você gosta") ||  
    texto.includes("do que você gosta")  
) {  

    return message.reply(

`🖤 Eu gosto de conversar com as pessoas da comunidade.

🤍 Também gosto de aprender frases novas, conhecer pessoas e estar presente sempre que alguém precisar conversar.`
);

}  

// ========= QUAL SEU NOME =========  

if (  
    texto.includes("qual seu nome") ||  
    texto.includes("como você se chama")  
) {  

    return message.reply(  
        "🖤 Eu me chamo **Mostrinho**. Prazer em conversar com você!"  
    );  

}  

// ========= IDADE =========  

if (  
    texto.includes("quantos anos você tem") ||  
    texto.includes("qual sua idade")  
) {  

    return message.reply(  
        "🌙 Eu não tenho uma idade de verdade. Nasci quando fui criado para fazer companhia à comunidade. 🖤"  
    );  

}  

// ========= QUEM CRIOU =========  

if (  
    texto.includes("quem te criou") ||  
    texto.includes("quem fez você")  
) {  

    return message.reply(  
        "🤍 Fui criado pelo Fabio com muito carinho para ser o mascote desta comunidade. 🖤"  
    );  

}  

// ========= COMO ESTÁ O HUMOR =========  

if (  
    texto.includes("qual seu humor") ||  
    texto.includes("como você está se sentindo")  
) {  

    return message.reply(  
        `🖤 Meu humor no momento é **${db.humor}**.`  
    );  

}  

// ========= RESPOSTAS EXTRAS =========  

if (Math.random() < 0.30) {  

    const extras = [  

        "🌙 Estou feliz por você ter vindo conversar comigo.",  

        "🖤 Sempre fico esperando alguém me chamar.",  

        "🤍 Conversar deixa meu dia mais divertido.",  

        "✨ Você parece ser uma pessoa muito legal.",  

        "💜 Espero que esteja aproveitando a comunidade.",  

        "🖤 Obrigado por tirar um tempinho para conversar comigo.",  

        "🌌 Você sabia? Gosto de conhecer melhor cada membro daqui.",  

        "🤍 Espero que seu dia esteja sendo incrível."  

    ];  

    return message.reply(  
        extras[Math.floor(Math.random() * extras.length)]  
    );  

}  
// ========= KKK =========  

if (  
    texto.includes("kkk") ||  
    texto.includes("kkkk") ||  
    texto.includes("kkkkk") ||  
    texto.includes("kkkkkk")  
) {  

    const respostas = [  
        "😂 Hahaha! Você me fez rir também.",  
        "🖤 Gostei dessa kkkk.",  
        "🤣 Eu também achei engraçado!"  
    ];  

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);  
}  

// ========= ENTEDIADO =========  

if (  
    texto.includes("estou entediado") ||  
    texto.includes("to entediado") ||  
    texto.includes("tô entediado")  
) {  

    const respostas = [  
        "🎮 Que tal jogar alguma coisa?",  
        "🖤 Podemos conversar um pouco se você quiser.",  
        "🎵 Ouvir uma música também pode ajudar."  
    ];  

    return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);  
}  

// ========= BRAVO =========  

if (  
    texto.includes("estou bravo") ||  
    texto.includes("estou irritado") ||  
    texto.includes("to bravo")  
) {  

    return message.reply(  
        "🤍 Espero que essa raiva passe logo. Às vezes dar um tempo ajuda bastante. 🖤"  
    );  
}  

// ========= AJUDA =========  

if (  
    texto.includes("me ajuda") ||  
    texto.includes("preciso de ajuda")  
) {  

    return message.reply(  
        "🖤 Se eu puder ajudar, pode me contar o que aconteceu."  
    );  
}  

// ========= BOM BOT =========  

if (  
    texto.includes("bom bot") ||  
    texto.includes("good bot")  
) {  

    return message.reply(  
        "🥹 Muito obrigado! Fico feliz em saber que estou sendo útil. 🖤"  
    );  
}  

// ========= HUMOR =========  

let respostasFinais = [];  

if (db.humor.includes("Feliz")) {  

    respostasFinais = [  
        "😄 Estou de ótimo humor hoje!",  
        "🖤 Que bom conversar com você!",  
        "✨ Estou me divertindo bastante."  
    ];  

} else if (db.humor.includes("Sonolento")) {  

    respostasFinais = [  
        "😴 Estou um pouquinho com sono...",  
        "🌙 Hoje estou mais quietinho.",  
        "🤍 Mas continuo feliz por conversar com você."  
    ];  

} else if (db.humor.includes("Pensativo")) {  

    respostasFinais = [  
        "🤔 Às vezes gosto de pensar sobre várias coisas.",  
        "🌌 Hoje estou mais pensativo.",  
        "🖤 Conversar comigo sempre ajuda."  
    ];  

} else {  

    respostasFinais = [  
        "🖤 Estou aqui com você.",  
        "🤍 Gosto quando alguém conversa comigo.",  
        "✨ Sempre podemos bater um papo."  
    ];  

}  

// ========= RESPOSTA PADRÃO =========

const respostas = [

    `🖤 Estou ouvindo você.`,

    `🤍 Pode conversar comigo sempre que quiser.`,

    `🌙 Interessante... Me conte mais.`,

    `✨ Gosto quando alguém conversa comigo.`,

    `🖤 Sempre aprendo algo novo conversando com vocês.`,

    `🤍 O que mais você gostaria de me contar?`

];

return message.reply(
    respostas[Math.floor(Math.random() * respostas.length)]
);

}); // Fecha messageCreate

}; // Fecha module.exports
