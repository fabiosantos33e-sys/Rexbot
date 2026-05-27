const fs = require("fs");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

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
  if (!db.jogadores[user.id]) return null;
  return db.jogadores[user.id];
}

function barra(atual, max) {
  const total = 10;
  const cheios = Math.max(0, Math.round((atual / max) * total));
  return "█".repeat(cheios) + "░".repeat(total - cheios);
}

function atkTotal(p) {
  return (
    (p.ataqueBase || p.ataque || 80) +
    (p.poder?.atk || 0) +
    (p.equipado?.arma?.ataque || 0)
  );
}

function defTotal(p) {
  return (
    (p.defesaBase || p.defesa || 35) +
    (p.poder?.def || 0) +
    (p.equipado?.armadura?.defesa || 0)
  );
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

    // =========================
    // DUNGEON INFINITA
    // =========================

    if (cmd === "dungeon") {
      if (!p.dungeon) {
        p.dungeon = {
          andar: 1,
          recompensaXp: 0,
          recompensaMoedas: 0
        };
      }

      const andar = p.dungeon.andar;

      const inimigo = {
        nome: `Guardião do Andar ${andar}`,
        vida: 300 + andar * 180,
        ataque: 60 + andar * 35,
        defesa: 30 + andar * 15,
        xp: 100 + andar * 80,
        moedas: 150 + andar * 100
      };

      const danoPlayer = Math.max(
        20,
        atkTotal(p) + Math.floor(Math.random() * 100) - Math.floor(inimigo.defesa / 2)
      );

      const danoInimigo = Math.max(
        10,
        inimigo.ataque + Math.floor(Math.random() * 80) - Math.floor(defTotal(p) / 2)
      );

      const venceu = danoPlayer >= inimigo.vida || Math.random() < 0.65;

      const embed = new EmbedBuilder()
        .setColor(venceu ? "#00ff88" : "#8b0000")
        .setTitle(`🕳️ Dungeon Infinita — Andar ${andar}`)
        .setDescription(
          `👹 Inimigo: **${inimigo.nome}**\n` +
          `❤️ Vida: ${barra(inimigo.vida, inimigo.vida)} ${inimigo.vida}/${inimigo.vida}\n\n` +
          `⚔️ Você causou **${danoPlayer}** de dano.\n` +
          `💥 Você recebeu **${danoInimigo}** de dano.`
        );

      if (venceu) {
        p.dungeon.recompensaXp += inimigo.xp;
        p.dungeon.recompensaMoedas += inimigo.moedas;
        p.dungeon.andar++;

        embed.addFields({
          name: "🏆 Vitória",
          value:
            `Você avançou para o andar **${p.dungeon.andar}**.\n` +
            `Recompensa acumulada:\n` +
            `✨ XP: ${p.dungeon.recompensaXp}\n` +
            `💰 Moedas: ${p.dungeon.recompensaMoedas}`
        });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`dungeon_continuar_${message.author.id}`)
            .setLabel("Continuar")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⚔️"),

          new ButtonBuilder()
            .setCustomId(`dungeon_sair_${message.author.id}`)
            .setLabel("Sair e Coletar")
            .setStyle(ButtonStyle.Success)
            .setEmoji("🏃")
        );

        save(db);
        return message.reply({ embeds: [embed], components: [row] });
      }

      p.dungeon = null;
      p.vida = p.vidaMax || p.vida;

      embed.addFields({
        name: "☠️ Derrota",
        value:
          "Você caiu na dungeon infinita e perdeu as recompensas acumuladas."
      });

      save(db);
      return message.reply({ embeds: [embed] });
    }

    if (cmd === "dungeonsair") {
      if (!p.dungeon) {
        return message.reply("Você não está em uma dungeon infinita.");
      }

      p.xp = (p.xp || 0) + p.dungeon.recompensaXp;
      p.moedas = (p.moedas || 0) + p.dungeon.recompensaMoedas;

      const xp = p.dungeon.recompensaXp;
      const moedas = p.dungeon.recompensaMoedas;

      p.dungeon = null;
      save(db);

      return message.reply(
        `🏃 Você saiu da dungeon infinita!\n` +
        `✨ XP recebido: ${xp}\n` +
        `💰 Moedas recebidas: ${moedas}`
      );
    }

    // =========================
    // RAID
    // =========================

    if (cmd === "raid") {
      if (!db.raid) {
        db.raid = {
          ativa: true,
          boss: "Dragão do Apocalipse",
          vida: 500000,
          vidaMax: 500000,
          dano: {},
          criada: Date.now()
        };

        save(db);
      }

      const embed = new EmbedBuilder()
        .setColor("#8b0000")
        .setTitle("👹 RAID MUNDIAL INICIADA")
        .setDescription(
          `🐉 Boss: **${db.raid.boss}**\n` +
          `❤️ Vida: ${barra(db.raid.vida, db.raid.vidaMax)} ${db.raid.vida}/${db.raid.vidaMax}\n\n` +
          `Clique em **Atacar Raid** para causar dano!`
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("raid_atacar")
          .setLabel("Atacar Raid")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("⚔️")
      );

      return message.reply({ embeds: [embed], components: [row] });
    }

    if (cmd === "raidstatus") {
      if (!db.raid || !db.raid.ativa) {
        return message.reply("Não tem raid ativa agora.");
      }

      const ranking = Object.entries(db.raid.dano || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([id, dano], i) => `${i + 1}. <@${id}> — ${dano} dano`)
        .join("\n");

      return message.reply(
        `👹 **Raid Atual**\n\n` +
        `🐉 Boss: ${db.raid.boss}\n` +
        `❤️ Vida: ${barra(db.raid.vida, db.raid.vidaMax)} ${db.raid.vida}/${db.raid.vidaMax}\n\n` +
        `🏆 Ranking de dano:\n${ranking || "Ninguém atacou ainda."}`
      );
    }
  });

  client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;

    const db = load();

    // BOTÕES DUNGEON
    if (interaction.customId.startsWith("dungeon_")) {
      const [, acao, userId] = interaction.customId.split("_");

      if (interaction.user.id !== userId) {
        return interaction.reply({
          content: "Esse botão não é seu.",
          ephemeral: true
        });
      }

      const p = getPlayer(db, interaction.user);
      if (!p || !p.dungeon) {
        return interaction.reply({
          content: "Você não está em dungeon infinita.",
          ephemeral: true
        });
      }

      if (acao === "sair") {
        const xp = p.dungeon.recompensaXp;
        const moedas = p.dungeon.recompensaMoedas;

        p.xp = (p.xp || 0) + xp;
        p.moedas = (p.moedas || 0) + moedas;
        p.dungeon = null;

        save(db);

        return interaction.update({
          content:
            `🏃 Você saiu da dungeon infinita!\n` +
            `✨ XP recebido: ${xp}\n` +
            `💰 Moedas recebidas: ${moedas}`,
          embeds: [],
          components: []
        });
      }

      if (acao === "continuar") {
        save(db);

        return interaction.update({
          content: `⚔️ Use **,dungeon** novamente para avançar para o próximo andar.`,
          embeds: [],
          components: []
        });
      }
    }

    // BOTÃO RAID
    if (interaction.customId === "raid_atacar") {
      if (!db.raid || !db.raid.ativa) {
        return interaction.reply({
          content: "Não existe raid ativa.",
          ephemeral: true
        });
      }

      const p = getPlayer(db, interaction.user);
      if (!p) {
        return interaction.reply({
          content: "Crie seu personagem primeiro com ,criar.",
          ephemeral: true
        });
      }

      const dano = Math.max(
        100,
        atkTotal(p) + Math.floor(Math.random() * 1000)
      );

      db.raid.vida = Math.max(0, db.raid.vida - dano);

      if (!db.raid.dano[interaction.user.id]) {
        db.raid.dano[interaction.user.id] = 0;
      }

      db.raid.dano[interaction.user.id] += dano;

      if (db.raid.vida <= 0) {
        db.raid.ativa = false;

        const ranking = Object.entries(db.raid.dano)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        for (const [id, totalDano] of ranking) {
          if (db.jogadores[id]) {
            db.jogadores[id].xp = (db.jogadores[id].xp || 0) + 5000;
            db.jogadores[id].moedas = (db.jogadores[id].moedas || 0) + 8000;
          }
        }

        save(db);

        return interaction.update({
          content:
            `🏆 **RAID FINALIZADA!**\n\n` +
            `🐉 O boss **${db.raid.boss}** foi derrotado!\n` +
            `Top jogadores receberam:\n` +
            `✨ 5000 XP\n` +
            `💰 8000 moedas`,
          embeds: [],
          components: []
        });
      }

      save(db);

      return interaction.reply({
        content:
          `⚔️ Você causou **${dano}** de dano na raid!\n` +
          `❤️ Vida restante: ${db.raid.vida}/${db.raid.vidaMax}`,
        ephemeral: true
      });
    }
  });
};
