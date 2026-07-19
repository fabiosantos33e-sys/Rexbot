const fs = require("fs");
const path = require("path");

module.exports = (client) => {

const pasta = path.join(__dirname, "database");
const arquivo = path.join(pasta, "pet.json");

if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(
        arquivo,
        JSON.stringify({
            nome: "Mostrinho",
            fome: 100,
            felicidade: 100,
            energia: 100,
            humor: "Animado 😄",
            frases: [],
            usuarios: {}
        }, null, 2)
    );
}

function carregar() {
    return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}

function salvar(db) {
    fs.writeFileSync(arquivo, JSON.stringify(db, null, 2));
}

// Atualiza os status a cada minuto
setInterval(() => {

    const db = carregar();

    db.fome = Math.max(0, db.fome - 1);
    db.energia = Math.max(0, db.energia - 1);

    if (db.fome <= 20) {
        db.humor = "Com fome 🍔";
    } else if (db.energia <= 20) {
        db.humor = "Com sono 😴";
    } else if (db.felicidade <= 30) {
        db.humor = "Entediado 😐";
    } else {
        db.humor = "Animado 😄";
    }

    salvar(db);

}, 60000);

// Mensagens automáticas (bem raras)
setInterval(() => {

    const guild = client.guilds.cache.first();
    if (!guild) return;

    const canal = guild.channels.cache.find(c => c.isTextBased());
    if (!canal) return;

    const mensagens = [
        "👀 Como vocês estão hoje?",
        "☕ Alguém afim de conversar comigo?",
        "✨ Espero que o dia de vocês esteja sendo incrível!",
        "🎉 Sempre bom ver o servidor movimentado.",
        "💙 Se precisarem de mim é só chamar: **Mostrinho**."
    ];

    if (Math.random() < 0.35) {
        canal.send(mensagens[Math.floor(Math.random() * mensagens.length)]);
    }

}, 1800000);

// Evento principal
client.on("messageCreate", async (message) => {

    if (message.author.bot) return;

    const texto = message.content.toLowerCase().trim();
    const db = carregar();

    if (!db.usuarios[message.author.id]) {
        db.usuarios[message.author.id] = {
            nome: message.author.username,
            xp: 0
        };
    }

    db.usuarios[message.author.id].xp++;

    // Só responde se falarem com ele
    const citado =
        texto.startsWith("mostrinho") ||
        message.mentions.has(client.user) ||
        (message.reference && message.reference.messageId);

    if (!citado) {
        salvar(db);
        return;
    }

    // Aprender frases
    if (texto.startsWith("mostrinho aprender ")) {

        const frase = message.content.slice(20).trim();

        if (!frase)
            return message.reply("❌ Escreva uma frase para eu aprender.");

        if (db.frases.includes(frase))
            return message.reply("😊 Eu já conheço essa frase.");

        db.frases.push(frase);

        salvar(db);

        return message.reply("🧠 Nova frase aprendida com sucesso!");
    }

    // Status
    if (texto === "mostrinho status") {

        return message.reply(
`🤖 **Mostrinho**

😄 Humor: ${db.humor}
🍔 Fome: ${db.fome}%
⚡ Energia: ${db.energia}%
🎉 Felicidade: ${db.felicidade}%
🧠 Frases aprendidas: ${db.frases.length}
⭐ XP: ${db.usuarios[message.author.id].xp}`
        );
    }

    // Saudações
    if (
        texto.includes("oi") ||
        texto.includes("olá") ||
        texto.includes("ola") ||
        texto.includes("eae") ||
        texto.includes("bom dia") ||
        texto.includes("boa tarde") ||
        texto.includes("boa noite")
    ) {

        const respostas = [
            `👋 Oi, ${message.author.username}! Como você está?`,
            `😊 Olá! É sempre bom conversar com você.`,
            `✨ Opa! Me chamou? Estou por aqui.`,
            `😄 E aí! Como posso deixar seu dia melhor?`,
            `💙 Oi! Espero que esteja tudo certo por aí.`
        ];

        return message.reply(
            respostas[Math.floor(Math.random() * respostas.length)]
        );
    }
    // Tudo bem
    if (
        texto.includes("tudo bem") ||
        texto.includes("como você está") ||
        texto.includes("como vc ta")
    ) {

        const respostas = [
            `😄 Estou muito bem! Meu humor está **${db.humor}**.`,
            `😊 Estou ótimo! Obrigado por perguntar.`,
            `⚡ Estou cheio de energia para conversar!`,
            `💙 Estou bem sim! E você, como está?`
        ];

        return message.reply(
            respostas[Math.floor(Math.random() * respostas.length)]
        );
    }

    // Quem é você
    if (
        texto.includes("quem é você") ||
        texto.includes("quem é vc")
    ) {

        return message.reply(
            "🤖 Eu sou o **Mostrinho**, um bot criado para conversar, interagir e deixar o servidor mais divertido."
        );
    }

    // Obrigado
    if (
        texto.includes("obrigado") ||
        texto.includes("valeu")
    ) {

        const respostas = [
            "💙 Sempre que precisar, é só me chamar!",
            "😄 Foi um prazer ajudar.",
            "✨ Disponha!",
            "😊 Tamo junto!"
        ];

        return message.reply(
            respostas[Math.floor(Math.random() * respostas.length)]
        );
    }

    // Brincar
    if (texto === "mostrinho brincar") {

        db.felicidade = Math.min(100, db.felicidade + 15);
        db.energia = Math.max(0, db.energia - 8);

        salvar(db);

        const respostas = [
            "🎮 Isso foi divertido demais!",
            "😂 Gostei da brincadeira!",
            "🥳 Vamos brincar mais vezes!",
            "😄 Agora estou muito mais animado!"
        ];

        return message.reply(
            respostas[Math.floor(Math.random() * respostas.length)]
        );
    }

    // Alimentar
    if (texto === "mostrinho alimentar") {

        db.fome = 100;

        salvar(db);

        const comidas = [
            "🍕 Pizza",
            "🍔 Hambúrguer",
            "🍗 Frango",
            "🍜 Lámen",
            "🌮 Taco",
            "🍰 Bolo"
        ];

        return message.reply(
            `😋 Humm... adorei o ${comidas[Math.floor(Math.random()*comidas.length)]}! Muito obrigado!`
        );
    }

    // Dormir
    if (texto === "mostrinho dormir") {

        db.energia = 100;

        salvar(db);

        return message.reply(
            "😴 Tirei um cochilo e agora estou com a energia renovada!"
        );
    }

    // Carinho
    if (texto === "mostrinho carinho") {

        db.felicidade = Math.min(100, db.felicidade + 8);

        salvar(db);

        return message.reply(
            "🥰 Amei o carinho! Você é muito gentil."
        );
    }

    // Abraço
    if (texto === "mostrinho abraço") {

        db.felicidade = Math.min(100, db.felicidade + 10);

        salvar(db);

        return message.reply(
            `🤗 *Abraça ${message.author.username} bem forte!*`
        );
    }

    // Contar frase aprendida
    if (texto === "mostrinho falar") {

        if (db.frases.length === 0)
            return message.reply("😅 Ainda não aprendi nenhuma frase.");

        return message.reply(
            db.frases[Math.floor(Math.random() * db.frases.length)]
        );
    }

    // Palavrões apenas quando falar com o bot
    const proibidas = [
        "porra",
        "caralho",
        "fdp",
        "merda",
        "desgraça",
        "puta"
    ];

    if (proibidas.some(p => texto.includes(p))) {

        return message.reply(
            "😅 Calma aí kkk... Vamos manter a conversa tranquila."
        );
    }

    // Resposta padrão
    const respostas = [
        "🤔 Ainda não sei responder isso, mas posso aprender com **Mostrinho aprender**.",
        "😊 Interessante... Conte mais!",
        "💙 Gostei da sua mensagem.",
        "😄 Ainda estou aprendendo coisas novas.",
        "✨ Não entendi muito bem, pode explicar de outro jeito?"
    ];

    salvar(db);

    return message.reply(
        respostas[Math.floor(Math.random() * respostas.length)]
    );

});

};
