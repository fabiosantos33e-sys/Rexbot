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
const VIDA_MAXIMA = 50000;

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
  ataques: [
    "Arise",
    "Corte do Monarca",
    "Exército das Sombras",
    "Domínio Absoluto",
    "Execução Sombria"
  ],
  atk: 3500,
  def: 2500,
  ultimate: {
    nome: "🌑 DOMÍNIO DO MONARCA",
    chance: 0.08,
    multiplicador: 4,
    imagem: "https://cdn.discordapp.com/attachments/1495896642904129676/1509668361364312196/solo-leveling-monarch.gif?ex=6a1a03b9&is=6a18b239&hm=c62736a31d87c520ba80fa731bf6291440b71f0a1f0b7e6666409ef9edc7db71&.png"
  }
};

const poderGojo = {
  nome: "Infinito",
  emoji: "🔵",
  ataques: [
    "Azul",
    "Vermelho",
    "Vazio Roxo",
    "Infinito Defensivo"
  ],
  atk: 2800,
  def: 3200,
  ultimate: {
    nome: "🔵 EXPANSÃO DE DOMÍNIO: INFINITO ABSOLUTO",
    chance: 0.08,
    multiplicador: 4,
    imagem: "https://cdn.discordapp.com/attachments/1495896642904129676/1509690086365855805/gojo-satoru-jujutsu-kaisen.webp?ex=6a1a17f5&is=6a18c675&hm=35122b05fdc8a1b9f27ee162957d02973e2975c89e68c325cd344bba03d37135&.png"
  }
};

const poderSukuna = {
  nome: "Maldição Real",
  emoji: "⛩️",
  ataques: [
    "Corte Desmantelador",
    "Corte Divisor",
    "Fulga",
    "Lâmina Amaldiçoada"
  ],
  atk: 3400,
  def: 2200,
  ultimate: {
    nome: "⛩️ EXPANSÃO DE DOMÍNIO: SANTUÁRIO AMALDIÇOADO",
    chance: 0.08,
    multiplicador: 4,
    imagem: "https://cdn.discordapp.com/attachments/1495896642904129676/1509690086613057758/jujutsu-kaisen-ryoumen-sukuna.webp?ex=6a1a17f5&is=6a18c675&hm=875061a9a10fb314a49e9d1b3d8057b74a827f3a3748fe27bc4b5893c44d3f2d&.png"
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

const bosses = [
  { nome: "Lobo Alfa Sombrio", emoji: "🐺", mapa: "Floresta Sombria", min: 1, raridade: "Comum", vida: 1100, ataque: 90, defesa: 35, xp: 600, moedas: 180, frase: "A matilha sente seu medo..." },
  { nome: "Ent Corrompido", emoji: "🌲", mapa: "Floresta Sombria", min: 1, raridade: "Incomum", vida: 1300, ataque: 80, defesa: 55, xp: 650, moedas: 200, frase: "A floresta não perdoa invasores." },
  { nome: "Caçador Perdido", emoji: "🗡️", mapa: "Floresta Sombria", min: 1, raridade: "Rara", vida: 1000, ataque: 115, defesa: 30, xp: 620, moedas: 220, frase: "Eu também tentei fugir..." },

  { nome: "Fenrir Jovem", emoji: "🐺", mapa: "Caverna dos Lobos", min: 25, raridade: "Rara", vida: 2600, ataque: 290, defesa: 90, xp: 1600, moedas: 420, frase: "Você entrou no território da matilha." },
  { nome: "Lobo Lunar", emoji: "🌕", mapa: "Caverna dos Lobos", min: 25, raridade: "Rara", vida: 2400, ataque: 220, defesa: 70, xp: 1550, moedas: 390, frase: "A lua será sua última visão." },
  { nome: "Guardião das Presas", emoji: "🦷", mapa: "Caverna dos Lobos", min: 25, raridade: "Épica", vida: 3000, ataque: 175, defesa: 120, xp: 1700, moedas: 460, frase: "Minhas presas rasgam aço." },

  { nome: "Rei Esqueleto", emoji: "💀", mapa: "Ruínas do Rei Esqueleto", min: 50, raridade: "Épica", vida: 5200, ataque: 600, defesa: 500, xp: 380, moedas: 850, frase: "Os mortos jamais descansam..." },
  { nome: "General Ossudo", emoji: "☠️", mapa: "Ruínas do Rei Esqueleto", min: 50, raridade: "Rara", vida: 4700, ataque: 900, defesa: 800, xp: 350, moedas: 790, frase: "Meu exército nunca acaba." },
  { nome: "Necromante Antigo", emoji: "🧙", mapa: "Ruínas do Rei Esqueleto", min: 50, raridade: "Épica", vida: 4300, ataque: 2000, defesa: 150, xp: 3700, moedas: 820, frase: "A morte obedece minha voz." },

  { nome: "Demônio Carmesim", emoji: "👹", mapa: "Castelo Demoníaco", min: 75, raridade: "Épica", vida: 7800, ataque: 900, defesa: 800, xp: 650, moedas: 1300, frase: "O castelo exige sangue." },
  { nome: "Cavaleiro Infernal", emoji: "⚔️", mapa: "Castelo Demoníaco", min: 75, raridade: "Épica", vida: 8500, ataque: 1000, defesa: 900, xp: 680, moedas: 1400, frase: "Minha espada guarda este portão." },
  { nome: "Bruxa Demoníaca", emoji: "🩸", mapa: "Castelo Demoníaco", min: 75, raridade: "Lendária", vida: 7000, ataque: 1500, defesa: 1000, xp: 670, moedas: 1450, frase: "Sua alma será minha poção." },

  { nome: "Dragão Carmesim", emoji: "🐉", mapa: "Vale do Dragão Carmesim", min: 100, raridade: "Lendária", vida: 13000, ataque: 1000, defesa: 900, xp: 1100, moedas: 1500, frase: "Meu fogo queimará até sua alma." },
  { nome: "Wyvern de Sangue", emoji: "🪽", mapa: "Vale do Dragão Carmesim", min: 100, raridade: "Épica", vida: 11500, ataque: 1500, defesa: 1000, xp: 1050, moedas: 1500, frase: "O céu pertence aos dragões." },
  { nome: "Guardião das Chamas", emoji: "🔥", mapa: "Vale do Dragão Carmesim", min: 100, raridade: "Lendária", vida: 12500, ataque: 2000, defesa: 1500, xp: 1080, moedas: 1500, frase: "A chama eterna não se apaga." },

  { nome: "Executor Rank S", emoji: "🕳️", mapa: "Dungeon Rank S", min: 150, raridade: "Lendária", vida: 22000, ataque: 2000, defesa: 1000, xp: 2200, moedas: 2500, frase: "Rank S não foi feito para humanos." },
  { nome: "Gigante da Dungeon", emoji: "🗿", mapa: "Dungeon Rank S", min: 150, raridade: "Épica", vida: 26000, ataque: 2500, defesa: 1000, xp: 2300, moedas: 2500, frase: "Eu esmago caçadores como insetos." },
  { nome: "Assassino do Vazio", emoji: "🖤", mapa: "Dungeon Rank S", min: 150, raridade: "Mítica", vida: 19000, ataque: 3000, defesa: 1500, xp: 2250, moedas: 2500, frase: "Você não verá meu próximo golpe." },

  { nome: "Rei Glacial", emoji: "❄️", mapa: "Abismo Congelado", min: 200, raridade: "Lendária", vida: 34000, ataque: 3000, defesa: 2500, xp: 3600, moedas: 3000, frase: "Tudo congela diante do meu trono." },
  { nome: "Fera do Gelo Eterno", emoji: "🧊", mapa: "Abismo Congelado", min: 200, raridade: "Épica", vida: 30000, ataque: 3500, defesa: 2500, xp: 3500, moedas: 3000, frase: "Seu sangue também vai congelar." },

  { nome: "Monarca das Cinzas", emoji: "🌑", mapa: "Reino das Sombras", min: 250, raridade: "Mítica", vida: 48000, ataque: 3500, defesa: 2500, xp: 5200, moedas: 4000, frase: "As sombras reconhecem sua presença." },
  { nome: "General Sombrio", emoji: "⚫", mapa: "Reino das Sombras", min: 250, raridade: "Lendária", vida: 43000, ataque: 3500, defesa: 2500, xp: 5000, moedas: 4500, frase: "Ajoelhe-se diante do exército." },

  { nome: "Serafim Caído", emoji: "👁️", mapa: "Templo Celestial", min: 300, raridade: "Mítica", vida: 62000, ataque: 3100, defesa: 2200, xp: 7000, moedas: 5000, frase: "O céu abandonou este mundo." },
  { nome: "Juiz Celestial", emoji: "✨", mapa: "Templo Celestial", min: 300, raridade: "Lendária", vida: 68000, ataque: 3200, defesa: 2500, xp: 7300, moedas: 5500, frase: "Seu julgamento começa agora." },

  { nome: "Deus das Sombras", emoji: "🖤", mapa: "Trono do Monarca", min: 350, raridade: "Sombria", vida: 95000, ataque: 4200, defesa: 3200, xp: 12000, moedas: 1300, frase: "ARISE..." },
  { nome: "Monarca Absoluto", emoji: "👑", mapa: "Trono do Monarca", min: 350, raridade: "Mítica", vida: 110000, ataque: 4500, defesa: 3500, xp: 14000, moedas: 1450, frase: "Você chegou longe demais." },

  { nome: "Devorador do Vazio", emoji: "🌀", mapa: "Fenda do Vazio", min: 380, raridade: "Mítica", vida: 135000, ataque: 5200, defesa: 4100, xp: 1800, moedas: 1700, frase: "Não existe luz onde eu caminho." },
  { nome: "Arauto do Fim", emoji: "🔱", mapa: "Domínio Final", min: 400, raridade: "Sombria", vida: 180000, ataque: 6500, defesa: 5200, xp: 2500, moedas: 2500, frase: "Este é o último portal." }
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
  if (!("classe" in p)) p.classe = null;
  if (!("guilda" in p)) p.guilda = null;
  if (!("eventosParticipados" in p)) p.eventosParticipados = 0;
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

function classeObj(p) {
  if (!p.classe) return null;
  return classes[p.classe] || null;
}

function vidaTotal(p) {
  const c = classeObj(p);
  const bonus = c?.vida || 0;
  return Math.min(VIDA_MAXIMA, p.vidaMax + bonus);
}

function atkTotal(p) {
  const arma = p.equipado?.arma?.ataque || 0;
  const poder = p.poder?.atk || 0;
  const classe = classeObj(p)?.atk || 0;
  const sombras = p.sombras?.reduce((a, s) => a + (s.ataque || 0), 0) || 0;
  return p.ataqueBase + arma + poder + classe + sombras;
}

function defTotal(p) {
  const armadura = p.equipado?.armadura?.defesa || 0;
  const poder = p.poder?.def || 0;
  const classe = classeObj(p)?.def || 0;
  const sombras = p.sombras?.reduce((a, s) => a + (s.defesa || 0), 0) || 0;
  return p.defesaBase + armadura + poder + classe + sombras;
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
    p.vida = vidaTotal(p);
    texto += `\n🔥 **LEVEL UP!** Agora você está no nível **${p.nivel}**!`;
  }

  return texto;
}

function eventoBonus(db) {
  const e = db.eventoGlobal;
  if (!e || !e.ativo) return { xp: 1, moedas: 1, drop: 0, nome: null };

  if (Date.now() > e.terminaEm) {
    db.eventoGlobal = null;
    return { xp: 1, moedas: 1, drop: 0, nome: null };
  }

  return {
    xp: e.xp || 1,
    moedas: e.moedas || 1,
    drop: e.drop || 0,
    nome: e.nome
  };
}

function inimigoPorNivel(p, boss = false) {
  let mult = boss ? 2.2 : 1.5;
  const mapa = mapaAtual(p);

  return {
    nome: boss ? `Guardião de ${mapa.nome}` : `Monstro de ${mapa.nome}`,
    mapa: mapa.nome,
    emoji: boss ? "👹" : "⚔️",
    raridade: boss ? "Rara" : "Comum",
    vida: Math.floor(250 + p.nivel * 55 * mult),
    ataque: Math.floor(35 + p.nivel * 12 * mult),
    defesa: Math.floor(15 + p.nivel * 6 * mult),
    xp: Math.floor(120 + p.nivel * 40 * mult),
    moedas: Math.floor((50 + p.nivel * 14) * (boss ? 2 : 1)),
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
  const escala = 1 + Math.max(0, p.nivel - base.min) * 0.03;

  return {
    nome: base.nome,
    mapa: base.mapa,
    emoji: base.emoji,
    raridade: base.raridade || "Rara",
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
    moedas: Math.floor(b.moedas * 1.1),
    portalMapa: mapa.nome
  };
}

function sortearDrop(boss = false, bonus = 0) {
  let roll = Math.random() * 100;
  if (boss) roll -= 10;
  roll -= bonus;

  if (roll <= 55) {
    return { ...rand([
      { nome: "Fragmento de Ferro", tipo: "material", raridade: "Comum" },
      { nome: "Pedra de Mana", tipo: "material", raridade: "Comum" },
      { nome: "Cristal Fraco", tipo: "material", raridade: "Comum" },
      { nome: "Poção Pequena", tipo: "consumivel", raridade: "Comum", cura: 300 }
    ]) };
  }

  if (roll <= 78) {
    return { ...rand([
      { nome: "Cristal Verde", tipo: "material", raridade: "Incomum" },
      { nome: "Anel do Caçador", tipo: "material", raridade: "Incomum" },
      { nome: "Poção Média", tipo: "consumivel", raridade: "Incomum", cura: 700 }
    ]) };
  }

  if (roll <= 92) {
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
  let vidaPlayer = vidaTotal(p);
  let vidaInimigo = inimigo.vida;
  const turnos = [];
  const classe = classeObj(p);

  turnos.push({
    name: "🎬 A dungeon escureceu...",
    value:
      `O portal atrás de você se fechou lentamente.\n` +
      `O ar ficou pesado, como se a própria dungeon estivesse respirando.\n\n` +
      `${inimigo.emoji || "👹"} **${inimigo.nome}** apareceu em **${inimigo.mapa}**.\n` +
      `${raridadeTexto(inimigo.raridade)}\n\n` +
      `🗣️ "${inimigo.frase || "Você não deveria estar aqui..."}"`
  });

  for (let turno = 1; turno <= 7; turno++) {
    let ataque = rand(p.poder.ataques);
    let usouUltimate = false;
    let ultimate = p.poder?.ultimate;

    if (classe && Math.random() < 0.35) {
      ataque = `${rand(classe.habilidades)} (${classe.nome})`;
    }

    if (p.equipado?.arma?.habilidade && Math.random() < 0.35) {
      ataque = `${p.equipado.arma.habilidade} (${p.equipado.arma.nome})`;
    }

    if (ultimate && Math.random() < ultimate.chance) {
      ataque = ultimate.nome;
      usouUltimate = true;
    }

    const critico = Math.random() < 0.18;

    let danoPlayer = Math.max(
      20,
      atkTotal(p) +
      Math.floor(Math.random() * 120) -
      Math.floor(inimigo.defesa / 2)
    );

    if (critico) danoPlayer *= 2;
    if (usouUltimate) danoPlayer *= ultimate.multiplicador;

    vidaInimigo = Math.max(0, vidaInimigo - danoPlayer);

    let textoUltimate = "";

    if (usouUltimate && p.poder.nome === "Sombras") {
      textoUltimate =
        `🌌 **O céu escureceu...**\n` +
        `⚫ A dungeon começou a tremer.\n` +
        `👁️ O Monarca das Sombras despertou sua verdadeira força.\n\n`;
    } else if (usouUltimate && p.poder.nome === "Infinito") {
      textoUltimate =
        `🔵 **O espaço parou ao seu redor...**\n` +
        `🌀 A distância entre tudo começou a se dobrar.\n` +
        `👁️ O Infinito tomou conta da dungeon.\n\n`;
    } else if (usouUltimate && p.poder.nome === "Maldição Real") {
      textoUltimate =
        `⛩️ **O santuário surgiu no meio da dungeon...**\n` +
        `🩸 Cortes invisíveis rasgaram o ar.\n` +
        `🔥 A presença amaldiçoada dominou o campo de batalha.\n\n`;
    }

    turnos.push({
      name: `⚔️ Turno ${turno} — ${p.nome}`,
      value:
        `${p.poder.emoji} Sua aura se espalhou pelo chão.\n` +
        `${classe ? `${classe.emoji} Classe ativa: **${classe.nome}**\n` : ""}` +
        textoUltimate +
        `${critico ? "💥 **CRÍTICO!**\n" : ""}` +
        `🗡️ Você usou **${ataque}**!\n\n` +
        `🩸 Dano causado: **${danoPlayer}**\n` +
        `👹 Inimigo: ${barra(vidaInimigo, inimigo.vida)} ${vidaInimigo}/${inimigo.vida}`
    });

    if (vidaInimigo <= 0) break;

    const danoBoss = Math.max(
      10,
      inimigo.ataque + Math.floor(Math.random() * 90) - Math.floor(defTotal(p) / 2)
    );

    vidaPlayer = Math.max(0, vidaPlayer - danoBoss);

    turnos.push({
      name: `${inimigo.emoji || "👹"} Contra-ataque`,
      value:
        `A dungeon tremeu com o rugido do inimigo.\n` +
        `O boss atravessou a poeira e atacou sem hesitar.\n\n` +
        `💢 Dano recebido: **${danoBoss}**\n` +
        `❤️ Você: ${barra(vidaPlayer, vidaTotal(p))} ${vidaPlayer}/${vidaTotal(p)}`
    });

    if (vidaPlayer <= 0) break;
  }

  return {
    venceu: vidaInimigo <= 0,
    morreu: vidaPlayer <= 0,
    turnos
  };
}

function recompensa(db, p, inimigo, boss = false) {
  const bonus = eventoBonus(db);

  const xp = Math.floor(inimigo.xp * bonus.xp);
  const moedas = Math.floor(inimigo.moedas * bonus.moedas);

  p.xp += xp;
  p.moedas += moedas;
  p.vitorias++;

  let txt =
    `✨ XP: +${xp}\n` +
    `💰 Moedas: +${moedas}`;

  if (bonus.nome) {
    txt += `\n🌌 Evento ativo: **${bonus.nome}**`;
  }

  const drop = sortearDrop(boss, bonus.drop);

  if (drop) {
    p.inventario.push(drop);
    txt += `\n🎁 DROP: ${raridadeTexto(drop.raridade)} **${drop.nome}**`;
  }

  txt += upar(p);
  return txt;
}

function criarEmbedPerfil(message, p) {
  const classe = classeObj(p);
  const mapa = mapaAtual(p);

  return new EmbedBuilder()
    .setColor("#050505")
    .setTitle("🌑 PERFIL DO CAÇADOR")
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 256 }))
    .setDescription(
      `> ${message.author}\n` +
      `> ${p.poder.emoji} Poder: **${p.poder.nome}**\n` +
      `> ${classe ? `${classe.emoji} Classe: **${classe.nome}**` : "🧬 Classe: **Nenhuma**"}\n` +
      `> 🏰 Guilda: **${p.guilda || "Nenhuma"}**`
    )
    .addFields(
      { name: "⭐ Nível", value: `${p.nivel}/400`, inline: true },
      { name: "✨ XP", value: `${p.xp}/${xpNecessario(p)}`, inline: true },
      { name: "💰 Moedas", value: `${p.moedas}`, inline: true },
      { name: "❤️ Vida", value: `${barra(p.vida, vidaTotal(p))}\n${p.vida}/${vidaTotal(p)}`, inline: false },
      { name: "⚔️ Ataque Total", value: `${atkTotal(p)}`, inline: true },
      { name: "🛡️ Defesa Total", value: `${defTotal(p)}`, inline: true },
      { name: "🗺️ Mapa Atual", value: `${mapa.emoji} ${mapa.nome}`, inline: true },
      { name: "🗡️ Arma", value: p.equipado.arma ? `${raridadeTexto(p.equipado.arma.raridade)} ${p.equipado.arma.nome}` : "Nenhuma", inline: true },
      { name: "🛡️ Armadura", value: p.equipado.armadura ? `${raridadeTexto(p.equipado.armadura.raridade)} ${p.equipado.armadura.nome}` : "Nenhuma", inline: true },
      { name: "🌑 Sombras", value: `${p.sombras.length} extraídas`, inline: true },
      { name: "🏆 Vitórias", value: `${p.vitorias}`, inline: true },
      { name: "☠️ Derrotas", value: `${p.derrotas}`, inline: true }
    )
    .setFooter({ text: "Mostrinho RPG •..." })
    .setTimestamp();
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
      return message.reply(`🌑 **Sistema despertado!**\nPoder recebido: ${p.poder.emoji} **${p.poder.nome}**\nUse **,classes** para escolher uma classe ou **,caçar** para lutar.`);
    }

    if (cmd === "classes") {
      const lista = Object.entries(classes).map(([id, c]) =>
        `${c.emoji} **${c.nome}** \`${id}\`\n` +
        `⚔️ +${c.atk} | 🛡️ +${c.def} | ❤️ +${c.vida}\n` +
        `_${c.desc}_`
      ).join("\n\n");

      const embed = new EmbedBuilder()
        .setColor("#050505")
        .setTitle("🧬 CLASSES DISPONÍVEIS")
        .setDescription(`${lista}\n\nUse: **,classe escolher id**\nExemplo: **,classe escolher berserker**`);

      return message.reply({ embeds: [embed] });
    }

    if (cmd === "classe") {
      const acao = args[0];
      const id = args[1]?.toLowerCase();

      if (acao !== "escolher" || !id) {
        return message.reply("Use: **,classe escolher espadachim**");
      }

      if (!classes[id]) {
        return message.reply("❌ Classe inválida. Use **,classes**.");
      }

      if (p.classe) {
        return message.reply("❌ Você já escolheu uma classe. Peça para um admin resetar se quiser trocar.");
      }

      p.classe = id;
      p.vida = vidaTotal(p);
      save(db);

      const c = classes[id];

      return message.reply(`${c.emoji} Você despertou como **${c.nome}**.\n${c.desc}`);
    }

    if (cmd === "perfil") {
      return message.reply({ embeds: [criarEmbedPerfil(message, p)] });
    }

    if (cmd === "inventario") {
      if (!p.inventario.length) return message.reply("🎒 Seu inventário está vazio.");

      const lista = p.inventario.map((item, i) =>
        `${i + 1}. ${raridadeTexto(item.raridade)} **${item.nome}** ` +
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
        return message.reply(`✅ Você equipou ${raridadeTexto(item.raridade)} **${item.nome}**!`);
      }

      if (item.tipo === "armadura" || item.defesa) {
        p.equipado.armadura = item;
        save(db);
        return message.reply(`✅ Você equipou ${raridadeTexto(item.raridade)} **${item.nome}**!`);
      }

      return message.reply("❌ Esse item não pode ser equipado.");
    }

    if (cmd === "loja") {
      let txt = "🏪 **Loja dos Caçadores**\n\n";
      for (const id in loja) {
        const item = loja[id];
        txt += `🔹 **${id}** — ${raridadeTexto(item.raridade)} ${item.nome} | 💰 ${item.preco}\n`;
      }
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
      if (item.cura) p.vida = Math.min(vidaTotal(p), p.vida + item.cura);

      save(db);
      return message.reply(`✅ Você comprou ${raridadeTexto(item.raridade)} **${item.nome}**!\n💰 Moedas restantes: ${p.moedas}`);
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
        p.vida = vidaTotal(p);
      }

      save(db);
      return message.reply(`🏋️ **Treino concluído!**\nTipo: **${tipo}**\nQuantidade: **${vezes}x**\nCusto: **${custo} moedas**`);
    }

    if (cmd === "guild") {
      const acao = args[0];

      if (acao === "criar") {
        const nome = args.slice(1).join(" ");
        if (!nome) return message.reply("Use: **,guild criar nome**");
        if (p.guilda) return message.reply("❌ Você já está em uma guilda.");
        if (db.guildas[nome]) return message.reply("❌ Essa guilda já existe.");

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

        return message.reply(`🏰 Guilda **${nome}** criada com sucesso!`);
      }

      if (acao === "entrar") {
        const nome = args.slice(1).join(" ");
        const g = db.guildas[nome];
        if (!g) return message.reply("❌ Guilda não encontrada.");
        if (p.guilda) return message.reply("❌ Você já está em uma guilda.");

        g.membros.push(message.author.id);
        p.guilda = nome;
        save(db);

        return message.reply(`🏰 Você entrou na guilda **${nome}**.`);
      }

      if (acao === "sair") {
        if (!p.guilda) return message.reply("❌ Você não está em uma guilda.");
        const g = db.guildas[p.guilda];

        if (g) {
          g.membros = g.membros.filter(id => id !== message.author.id);
        }

        const antiga = p.guilda;
        p.guilda = null;
        save(db);

        return message.reply(`🚪 Você saiu da guilda **${antiga}**.`);
      }

      if (acao === "info") {
        if (!p.guilda) return message.reply("❌ Você não possui guilda.");
        const g = db.guildas[p.guilda];

        if (!g) return message.reply("❌ Guilda não encontrada.");

        const embed = new EmbedBuilder()
          .setColor("#050505")
          .setTitle(`🏰 Guilda ${g.nome}`)
          .setDescription(
            `👑 Líder: <@${g.lider}>\n` +
            `👥 Membros: ${g.membros.length}\n` +
            `⭐ Nível: ${g.nivel}\n` +
            `✨ XP: ${g.xp}\n` +
            `🏆 Vitórias: ${g.vitorias}`
          );

        return message.reply({ embeds: [embed] });
      }

      if (acao === "ranking") {
        const ranking = Object.values(db.guildas)
          .sort((a, b) => b.nivel - a.nivel || b.xp - a.xp)
          .slice(0, 10)
          .map((g, i) => `${i + 1}. **${g.nome}** — Lv ${g.nivel} | ${g.membros.length} membros`)
          .join("\n");

        return message.reply(`🏰 **Ranking de Guildas**\n\n${ranking || "Nenhuma guilda criada."}`);
      }

      return message.reply(
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

      if (!bonus.nome) {
        return message.reply("🌌 Nenhum evento global ativo agora.");
      }

      return message.reply(
        `🌌 **Evento ativo:** ${bonus.nome}\n` +
        `✨ XP x${bonus.xp}\n` +
        `💰 Moedas x${bonus.moedas}\n` +
        `🎁 Drop bônus +${bonus.drop}`
      );
    }

if (cmd === "ultimate") {

  if (!p.poder.ultimate) {
    return message.reply("❌ Você não possui ultimate.");
  }

  let texto = "";
  let gif = "";

  if (p.poder.nome === "Sombras") {

    texto =
    "🌌 O céu escureceu...\n" +
    "⚫ A dungeon começou a tremer...\n" +
    "👁️ O Monarca das Sombras despertou.";

    gif = "https://cdn.discordapp.com/attachments/1495896642904129676/1509668361364312196/solo-leveling-monarch.gif?ex=6a1a03b9&is=6a18b239&hm=c62736a31d87c520ba80fa731bf6291440b71f0a1f0b7e6666409ef9edc7db71&.png";
  }

  else if (p.poder.nome === "Infinito") {

    texto =
    "🔵 O espaço foi distorcido...\n" +
    "🌀 Tudo ficou imóvel diante do Infinito.";

    gif = "https://cdn.discordapp.com/attachments/1495896642904129676/1509690086613057758/jujutsu-kaisen-ryoumen-sukuna.webp?ex=6a1a17f5&is=6a18c675&hm=875061a9a10fb314a49e9d1b3d8057b74a827f3a3748fe27bc4b5893c44d3f2d&.png";
  }

  else if (p.poder.nome === "Maldição Real") {

    texto =
    "⛩️ O santuário amaldiçoado apareceu...\n" +
    "🩸 Cortes invisíveis rasgaram a dungeon.";

    gif = "https://cdn.discordapp.com/attachments/1495896642904129676/1509690086613057758/jujutsu-kaisen-ryoumen-sukuna.webp?ex=6a1a17f5&is=6a18c675&hm=875061a9a10fb314a49e9d1b3d8057b74a827f3a3748fe27bc4b5893c44d3f2d&.png";
  }

  const embed = new EmbedBuilder()
    .setColor("#2b003d")
    .setTitle(p.poder.ultimate.nome)
    .setDescription(texto);

  if (gif !== "LINK_DO_GIF") {
    embed.setImage(gif);
  }

  return message.reply({ embeds: [embed] });
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
          .setColor(corRaridade(boss.raridade))
          .setTitle("⚠️ BOSS ENCONTRADO")
          .setDescription(
            `A dungeon ficou silenciosa.\n` +
            `As tochas apagaram uma por uma.\n\n` +
            `${boss.emoji || "👹"} **${boss.nome}** apareceu.\n` +
            `🗺️ ${boss.mapa}\n` +
            `${raridadeTexto(boss.raridade)}\n\n` +
            `❤️ Vida: ${boss.vida}\n` +
            `⚔️ Ataque: ${boss.ataque}\n\n` +
            `🗣️ "${boss.frase || "Você não deveria estar aqui..."}"`
          );

        return message.reply({ embeds: [embed], components: [row] });
      }

      const inimigo = inimigoPorNivel(p, false);
      const luta = narrarLuta(p, inimigo);

      const embed = new EmbedBuilder()
        .setColor("#050505")
        .setTitle(`🌑 Dungeon: ${inimigo.mapa}`)
        .setDescription(`👹 Inimigo: **${inimigo.nome}**`);

      embed.addFields(luta.turnos.slice(0, 20));

      if (luta.morreu) {
        p.derrotas++;
        p.moedas = Math.max(0, p.moedas - Math.floor(inimigo.moedas / 2));
        embed.addFields({ name: "☠️ Resultado", value: "Você caiu na dungeon. Sua vida será restaurada, mas parte das moedas foi perdida." });
      } else if (luta.venceu) {
        embed.addFields({ name: "🏆 Recompensa", value: recompensa(db, p, inimigo, false) });

        if (p.guilda && db.guildas[p.guilda]) {
          db.guildas[p.guilda].xp += 25;
          db.guildas[p.guilda].vitorias += 1;
        }

        if (p.poder.nome === "Sombras") {
          p.sombraPendente = {
            nome: inimigo.nome,
            ataque: Math.floor(inimigo.ataque * 0.25),
            defesa: Math.floor(inimigo.defesa * 0.25)
          };

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`rpg_arise_${message.author.id}`).setLabel("Arise").setStyle(ButtonStyle.Primary).setEmoji("🌑")
          );

          p.vida = vidaTotal(p);
          save(db);
          return message.reply({ embeds: [embed], components: [row] });
        }
      } else {
        embed.addFields({ name: "🏃 Resultado", value: "Você resistiu o suficiente para escapar antes de cair." });
      }

      p.vida = vidaTotal(p);
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
      p.vida = vidaTotal(p);
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
        .setColor("#2b003d")
        .setTitle("🚪 PORTAL DE NOVO MAPA")
        .setDescription(
          `Um portal se abriu no céu da dungeon.\n` +
          `Do outro lado, você sente a presença de ${prox.emoji} **${prox.nome}**.\n\n` +
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

      if (acao === "evento") {
        const tipo = args[1];

        if (tipo === "clear") {
          db.eventoGlobal = null;
          save(db);
          return message.reply("🌌 Evento global removido.");
        }

        const eventos = {
          eclipse: { nome: "Eclipse Sombrio", xp: 1.4, moedas: 1.1, drop: 8 },
          mana: { nome: "Chuva de Mana", xp: 1.2, moedas: 1.3, drop: 5 },
          raid: { nome: "Presságio de Raid Mundial", xp: 1.6, moedas: 1.2, drop: 10 }
        };

        if (!eventos[tipo]) {
          return message.reply("Use: **,adm evento eclipse**, **mana**, **raid** ou **clear**");
        }

        db.eventoGlobal = {
          ativo: true,
          ...eventos[tipo],
          terminaEm: Date.now() + 60 * 60 * 1000
        };

        save(db);
        return message.reply(`🌌 Evento **${eventos[tipo].nome}** iniciado por 1 hora.`);
      }

      if (!membro) return message.reply("Use: **,adm money @user 500**");
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
        if (!mapa) return message.reply("Mapa não encontrado.");
        if (!alvo.mapasLiberados.includes(mapa.nome)) alvo.mapasLiberados.push(mapa.nome);
      }
      else return message.reply("Ação inválida: money, xp, level, heal, reset, sombras, gojo, sukuna, classe, mapa, evento");

      save(db);
      return message.reply(`👑 Admin executou **${acao}** em ${membro}`);
    }

    if (cmd === "rpghelp" || cmd === "help") {
      const embed = new EmbedBuilder()
        .setColor("#050505")
        .setTitle("🌑 MOSTRINHO RPG — GUIA")
        .setDescription(
          `O Mostrinho RPG é um RPG estilo anime dentro do Discord.\n` +
          `Você cria um caçador, escolhe uma classe, luta em dungeons, libera mapas, entra em guildas e enfrenta bosses cinematográficos.\n\n` +

          `👤 **Começo**\n` +
          `,criar — cria personagem\n` +
          `,perfil — mostra seu perfil dark\n` +
          `,classes — lista classes\n` +
          `,classe escolher id — escolhe sua classe\n\n` +

          `⚔️ **Combate**\n` +
          `,caçar — entra em dungeon e luta\n` +
          `,sombras — mostra sombras extraídas\n` +
          `,ranking — ranking global\n\n` +

          `🗺️ **Mapas**\n` +
          `,mapas — mostra mapas\n` +
          `,abrirmapa — enfrenta guardião para liberar mapa\n` +
          `,viajar nome — viaja para mapa liberado\n\n` +

          `🎒 **Itens**\n` +
          `,inventario — mostra itens\n` +
          `,equipar 1 — equipa item\n` +
          `,loja — mostra loja\n` +
          `,comprar espada_ferro — compra item\n\n` +

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
          `,evento — mostra evento global ativo\n\n` +

        
        .setFooter({ text: "... Mostrinho ." });

      return message.reply({ embeds: [embed] });
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

      const embed = new EmbedBuilder()
        .setColor("#050505")
        .setTitle("🌑 ARISE")
        .setDescription(
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

    let boss = p.bossPendente;
    if (!boss) boss = bossAleatorio(p);

    if (acao === "correr") {
      p.bossPendente = null;
      p.portalPendente = null;
      p.vida = vidaTotal(p);
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
        .setColor(corRaridade(boss.raridade))
        .setTitle(`⚔️ Boss: ${boss.nome}`);

      embed.addFields(luta.turnos.slice(0, 20));

      if (luta.morreu) {
        p.derrotas++;
        p.bossPendente = null;
        p.portalPendente = null;
        embed.addFields({ name: "☠️ Resultado", value: "Você caiu diante do boss. A dungeon silenciou por alguns segundos." });
      } else if (luta.venceu) {
        embed.addFields({ name: "🏆 Recompensa", value: recompensa(db, p, boss, true) });

        if (p.guilda && db.guildas[p.guilda]) {
          db.guildas[p.guilda].xp += 100;
          db.guildas[p.guilda].vitorias += 1;
        }

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

          p.vida = vidaTotal(p);
          save(db);

          return interaction.update({
            embeds: [embed],
            components: [row]
          });
        }
      } else {
        embed.addFields({ name: "🏃 Resultado", value: "Você resistiu, mas precisou recuar." });
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
