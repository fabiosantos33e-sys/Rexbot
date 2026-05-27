const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

const FILE = "./rpgdb.json";
const PREFIX = ",";

function load() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ jogadores: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE));
}

function save(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

function getPlayer(db, user) {
  return db.jogadores[user.id];
}

function barra(atual, max) {
  const total = 12;
  const cheios = Math.max(0, Math.round((atual / max) * total));
  return "█".repeat(cheios) + "░".repeat(total - cheios);
}

function rand(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

module.exports = (client) => {
  client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const db = load();
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();

    const p = getPlayer(db, message.author);
    if (!p) return;

    // ULTIMATE CINEMATOGRÁFICA
    if (cmd === "ultimate") {
      const poder = p.poder || { nome: "Mana Desconhecido", emoji: "🌌" };

      const ultimates = [
        `☄️ O céu escureceu...\n\n${poder.emoji} **${poder.nome}** começou a explodir em volta de ${message.author}.\n\n⚔️ **ULTIMATE:** Ruptura Absoluta\n\n💥 O inimigo foi lançado contra a dungeon com uma onda de mana absurda.`,
        `🌑 As sombras começaram a tremer...\n\n${message.author} ergueu a arma lentamente.\n\n👁️ "Acabou."\n\n💥 **DANO CINEMATOGRÁFICO:** ${p.nivel * 999}`,
        `🔥 O chão rachou.\n\nUma aura monstruosa cobriu o campo de batalha.\n\n⚔️ ${message.author} usou **Execução Final**.\n\n☠️ O inimigo caiu sem conseguir reagir.`
      ];

      const embed = new EmbedBuilder()
        .setColor("#8b0000")
        .setTitle("🎬 ABSOLUTE CINEMA")
        .setDescription(rand(ultimates))
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

      return message.reply({ embeds: [embed] });
    }

    // AURA DO PERSONAGEM
    if (cmd === "aura") {
      const poder = p.poder || { nome: "Desconhecido", emoji: "🌌" };

      const embed = new EmbedBuilder()
        .setColor("#00ff88")
        .setTitle("🌌 Aura Despertada")
        .setDescription(
          `👤 ${message.author}\n\n` +
          `${poder.emoji} Poder: **${poder.nome}**\n` +
          `⭐ Nível: **${p.nivel}**\n\n` +
          `O ar ficou pesado...\n` +
          `A presença do caçador fez a dungeon inteira tremer.`
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

      return message.reply({ embeds: [embed] });
    }

    // TRANSFORMAÇÃO
    if (cmd === "transformar") {
      if (p.nivel < 100) {
        return message.reply("❌ Você precisa estar no nível 100 para transformar.");
      }

      const formas = [
        "🌑 Monarca Absoluto",
        "🔥 Berserk Demoníaco",
        "⚡ Forma Divina",
        "☄️ Despertar Celestial",
        "🩸 Modo Carnificina"
      ];

      const forma = rand(formas);

      const embed = new EmbedBuilder()
        .setColor("#9900ff")
        .setTitle("☄️ TRANSFORMAÇÃO")
        .setDescription(
          `O mana começou a explodir...\n\n` +
          `O corpo de ${message.author} foi coberto por uma aura colossal.\n\n` +
          `👁️ Forma ativada:\n**${forma}**\n\n` +
          `⚔️ Ataque temporário aumentado.\n` +
          `🛡️ Defesa temporária aumentada.`
        );

      p.ataqueBase += 150;
      p.defesaBase += 100;

      save(db);

      return message.reply({ embeds: [embed] });
    }

    // ARISE CINEMATOGRÁFICO
    if (cmd === "arisecinema") {
      if (!p.poder || p.poder.nome !== "Sombras") {
        return message.reply("❌ Apenas quem tem o poder **Sombras** pode usar isso.");
      }

      const embed = new EmbedBuilder()
        .setColor("#111111")
        .setTitle("🌑 ARISE")
        .setDescription(
          `As sombras começaram a se mover...\n\n` +
          `O corpo do inimigo derrotado tremeu.\n\n` +
          `👁️ ${message.author} sussurrou:\n\n` +
          `**"ARISE."**\n\n` +
          `☠️ A alma foi puxada para fora do corpo.\n` +
          `🪖 Um novo soldado sombrio se ajoelhou diante do Monarca.`
        );

      return message.reply({ embeds: [embed] });
    }

    // BOSS FALANDO
    if (cmd === "bossfala") {
      const falas = [
        "👹 \"Você ousa entrar no meu domínio?\"",
        "🐉 \"Eu devorei milhares de caçadores antes de você.\"",
        "☠️ \"Sua alma será minha recompensa.\"",
        "🔥 \"A dungeon será seu túmulo.\"",
        "🌑 \"Mesmo suas sombras temem meu nome.\""
      ];

      return message.reply(rand(falas));
    }

    // CENA DE DUNGEON
    if (cmd === "cutscene") {
      const cenas = [
        `🕳️ Você entrou na dungeon...\n\nAs tochas se apagaram sozinhas.\nUma respiração pesada ecoou no fundo do corredor.\n\n⚠️ Algo está observando você.`,
        `🌌 Um portal vermelho abriu no céu.\n\nO chão começou a quebrar.\nA presença de um boss invadiu o servidor.\n\n👹 "Finalmente... carne fresca."`,
        `🌑 As paredes da dungeon começaram a sangrar mana.\n\n${message.author} sentiu o corpo travar.\n\n⚔️ Uma batalha impossível está prestes a começar.`
      ];

      const embed = new EmbedBuilder()
        .setColor("#2b0055")
        .setTitle("🎥 Cutscene da Dungeon")
        .setDescription(rand(cenas));

      return message.reply({ embeds: [embed] });
    }

    // EXECUÇÃO FINAL
    if (cmd === "execucao") {
      const poder = p.poder || { nome: "Mana", emoji: "🌌" };

      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("☠️ EXECUÇÃO FINAL")
        .setDescription(
          `${poder.emoji} ${message.author} desapareceu em alta velocidade.\n\n` +
          `⚔️ A lâmina brilhou por um segundo.\n\n` +
          `Silêncio.\n\n` +
          `💥 O inimigo caiu dividido pela energia do ataque.\n\n` +
          `🎬 **ABSOLUTE CINEMA.**`
        );

      return message.reply({ embeds: [embed] });
    }

    // AJUDA CINEMA
    if (cmd === "cinemahelp") {
      return message.reply(
        `🎬 **Comandos Cinematográficos**\n\n` +
        `,ultimate — ataque ultimate cinematográfico\n` +
        `,aura — mostra aura do personagem\n` +
        `,transformar — transformação nível 100+\n` +
        `,arisecinema — cena Arise para Sombras\n` +
        `,bossfala — boss fala algo\n` +
        `,cutscene — cena de dungeon\n` +
        `,execucao — execução final`
      );
    }
  });
};
