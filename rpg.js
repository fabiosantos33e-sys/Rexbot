const fs = require("fs");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const FILE = "./rpgdb.json";
const PREFIX = ",";
const ADMINS = ["1053803800340746261"];

const NIVEL_MAX = 400;
const VIDA_MAXIMA = 15000;

const poderesNormais = [
  { nome: "Chamas Negras", emoji: "🔥", ataques: ["Explosão Infernal", "Lança Flamejante", "Chama Devoradora"], atk: 35, def: 0 },
  { nome: "Água Abissal", emoji: "💧", ataques: ["Corte Aquático", "Prisão de Água", "Tsunami Abissal"], atk: 10, def: 35 },
  { nome: "Vento Celestial", emoji: "🌪️", ataques: ["Lâmina de Vento", "Furacão Cortante", "Passo Celestial"], atk: 30, def: 10 },
  { nome: "Raio Divino", emoji: "⚡", ataques: ["Trovão Rasgante", "Impacto Elétrico", "Julgamento do Raio"], atk: 45, def: 5 },
  { nome: "Gelo Eterno", emoji: "❄️", ataques: ["Estaca de Gelo", "Nevasca Mortal", "Prisão Congelante"], atk: 20, def: 40 },
  { nome: "Sangue Demoníaco", emoji: "🩸", ataques: ["Garra Carmesim", "Fúria Sangrenta", "Corte Vital"], atk: 70, def: 10 },
  { nome: "Gravidade", emoji: "🕳️", ataques: ["Pressão Gravitacional", "Campo Pesado", "Colapso Negro"], atk: 65, def: 35 },
  { nome: "Luz Celestial", emoji: "✨", ataques: ["Raio Sagrado", "Explosão Celestial", "Lança de Luz"], atk: 55, def: 20 },
  { nome: "Terra Titânica", emoji: "🪨", ataques: ["Punho Sísmico", "Muralha de Pedra", "Impacto Titânico"], atk: 20, def: 60 }
];

const poderSombras = {
  nome: "Sombras",
  emoji: "🌑",
  ataques: ["Arise", "Corte do Monarca", "Exército das Sombras", "Domínio Absoluto", "Execução Sombria"],
  atk: 3500,
  def: 2500
};

const mapas = [
  { nome: "Floresta Sombria", min: 1, emoji: "🌲" },
  { nome: "Caverna dos Lobos", min: 25, emoji: "🐺" },
  { nome: "Ruínas do Rei Esqueleto", min: 50, emoji: "💀" },
  { nome: "Castelo Demoníaco", min: 75, emoji: "🏰" },
  { nome: "Vale do Dragão Carmesim", min: 100, emoji: "🐉" },
  { nome: "Dungeon Rank S", min: 150, emoji: "🕳️" },
  { nome: "Abismo Congelado", min: 200, emoji: "❄️" },
  { nome: "Reino das Sombras", min: 250, emoji: "🌑" },
  { nome: "Templo Celestial", min: 300, emoji: "✨" },
  { nome: "Trono do Monarca", min: 350, emoji: "👑" }
];

const bosses = [
  { nome: "Lobo Alfa Sombrio", emoji: "🐺", mapa: "Floresta Sombria", min: 1, vida: 1100, ataque: 90, defesa: 35, xp: 600, moedas: 500, frase: "A matilha sente seu medo..." },
  { nome: "Ent Corrompido", emoji: "🌲", mapa: "Floresta Sombria", min: 1, vida: 1300, ataque: 80, defesa: 55, xp: 650, moedas: 520, frase: "A floresta não perdoa invasores." },
  { nome: "Caçador Perdido", emoji: "🗡️", mapa: "Floresta Sombria", min: 1, vida: 1000, ataque: 115, defesa: 30, xp: 620, moedas: 540, frase: "Eu também tentei fugir..." },

  { nome: "Fenrir Jovem", emoji: "🐺", mapa: "Caverna dos Lobos", min: 25, vida: 2600, ataque: 190, defesa: 90, xp: 1600, moedas: 1300, frase: "Você entrou no território da matilha." },
  { nome: "Lobo Lunar", emoji: "🌕", mapa: "Caverna dos Lobos", min: 25, vida: 2400, ataque: 220, defesa: 70, xp: 1550, moedas: 1200, frase: "A lua será sua última visão." },
  { nome: "Guardião das Presas", emoji: "🦷", mapa: "Caverna dos Lobos", min: 25, vida: 3000, ataque: 175, defesa: 120, xp: 1700, moedas: 1400, frase: "Minhas presas rasgam aço." },

  { nome: "Rei Esqueleto", emoji: "💀", mapa: "Ruínas do Rei Esqueleto", min: 50, vida: 5200, ataque: 320, defesa: 180, xp: 3800, moedas: 3000, frase: "Os mortos jamais descansam..." },
  { nome: "General Ossudo", emoji: "☠️", mapa: "Ruínas do Rei Esqueleto", min: 50, vida: 4700, ataque: 360, defesa: 140, xp: 3500, moedas: 2800, frase: "Meu exército nunca acaba." },
  { nome: "Necromante Antigo", emoji: "🧙", mapa: "Ruínas do Rei Esqueleto", min: 50, vida: 4300, ataque: 400, defesa: 120, xp: 3700, moedas: 2900, frase: "A morte obedece minha voz." },

  { nome: "Demônio Carmesim", emoji: "👹", mapa: "Castelo Demoníaco", min: 75, vida: 7800, ataque: 520, defesa: 260, xp: 6500, moedas: 5000, frase: "O castelo exige sangue." },
  { nome: "Cavaleiro Infernal", emoji: "⚔️", mapa: "Castelo Demoníaco", min: 75, vida: 8500, ataque: 480, defesa: 330, xp: 6800, moedas: 5300, frase: "Minha espada guarda este portão." },
  { nome: "Bruxa Demoníaca", emoji: "🩸", mapa: "Castelo Demoníaco", min: 75, vida: 7000, ataque: 600, defesa: 220, xp: 6700, moedas: 5200, frase: "Sua alma será minha poção." },

  { nome: "Dragão Carmesim", emoji: "🐉", mapa: "Vale do Dragão Carmesim", min: 100, vida: 13000, ataque: 820, defesa: 430, xp: 11000, moedas: 8500, frase: "Meu fogo queimará até sua alma." },
  { nome: "Wyvern de Sangue", emoji: "🪽", mapa: "Vale do Dragão Carmesim", min: 100, vida: 11500, ataque: 900, defesa: 360, xp: 10500, moedas: 8000, frase: "O céu pertence aos dragões." },
  { nome: "Guardião das Chamas", emoji: "🔥", mapa: "Vale do Dragão Carmesim", min: 100, vida: 12500, ataque: 780, defesa: 520, xp: 10800, moedas: 8300, frase: "A chama eterna não se apaga." },

  { nome: "Executor Rank S", emoji: "🕳️", mapa: "Dungeon Rank S", min: 150, vida: 22000, ataque: 1300, defesa: 800, xp: 22000, moedas: 15000, frase: "Rank S não foi feito para humanos." },
  { nome: "Gigante da Dungeon", emoji: "🗿", mapa: "Dungeon Rank S", min: 150, vida: 26000, ataque: 1150, defesa: 1000, xp: 23000, moedas: 16000, frase: "Eu esmago caçadores como insetos." },
  { nome: "Assassino do Vazio", emoji: "🖤", mapa: "Dungeon Rank S", min: 150, vida: 19000, ataque: 1550, defesa: 620, xp: 22500, moedas: 15500, frase: "Você não verá meu próximo golpe." },

  { nome: "Rei Glacial", emoji: "❄️", mapa: "Abismo Congelado", min: 200, vida: 34000, ataque: 1700, defesa: 1300, xp: 36000, moedas: 25000, frase: "Tudo congela diante do meu trono." },
  { nome: "Fera do Gelo Eterno", emoji: "🧊", mapa: "Abismo Congelado", min: 200, vida: 30000, ataque: 1900, defesa: 1050, xp: 35000, moedas: 24000, frase: "Seu sangue também vai congelar." },

  { nome: "Monarca das Cinzas", emoji: "🌑", mapa: "Reino das Sombras", min: 250, vida: 48000, ataque: 2300, defesa: 1700, xp: 52000, moedas: 35000, frase: "As sombras reconhecem sua presença." },
  { nome: "General Sombrio", emoji: "⚫", mapa: "Reino das Sombras", min: 250, vida: 43000, ataque: 2500, defesa: 1500, xp: 50000, moedas: 33000, frase: "Ajoelhe-se diante do exército." },

  { nome: "Serafim Caído", emoji: "👁️", mapa: "Templo Celestial", min: 300, vida: 62000, ataque: 3100, defesa: 2200, xp: 70000, moedas: 47000, frase: "O céu abandonou este mundo." },
  { nome: "Juiz Celestial", emoji: "✨", mapa: "Templo Celestial", min: 300, vida: 68000, ataque: 2900, defesa: 2500, xp: 73000, moedas: 50000, frase: "Seu julgamento começa agora." },

  { nome: "Deus das Sombras", emoji: "🖤", mapa: "Trono do Monarca", min: 350, vida: 95000, ataque: 4200, defesa: 3200, xp: 120000, moedas: 80000, frase: "ARISE..." },
  { nome: "Monarca Absoluto", emoji: "👑", mapa: "Trono do Monarca", min: 350, vida: 110000, ataque: 4500, defesa: 3500, xp: 140000, moedas: 90000, frase: "Você chegou longe demais." }
];

const loja = {
  espada_ferro: { nome: "Espada de Ferro", tipo: "arma", preco: 500, ataque: 60, raridade: "Comum" },
  adaga_dupla: { nome: "Adaga Dupla", tipo: "arma", preco: 1600, ataque: 160, raridade: "Rara", habilidade: "Dança das Lâminas" },
  espada_demon: { nome: "Espada Demoníaca", tipo: "arma", preco: 5000, ataque: 420, raridade: "Épica", habilidade: "Corte Demoníaco" },
  katana_sombria: { nome: "Katana Sombria", tipo: "arma", preco: 7000, ataque: 520, raridade: "Épica", habilidade: "Corte da Lua Negra" },
  foice_eclipse: { nome: "Foice do Eclipse", tipo: "arma", preco: 12000, ataque: 700, raridade: "Lendária", habilidade: "Ceifador Lunar" },
  armadura_sombra: { nome: "Armadura Sombria", tipo: "armadura", preco: 3500, defesa: 260, raridade: "Épica" },
  pocao: { nome: "Poção Suprema", tipo: "consumivel", preco: 600, cura: 1500, raridade: "Comum" }
};

function load() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ jogadores: {} }, null, 2));
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function barra(atual, max) {
  const total = 10;
  const cheios = Math.max(0, Math.min(total, Math.round((atual / max) * total)));
  return "█".repeat(cheios) + "░".repeat(total - cheios);
}

function isAdmin(id) {
  return ADMINS.includes(id);
}

function criarPlayer(user) {
  const poder = rand(poderesNormais);
  return {
    nome: user.username,
    nivel: 1,
    xp: 0,
    vida: 600,
    vidaMax: 600,
    ataqueBase: 80,
    defesaBase: 35,
    moedas: 500,
    poder,
    mapaAtual: "Floresta Sombria",
    mapasLiberados: ["Floresta Sombria"],
    inventario: [],
    equipado: { arma: null, armadura: null },
    sombras: [],
    sombraPendente: null,
    bossPendente: null,
    portalPendente: null,
    vitorias: 0,
    derrotas: 0
  };
}

function corrigirPlayer(p, user) {
  p.nome = user.username;
  if (!p.poder) p.poder = rand(poderesNormais);
  if (!p.poder.emoji) p.poder.emoji = "🔥";
  if (!p.poder.ataques) p.poder.ataques = ["Ataque Elemental"];
  if (!p.mapasLiberados) p.mapasLiberados = ["Floresta Sombria"];
  if (!p.mapaAtual) p.mapaAtual = p.mapasLiberados[0] || "Floresta Sombria";
  if (!p.inventario) p.inventario = [];
  if (!p.equipado) p.equipado = { arma: null, armadura: null };
  if (!p.sombras) p.sombras = [];
  if (!("ataqueBase" in p)) p.ataqueBase = p.ataque || 80;
  if (!("defesaBase" in p)) p.defesaBase = p.defesa || 35;
  if (!p.vidaMax) p.vidaMax = 600;
  if (!p.vida) p.vida = p.vidaMax;
  if (!p.moedas) p.moedas = 0;
  if (!p.vitorias) p.vitorias = 0;
  if (!p.derrotas) p.derrotas = 0;
}

function getPlayer(db, user) {
  if (!db.jogadores[user.id]) db.jogadores[user.id] = criarPlayer(user);
  corrigirPlayer(db.jogadores[user.id], user);
  return db.jogadores[user.id];
}

function mapaObj(nome) {
  return mapas.find(m => m.nome.toLowerCase() === String(nome).toLowerCase()) || mapas[0];
}

function mapaAtual(p) {
  return mapaObj(p.mapaAtual);
}

function proximoMapa(p) {
  return mapas.find(m => !p.mapasLiberados.includes(m.nome) && p.nivel >= m.min);
}

function atkTotal(p) {
  const arma = p.equipado?.arma?.ataque || 0;
  const poder = p.poder?.atk || 0;
  const sombras = p.sombras?.reduce((a, s) => a + (s.ataque || 0), 0) || 0;
  return p.ataqueBase + arma + poder + sombras;
}

function defTotal(p) {
  const armadura = p.equipado?.armadura?.defesa || 0;
  const poder = p.poder?.def || 0;
  const sombras = p.sombras?.reduce((a, s) => a + (s.defesa || 0), 0) || 0;
  return p.defesaBase + armadura + poder + sombras;
}

function xpNecessario(p) {
  return p.nivel * 160;
}

function upar(p) {
  let texto = "";
  while (p.xp >= xpNecessario(p) && p.nivel < NIVEL_MAX) {
    p.xp -= xpNecessario(p);
    p.nivel++;
    p.vidaMax = Math.min(VIDA_MAXIMA, p.vidaMax + 90);
    p.ataqueBase += 28;
    p.defesaBase += 14;
    p.vida = p.vidaMax;
    texto += `\n🔥 **LEVEL UP!** Agora você está no nível **${p.nivel}**!`;
  }
  return texto;
}

function inimigoPorNivel(p, boss = false) {
  let mult = boss ? 2.2 : 1.5;
  const mapa = mapaAtual(p);

  return {
    nome: boss ? `Guardião de ${mapa.nome}` : `Monstro de ${mapa.nome}`,
    mapa: mapa.nome,
    emoji: boss ? "👹" : "⚔️",
    vida: Math.floor(250 + p.nivel * 55 * mult),
    ataque: Math.floor(35 + p.nivel * 12 * mult),
    defesa: Math.floor(15 + p.nivel * 6 * mult),
    xp: Math.floor(120 + p.nivel * 40 * mult),
    moedas: Math.floor(150 + p.nivel * 45 * mult),
    frase: "Mostre se merece sobreviver.",
    boss
  };
}

function bossAleatorio(p) {
  const mapa = mapaAtual(p);

  let lista = bosses.filter(b =>
    p.nivel >= b.min &&
    (b.mapa === mapa.nome || p.mapasLiberados.includes(b.mapa))
  );

  const doMapaAtual = lista.filter(b => b.mapa === mapa.nome);
  if (doMapaAtual.length) lista = doMapaAtual;

  if (!lista.length) return inimigoPorNivel(p, true);

  const base = { ...rand(lista) };

  const escala = 1 + Math.max(0, p.nivel - base.min) * 0.035;

  return {
    nome: base.nome,
    mapa: base.mapa,
    emoji: base.emoji,
    vida: Math.floor(base.vida * escala),
    ataque: Math.floor(base.ataque * escala),
    defesa: Math.floor(base.defesa * escala),
    xp: Math.floor(base.xp * escala),
    moedas: Math.floor(base.moedas * escala),
    frase: base.frase,
    boss: true
  };
}

function bossPortal(p, mapa) {
  const b = bossAleatorio(p);
  return {
    ...b,
    nome: `Guardião do Portal: ${mapa.nome}`,
    mapa: mapa.nome,
    vida: Math.floor(b.vida * 1.15),
    ataque: Math.floor(b.ataque * 1.1),
    defesa: Math.floor(b.defesa * 1.1),
    xp: Math.floor(b.xp * 1.2),
    moedas: Math.floor(b.moedas * 1.2),
    portalMapa: mapa.nome
  };
}

function sortearDrop(boss = false) {
  let roll = Math.random() * 100;
  if (boss) roll -= 10;

  if (roll <= 70) {
    return { ...rand([
      { nome: "Fragmento de Ferro", tipo: "material", raridade: "Comum" },
      { nome: "Pedra de Mana", tipo: "material", raridade: "Comum" },
      { nome: "Cristal Fraco", tipo: "material", raridade: "Comum" },
      { nome: "Poção Pequena", tipo: "consumivel", raridade: "Comum", cura: 300 }
    ]) };
  }

  if (roll <= 90) {
    return { ...rand([
      { nome: "Adaga Sombria", tipo: "arma", raridade: "Rara", ataque: 120 },
      { nome: "Katana Azul", tipo: "arma", raridade: "Rara", ataque: 180 },
      { nome: "Armadura de Mana", tipo: "armadura", raridade: "Rara", defesa: 100 }
    ]) };
  }

  if (roll <= 98) {
    return { ...rand([
      { nome: "Espada Demoníaca", tipo: "arma", raridade: "Épica", ataque: 350, habilidade: "Corte Infernal" },
      { nome: "Foice do Eclipse", tipo: "arma", raridade: "Épica", ataque: 420, habilidade: "Lua Sangrenta" }
    ]) };
  }

  return { ...rand([
    { nome: "Lâmina do Monarca", tipo: "arma", raridade: "Mítica", ataque: 900, habilidade: "Execução Absoluta" },
    { nome: "Espada do Rei Demônio", tipo: "arma", raridade: "Mítica", ataque: 950, habilidade: "Julgamento Demoníaco" }
  ]) };
}

function narrarLuta(p, inimigo) {
  let vidaPlayer = p.vidaMax;
  let vidaInimigo = inimigo.vida;
  const turnos = [];

  turnos.push({
    name: "🎬 A Dungeon tremeu...",
    value:
      `🌑 O ar ficou pesado.\n` +
      `${inimigo.emoji || "👹"} **${inimigo.nome}** apareceu em **${inimigo.mapa}**.\n\n` +
      `🗣️ "${inimigo.frase || "Você não deveria estar aqui..."}"`
  });

  for (let turno = 1; turno <= 7; turno++) {
    let ataque = rand(p.poder.ataques);

    if (p.equipado?.arma?.habilidade && Math.random() < 0.35) {
      ataque = `${p.equipado.arma.habilidade} (${p.equipado.arma.nome})`;
    }

    const danoPlayer = Math.max(
      20,
      atkTotal(p) + Math.floor(Math.random() * 90) - Math.floor(inimigo.defesa / 2)
    );

    vidaInimigo = Math.max(0, vidaInimigo - danoPlayer);

    turnos.push({
      name: `⚔️ Turno ${turno} — ${p.nome}`,
      value:
        `${p.poder.emoji} Sua aura explodiu.\n` +
        `💥 Você usou **${ataque}**.\n\n` +
        `🔥 Dano: **${danoPlayer}**\n` +
        `👹 Inimigo: ${barra(vidaInimigo, inimigo.vida)} ${vidaInimigo}/${inimigo.vida}`
    });

    if (vidaInimigo <= 0) break;

    const danoBoss = Math.max(
      10,
      inimigo.ataque + Math.floor(Math.random() * 70) - Math.floor(defTotal(p) / 2)
    );

    vidaPlayer = Math.max(0, vidaPlayer - danoBoss);

    turnos.push({
      name: `👹 ${inimigo.nome}`,
      value:
        `💢 O chão rachou.\n` +
        `⚡ O inimigo avançou brutalmente.\n\n` +
        `💥 Dano recebido: **${danoBoss}**\n` +
        `❤️ Você: ${barra(vidaPlayer, p.vidaMax)} ${vidaPlayer}/${p.vidaMax}`
    });

    if (vidaPlayer <= 0) break;
  }

  return {
    venceu: vidaInimigo <= 0,
    morreu: vidaPlayer <= 0,
    turnos
  };
}

function recompensa(p, inimigo, boss = false) {
  p.xp += inimigo.xp;
  p.moedas += inimigo.moedas;
  p.vitorias++;

  let txt = `✨ XP: +${inimigo.xp}\n💰 Moedas: +${inimigo.moedas}`;

  const drop = sortearDrop(boss);
  if (drop) {
    p.inventario.push(drop);
    txt += `\n🎁 DROP: **${drop.nome}** [${drop.raridade}]`;
  }

  txt += upar(p);
  return txt;
}

function criarEmbedPerfil(message, p) {
  return new EmbedBuilder()
    .setColor("#00ff88")
    .setTitle("🕶️ Perfil do Caçador")
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 256 }))
    .setDescription(`👤 ${message.author}\n${p.poder.emoji} Poder: **${p.poder.nome}**`)
    .addFields(
      { name: "⭐ Nível", value: `${p.nivel}/400`, inline: true },
      { name: "✨ XP", value: `${p.xp}/${xpNecessario(p)}`, inline: true },
      { name: "💰 Moedas", value: `${p.moedas}`, inline: true },
      { name: "❤️ Vida", value: `${barra(p.vida, p.vidaMax)}\n${p.vida}/${p.vidaMax}`, inline: false },
      { name: "⚔️ Ataque", value: `${atkTotal(p)}`, inline: true },
      { name: "🛡️ Defesa", value: `${defTotal(p)}`, inline: true },
      { name: "🗺️ Mapa atual", value: `${mapaAtual(p).emoji} ${mapaAtual(p).nome}`, inline: true },
      { name: "🗡️ Arma", value: p.equipado.arma?.nome || "Nenhuma", inline: true },
      { name: "🛡️ Armadura", value: p.equipado.armadura?.nome || "Nenhuma", inline: true },
      { name: "🌑 Sombras", value: `${p.sombras.length} extraídas`, inline: true }
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

    if (cmd === "criar") {
      save(db);
      return message.reply(`🌑 **Sistema despertado!**\nPoder recebido: ${p.poder.emoji} **${p.poder.nome}**\nUse **,caçar**.`);
    }

    if (cmd === "perfil") {
      return message.reply({ embeds: [criarEmbedPerfil(message, p)] });
    }

    if (cmd === "inventario") {
      if (!p.inventario.length) return message.reply("🎒 Seu inventário está vazio.");

      const lista = p.inventario.map((item, i) =>
        `${i + 1}. **${item.nome}** [${item.raridade || "Comum"}] ` +
        `${item.ataque ? `⚔️ +${item.ataque}` : ""} ` +
        `${item.defesa ? `🛡️ +${item.defesa}` : ""} ` +
        `${item.habilidade ? `✨ ${item.habilidade}` : ""}`
      ).join("\n");

      return message.reply(`🎒 **Inventário**\n\n${lista}\n\nUse **,equipar número**`);
    }

    if (cmd === "equipar") {
      const numero = parseInt(args[0]);
      const item = p.inventario[numero - 1];

      if (!item) return message.reply("❌ Item inválido. Use **,inventario**.");
      if (item.tipo === "material" || item.tipo === "consumivel" || item.cura) return message.reply("❌ Esse item não pode ser equipado.");

      if (item.tipo === "arma" || item.ataque) {
        p.equipado.arma = item;
        save(db);
        return message.reply(`✅ Você equipou a arma **${item.nome}**!`);
      }

      if (item.tipo === "armadura" || item.defesa) {
        p.equipado.armadura = item;
        save(db);
        return message.reply(`✅ Você equipou a armadura **${item.nome}**!`);
      }

      return message.reply("❌ Esse item não pode ser equipado.");
    }

    if (cmd === "loja") {
      let txt = "🏪 **Loja dos Caçadores**\n\n";
      for (const id in loja) txt += `🔹 **${id}** — ${loja[id].nome} | 💰 ${loja[id].preco}\n`;
      return message.reply(txt);
    }

    if (cmd === "comprar") {
      const id = args[0]?.toLowerCase();
      const item = loja[id];

      if (!id) return message.reply("❌ Use: **,comprar nome_do_item**");
      if (!item) return message.reply("❌ Item não encontrado. Use **,loja**.");
      if (p.moedas < item.preco) return message.reply(`💰 Você precisa de ${item.preco} moedas.`);

      p.moedas -= item.preco;
      p.inventario.push({ ...item });
      if (item.cura) p.vida = Math.min(p.vidaMax, p.vida + item.cura);

      save(db);
      return message.reply(`✅ Você comprou **${item.nome}**!\n💰 Moedas restantes: ${p.moedas}`);
    }

    if (cmd === "treinar") {
      const tipo = args[0];
      const vezes = parseInt(args[1]) || 1;
      const permitidos = [1, 5, 10, 30, 50, 100];

      if (!["forca", "vida", "defesa"].includes(tipo)) {
        return message.reply("Use: **,treinar forca 10**, **,treinar vida 5** ou **,treinar defesa 30**");
      }

      if (!permitidos.includes(vezes)) {
        return message.reply("Você só pode treinar: **1, 5, 10, 30, 50 ou 100** vezes.");
      }

      const custo = 200 * vezes;
      if (p.moedas < custo) return message.reply(`💰 Você precisa de **${custo} moedas**.`);

      p.moedas -= custo;
      if (tipo === "forca") p.ataqueBase += 20 * vezes;
      if (tipo === "defesa") p.defesaBase += 15 * vezes;
      if (tipo === "vida") {
        p.vidaMax = Math.min(VIDA_MAXIMA, p.vidaMax + 120 * vezes);
        p.vida = p.vidaMax;
      }

      save(db);
      return message.reply(`🏋️ **Treino concluído!**\nTipo: **${tipo}**\nQuantidade: **${vezes}x**\nCusto: **${custo} moedas**`);
    }

    if (cmd === "caçar") {
      const achouBoss = Math.floor(Math.random() * 100) <= 30;

      if (achouBoss) {
        const boss = bossAleatorio(p);
        p.bossPendente = boss;
        save(db);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`rpg_enfrentar_${message.author.id}`).setLabel("Enfrentar Boss").setStyle(ButtonStyle.Danger).setEmoji("⚔️"),
          new ButtonBuilder().setCustomId(`rpg_correr_${message.author.id}`).setLabel("Correr").setStyle(ButtonStyle.Secondary).setEmoji("🏃")
        );

        const embed = new EmbedBuilder()
          .setColor("#8b0000")
          .setTitle("⚠️ BOSS ENCONTRADO")
          .setDescription(
            `🌑 A dungeon ficou silenciosa...\n\n` +
            `${boss.emoji || "👹"} **${boss.nome}** apareceu.\n` +
            `🗺️ ${boss.mapa}\n` +
            `❤️ Vida: ${boss.vida}\n` +
            `⚔️ Ataque: ${boss.ataque}\n\n` +
            `🗣️ "${boss.frase || "Você não deveria estar aqui..."}"`
          );

        return message.reply({ embeds: [embed], components: [row] });
      }

      const inimigo = inimigoPorNivel(p, false);
      const luta = narrarLuta(p, inimigo);

      const embed = new EmbedBuilder()
        .setColor("#111111")
        .setTitle(`🌑 Dungeon: ${inimigo.mapa}`)
        .setDescription(`👹 Inimigo: **${inimigo.nome}**`);

      embed.addFields(luta.turnos.slice(0, 20));

      if (luta.morreu) {
        p.derrotas++;
        p.moedas = Math.max(0, p.moedas - Math.floor(inimigo.moedas / 2));
        embed.addFields({ name: "☠️ Resultado", value: "Você morreu na dungeon e perdeu moedas." });
      } else if (luta.venceu) {
        embed.addFields({ name: "🏆 Recompensa", value: recompensa(p, inimigo, false) });

        if (p.poder.nome === "Sombras") {
          p.sombraPendente = {
            nome: inimigo.nome,
            ataque: Math.floor(inimigo.ataque * 0.25),
            defesa: Math.floor(inimigo.defesa * 0.25)
          };

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`rpg_arise_${message.author.id}`).setLabel("Arise").setStyle(ButtonStyle.Primary).setEmoji("🌑")
          );

          p.vida = p.vidaMax;
          save(db);
          return message.reply({ embeds: [embed], components: [row] });
        }
      } else {
        embed.addFields({ name: "🏃 Resultado", value: "Você recuou antes de morrer." });
      }

      p.vida = p.vidaMax;
      save(db);
      return message.reply({ embeds: [embed] });
    }

    if (cmd === "mapas") {
      const lista = mapas.map(m => {
        const liberado = p.mapasLiberados.includes(m.nome);
        const atual = p.mapaAtual === m.nome;
        return `${liberado ? "✅" : "🔒"} ${m.emoji} **${m.nome}** — Lv ${m.min}${atual ? " 🌟 ATUAL" : ""}`;
      }).join("\n");

      const prox = proximoMapa(p);
      return message.reply(
        `🗺️ **MAPAS DO RPG**\n\n${lista}\n\n` +
        `Use **,viajar nome do mapa** para trocar de mapa.\n` +
        `Use **,abrirmapa** para liberar um mapa novo quando tiver nível.\n` +
        `${prox ? `\n📍 Próximo disponível: **${prox.nome}**` : ""}`
      );
    }

    if (cmd === "viajar") {
      const nome = args.join(" ").toLowerCase();
      if (!nome) return message.reply("Use: **,viajar nome do mapa**");

      const mapa = mapas.find(m => m.nome.toLowerCase().includes(nome));
      if (!mapa) return message.reply("❌ Mapa não encontrado. Use **,mapas**.");
      if (!p.mapasLiberados.includes(mapa.nome)) return message.reply("🔒 Esse mapa ainda está bloqueado. Use **,abrirmapa** quando tiver nível.");

      p.mapaAtual = mapa.nome;
      p.vida = p.vidaMax;
      save(db);

      return message.reply(`🗺️ Você viajou para ${mapa.emoji} **${mapa.nome}**.`);
    }

    if (cmd === "abrirmapa") {
      const prox = proximoMapa(p);
      if (!prox) return message.reply("❌ Nenhum mapa novo disponível agora. Veja com **,mapas**.");

      const boss = bossPortal(p, prox);
      p.portalPendente = prox.nome;
      p.bossPendente = boss;
      save(db);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`rpg_enfrentar_${message.author.id}`).setLabel("Enfrentar Guardião").setStyle(ButtonStyle.Danger).setEmoji("🚪"),
        new ButtonBuilder().setCustomId(`rpg_correr_${message.author.id}`).setLabel("Desistir").setStyle(ButtonStyle.Secondary).setEmoji("🏃")
      );

      const embed = new EmbedBuilder()
        .setColor("#8800ff")
        .setTitle("🚪 PORTAL DE NOVO MAPA")
        .setDescription(
          `Você encontrou o portal para ${prox.emoji} **${prox.nome}**.\n\n` +
          `Para liberar esse mapa, derrote:\n` +
          `👹 **${boss.nome}**\n` +
          `❤️ Vida: ${boss.vida}\n` +
          `⚔️ Ataque: ${boss.ataque}`
        );

      return message.reply({ embeds: [embed], components: [row] });
    }

    if (cmd === "bossnivel") {
      return message.reply("Agora use **,abrirmapa** para enfrentar o guardião e liberar novos mapas.");
    }

    if (cmd === "sombras") {
      if (p.poder.nome !== "Sombras") return message.reply("❌ Você não é o Monarca das Sombras.");
      if (!p.sombras.length) return message.reply("🌑 Você ainda não extraiu nenhuma sombra.");

      const lista = p.sombras.map((s, i) => `${i + 1}. **${s.nome}** | ⚔️ +${s.ataque} | 🛡️ +${s.defesa}`).join("\n");
      return message.reply(`🌑 **Seu Exército das Sombras**\n\n${lista}`);
    }

    if (cmd === "ranking") {
      const ranking = Object.values(db.jogadores)
        .sort((a, b) => b.nivel - a.nivel || b.xp - a.xp)
        .slice(0, 10)
        .map((j, i) => `${i + 1}. **${j.nome}** — Lv ${j.nivel}`)
        .join("\n");

      return message.reply(`🏆 **Ranking**\n\n${ranking || "Ninguém ainda"}`);
    }

    if (cmd === "adm") {
      if (!isAdmin(message.author.id)) return;

      const acao = args[0];
      const membro = message.mentions.users.first();
      const valor = parseInt(args[2]);

      if (!membro) return message.reply("Use: **,adm money @user 500**");

      const alvo = getPlayer(db, membro);

      if (acao === "money") alvo.moedas += valor;
      else if (acao === "xp") alvo.xp += valor;
      else if (acao === "level") alvo.nivel = Math.min(NIVEL_MAX, alvo.nivel + valor);
      else if (acao === "heal") alvo.vida = alvo.vidaMax;
      else if (acao === "reset") delete db.jogadores[membro.id];
      else if (acao === "sombras") alvo.poder = poderSombras;
      else if (acao === "mapa") {
        const nomeMapa = args.slice(2).join(" ").toLowerCase();
        const mapa = mapas.find(m => m.nome.toLowerCase().includes(nomeMapa));
        if (!mapa) return message.reply("Mapa não encontrado.");
        if (!alvo.mapasLiberados.includes(mapa.nome)) alvo.mapasLiberados.push(mapa.nome);
      }
      else return message.reply("Ação inválida: money, xp, level, heal, reset, sombras, mapa");

      save(db);
      return message.reply(`👑 Admin executou **${acao}** em ${membro}`);
    }

    if (cmd === "rpghelp") {
      return message.reply(
        "🌑 **GUIA RPG**\n\n" +
        ",criar — cria personagem\n" +
        ",perfil — mostra status\n" +
        ",caçar — luta em dungeon e pode achar boss aleatório\n" +
        ",mapas — ver mapas\n" +
        ",abrirmapa — enfrentar guardião para liberar mapa novo\n" +
        ",viajar nome — viajar para mapa liberado\n" +
        ",inventario — ver itens\n" +
        ",equipar 1 — equipar item\n" +
        ",loja — ver loja\n" +
        ",comprar espada_ferro — comprar item\n" +
        ",treinar forca 10\n" +
        ",treinar vida 10\n" +
        ",treinar defesa 10\n" +
        ",sombras — mostra sombras extraídas\n" +
        ",ranking — ranking\n\n" +
        "👑 Admin:\n" +
        ",adm money @user 5000\n" +
        ",adm xp @user 1000\n" +
        ",adm level @user 10\n" +
        ",adm heal @user\n" +
        ",adm reset @user\n" +
        ",adm sombras @user\n" +
        ",adm mapa @user nome do mapa"
      );
    }
  });

  client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;

    const [tipo, acao, userId] = interaction.customId.split("_");
    if (tipo !== "rpg") return;

    if (interaction.user.id !== userId) {
      return interaction.reply({ content: "Esse botão não é seu.", ephemeral: true });
    }

    const db = load();
    const p = getPlayer(db, interaction.user);

    if (acao === "arise") {
      if (p.poder.nome !== "Sombras") {
        return interaction.reply({ content: "❌ Apenas o Monarca das Sombras pode usar Arise.", ephemeral: true });
      }

      if (!p.sombraPendente) {
        return interaction.reply({ content: "❌ Não existe sombra para extrair.", ephemeral: true });
      }

      const sombra = p.sombraPendente;
      p.sombras.push(sombra);
      p.sombraPendente = null;
      save(db);

      return interaction.update({
        content:
          `🌑 **ARISE!**\n\n` +
          `O corpo do inimigo tremeu...\n` +
          `As sombras subiram do chão.\n\n` +
          `A sombra de **${sombra.nome}** foi extraída!\n` +
          `⚔️ +${sombra.ataque}\n` +
          `🛡️ +${sombra.defesa}`,
        embeds: [],
        components: []
      });
    }

    let boss = p.bossPendente;
    if (!boss) boss = bossAleatorio(p);

    if (acao === "correr") {
      p.bossPendente = null;
      p.portalPendente = null;
      p.vida = p.vidaMax;
      save(db);

      return interaction.update({
        content: "🏃 Você recuou. Sua vida foi restaurada.",
        embeds: [],
        components: []
      });
    }

    if (acao === "enfrentar") {
      const luta = narrarLuta(p, boss);

      const embed = new EmbedBuilder()
        .setColor("#8b0000")
        .setTitle(`⚔️ Boss: ${boss.nome}`);

      embed.addFields(luta.turnos.slice(0, 20));

      if (luta.morreu) {
        p.derrotas++;
        p.bossPendente = null;
        p.portalPendente = null;
        embed.addFields({ name: "☠️ Resultado", value: "Você morreu contra o boss." });
      } else if (luta.venceu) {
        embed.addFields({ name: "🏆 Recompensa", value: recompensa(p, boss, true) });

        if (p.portalPendente && boss.portalMapa) {
          if (!p.mapasLiberados.includes(boss.portalMapa)) p.mapasLiberados.push(boss.portalMapa);
          p.mapaAtual = boss.portalMapa;
          embed.addFields({ name: "🗺️ MAPA LIBERADO", value: `Você liberou e viajou para **${boss.portalMapa}**!` });
        }

        p.bossPendente = null;
        p.portalPendente = null;

        if (p.poder.nome === "Sombras") {
          p.sombraPendente = {
            nome: boss.nome,
            ataque: Math.floor(boss.ataque * 0.25),
            defesa: Math.floor(boss.defesa * 0.25)
          };

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`rpg_arise_${interaction.user.id}`)
              .setLabel("Arise")
              .setStyle(ButtonStyle.Primary)
              .setEmoji("🌑")
          );

          p.vida = p.vidaMax;
          save(db);

          return interaction.update({
            embeds: [embed],
            components: [row]
          });
        }
      } else {
        embed.addFields({ name: "🏃 Resultado", value: "Você resistiu, mas precisou recuar." });
      }

      p.vida = p.vidaMax;
      save(db);

      return interaction.update({
        embeds: [embed],
        components: []
      });
    }
  });
};
