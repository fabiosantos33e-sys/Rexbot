const fs = require("fs");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const FILE = "./rpgdb.json";
const NIVEL_MAX = 400;
const VIDA_MAXIMA = 50000;
const ADMINS = ["1053803800340746261"];

const rarity = {
  Comum: { emoji: "⚪", color: "#bdbdbd" },
  Incomum: { emoji: "🟢", color: "#2ecc71" },
  Rara: { emoji: "🔵", color: "#3498db" },
  Épica: { emoji: "🟣", color: "#9b59b6" },
  Lendária: { emoji: "🟡", color: "#f1c40f" },
  Mítica: { emoji: "🔴", color: "#e74c3c" },
  Sombria: { emoji: "🌑", color: "#2b003d" }
};

const classes = {
  espadachim: {
    nome: "Espadachim Sombrio",
    emoji: "⚔️",
    atk: 140,
    def: 45,
    vida: 350,
    desc: "Dano alto com espada e golpes rápidos.",
    habilidades: ["Corte Sombrio", "Lâmina Fantasma", "Execução Negra"]
  },
  necromante: {
    nome: "Necromante",
    emoji: "🌑",
    atk: 90,
    def: 100,
    vida: 500,
    desc: "Controle de sombras, resistência e invocação.",
    habilidades: ["Toque Sombrio", "Selo da Morte", "Invocação Negra"]
  },
  berserker: {
    nome: "Berserker",
    emoji: "🩸",
    atk: 220,
    def: 20,
    vida: 650,
    desc: "Dano bruto e fúria em batalha.",
    habilidades: ["Fúria Sangrenta", "Impacto Brutal", "Grito de Guerra"]
  },
  mago: {
    nome: "Mago Arcano",
    emoji: "🔮",
    atk: 180,
    def: 35,
    vida: 280,
    desc: "Magia explosiva e ataques elementais.",
    habilidades: ["Rajada Arcana", "Explosão Mística", "Selo Elemental"]
  },
  cacador: {
    nome: "Caçador",
    emoji: "🏹",
    atk: 120,
    def: 70,
    vida: 420,
    desc: "Classe equilibrada com precisão e velocidade.",
    habilidades: ["Disparo Fatal", "Passo Rápido", "Golpe Preciso"]
  }
};

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
  def: 2500,
  ultimate: {
    nome: "🌑 DOMÍNIO DO MONARCA",
    chance: 0.08,
    multiplicador: 4,
    imagem: "https://cdn.discordapp.com/attachments/1495896642904129676/1509668361364312196/solo-leveling-monarch.gif"
  }
};

const poderGojo = {
  nome: "Infinito",
  emoji: "🔵",
  ataques: ["Azul", "Vermelho", "Vazio Roxo", "Infinito Defensivo"],
  atk: 2800,
  def: 3200,
  ultimate: {
    nome: "🔵 EXPANSÃO DE DOMÍNIO: INFINITO ABSOLUTO",
    chance: 0.08,
    multiplicador: 4,
    imagem: "https://cdn.discordapp.com/attachments/1495896642904129676/1509690086365855805/gojo-satoru-jujutsu-kaisen.webp"
  }
};

const poderSukuna = {
  nome: "Maldição Real",
  emoji: "⛩️",
  ataques: ["Corte Desmantelador", "Corte Divisor", "Fulga", "Lâmina Amaldiçoada"],
  atk: 3400,
  def: 2200,
  ultimate: {
    nome: "⛩️ EXPANSÃO DE DOMÍNIO: SANTUÁRIO AMALDIÇOADO",
    chance: 0.08,
    multiplicador: 4,
    imagem: "https://cdn.discordapp.com/attachments/1495896642904129676/1509690086613057758/jujutsu-kaisen-ryoumen-sukuna.webp"
  }
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
  { nome: "Trono do Monarca", min: 350, emoji: "👑" },
  { nome: "Fenda do Vazio", min: 380, emoji: "🌀" },
  { nome: "Domínio Final", min: 400, emoji: "🔱" }
];

const loja = {
  espada_ferro: { nome: "Espada de Ferro", tipo: "arma", preco: 500, ataque: 60, raridade: "Comum" },
  adaga_dupla: { nome: "Adaga Dupla", tipo: "arma", preco: 1600, ataque: 160, raridade: "Rara", habilidade: "Dança das Lâminas" },
  espada_demon: { nome: "Espada Demoníaca", tipo: "arma", preco: 5000, ataque: 420, raridade: "Épica", habilidade: "Corte Demoníaco" },
  katana_sombria: { nome: "Katana Sombria", tipo: "arma", preco: 7000, ataque: 520, raridade: "Épica", habilidade: "Corte da Lua Negra" },
  foice_eclipse: { nome: "Foice do Eclipse", tipo: "arma", preco: 12000, ataque: 700, raridade: "Lendária", habilidade: "Ceifador Lunar" },
  armadura_sombra: { nome: "Armadura Sombria", tipo: "armadura", preco: 3500, defesa: 260, raridade: "Épica" },
  couraca_rank_s: { nome: "Couraça do Caçador Rank S", tipo: "armadura", preco: 9500, defesa: 520, raridade: "Lendária" },
  armadura_monarca: { nome: "Armadura do Monarca", tipo: "armadura", preco: 18000, defesa: 850, raridade: "Mítica" }
};

function load() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({
      jogadores: {},
      guildas: {},
      eventoGlobal: null
    }, null, 2));
  }

  const db = JSON.parse(fs.readFileSync(FILE, "utf8"));
  if (!db.jogadores) db.jogadores = {};
  if (!db.guildas) db.guildas = {};
  if (!("eventoGlobal" in db)) db.eventoGlobal = null;

  return db;
}

function save(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function raridadeTexto(nome) {
  const r = rarity[nome] || rarity.Comum;
  return `${r.emoji} ${nome || "Comum"}`;
}

function corRaridade(nome) {
  return (rarity[nome] || rarity.Comum).color;
}

function barra(atual, max) {
  const total = 12;
  const cheios = Math.max(0, Math.min(total, Math.round((atual / max) * total)));
  return "█".repeat(cheios) + "░".repeat(total - cheios);
}

function isAdmin(id) {
  return ADMINS.includes(id);
}

function responder(message, resposta) {
  if (typeof resposta === "string") {
    const descricao = resposta.length > 4000 ? resposta.slice(0, 3990) + "…" : resposta;
    const embed = new EmbedBuilder()
      .setColor("#17131f")
      .setDescription(descricao)
      .setFooter({ text: "Mostrinho RPG • Sistema de Caçadores" })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  if (resposta && typeof resposta === "object" && resposta.content && !resposta.embeds?.length) {
    const { content, ...opcoes } = resposta;
    const descricao = String(content).length > 4000
      ? String(content).slice(0, 3990) + "…"
      : String(content);

    const embed = new EmbedBuilder()
      .setColor("#17131f")
      .setDescription(descricao)
      .setFooter({ text: "Mostrinho RPG • Sistema de Caçadores" })
      .setTimestamp();

    return message.reply({ ...opcoes, embeds: [embed] });
  }

  return message.reply(resposta);
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
    classe: null,
    guilda: null,
    mapaAtual: "Floresta Sombria",
    mapasLiberados: ["Floresta Sombria"],
    inventario: [],
    equipado: { arma: null, armadura: null },
    sombras: [],
    sombraPendente: null,
    bossPendente: null,
    portalPendente: null,
    vitorias: 0,
    derrotas: 0,
    eventosParticipados: 0
  };
}

function getPlayer(db, user) {
  if (!db.jogadores[user.id]) {
    db.jogadores[user.id] = criarPlayer(user);
  }

  const p = db.jogadores[user.id];

  if (!p.inventario) p.inventario = [];
  if (!p.equipado) p.equipado = { arma: null, armadura: null };
  if (!p.mapasLiberados) p.mapasLiberados = ["Floresta Sombria"];
  if (!p.sombras) p.sombras = [];
  if (!p.sombraPendente) p.sombraPendente = null;
  if (!p.vidaMax) p.vidaMax = 600;
  if (!p.ataqueBase) p.ataqueBase = 80;
  if (!p.defesaBase) p.defesaBase = 35;
  if (!p.mapaAtual) p.mapaAtual = "Floresta Sombria";
  if (typeof p.moedas !== "number") p.moedas = 500;
  if (typeof p.nivel !== "number") p.nivel = 1;
  if (typeof p.xp !== "number") p.xp = 0;

  p.inventario = p.inventario.filter(item =>
    item && (item.tipo === "arma" || item.tipo === "armadura" ||
      typeof item.ataque === "number" || typeof item.defesa === "number")
  ).map(item => ({
    ...item,
    tipo: item.tipo || (typeof item.ataque === "number" ? "arma" : "armadura")
  }));

  if (!p.poder) p.poder = rand(poderesNormais);

  return p;
}

function ataqueTotal(p) {
  const classe = p.classe ? classes[p.classe] : null;
  const arma = p.equipado.arma;
  const sombras = (p.sombras || []).reduce((s, x) => s + (x.ataque || 0), 0);

  return p.ataqueBase +
    (classe?.atk || 0) +
    (p.poder?.atk || 0) +
    (arma?.ataque || 0) +
    sombras;
}

function defesaTotal(p) {
  const classe = p.classe ? classes[p.classe] : null;
  const armadura = p.equipado.armadura;
  const sombras = (p.sombras || []).reduce((s, x) => s + (x.defesa || 0), 0);

  return p.defesaBase +
    (classe?.def || 0) +
    (p.poder?.def || 0) +
    (armadura?.defesa || 0) +
    sombras;
}

function vidaTotal(p) {
  const classe = p.classe ? classes[p.classe] : null;
  return Math.min(VIDA_MAXIMA, p.vidaMax + (classe?.vida || 0));
}

function xpNecessario(nivel) {
  return Math.floor(150 + nivel * 65 + Math.pow(nivel, 1.45) * 8);
}

function subirNivel(p) {
  const subidas = [];

  while (p.nivel < NIVEL_MAX && p.xp >= xpNecessario(p.nivel)) {
    p.xp -= xpNecessario(p.nivel);
    p.nivel++;
    p.vidaMax += 25;
    p.ataqueBase += 12;
    p.defesaBase += 7;
    p.vida = vidaTotal(p);
    subidas.push(p.nivel);

    const mapa = mapas.filter(m => m.min <= p.nivel).at(-1);
    if (mapa && !p.mapasLiberados.includes(mapa.nome)) {
      p.mapasLiberados.push(mapa.nome);
    }
  }

  return subidas;
}

function mapaDoNivel(nivel) {
  return mapas.filter(m => m.min <= nivel).at(-1) || mapas[0];
}

const monstrosPorMapa = {
  "Floresta Sombria": [
    { nome: "Lobo Cinzento", emoji: "🐺", raridade: "Comum", vida: 1, ataque: 1, defesa: 1, narrativa: "Um rosnado rompe o silêncio entre as árvores." },
    { nome: "Goblin das Raízes", emoji: "👺", raridade: "Comum", vida: 0.9, ataque: 1.1, defesa: 0.8, narrativa: "Um goblin salta de trás das raízes, empunhando uma lâmina enferrujada." },
    { nome: "Corvo Corrompido", emoji: "🐦‍⬛", raridade: "Incomum", vida: 0.7, ataque: 1.4, defesa: 0.7, narrativa: "Uma criatura de penas negras mergulha em sua direção." },
    { nome: "Ent Enfurecido", emoji: "🌳", raridade: "Rara", vida: 1.8, ataque: 1.1, defesa: 1.7, narrativa: "O chão estremece quando uma árvore desperta para a batalha." }
  ],
  "Caverna dos Lobos": [
    { nome: "Lobo das Cavernas", emoji: "🐺", raridade: "Comum", vida: 1.1, ataque: 1.2, defesa: 0.9, narrativa: "Olhos brilhantes surgem na escuridão da caverna." },
    { nome: "Morcego Sanguinário", emoji: "🦇", raridade: "Incomum", vida: 0.8, ataque: 1.5, defesa: 0.8, narrativa: "Um enxame de asas negras cobre o teto." }
  ]
};

function inimigoPorNivel(p) {
  const mapa = mapaDoNivel(p.nivel);
  const lista = monstrosPorMapa[mapa.nome] || monstrosPorMapa["Floresta Sombria"];
  const base = rand(lista);
  const escala = 1 + p.nivel * 0.15;

  return {
    ...base,
    vida: Math.floor(400 * base.vida * escala),
    ataque: Math.floor(50 * base.ataque * escala),
    defesa: Math.floor(20 * base.defesa * escala)
  };
}

function bossAleatorio(p) {
  return {
    nome: `Guardião de ${mapaDoNivel(p.nivel).nome}`,
    emoji: "👹",
    vida: Math.floor(1200 * (1 + p.nivel * 0.2)),
    ataque: Math.floor(100 * (1 + p.nivel * 0.15)),
    defesa: Math.floor(45 * (1 + p.nivel * 0.1)),
    frase: "Seu caminho termina aqui, caçador."
  };
}

function eventoBonus(db) {
  const evento = db.eventoGlobal;

  if (!evento || !evento.ativo || evento.terminaEm < Date.now()) {
    return { xp: 1, moedas: 1, drop: 0 };
  }

  return {
    xp: evento.xp || 1,
    moedas: evento.moedas || 1,
    drop: evento.drop || 0
  };
}

function recompensa(db, p, inimigo, boss = false) {
  const bonus = eventoBonus(db);
  const xp = Math.floor((boss ? 500 : 100) * (1 + p.nivel * 0.1) * bonus.xp);
  const moedas = Math.floor((boss ? 800 : 150) * bonus.moedas);

  p.xp += xp;
  p.moedas += moedas;
  p.vitorias = (p.vitorias || 0) + 1;

  const subidas = subirNivel(p);
  const textoNivel = subidas.length
    ? `\n\n🎉 **Nível aumentado:** ${subidas.join(", ")}`
    : "";

  save(db);

  return `✨ XP: **+${xp}**\n💰 Moedas: **+${moedas}**${textoNivel}`;
}

function narrarLuta(p, inimigo) {
  let vidaJogador = p.vida;
  let vidaInimigo = inimigo.vida;
  const turnos = [];
  let rodada = 0;

  while (vidaJogador > 0 && vidaInimigo > 0 && rodada < 10) {
    rodada++;

    const dano = Math.max(1, ataqueTotal(p) - (inimigo.defesa || 0));
    vidaInimigo -= dano;

    turnos.push({
      name: `⚔️ Rodada ${rodada} — ${p.nome}`,
      value: `Você ataca **${inimigo.nome}** e causa **${dano}** de dano.\n❤️ Vida do inimigo: ${Math.max(0, vidaInimigo)}`
    });

    if (vidaInimigo <= 0) break;

    const danoInimigo = Math.max(1, (inimigo.ataque || 0) - defesaTotal(p));
    vidaJogador -= danoInimigo;

    turnos.push({
      name: `🩸 Contra-ataque de ${inimigo.nome}`,
      value: `O inimigo revida e causa **${danoInimigo}** de dano.\n❤️ Sua vida: ${Math.max(0, vidaJogador)}`
    });
  }

  return {
    turnos,
    venceu: vidaInimigo <= 0,
    morreu: vidaJogador <= 0,
    vidaJogador: Math.max(0, vidaJogador),
    vidaInimigo: Math.max(0, vidaInimigo)
  };
}

function criarEmbed(titulo, descricao, cor = "#17131f") {
  return new EmbedBuilder()
    .setColor(cor)
    .setTitle(titulo)
    .setDescription(descricao)
    .setFooter({ text: "Mostrinho RPG • Sistema de Caçadores" })
    .setTimestamp();
}

module.exports = client => {
  client.on("messageCreate", async message => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(",")) return;

    const args = message.content.slice(1).trim().split(/\s+/);
    const cmd = (args.shift() || "").toLowerCase();

    const db = load();
    const p = getPlayer(db, message.author);

    if (cmd === "criar") {
      if (db.jogadores[message.author.id]) {
        return responder(message, "Você já possui um personagem! Use **,perfil** para ver seus dados.");
      }

      db.jogadores[message.author.id] = criarPlayer(message.author);
      save(db);

      return responder(message, {
        embeds: [
          criarEmbed(
            "🌑 CAÇADOR REGISTRADO",
            `**${message.author.username}**, sua jornada começou.\n\n` +
            `✨ Você recebeu um poder inicial: **${db.jogadores[message.author.id].poder.nome}**.\n` +
            `❤️ Vida: 600\n⚔️ Ataque base: 80\n🛡️ Defesa base: 35\n💰 Moedas: 500\n\n` +
            "Use **,classes** para conhecer as classes e **,caçar** para enfrentar seu primeiro monstro."
          )
        ]
      });
    }

    if (cmd === "perfil") {
      const arma = p.equipado?.arma;
      const armadura = p.equipado?.armadura;
      const classeData = p.classe ? classes[p.classe] : null;
      const classeNome = classeData ? `${classeData.emoji} ${classeData.nome}` : "⚪ Sem classe";
      const poder = p.poder || { nome: "Desconhecido", emoji: "✨" };
      const vidaMax = Math.max(1, vidaTotal(p));
      const xpMax = Math.max(1, xpNecessario(p.nivel));
      const vidaAtual = Math.max(0, Math.min(p.vida, vidaMax));
      const xpAtual = Math.max(0, p.xp || 0);
      const vidaPct = Math.round((vidaAtual / vidaMax) * 100);
      const xpPct = Math.min(100, Math.round((xpAtual / xpMax) * 100));
      const mapa = mapaDoNivel(p.nivel);
      const titulo = p.nivel >= 400 ? "👑 MONARCA SUPREMO" :
        p.nivel >= 300 ? "🔱 CAÇADOR LENDÁRIO" :
        p.nivel >= 200 ? "🌌 CAÇADOR DE ELITE" :
        p.nivel >= 100 ? "⚔️ CAÇADOR VETERANO" :
        p.nivel >= 50 ? "🛡️ CAÇADOR EXPERIENTE" : "🌱 CAÇADOR INICIANTE";
      const guilda = p.guilda && db.guildas[p.guilda] ? db.guildas[p.guilda] : null;

      const embed = new EmbedBuilder()
        .setColor(classeData ? corRaridade(classeData.nome === "Necromante" ? "Sombria" : "Épica") : "#17131f")
        .setAuthor({
          name: `FICHA DO CAÇADOR • ${message.author.username}`,
          iconURL: message.author.displayAvatarURL({ size: 128 })
        })
        .setTitle(`${p.poder?.emoji || "🌑"} ${p.nome}`)
        .setDescription(
          `> **${titulo}**\n` +
          `> *Sua lenda é construída a cada batalha.*\n\n` +
          `**📈 PROGRESSO DE NÍVEL**  •  **Nível ${p.nivel}/${NIVEL_MAX}**\n` +
          `\`${barra(xpAtual, xpMax)}\`  **${xpPct}%**\n` +
          `✨ ${xpAtual.toLocaleString("pt-BR")} / ${xpMax.toLocaleString("pt-BR")} XP\n\n` +
          `**❤️ VITALIDADE**  •  **${vidaPct}%**\n` +
          `\`${barra(vidaAtual, vidaMax)}\`\n` +
          `❤️ ${vidaAtual.toLocaleString("pt-BR")} / ${vidaMax.toLocaleString("pt-BR")} HP`
        )
        .setThumbnail(message.author.displayAvatarURL({ size: 512 }))
        .addFields(
          {
            name: "⚔️ PODER DE COMBATE",
            value: `**Ataque**\n\`${ataqueTotal(p).toLocaleString("pt-BR")} ATK\`\n\n**Defesa**\n\`${defesaTotal(p).toLocaleString("pt-BR")} DEF\``,
            inline: true
          },
          {
            name: "🧬 IDENTIDADE",
            value: `**Classe:** ${classeNome}\n**Poder:** ${poder.emoji || "✨"} ${poder.nome}\n**Mapa:** ${mapa.emoji} ${mapa.nome}`,
            inline: true
          },
          {
            name: "🎒 EQUIPAMENTO ATIVO",
            value:
              `⚔️ **Arma**\n${arma ? `${raridadeTexto(arma.raridade)} **${arma.nome}**\n└ +${(arma.ataque || 0).toLocaleString("pt-BR")} ATK` : "└ Nenhuma arma equipada"}\n\n` +
              `🛡️ **Armadura**\n${armadura ? `${raridadeTexto(armadura.raridade)} **${armadura.nome}**\n└ +${(armadura.defesa || 0).toLocaleString("pt-BR")} DEF` : "└ Nenhuma armadura equipada"}`,
            inline: false
          },
          {
            name: "🏆 HISTÓRICO DO CAÇADOR",
            value: `🏅 **Vitórias:** ${(p.vitorias || 0).toLocaleString("pt-BR")}\n☠️ **Derrotas:** ${(p.derrotas || 0).toLocaleString("pt-BR")}\n🎒 **Itens no inventário:** ${(p.inventario || []).length}\n🌑 **Sombras:** ${(p.sombras || []).length}`,
            inline: true
          },
          {
            name: "💰 RECURSOS",
            value: `🪙 **${(p.moedas || 0).toLocaleString("pt-BR")} moedas**\n✨ **${(p.xpTotal || 0).toLocaleString("pt-BR")} XP acumulado**`,
            inline: true
          },
          {
            name: "🏰 GUILDA",
            value: guilda ? `**${guilda.nome}**\n👥 ${(guilda.membros || []).length} membro(s)` : "Você ainda não faz parte de uma guilda.",
            inline: false
          }
        )
        .setFooter({
          text: "MOSTRINHO RPG • Sistema de Caçadores",
          iconURL: message.client.user.displayAvatarURL()
        })
        .setTimestamp();

      return responder(message, { embeds: [embed] });
    }

    if (cmd === "classes") {
      const descricao = Object.entries(classes).map(([id, c]) =>
        `**${c.emoji} ${c.nome}** — \`,classe escolher ${id}\`\n${c.desc}\n⚔️ ${c.atk} ATK | 🛡️ ${c.def} DEF | ❤️ ${c.vida} VIDA`
      ).join("\n\n");

      return responder(message, {
        embeds: [criarEmbed("⚔️ CLASSES DISPONÍVEIS", descricao)]
      });
    }

    if (cmd === "classe") {
      if (args[0] !== "escolher") {
        return responder(message, "Use **,classe escolher nome**. Veja as opções com **,classes**.");
      }

      const id = (args[1] || "").toLowerCase();
      if (!classes[id]) return responder(message, "Classe inválida. Use **,classes** para consultar as opções.");

      if (p.classe) return responder(message, "Você já escolheu uma classe. Não é possível trocar normalmente.");

      p.classe = id;
      p.vida = vidaTotal(p);
      save(db);

      return responder(message, {
        embeds: [criarEmbed("⚔️ CLASSE ESCOLHIDA", `Você agora é **${classes[id].nome}**!\n\n${classes[id].desc}\n\nHabilidades: ${classes[id].habilidades.join(", ")}`)]
      });
    }

    if (cmd === "caçar" || cmd === "cacar") {
      if (p.bossPendente) {
        return responder(message, "Você já possui um confronto pendente. Use os botões da batalha anterior.");
      }

      const bonus = eventoBonus(db);
      const inimigo = inimigoPorNivel(p);
      const chanceBoss = Math.random() < 0.12;

      if (chanceBoss) {
        const boss = bossAleatorio(p);
        p.bossPendente = boss;
        save(db);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`rpg_enfrentar_${message.author.id}`)
            .setLabel("Enfrentar Boss")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId(`rpg_correr_${message.author.id}`)
            .setLabel("Recuar")
            .setStyle(ButtonStyle.Secondary)
        );

        return responder(message, {
          embeds: [criarEmbed(
            `👹 BOSS ENCONTRADO: ${boss.nome}`,
            `${boss.emoji} **${boss.frase}**\n\n` +
            `❤️ Vida: ${boss.vida}\n⚔️ Ataque: ${boss.ataque}\n🛡️ Defesa: ${boss.defesa}\n\n` +
            "Escolha sua ação com os botões abaixo."
          )],
          components: [row]
        });
      }

      const luta = narrarLuta(p, inimigo);
      const embed = criarEmbed(
        `${inimigo.emoji} DUNGEON: ${inimigo.nome}`,
        `${inimigo.narrativa}\n\n` +
        `❤️ Vida do inimigo: ${inimigo.vida}\n⚔️ Ataque: ${inimigo.ataque}\n🛡️ Defesa: ${inimigo.defesa}`
      );

      embed.addFields(luta.turnos.slice(0, 20));

      if (luta.venceu) {
        p.vida = vidaTotal(p);
        const texto = recompensa(db, p, inimigo, false);
        embed.addFields({ name: "🏆 VITÓRIA", value: texto });
      } else {
        p.derrotas++;
        p.vida = vidaTotal(p);
        embed.addFields({
          name: "☠️ DERROTA",
          value: "O inimigo foi mais forte desta vez. Sua vida foi restaurada para a próxima batalha."
        });
        save(db);
      }

      return responder(message, { embeds: [embed] });
    }

    if (cmd === "ranking") {
      const ranking = Object.entries(db.jogadores)
        .sort((a, b) => b[1].nivel - a[1].nivel || b[1].xp - a[1].xp)
        .slice(0, 10);

      const descricao = ranking.length
        ? ranking.map(([id, jogador], i) =>
          `**${i + 1}.** ${jogador.nome} — Nível **${jogador.nivel}** | ✨ ${jogador.xp} XP`
        ).join("\n")
        : "Ainda não existem caçadores no ranking.";

      return responder(message, {
        embeds: [criarEmbed("🏆 RANKING DOS CAÇADORES", descricao)]
      });
    }

    if (cmd === "sombras") {
      if (p.poder.nome !== "Sombras") {
        return responder(message, "🌑 Apenas o Monarca das Sombras pode consultar seu exército.");
      }

      const descricao = p.sombras.length
        ? p.sombras.map((s, i) =>
          `**${i + 1}. ${s.nome}**\n⚔️ +${s.ataque} ATK | 🛡️ +${s.defesa} DEF`
        ).join("\n\n")
        : "Seu exército ainda está vazio. Derrote um boss e use **Arise** para extrair a sombra.";

      return responder(message, {
        embeds: [criarEmbed("🌑 EXÉRCITO DAS SOMBRAS", descricao)]
      });
    }

    if (cmd === "mapas") {
      const descricao = mapas.map(m => {
        const liberado = p.mapasLiberados.includes(m.nome);
        return `${liberado ? "🟢" : "🔒"} ${m.emoji} **${m.nome}** — Nível ${m.min}`;
      }).join("\n");

      return responder(message, {
        embeds: [criarEmbed("🗺️ MAPAS DO MUNDO", descricao)]
      });
    }

    if (cmd === "abrirmapa") {
      const proximo = mapas.find(m => !p.mapasLiberados.includes(m.nome));

      if (!proximo) {
        return responder(message, "🏆 Você já liberou todos os mapas!");
      }

      if (p.nivel < proximo.min) {
        return responder(message, `🔒 Você precisa alcançar o nível **${proximo.min}** para desafiar o guardião de **${proximo.nome}**.`);
      }

      const boss = {
        nome: `Guardião de ${proximo.nome}`,
        emoji: "👑",
        vida: Math.floor(2000 * (1 + p.nivel * 0.25)),
        ataque: Math.floor(150 * (1 + p.nivel * 0.15)),
        defesa: Math.floor(80 * (1 + p.nivel * 0.1)),
        frase: `Você não passará para ${proximo.nome} sem provar seu valor!`,
        portalMapa: proximo.nome
      };

      p.bossPendente = boss;
      p.portalPendente = true;
      save(db);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`rpg_enfrentar_${message.author.id}`)
          .setLabel("Desafiar guardião")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`rpg_correr_${message.author.id}`)
          .setLabel("Recuar")
          .setStyle(ButtonStyle.Secondary)
      );

      return responder(message, {
        embeds: [criarEmbed(
          `🗝️ PORTAL: ${proximo.nome}`,
          `${boss.emoji} **${boss.frase}**\n\n` +
          `❤️ Vida: ${boss.vida}\n⚔️ Ataque: ${boss.ataque}\n🛡️ Defesa: ${boss.defesa}\n\n` +
          "Vença o guardião para liberar o próximo mapa."
        )],
        components: [row]
      });
    }

    if (cmd === "viajar") {
      const nome = args.join(" ").toLowerCase();
      const mapa = mapas.find(m => m.nome.toLowerCase().includes(nome));

      if (!mapa) return responder(message, "Mapa não encontrado. Use **,mapas**.");
      if (!p.mapasLiberados.includes(mapa.nome)) return responder(message, "🔒 Esse mapa ainda está bloqueado.");
      if (p.nivel < mapa.min) return responder(message, `Você precisa estar no nível ${mapa.min}.`);

      p.mapaAtual = mapa.nome;
      save(db);

      return responder(message, {
        embeds: [criarEmbed("🗺️ VIAGEM CONCLUÍDA", `Você viajou para **${mapa.emoji} ${mapa.nome}**.`)]
      });
    }

    if (cmd === "inventario") {
      const itens = p.inventario;

      const descricao = itens.length
        ? itens.map((item, i) =>
          `**${i + 1}.** ${raridadeTexto(item.raridade)} **${item.nome}**\n` +
          `${item.tipo === "arma" ? `⚔️ +${item.ataque || 0} ATK` : `🛡️ +${item.defesa || 0} DEF`}`
        ).join("\n\n")
        : "Seu inventário está vazio. Visite a loja para comprar equipamentos.";

      return responder(message, {
        embeds: [criarEmbed("🎒 INVENTÁRIO", descricao)]
      });
    }

    if (cmd === "equipar") {
      const indice = parseInt(args[0]) - 1;
      const item = p.inventario[indice];

      if (!item) return responder(message, "Item não encontrado. Use **,inventario** para ver os números.");

      if (item.tipo === "arma") {
        p.equipado.arma = item;
      } else {
        p.equipado.armadura = item;
      }

      save(db);

      return responder(message, {
        embeds: [criarEmbed(
          "🎒 EQUIPAMENTO ALTERADO",
          `${raridadeTexto(item.raridade)} **${item.nome}** foi equipado com sucesso!`
        )]
      });
    }

    if (cmd === "loja") {
      const descricao = Object.entries(loja).map(([id, item]) =>
        `**${raridadeTexto(item.raridade)} ${item.nome}**\n` +
        `${item.tipo === "arma" ? `⚔️ +${item.ataque} ATK` : `🛡️ +${item.defesa} DEF`}\n` +
        `💰 ${item.preco} moedas\nComando: \`,comprar ${id}\``
      ).join("\n\n");

      return responder(message, {
        embeds: [criarEmbed("🏪 LOJA DE EQUIPAMENTOS", descricao)]
      });
    }

    if (cmd === "comprar") {
      const id = (args[0] || "").toLowerCase();
      const item = loja[id];

      if (!item) return responder(message, "Esse item não existe na loja. Use **,loja**.");
      if (p.moedas < item.preco) return responder(message, `Você precisa de **${item.preco} moedas** para comprar esse item.`);

      p.moedas -= item.preco;
      p.inventario.push({ ...item });
      save(db);

      return responder(message, {
        embeds: [criarEmbed(
          "🛍️ COMPRA REALIZADA",
          `Você comprou ${raridadeTexto(item.raridade)} **${item.nome}**!\n\n` +
          `💰 Saldo restante: **${p.moedas} moedas**`
        )]
      });
    }

    if (cmd === "ultimate") {
      if (!p.poder.ultimate) return responder(message, "❌ Você não possui ultimate.");

      const ultimate = p.poder.ultimate;
      if (Math.random() > ultimate.chance) {
        return responder(message, `🌌 Você tentou ativar **${ultimate.nome}**, mas o poder não respondeu desta vez.`);
      }

      const dano = Math.floor(ataqueTotal(p) * ultimate.multiplicador);
      const embed = criarEmbed(
        ultimate.nome,
        `O ambiente inteiro tremeu quando seu poder foi liberado.\n\n` +
        `💥 Dano especial: **${dano}**\n` +
        `⚡ Seu poder foi ativado com sucesso!`
      );

      if (ultimate.imagem) embed.setImage(ultimate.imagem);

      return responder(message, { embeds: [embed] });
    }

    if (cmd === "treinar") {
      const tipo = (args[0] || "").toLowerCase();
      const pontos = Math.max(1, Math.min(10, parseInt(args[1]) || 1));
      const custo = pontos * 100;

      if (p.moedas < custo) return responder(message, `Você precisa de ${custo} moedas para treinar.`);

      if (!["forca", "vida", "defesa"].includes(tipo)) {
        return responder(message, "Use **,treinar forca 10**, **,treinar vida 10** ou **,treinar defesa 10**.");
      }

      p.moedas -= custo;

      if (tipo === "forca") p.ataqueBase += pontos * 5;
      if (tipo === "vida") {
        p.vidaMax += pontos * 20;
        p.vida = vidaTotal(p);
      }
      if (tipo === "defesa") p.defesaBase += pontos * 4;

      save(db);

      return responder(message, `🏋️ Treinamento concluído!\n\nAtributo: **${tipo}**\nPontos: **${pontos}**\n💰 Custo: ${custo} moedas.`);
    }

    if (cmd === "adm") {
      if (!isAdmin(message.author.id)) return;

      const acao = args[0];
      const membro = message.mentions.users.first();
      const valor = parseInt(args[2]);

      if (acao === "evento") {
        const tipo = args[1];

        if (tipo === "clear") {
          db.eventoGlobal = null;
          save(db);
          return responder(message, "🌌 Evento global removido.");
        }

        const eventos = {
          eclipse: { nome: "Eclipse Sombrio", xp: 1.4, moedas: 1.1, drop: 8 },
          mana: { nome: "Chuva de Mana", xp: 1.2, moedas: 1.3, drop: 5 },
          raid: { nome: "Presságio de Raid Mundial", xp: 1.6, moedas: 1.2, drop: 10 }
        };

        if (!eventos[tipo]) {
          return responder(message, "Use: **,adm evento eclipse**, **mana**, **raid** ou **clear**");
        }

        db.eventoGlobal = {
          ativo: true,
          ...eventos[tipo],
          terminaEm: Date.now() + 60 * 60 * 1000
        };

        save(db);
        return responder(message, `🌌 Evento **${eventos[tipo].nome}** iniciado por 1 hora.`);
      }

      if (!membro) return responder(message, "Use: **,adm money @user 500**");
      const alvo = getPlayer(db, membro);

      if (acao === "money") alvo.moedas += valor;
      else if (acao === "xp") alvo.xp += valor;
      else if (acao === "level") alvo.nivel = Math.min(NIVEL_MAX, alvo.nivel + valor);
      else if (acao === "heal") alvo.vida = vidaTotal(alvo);
      else if (acao === "reset") delete db.jogadores[membro.id];
      else if (acao === "sombras") alvo.poder = poderSombras;
      else if (acao === "gojo") alvo.poder = poderGojo;
      else if (acao === "sukuna") alvo.poder = poderSukuna;
      else if (acao === "classe") alvo.classe = null;
      else if (acao === "mapa") {
        const nomeMapa = args.slice(2).join(" ").toLowerCase();
        const mapa = mapas.find(m => m.nome.toLowerCase().includes(nomeMapa));
        if (!mapa) return responder(message, "Mapa não encontrado.");
        if (!alvo.mapasLiberados.includes(mapa.nome)) alvo.mapasLiberados.push(mapa.nome);
      } else {
        return responder(message, "Ação inválida: money, xp, level, heal, reset, sombras, gojo, sukuna, classe, mapa, evento");
      }

      save(db);
      return responder(message, `👑 Admin executou **${acao}** em ${membro}`);
    }

    if (cmd === "rpghelp" || cmd === "help") {
      const embed = criarEmbed(
        "🌑  RPG — GUIA",
        `O Mostrinho RPG é um RPG estilo anime dentro do Discord.\n` +
        `Você cria um caçador, escolhe uma classe, luta em dungeons, libera mapas, entra em guildas e enfrenta bosses cinematográficos.\n\n` +
        `👤 **Começo**\n` +
        `,criar — cria personagem\n` +
        `,perfil — mostra seu perfil\n` +
        `,classes — lista classes\n` +
        `,classe escolher id — escolhe sua classe\n\n` +
        `⚔️ **Combate**\n` +
        `,caçar — entra em dungeon e luta\n` +
        `,sombras — mostra sombras extraídas\n` +
        `,ultimate — tenta ativar seu poder supremo\n` +
        `,ranking — ranking global\n\n` +
        `🗺️ **Mapas**\n` +
        `,mapas — mostra mapas\n` +
        `,abrirmapa — enfrenta guardião para liberar mapa\n` +
        `,viajar nome — viaja para mapa liberado\n\n` +
        `🎒 **Equipamentos**\n` +
        `,inventario — mostra equipamentos\n` +
        `,equipar 1 — equipa item do inventário\n` +
        `,loja — mostra loja\n` +
        `,comprar espada_ferro — compra equipamento\n\n` +
        `🏋️ **Treino**\n` +
        `,treinar forca 10\n` +
        `,treinar vida 10\n` +
        `,treinar defesa 10\n\n` +
        `🏰 **Guildas**\n` +
        `,guild criar nome\n` +
        `,guild entrar nome\n` +
        `,guild sair\n` +
        `,guild info\n` +
        `,guild ranking\n\n` +
        `🌌 **Eventos**\n` +
        `,evento — mostra evento global ativo`
      );

      return responder(message, { embeds: [embed] });
    }
  });

  client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;

    const [tipo, acao, userId] = interaction.customId.split("_");
    if (tipo !== "rpg") return;

    if (interaction.user.id !== userId) {
      return interaction.reply({
        embeds: [criarEmbed("⛔ Ação não permitida", "Esse botão não pertence a você.", "#7f1d1d")],
        ephemeral: true
      });
    }

    const db = load();
    const p = getPlayer(db, interaction.user);

    if (acao === "arise") {
      if (p.poder.nome !== "Sombras") {
        return interaction.reply({
          embeds: [criarEmbed("🌑 Arise indisponível", "Apenas o Monarca das Sombras pode usar Arise.", "#7f1d1d")],
          ephemeral: true
        });
      }

      if (!p.sombraPendente) {
        return interaction.reply({
          embeds: [criarEmbed("🌑 Nenhuma sombra", "Não existe sombra pendente para extrair.", "#7f1d1d")],
          ephemeral: true
        });
      }

      const sombra = p.sombraPendente;
      p.sombras.push(sombra);
      p.sombraPendente = null;
      save(db);

      const embed = criarEmbed(
        "🌑 ARISE",
        `O corpo derrotado ficou imóvel por alguns segundos.\n` +
        `Então, a sombra dele começou a se soltar do chão.\n\n` +
        `O ar ficou pesado.\n` +
        `As paredes da dungeon tremeram.\n\n` +
        `Uma voz ecoou no silêncio:\n\n` +
        `**"ARISE."**\n\n` +
        `🌑 A sombra de **${sombra.nome}** se levantou e jurou lealdade.\n` +
        `⚔️ +${sombra.ataque}\n` +
        `🛡️ +${sombra.defesa}`
      );

      return interaction.update({
        embeds: [embed],
        components: []
      });
    }

    if (acao === "correr") {
      p.bossPendente = null;
      p.portalPendente = null;
      p.vida = vidaTotal(p);
      save(db);

      return interaction.update({
        embeds: [criarEmbed("🏃 Retirada estratégica", "Você recuou da dungeon. Sua vida foi restaurada.", "#6b7280")],
        components: []
      });
    }

    if (acao === "enfrentar") {
      const boss = p.bossPendente || bossAleatorio(p);
      const luta = narrarLuta(p, boss);

      const embed = criarEmbed(
        `⚔️ BOSS: ${boss.nome}`,
        `${boss.emoji} **${boss.frase || "O inimigo se prepara para lutar."}**`
      );

      embed.addFields(luta.turnos.slice(0, 20));

      if (luta.morreu) {
        p.derrotas++;
        p.bossPendente = null;
        p.portalPendente = null;
        embed.addFields({
          name: "☠️ Resultado",
          value: "Você caiu diante do boss. A dungeon silenciou por alguns segundos."
        });
      } else if (luta.venceu) {
        embed.addFields({
          name: "🏆 Recompensa",
          value: recompensa(db, p, boss, true)
        });

        if (p.guilda && db.guildas[p.guilda]) {
          db.guildas[p.guilda].xp += 100;
          db.guildas[p.guilda].vitorias += 1;
        }

        if (p.portalPendente && boss.portalMapa) {
          if (!p.mapasLiberados.includes(boss.portalMapa)) {
            p.mapasLiberados.push(boss.portalMapa);
          }

          p.mapaAtual = boss.portalMapa;
          embed.addFields({
            name: "🗺️ MAPA LIBERADO",
            value: `Você liberou e viajou para **${boss.portalMapa}**!`
          });
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

          p.vida = vidaTotal(p);
          save(db);

          return interaction.update({
            embeds: [embed],
            components: [row]
          });
        }
      } else {
        embed.addFields({
          name: "🏃 Resultado",
          value: "Você resistiu, mas precisou recuar."
        });
      }

      p.vida = vidaTotal(p);
      save(db);

      return interaction.update({
        embeds: [embed],
        components: []
      });
    }
  });
};
