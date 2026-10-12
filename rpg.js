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
    { nome: "Morcego Sanguinário", emoji: "🦇", raridade: "Incomum", vida: 0.8, ataque: 1.5, defesa: 0.8, narrativa: "Um enxame de asas negras cobre o teto." },
    { nome: "Urso das Rochas", emoji: "🐻", raridade: "Rara", vida: 1.7, ataque: 1.3, defesa: 1.4, narrativa: "Um urso monstruoso bloqueia a passagem." },
    { nome: "Fenrir Menor", emoji: "🌕", raridade: "Épica", vida: 2, ataque: 1.7, defesa: 1.3, narrativa: "A criatura uiva, e as paredes da caverna respondem." }
  ],
  "Ruínas do Rei Esqueleto": [
    { nome: "Esqueleto Guerreiro", emoji: "💀", raridade: "Comum", vida: 1.1, ataque: 1.1, defesa: 1.2, narrativa: "O som de ossos se montando ecoa pelas ruínas." },
    { nome: "Arqueiro Cadavérico", emoji: "🏹", raridade: "Incomum", vida: 0.8, ataque: 1.6, defesa: 0.8, narrativa: "Uma flecha atravessa a poeira e atinge o chão ao seu lado." },
    { nome: "Cavaleiro Ossudo", emoji: "☠️", raridade: "Rara", vida: 1.6, ataque: 1.3, defesa: 1.8, narrativa: "Um cavaleiro sem rosto ergue sua espada enferrujada." },
    { nome: "Mago dos Túmulos", emoji: "🧙", raridade: "Épica", vida: 1.2, ataque: 1.9, defesa: 1.2, narrativa: "Runas antigas acendem sob os pés do feiticeiro." }
  ],
  "Castelo Demoníaco": [
    { nome: "Soldado Infernal", emoji: "👹", raridade: "Comum", vida: 1.2, ataque: 1.3, defesa: 1.1, narrativa: "Um soldado demoníaco avança com a armadura em brasa." },
    { nome: "Cão Abissal", emoji: "🐕‍🦺", raridade: "Incomum", vida: 1.3, ataque: 1.5, defesa: 1, narrativa: "A criatura fareja sua presença e mostra dentes incandescentes." },
    { nome: "Bruxa Carmesim", emoji: "🩸", raridade: "Rara", vida: 1.1, ataque: 1.9, defesa: 1.2, narrativa: "Uma bruxa desenha símbolos vermelhos no ar." },
    { nome: "Cavaleiro do Inferno", emoji: "⚔️", raridade: "Épica", vida: 2, ataque: 1.7, defesa: 1.8, narrativa: "A armadura do cavaleiro range enquanto ele se aproxima." }
  ],
  "Vale do Dragão Carmesim": [
    { nome: "Lagarto de Brasa", emoji: "🦎", raridade: "Comum", vida: 1, ataque: 1.5, defesa: 1, narrativa: "Pedras incandescentes rolam sob as patas do réptil." },
    { nome: "Wyvern Jovem", emoji: "🐲", raridade: "Incomum", vida: 1.3, ataque: 1.7, defesa: 1.2, narrativa: "Uma sombra alada passa sobre o vale." },
    { nome: "Draco Carmesim", emoji: "🐉", raridade: "Rara", vida: 1.8, ataque: 1.9, defesa: 1.6, narrativa: "O rugido da criatura faz o vale inteiro tremer." },
    { nome: "Guardião Vulcânico", emoji: "🌋", raridade: "Épica", vida: 2.2, ataque: 2, defesa: 2, narrativa: "A rocha se abre, revelando um gigante coberto de lava." }
  ],
  "Dungeon Rank S": [
    { nome: "Executor Rank S", emoji: "🗡️", raridade: "Rara", vida: 1.8, ataque: 2, defesa: 1.5, narrativa: "O executor mede sua força antes de erguer a arma." },
    { nome: "Golem de Mana", emoji: "🗿", raridade: "Épica", vida: 2.5, ataque: 1.8, defesa: 2.5, narrativa: "Cristais de mana brilham no peito do golem." },
    { nome: "Assassino do Vazio", emoji: "🖤", raridade: "Lendária", vida: 1.6, ataque: 2.7, defesa: 1.4, narrativa: "Você sente uma presença atrás de si, mas não vê ninguém." }
  ],
  "Abismo Congelado": [
    { nome: "Lobo Glacial", emoji: "🐺", raridade: "Rara", vida: 1.5, ataque: 1.8, defesa: 1.6, narrativa: "O bafo da fera congela o ar à sua frente." },
    { nome: "Titã de Gelo", emoji: "🧊", raridade: "Épica", vida: 2.8, ataque: 2, defesa: 2.6, narrativa: "Uma figura colossal emerge da nevasca." },
    { nome: "Rei Glacial", emoji: "❄️", raridade: "Lendária", vida: 2.5, ataque: 2.5, defesa: 2.4, narrativa: "Uma coroa de gelo se ilumina no meio da tempestade." }
  ],
  "Reino das Sombras": [
    { nome: "Soldado das Sombras", emoji: "🌑", raridade: "Rara", vida: 1.6, ataque: 1.8, defesa: 1.7, narrativa: "Uma sombra se desprende da parede e assume forma humana." },
    { nome: "General Sombrio", emoji: "⚫", raridade: "Épica", vida: 2.4, ataque: 2.5, defesa: 2.4, narrativa: "Uma presença imponente faz as sombras se curvarem." },
    { nome: "Monarca das Cinzas", emoji: "👑", raridade: "Mítica", vida: 3, ataque: 2.8, defesa: 2.7, narrativa: "A escuridão se abre como um trono diante de você." }
  ],
  "Templo Celestial": [
    { nome: "Sentinela Celestial", emoji: "✨", raridade: "Rara", vida: 1.7, ataque: 2, defesa: 1.8, narrativa: "Uma estátua abre os olhos e desce do pedestal." },
    { nome: "Serafim Caído", emoji: "👁️", raridade: "Épica", vida: 2.4, ataque: 2.7, defesa: 2.2, narrativa: "As asas da criatura espalham luz e cinzas." },
    { nome: "Juiz Celestial", emoji: "⚖️", raridade: "Lendária", vida: 2.8, ataque: 2.8, defesa: 2.6, narrativa: "Uma voz anuncia seu julgamento antes mesmo do primeiro golpe." }
  ],
  "Trono do Monarca": [
    { nome: "Guardião do Trono", emoji: "🛡️", raridade: "Épica", vida: 2.6, ataque: 2.6, defesa: 2.8, narrativa: "O guardião ergue o escudo e bloqueia a passagem." },
    { nome: "Arauto do Monarca", emoji: "👑", raridade: "Lendária", vida: 2.7, ataque: 2.9, defesa: 2.6, narrativa: "O arauto pronuncia um nome antigo e a sala estremece." }
  ],
  "Fenda do Vazio": [
    { nome: "Devorador de Portais", emoji: "🌀", raridade: "Lendária", vida: 2.7, ataque: 3, defesa: 2.5, narrativa: "O espaço se dobra ao redor de uma criatura sem rosto." },
    { nome: "Anomalia Viva", emoji: "🔮", raridade: "Mítica", vida: 3, ataque: 3, defesa: 3, narrativa: "A realidade parece falhar quando a anomalia se aproxima." }
  ],
  "Domínio Final": [
    { nome: "Carrasco do Fim", emoji: "🔱", raridade: "Lendária", vida: 3, ataque: 3, defesa: 3, narrativa: "Uma figura colossal surge diante do último portão." },
    { nome: "Devorador de Mundos", emoji: "🌌", raridade: "Mítica", vida: 3.5, ataque: 3.3, defesa: 3, narrativa: "O céu desaparece atrás de uma presença impossível." }
  ]
};

const bosses = [
  { nome: "Lobo Alfa Sombrio", emoji: "🐺", mapa: "Floresta Sombria", min: 1, raridade: "Comum", vida: 1100, ataque: 90, defesa: 35, xp: 600, moedas: 180, frase: "A matilha sente seu medo..." },
  { nome: "Ent Corrompido", emoji: "🌲", mapa: "Floresta Sombria", min: 1, raridade: "Incomum", vida: 1300, ataque: 80, defesa: 55, xp: 650, moedas: 200, frase: "A floresta não perdoa invasores." },
  { nome: "Caçador Perdido", emoji: "🗡️", mapa: "Floresta Sombria", min: 1, raridade: "Rara", vida: 1000, ataque: 115, defesa: 30, xp: 620, moedas: 220, frase: "Eu também tentei fugir..." },
  { nome: "Fenrir Jovem", emoji: "🐺", mapa: "Caverna dos Lobos", min: 25, raridade: "Rara", vida: 2600, ataque: 290, defesa: 90, xp: 1600, moedas: 420, frase: "Você entrou no território da matilha." },
  { nome: "Lobo Lunar", emoji: "🌕", mapa: "Caverna dos Lobos", min: 25, raridade: "Rara", vida: 2400, ataque: 220, defesa: 70, xp: 1550, moedas: 390, frase: "A lua será sua última visão." },
  { nome: "Guardião das Presas", emoji: "🦷", mapa: "Caverna dos Lobos", min: 25, raridade: "Épica", vida: 3000, ataque: 175, defesa: 120, xp: 1700, moedas: 460, frase: "Minhas presas rasgam aço." },
  { nome: "Rei Esqueleto", emoji: "💀", mapa: "Ruínas do Rei Esqueleto", min: 50, raridade: "Épica", vida: 5200, ataque: 600, defesa: 500, xp: 3800, moedas: 850, frase: "Os mortos jamais descansam..." },
  { nome: "General Ossudo", emoji: "☠️", mapa: "Ruínas do Rei Esqueleto", min: 50, raridade: "Rara", vida: 4700, ataque: 900, defesa: 800, xp: 3500, moedas: 790, frase: "Meu exército nunca acaba." },
  { nome: "Necromante Antigo", emoji: "🧙", mapa: "Ruínas do Rei Esqueleto", min: 50, raridade: "Épica", vida: 4300, ataque: 2000, defesa: 1500, xp: 3700, moedas: 820, frase: "A morte obedece minha voz." },
  { nome: "Demônio Carmesim", emoji: "👹", mapa: "Castelo Demoníaco", min: 75, raridade: "Épica", vida: 7800, ataque: 900, defesa: 800, xp: 6500, moedas: 1300, frase: "O castelo exige sangue." },
  { nome: "Cavaleiro Infernal", emoji: "⚔️", mapa: "Castelo Demoníaco", min: 75, raridade: "Épica", vida: 8500, ataque: 1000, defesa: 900, xp: 6800, moedas: 1400, frase: "Minha espada guarda este portão." },
  { nome: "Bruxa Demoníaca", emoji: "🩸", mapa: "Castelo Demoníaco", min: 75, raridade: "Lendária", vida: 7000, ataque: 1500, defesa: 1000, xp: 6700, moedas: 1450, frase: "Sua alma será minha poção." },
  { nome: "Dragão Carmesim", emoji: "🐉", mapa: "Vale do Dragão Carmesim", min: 100, raridade: "Lendária", vida: 13000, ataque: 2000, defesa: 1900, xp: 11000, moedas: 1500, frase: "Meu fogo queimará até sua alma." },
  { nome: "Wyvern de Sangue", emoji: "🪽", mapa: "Vale do Dragão Carmesim", min: 100, raridade: "Épica", vida: 11500, ataque: 1500, defesa: 1000, xp: 10500, moedas: 1500, frase: "O céu pertence aos dragões." },
  { nome: "Guardião das Chamas", emoji: "🔥", mapa: "Vale do Dragão Carmesim", min: 100, raridade: "Lendária", vida: 12500, ataque: 2000, defesa: 1500, xp: 10800, moedas: 1500, frase: "A chama eterna não se apaga." },
  { nome: "Executor Rank S", emoji: "🕳️", mapa: "Dungeon Rank S", min: 150, raridade: "Lendária", vida: 22000, ataque: 3000, defesa: 2500, xp: 22000, moedas: 2500, frase: "Rank S não foi feito para humanos." },
  { nome: "Gigante da Dungeon", emoji: "🗿", mapa: "Dungeon Rank S", min: 150, raridade: "Épica", vida: 26000, ataque: 3500, defesa: 3000, xp: 23000, moedas: 2500, frase: "Eu esmago caçadores como insetos." },
  { nome: "Assassino do Vazio", emoji: "🖤", mapa: "Dungeon Rank S", min: 150, raridade: "Mítica", vida: 19000, ataque: 4000, defesa: 3500, xp: 22500, moedas: 2500, frase: "Você não verá meu próximo golpe." },
  { nome: "Rei Glacial", emoji: "❄️", mapa: "Abismo Congelado", min: 200, raridade: "Lendária", vida: 34000, ataque: 4000, defesa: 3500, xp: 36000, moedas: 3000, frase: "Tudo congela diante do meu trono." },
  { nome: "Fera do Gelo Eterno", emoji: "🧊", mapa: "Abismo Congelado", min: 200, raridade: "Épica", vida: 30000, ataque: 4500, defesa: 3500, xp: 35000, moedas: 3000, frase: "Seu sangue também vai congelar." },
  { nome: "Monarca das Cinzas", emoji: "🌑", mapa: "Reino das Sombras", min: 250, raridade: "Mítica", vida: 48000, ataque: 4500, defesa: 4000, xp: 52000, moedas: 4000, frase: "As sombras reconhecem sua presença." },
  { nome: "General Sombrio", emoji: "⚫", mapa: "Reino das Sombras", min: 250, raridade: "Lendária", vida: 43000, ataque: 4500, defesa: 4000, xp: 50000, moedas: 4500, frase: "Ajoelhe-se diante do exército." },
  { nome: "Serafim Caído", emoji: "👁️", mapa: "Templo Celestial", min: 300, raridade: "Mítica", vida: 62000, ataque: 5000, defesa: 4500, xp: 70000, moedas: 5000, frase: "O céu abandonou este mundo." },
  { nome: "Juiz Celestial", emoji: "✨", mapa: "Templo Celestial", min: 300, raridade: "Lendária", vida: 68000, ataque: 4800, defesa: 5000, xp: 72000, moedas: 5200, frase: "Sua sentença será definitiva." },
  { nome: "Guardião do Trono", emoji: "🛡️", mapa: "Trono do Monarca", min: 350, raridade: "Lendária", vida: 80000, ataque: 5500, defesa: 6000, xp: 85000, moedas: 6000, frase: "Ninguém alcança o Monarca sem passar por mim." },
  { nome: "Arauto do Monarca", emoji: "👑", mapa: "Trono do Monarca", min: 350, raridade: "Mítica", vida: 90000, ataque: 6000, defesa: 6000, xp: 90000, moedas: 6500, frase: "O trono aguarda seu próximo sacrifício." },
  { nome: "Devorador de Portais", emoji: "🌀", mapa: "Fenda do Vazio", min: 380, raridade: "Mítica", vida: 100000, ataque: 7000, defesa: 6500, xp: 100000, moedas: 7000, frase: "O espaço se dobra diante de sua fome." },
  { nome: "Carrasco do Fim", emoji: "🔱", mapa: "Domínio Final", min: 400, raridade: "Mítica", vida: 150000, ataque: 8500, defesa: 8000, xp: 150000, moedas: 8000, frase: "Você chegou ao fim da jornada." }
];

function eventoBonus(db) {
  const evento = db.eventoGlobal;

  if (!evento || !evento.ativo) {
    return { xp: 1, moedas: 1, drop: 0, nome: null };
  }

  if (evento.terminaEm && Date.now() > evento.terminaEm) {
    db.eventoGlobal = null;
    return { xp: 1, moedas: 1, drop: 0, nome: null };
  }

  return {
    xp: evento.xp || 1,
    moedas: evento.moedas || 1,
    drop: evento.drop || 0,
    nome: evento.nome
  };
}

function inimigoPorNivel(p) {
  const mapa = mapaDoNivel(p.nivel);
  const lista = monstrosPorMapa[mapa.nome] || monstrosPorMapa["Floresta Sombria"];
  const monstro = rand(lista);
  const escala = 1 + p.nivel * 0.14;

  return {
    nome: monstro.nome,
    emoji: monstro.emoji,
    mapa: mapa.nome,
    raridade: monstro.raridade,
    vida: Math.floor((160 + p.nivel * 55) * monstro.vida * escala),
    ataque: Math.floor((25 + p.nivel * 12) * monstro.ataque * escala),
    defesa: Math.floor((10 + p.nivel * 7) * monstro.defesa * escala),
    xp: Math.floor((90 + p.nivel * 45) * escala),
    moedas: Math.floor(40 + p.nivel * 10),
    frase: monstro.narrativa
  };
}

function bossAleatorio(p) {
  const mapa = mapaDoNivel(p.nivel);
  const disponiveis = bosses.filter(b => b.min <= p.nivel && b.mapa === mapa.nome);
  const boss = disponiveis.length ? rand(disponiveis) : bosses[0];

  return {
    ...boss,
    vida: Math.floor(boss.vida * (1 + Math.max(0, p.nivel - boss.min) * 0.07)),
    ataque: Math.floor(boss.ataque * (1 + Math.max(0, p.nivel - boss.min) * 0.04)),
    defesa: Math.floor(boss.defesa * (1 + Math.max(0, p.nivel - boss.min) * 0.04)),
    xp: Math.floor(boss.xp * 0.25),
    moedas: Math.floor(boss.moedas * 0.5)
  };
}

function sortearDrop(p, bonusDrop = 0, boss = false) {
  const chance = Math.min(boss ? 45 : 35, (boss ? 22 : 8) + bonusDrop);

  if (Math.random() * 100 >= chance) return null;

  const rolagem = Math.random() * 100;
  let raridade;

  if (boss) {
    if (rolagem < 58) raridade = "Rara";
    else if (rolagem < 86) raridade = "Épica";
    else if (rolagem < 97) raridade = "Lendária";
    else raridade = "Mítica";
  } else {
    if (rolagem < 76) raridade = "Rara";
    else if (rolagem < 96) raridade = "Épica";
    else if (rolagem < 99.5) raridade = "Lendária";
    else raridade = "Mítica";
  }

  const armas = [
    { nome: "Lâmina do Caçador", tipo: "arma", ataque: 90, raridade: "Rara" },
    { nome: "Espada das Ruínas", tipo: "arma", ataque: 160, raridade: "Rara" },
    { nome: "Adaga do Predador", tipo: "arma", ataque: 210, raridade: "Rara" },
    { nome: "Katana do Eclipse", tipo: "arma", ataque: 350, raridade: "Épica" },
    { nome: "Espada Demoníaca", tipo: "arma", ataque: 480, raridade: "Épica" },
    { nome: "Foice do Ceifador", tipo: "arma", ataque: 700, raridade: "Lendária" },
    { nome: "Lâmina do Monarca", tipo: "arma", ataque: 1100, raridade: "Mítica" }
  ];

  const armaduras = [
    { nome: "Peitoral do Caçador", tipo: "armadura", defesa: 90, raridade: "Rara" },
    { nome: "Armadura das Ruínas", tipo: "armadura", defesa: 170, raridade: "Rara" },
    { nome: "Couraça Demoníaca", tipo: "armadura", defesa: 320, raridade: "Épica" },
    { nome: "Armadura do Eclipse", tipo: "armadura", defesa: 450, raridade: "Épica" },
    { nome: "Couraça Rank S", tipo: "armadura", defesa: 650, raridade: "Lendária" },
    { nome: "Armadura do Monarca", tipo: "armadura", defesa: 1000, raridade: "Mítica" }
  ];

  const pool = [...armas, ...armaduras].filter(item => item.raridade === raridade);
  const escolhido = pool.length ? rand(pool) : rand([...armas, ...armaduras]);

  const escala = Math.max(1, 1 + p.nivel * 0.015);

  return {
    ...escolhido,
    ataque: escolhido.ataque ? Math.floor(escolhido.ataque * escala) : undefined,
    defesa: escolhido.defesa ? Math.floor(escolhido.defesa * escala) : undefined,
    id: `${Date.now()}_${Math.floor(Math.random() * 100000)}`
  };
}

function recompensa(db, p, inimigo, boss = false) {
  const bonus = eventoBonus(db);
  const xpGanho = Math.floor(inimigo.xp * bonus.xp);
  const moedasGanhas = Math.floor(inimigo.moedas * (boss ? 0.55 : 0.4) * bonus.moedas);

  p.xp += xpGanho;
  p.moedas += moedasGanhas;
  p.vitorias++;

  const subidas = subirNivel(p);
  const drop = sortearDrop(p, bonus.drop, boss);

  let texto =
    `✨ XP: +${xpGanho}\n` +
    `💰 Moedas: +${moedasGanhas}\n` +
    `❤️ Vida restaurada: ${vidaTotal(p)}\n`;

  if (subidas.length) {
    texto += `\n🎉 **Nível aumentado!** Agora você está no nível ${p.nivel}.\n`;
  }

  if (drop) {
    p.inventario.push(drop);
    texto += `\n🎁 **Equipamento encontrado!**\n${raridadeTexto(drop.raridade)} ${drop.nome}\n`;

    if (drop.tipo === "arma") texto += `⚔️ Ataque: +${drop.ataque}\n`;
    if (drop.tipo === "armadura") texto += `🛡️ Defesa: +${drop.defesa}\n`;
  } else {
    texto += "\n🎁 Nenhum equipamento caiu desta vez. A dungeon continua guardando seus tesouros.\n";
  }

  p.vida = vidaTotal(p);
  return texto;
}

function narrarLuta(p, inimigo) {
  let vidaJogador = p.vida;
  let vidaInimigo = inimigo.vida;
  const turnos = [];
  let rodada = 0;

  const ataqueJogador = ataqueTotal(p);
  const defesaJogador = defesaTotal(p);

  while (vidaJogador > 0 && vidaInimigo > 0 && rodada < 12) {
    rodada++;

    let dano = Math.max(10, Math.floor(ataqueJogador * (0.65 + Math.random() * 0.7) - inimigo.defesa * 0.35));
    let critico = Math.random() < 0.12;

    if (critico) dano = Math.floor(dano * 1.8);

    vidaInimigo -= dano;

    turnos.push({
      name: `${critico ? "💥 CRÍTICO!" : "⚔️ Rodada " + rodada}`,
      value: `Você atingiu **${inimigo.nome}** e causou **${dano}** de dano.\n❤️ Vida do inimigo: ${Math.max(0, vidaInimigo)}/${inimigo.vida}`
    });

    if (vidaInimigo <= 0) break;

    const danoInimigo = Math.max(5, Math.floor(inimigo.ataque * (0.7 + Math.random() * 0.6) - defesaJogador * 0.3));
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
      const arma = p.equipado.arma ? `${p.equipado.arma.nome} (+${p.equipado.arma.ataque} ATK)` : "Nenhuma";
      const armadura = p.equipado.armadura ? `${p.equipado.armadura.nome} (+${p.equipado.armadura.defesa} DEF)` : "Nenhuma";
      const classe = p.classe ? classes[p.classe]?.nome : "Sem classe";

      const embed = criarEmbed(
        `🌑 Perfil de ${p.nome}`,
        `**Nível:** ${p.nivel}/${NIVEL_MAX}\n` +
        `**XP:** ${p.xp}/${xpNecessario(p.nivel)}\n` +
        `**Vida:** ${p.vida}/${vidaTotal(p)}\n` +
        `\`${barra(p.vida, vidaTotal(p))}\`\n\n` +
        `**Classe:** ${classe}\n` +
        `**Poder:** ${p.poder.nome} ${p.poder.emoji || ""}\n` +
        `**Ataque:** ${ataqueTotal(p)}\n` +
        `**Defesa:** ${defesaTotal(p)}\n` +
        `**Arma:** ${arma}\n` +
        `**Armadura:** ${armadura}\n` +
        `**Moedas:** ${p.moedas} 💰\n` +
        `**Vitórias:** ${p.vitorias || 0}\n` +
        `**Derrotas:** ${p.derrotas || 0}\n` +
        `**Mapa:** ${p.mapaAtual}`
      );

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
            .setLabel("Enfrentar boss")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("⚔️"),
          new ButtonBuilder()
            .setCustomId(`rpg_correr_${message.author.id}`)
            .setLabel("Recuar")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🏃")
        );

        const embed = criarEmbed(
          `👹 BOSS ENCONTRADO: ${boss.nome}`,
          `${boss.emoji} **${boss.frase}**\n\n` +
          `🏷️ Raridade: ${raridadeTexto(boss.raridade)}\n` +
          `🗺️ Mapa: ${boss.mapa}\n` +
          `❤️ Vida: ${boss.vida}\n` +
          `⚔️ Ataque: ${boss.ataque}\n` +
          `🛡️ Defesa: ${boss.defesa}\n\n` +
          "O ar pesa. O boss percebeu sua presença.\nVocê vai enfrentá-lo ou recuar?",
          corRaridade(boss.raridade)
        );

        return responder(message, { embeds: [embed], components: [row] });
      }

      const luta = narrarLuta(p, inimigo);
      const embed = criarEmbed(
        `⚔️ DUNGEON: ${inimigo.nome}`,
        `${inimigo.emoji} **${inimigo.frase}**\n\n` +
        `🏷️ Raridade: ${raridadeTexto(inimigo.raridade)}\n` +
        `🗺️ Mapa: ${inimigo.mapa}\n\n` +
        luta.turnos.slice(0, 8).map(t => `**${t.name}**\n${t.value}`).join("\n\n")
      );

      if (luta.venceu) {
        embed.addFields({
          name: "🏆 VITÓRIA",
          value: recompensa(db, p, inimigo, false)
        });

        if (p.guilda && db.guildas[p.guilda]) {
          db.guildas[p.guilda].xp += 10;
          db.guildas[p.guilda].vitorias += 1;
        }
      } else {
        p.derrotas++;
        embed.addFields({
          name: "☠️ DERROTA",
          value: "O monstro venceu esta batalha. Você recuperou a vida após o confronto."
        });
      }

      p.vida = vidaTotal(p);
      save(db);

      return responder(message, { embeds: [embed] });
    }

    if (cmd === "inventario" || cmd === "inv") {
      if (!p.inventario.length) {
        return responder(message, "🎒 Seu inventário está vazio. Derrote monstros para tentar encontrar armas e armaduras.");
      }

      const lista = p.inventario.slice(0, 25).map((item, i) => {
        const stat = item.tipo === "arma"
          ? `⚔️ +${item.ataque} ATK`
          : `🛡️ +${item.defesa} DEF`;

        return `**${i + 1}. ${item.nome}**\n${raridadeTexto(item.raridade)} • ${stat}`;
      }).join("\n\n");

      return responder(message, {
        embeds: [criarEmbed("🎒 INVENTÁRIO DE EQUIPAMENTOS", lista)]
      });
    }

    if (cmd === "equipar") {
      const indice = Number(args[0]) - 1;
      const item = p.inventario[indice];

      if (!item) return responder(message, "Equipamento não encontrado. Consulte **,inventario**.");

      if (item.tipo === "arma") p.equipado.arma = item;
      else if (item.tipo === "armadura") p.equipado.armadura = item;
      else return responder(message, "Esse objeto não pode ser equipado.");

      save(db);

      return responder(message, {
        embeds: [criarEmbed("🛡️ EQUIPAMENTO ATIVADO", `Você equipou **${item.nome}**!\n\n${item.tipo === "arma" ? `⚔️ Ataque: +${item.ataque}` : `🛡️ Defesa: +${item.defesa}`}`)]
      });
    }

    if (cmd === "loja") {
      const lista = Object.entries(loja).map(([id, item]) => {
        const stat = item.tipo === "arma" ? `⚔️ +${item.ataque} ATK` : `🛡️ +${item.defesa} DEF`;
        return `**${item.nome}** — \`,comprar ${id}\`\n${raridadeTexto(item.raridade)} • ${stat}\n💰 ${item.preco} moedas`;
      }).join("\n\n");

      return responder(message, {
        embeds: [criarEmbed("🏪 LOJA DE EQUIPAMENTOS", `Suas moedas: **${p.moedas}** 💰\n\n${lista}`)]
      });
    }

    if (cmd === "comprar") {
      const id = (args[0] || "").toLowerCase();
      const item = loja[id];

      if (!item) return responder(message, "Equipamento não encontrado. Use **,loja** para ver a lista.");
      if (p.moedas < item.preco) return responder(message, `Você precisa de ${item.preco - p.moedas} moedas a mais.`);

      p.moedas -= item.preco;
      const novo = { ...item, id: `${Date.now()}_${Math.floor(Math.random() * 100000)}` };
      p.inventario.push(novo);
      save(db);

      return responder(message, {
        embeds: [criarEmbed("🛒 COMPRA REALIZADA", `Você comprou **${item.nome}**!\n\n${raridadeTexto(item.raridade)}\n${item.tipo === "arma" ? `⚔️ Ataque: +${item.ataque}` : `🛡️ Defesa: +${item.defesa}`}\n\n💰 Saldo restante: ${p.moedas}`)]
      });
    }

    if (cmd === "mapas") {
      const lista = mapas.map(m => {
        const liberado = p.mapasLiberados.includes(m.nome);
        return `${liberado ? "✅" : "🔒"} ${m.emoji} **${m.nome}** — nível ${m.min}`;
      }).join("\n");

      return responder(message, {
        embeds: [criarEmbed("🗺️ MAPAS E DUNGEONS", lista)]
      });
    }

    if (cmd === "viajar") {
      const nome = args.join(" ").toLowerCase();
      const mapa = mapas.find(m => m.nome.toLowerCase().includes(nome));

      if (!mapa) return responder(message, "Mapa não encontrado. Use **,mapas**.");
      if (!p.mapasLiberados.includes(mapa.nome)) return responder(message, "Você ainda não liberou esse mapa.");
      if (p.nivel < mapa.min) return responder(message, `Você precisa alcançar o nível ${mapa.min}.`);

      p.mapaAtual = mapa.nome;
      save(db);

      return responder(message, `🗺️ Você viajou para **${mapa.nome}**.`);
    }

    if (cmd === "abrirmapa") {
      const atual = mapaDoNivel(p.nivel);
      const indice = mapas.findIndex(m => m.nome === atual.nome);
      const prox = mapas[indice + 1];

      if (!prox) return responder(message, "Você já alcançou o último mapa!");
      if (p.nivel < prox.min) return responder(message, `Você precisa alcançar o nível ${prox.min} para desafiar este portal.`);

      const boss = bosses.find(b => b.mapa === atual.nome) || bosses[0];
      p.bossPendente = {
        ...boss,
        portalMapa: prox.nome,
        vida: Math.floor(boss.vida * 1.3),
        ataque: Math.floor(boss.ataque * 1.2),
        defesa: Math.floor(boss.defesa * 1.2)
      };
      p.portalPendente = prox.nome;
      save(db);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`rpg_enfrentar_${message.author.id}`)
          .setLabel("Enfrentar guardião")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("⚔️"),
        new ButtonBuilder()
          .setCustomId(`rpg_correr_${message.author.id}`)
          .setLabel("Desistir")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🏃")
      );

      const embed = criarEmbed(
        "🚪 PORTAL DE NOVO MAPA",
        `Um portal se abriu no céu da dungeon.\n` +
        `Do outro lado, você sente a presença de ${prox.emoji} **${prox.nome}**.\n\n` +
        `Para liberar esse mapa, derrote:\n` +
        `👹 **${boss.nome}**\n` +
        `❤️ Vida: ${boss.vida}\n` +
        `⚔️ Ataque: ${boss.ataque}`
      );

      return responder(message, { embeds: [embed], components: [row] });
    }

    if (cmd === "bossnivel") {
      return responder(message, "Agora use **,abrirmapa** para enfrentar o guardião e liberar novos mapas.");
    }

    if (cmd === "sombras") {
      if (p.poder.nome !== "Sombras") return responder(message, "❌ Você não é o Monarca das Sombras.");
      if (!p.sombras.length) return responder(message, "🌑 Você ainda não extraiu nenhuma sombra.");

      const lista = p.sombras.map((s, i) => `${i + 1}. **${s.nome}** | ⚔️ +${s.ataque} | 🛡️ +${s.defesa}`).join("\n");
      return responder(message, `🌑 **Seu Exército das Sombras**\n\n${lista}`);
    }

    if (cmd === "ranking") {
      const ranking = Object.values(db.jogadores)
        .sort((a, b) => b.nivel - a.nivel || b.xp - a.xp)
        .slice(0, 10)
        .map((j, i) => `${i + 1}. **${j.nome}** — Lv ${j.nivel}`)
        .join("\n");

      return responder(message, `🏆 **Ranking**\n\n${ranking || "Ninguém ainda"}`);
    }

    if (cmd === "guild") {
      const acao = (args.shift() || "").toLowerCase();

      if (acao === "criar") {
        const nome = args.join(" ").trim();
        if (!nome) return responder(message, "Use **,guild criar nome-da-guilda**.");
        if (p.guilda) return responder(message, "Você já pertence a uma guilda.");
        if (db.guildas[nome]) return responder(message, "Já existe uma guilda com esse nome.");

        db.guildas[nome] = {
          nome,
          lider: message.author.id,
          membros: [message.author.id],
          nivel: 1,
          xp: 0,
          vitorias: 0
        };

        p.guilda = nome;
        save(db);

        return responder(message, `🏰 A guilda **${nome}** foi criada! Você é o líder.`);
      }

      if (acao === "entrar") {
        const nome = args.join(" ").trim();
        const guilda = db.guildas[nome];

        if (!guilda) return responder(message, "Guilda não encontrada.");
        if (p.guilda) return responder(message, "Você já está em uma guilda.");

        guilda.membros.push(message.author.id);
        p.guilda = nome;
        save(db);

        return responder(message, `🏰 Você entrou na guilda **${nome}**.`);
      }

      if (acao === "sair") {
        if (!p.guilda) return responder(message, "Você não está em uma guilda.");

        const g = db.guildas[p.guilda];
        if (g) g.membros = g.membros.filter(id => id !== message.author.id);

        const antiga = p.guilda;
        p.guilda = null;
        save(db);

        return responder(message, `🚪 Você saiu da guilda **${antiga}**.`);
      }

      if (acao === "info") {
        if (!p.guilda) return responder(message, "Você não possui guilda.");

        const g = db.guildas[p.guilda];
        if (!g) return responder(message, "Guilda não encontrada.");

        const embed = criarEmbed(
          `🏰 Guilda ${g.nome}`,
          `👑 Líder: <@${g.lider}>\n` +
          `👥 Membros: ${g.membros.length}\n` +
          `⭐ Nível: ${g.nivel}\n` +
          `✨ XP: ${g.xp}\n` +
          `🏆 Vitórias: ${g.vitorias}`
        );

        return responder(message, { embeds: [embed] });
      }

      if (acao === "ranking") {
        const ranking = Object.values(db.guildas)
          .sort((a, b) => b.nivel - a.nivel || b.xp - a.xp)
          .slice(0, 10)
          .map((g, i) => `${i + 1}. **${g.nome}** — Lv ${g.nivel} | ${g.membros.length} membros`)
          .join("\n");

        return responder(message, `🏰 **Ranking de Guildas**\n\n${ranking || "Nenhuma guilda criada."}`);
      }

      return responder(message,
        "🏰 **Comandos de Guilda**\n" +
        ",guild criar nome\n" +
        ",guild entrar nome\n" +
        ",guild sair\n" +
        ",guild info\n" +
        ",guild ranking"
      );
    }

    if (cmd === "evento" || cmd === "eventos") {
      const bonus = eventoBonus(db);
      save(db);

      if (!bonus.nome) return responder(message, "🌌 Nenhum evento global ativo agora.");

      return responder(message,
        `🌌 **Evento ativo:** ${bonus.nome}\n` +
        `✨ XP x${bonus.xp}\n` +
        `💰 Moedas x${bonus.moedas}\n` +
        `🎁 Drop bônus +${bonus.drop}`
      );
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
