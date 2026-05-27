const fs = require("fs");

const FILE = "./rpgdb.json";
const PREFIX = ",";

function load() {
  return JSON.parse(fs.readFileSync(FILE));
}

function save(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

function getPlayer(db, user) {
  return db.jogadores[user.id];
}

module.exports = (client) => {

  client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const db = load();

    if (!db.jogadores[message.author.id]) return;

    const p = getPlayer(db, message.author);

    const args = message.content
      .slice(PREFIX.length)
      .trim()
      .split(/ +/);

    const cmd = args.shift()?.toLowerCase();

    // =========================
    // PETS
    // =========================

    if (cmd === "pet") {

      if (!p.pet) {
        return message.reply(
          "🐾 Você ainda não possui um pet.\nUse **,gachapet**"
        );
      }

      return message.reply(
        `🐾 **Seu Pet**\n\n` +
        `Nome: **${p.pet.nome}**\n` +
        `Raridade: ${p.pet.raridade}\n` +
        `⚔️ Ataque: +${p.pet.atk}\n` +
        `🛡️ Defesa: +${p.pet.def}`
      );
    }

    if (cmd === "gachapet") {

      const pets = [
        {
          nome: "Lobo Sombrio",
          raridade: "Raro",
          atk: 80,
          def: 40
        },
        {
          nome: "Mini Dragão",
          raridade: "Épico",
          atk: 150,
          def: 70
        },
        {
          nome: "Fênix Celestial",
          raridade: "Lendário",
          atk: 300,
          def: 150
        },
        {
          nome: "Serpente do Vazio",
          raridade: "Mítico",
          atk: 500,
          def: 220
        }
      ];

      const pet = pets[Math.floor(Math.random() * pets.length)];

      p.pet = pet;

      save(db);

      return message.reply(
        `🎰 Você invocou um pet!\n\n` +
        `🐾 **${pet.nome}**\n` +
        `✨ Raridade: ${pet.raridade}`
      );
    }

    // =========================
    // TITULOS
    // =========================

    if (cmd === "titulo") {

      if (!p.titulo) {
        return message.reply(
          "🏷️ Você ainda não possui um título."
        );
      }

      return message.reply(
        `🏷️ Seu título atual:\n\n**${p.titulo}**`
      );
    }

    // =========================
    // DESPERTAR
    // =========================

    if (cmd === "despertar") {

      if (p.nivel < 100) {
        return message.reply(
          "❌ Você precisa estar no nível 100."
        );
      }

      if (p.despertado) {
        return message.reply(
          "✨ Você já despertou seu poder."
        );
      }

      const modos = [
        {
          nome: "Modo Monarca",
          atk: 400,
          def: 250
        },
        {
          nome: "Modo Celestial",
          atk: 280,
          def: 400
        },
        {
          nome: "Modo Berserk",
          atk: 600,
          def: 100
        }
      ];

      const modo = modos[Math.floor(Math.random() * modos.length)];

      p.despertado = modo.nome;
      p.ataqueBase += modo.atk;
      p.defesaBase += modo.def;

      save(db);

      return message.reply(
        `☄️ DESPERTAR REALIZADO!\n\n` +
        `✨ Forma: **${modo.nome}**\n` +
        `⚔️ +${modo.atk} ataque\n` +
        `🛡️ +${modo.def} defesa`
      );
    }

    // =========================
    // GUILD
    // =========================

    if (cmd === "guild") {

      const sub = args[0];

      if (sub === "criar") {

        const nome = args.slice(1).join(" ");

        if (!nome) {
          return message.reply(
            "Use: **,guild criar Nome**"
          );
        }

        if (!db.guilds) db.guilds = {};

        db.guilds[nome] = {
          dono: message.author.id,
          membros: [message.author.id],
          nivel: 1
        };

        p.guild = nome;

        save(db);

        return message.reply(
          `🏯 Guild criada: **${nome}**`
        );
      }

      if (sub === "info") {

        if (!p.guild) {
          return message.reply(
            "❌ Você não possui guild."
          );
        }

        const g = db.guilds[p.guild];

        return message.reply(
          `🏯 Guild: **${p.guild}**\n` +
          `👑 Dono: <@${g.dono}>\n` +
          `👥 Membros: ${g.membros.length}\n` +
          `⭐ Nível: ${g.nivel}`
        );
      }
    }

    // =========================
    // PVP
    // =========================

    if (cmd === "pvp") {

      const alvo = message.mentions.users.first();

      if (!alvo) {
        return message.reply(
          "Use: **,pvp @user**"
        );
      }

      if (!db.jogadores[alvo.id]) {
        return message.reply(
          "❌ Esse jogador não possui personagem."
        );
      }

      const enemy = db.jogadores[alvo.id];

      const atk1 = p.ataqueBase + Math.floor(Math.random() * 300);
      const atk2 = enemy.ataqueBase + Math.floor(Math.random() * 300);

      let vencedor;

      if (atk1 > atk2) vencedor = p.nome;
      else vencedor = enemy.nome;

      return message.reply(
        `⚔️ PvP iniciado!\n\n` +
        `👤 ${p.nome}: ${atk1} poder\n` +
        `👤 ${enemy.nome}: ${atk2} poder\n\n` +
        `🏆 Vencedor: **${vencedor}**`
      );
    }

    // =========================
    // MISSÕES
    // =========================

    if (cmd === "missao") {

      const missoes = [
        "Mate 10 monstros",
        "Vença 1 boss",
        "Treine 3 vezes",
        "Ganhe 2000 moedas"
      ];

      const missao = missoes[
        Math.floor(Math.random() * missoes.length)
      ];

      return message.reply(
        `📜 Missão diária:\n\n${missao}\n\n🎁 Recompensa: 500 XP`
      );
    }

    // =========================
    // GACHA
    // =========================

    if (cmd === "gacha") {

      const itens = [
        "Espada SSR",
        "Relíquia UR",
        "Cristal Lendário",
        "Armadura Mítica"
      ];

      const item = itens[
        Math.floor(Math.random() * itens.length)
      ];

      return message.reply(
        `🎰 Você girou o gacha!\n\n🎁 Recompensa: **${item}**`
      );
    }

    // =========================
    // RAID
    // =========================

    if (cmd === "raid") {

      return message.reply(
        `👹 RAID INICIADA!\n\n` +
        `🐉 Boss: Dragão do Apocalipse\n` +
        `❤️ Vida: 500000\n` +
        `⚔️ Ataque: 15000\n\n` +
        `Chame outros jogadores para lutar!`
      );
    }

    // =========================
    // TITULOS AUTOMÁTICOS
    // =========================

    if (p.nivel >= 200 && !p.titulo) {
      p.titulo = "🌑 Monarca Ascendente";
      save(db);
    }

  });

};
