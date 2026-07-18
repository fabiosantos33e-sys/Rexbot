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

const salvar = (db) => {
    fs.writeFileSync(arquivo, JSON.stringify(db, null, 2));
};

const carregar = () => JSON.parse(fs.readFileSync(arquivo));

setInterval(() => {
    let db = carregar();

    db.fome = Math.max(0, db.fome - 2);
    db.energia = Math.max(0, db.energia - 1);

    if (db.fome < 30) db.humor = "Com fome";
    else if (db.energia < 30) db.humor = "Com sono";
    else db.humor = "Feliz";

    salvar(db);
}, 60000);

setInterval(async () => {
    let db = carregar();

    const frases = [
        "Alguém quer brincar comigo? 🦖",
        "Estou observando vocês 👀",
        "Não esqueçam de me alimentar 🍖",
        "Hoje estou muito feliz ❤️"
    ];

    const guild = client.guilds.cache.first();
    if (!guild) return;

    const canal = guild.channels.cache.find(c => c.isTextBased());

    if (canal) {
        canal.send(frases[Math.floor(Math.random() * frases.length)]);
    }

}, 900000);

client.on("messageCreate", async (message) => {

    if (message.author.bot) return;

    let db = carregar();

    if (!db.usuarios[message.author.id]) {
        db.usuarios[message.author.id] = {
            nome: message.author.username,
            xp: 0
        };
    }

    db.usuarios[message.author.id].xp++;

    if (message.content.toLowerCase().startsWith("aprender ")) {

        let frase = message.content.slice(9);

        if (!frase) return;

        db.frases.push(frase);
        salvar(db);

        return message.reply("🧠 Aprendi!");
    }

    if (message.content.toLowerCase() === "pet") {

        const respostas = [
            "Oi!",
            "Estou aqui ❤️",
            "Como posso ajudar?",
            db.frases[Math.floor(Math.random() * db.frases.length)] || "Ainda não aprendi nada."
        ];

        return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);
    }

    if (message.content.toLowerCase() === "alimentar") {

        db.fome = 100;
        salvar(db);

        return message.reply("🍖 Obrigado pela comida!");
    }

    if (message.content.toLowerCase() === "brincar") {

        db.felicidade = Math.min(100, db.felicidade + 10);
        db.energia = Math.max(0, db.energia - 10);

        salvar(db);

        return message.reply("🎉 Foi divertido!");
    }

    if (message.content.toLowerCase() === "dormir") {

        db.energia = 100;

        salvar(db);

        return message.reply("😴 Agora estou descansado!");
    }

    if (message.content.toLowerCase() === "status") {

        return message.reply(
`🦖 **Mostrinho**

❤️ Humor: ${db.humor}
🍖 Fome: ${db.fome}
⚡ Energia: ${db.energia}
😊 Felicidade: ${db.felicidade}

🧠 Frases aprendidas: ${db.frases.length}`
        );
    }

    salvar(db);

});

};
