// ============================================================
// RPG BATALHAS — CRÔNICAS DO CAOS
// Discord.js v14 | CommonJS
// Instalação: require("./rpg_batalhas")(client);
// ============================================================

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const PREFIX = ",";
const MAX_LEVEL = 300;
const COOLDOWN_CACA = 8000;
const COOLDOWN_CHEFE = 30000;

const DATA_DIR = path.join(__dirname, "dados_rpg");
const DATABASE = path.join(DATA_DIR, "jogadores.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

let jogadores = {};

try {
    if (fs.existsSync(DATABASE)) {
        jogadores = JSON.parse(fs.readFileSync(DATABASE, "utf8"));
    }
} catch (erro) {
    console.error("[RPG] Banco de dados inválido:", erro.message);
    jogadores = {};
}

const batalhas = new Map();
const encontros = new Map();

function salvarBanco() {
    const temporario = DATABASE + ".tmp";
    fs.writeFileSync(temporario, JSON.stringify(jogadores, null, 2));
    fs.renameSync(temporario, DATABASE);
}

function numero(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escolher(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

function barra(atual, maximo, tamanho = 12) {
    const proporcao = maximo > 0
        ? Math.max(0, Math.min(1, atual / maximo))
        : 0;

    const cheios = Math.round(proporcao * tamanho);

    return "█".repeat(cheios) + "░".repeat(tamanho - cheios);
}

function embedBase(titulo, descricao, cor = 0x5865F2) {
    return new EmbedBuilder()
        .setColor(cor)
        .setTitle(titulo)
        .setDescription(descricao)
        .setTimestamp();
}

function cooldown(ultimo, tempo) {
    return Date.now() - (ultimo || 0) < tempo;
}

function restante(ultimo, tempo) {
    return Math.max(0, Math.ceil(
        (tempo - (Date.now() - (ultimo || 0))) / 1000
    ));
}

function criarJogador(id, nome) {
    return {
        id,
        nome,
        nivel: 1,
        xp: 0,
        xpProx: 100,
        moedas: 150,
        vida: 120,
        vidaMax: 120,
        ataque: 12,
        defesa: 5,
        velocidade: 5,
        sorte: 1,
        classe: "Aventureiro",
        armaAtual: null,
        armaduraAtual: null,
        armas: [],
        armaduras: [],
        mapaAtual: "Vila Inicial",
        vitorias: 0,
        derrotas: 0,
        monstrosDerrotados: 0,
        chefesDerrotados: 0,
        dungeonsConcluidas: 0,
        conquistas: [],
        ultimaCaca: 0,
        ultimoChefe: 0,
        ultimoTreino: 0,
        ultimoLogin: Date.now()
    };
}

function getJogador(id, nome) {
    if (!jogadores[id]) {
        jogadores[id] = criarJogador(id, nome);
    }

    const j = jogadores[id];

    j.nome = nome || j.nome || "Aventureiro";
    j.nivel ??= 1;
    j.xp ??= 0;
    j.xpProx ??= 100;
    j.moedas ??= 0;
    j.vidaMax ??= 120;
    j.vida ??= j.vidaMax;
    j.ataque ??= 12;
    j.defesa ??= 5;
    j.velocidade ??= 5;
    j.sorte ??= 1;
    j.armas ??= [];
    j.armaduras ??= [];
    j.conquistas ??= [];
    j.mapaAtual ??= "Vila Inicial";

    // Compatibilidade com equipamentos antigos.
    j.armas = [...new Set(j.armas)];
    j.armaduras = [...new Set(j.armaduras)];

    return j;
}

function salvarJogador(j) {
    j.ultimoLogin = Date.now();
    salvarBanco();
}

const RARIDADES = {
    comum: {
        nome: "Comum",
        emoji: "⚪",
        cor: 0x95A5A6,
        ataques: 2
    },
    incomum: {
        nome: "Incomum",
        emoji: "🟢",
        cor: 0x2ECC71,
        ataques: 2
    },
    raro: {
        nome: "Raro",
        emoji: "🔵",
        cor: 0x3498DB,
        ataques: 3
    },
    epico: {
        nome: "Épico",
        emoji: "🟣",
        cor: 0x9B59B6,
        ataques: 3
    },
    lendario: {
        nome: "Lendário",
        emoji: "🟡",
        cor: 0xF1C40F,
        ataques: 4
    }
};

// O Absoluto Crítico é uma técnica EXTRA.
// Não substitui os ataques normais da arma.
// Só pode surgir com pouca vida e uma chance muito baixa.

const ABSOLUTO = {
    nome: "ABSOLUTO: RUPTURA DO DESTINO",
    chance: 0.035,
    vidaMaximaPercentual: 0.15,
    multiplicador: 5,
    descricao:
        "O guerreiro concentra toda a energia restante em um único golpe."
};

const ARMAS = [
    {
        id: "espada_ferro",
        nome: "Espada de Ferro",
        ataque: 12,
        raridade: "comum",
        ataques: [
            { nome: "Corte Ascendente", mult: 1.0,
              texto: "A lâmina sobe em um arco rápido, abrindo a guarda inimiga." },
            { nome: "Impacto de Ferro", mult: 1.35,
              texto: "Você firma os pés e desfere um golpe pesado contra o adversário." }
        ]
    },
    {
        id: "adaga_cacador",
        nome: "Adaga do Caçador",
        ataque: 9,
        raridade: "comum",
        ataques: [
            { nome: "Picada Veloz", mult: 1.0,
              texto: "Você avança com um movimento curto e preciso." },
            { nome: "Passo Fantasma", mult: 1.4,
              texto: "Um passo lateral confunde o inimigo antes do corte." }
        ]
    },
    {
        id: "machado_guerreiro",
        nome: "Machado do Guerreiro",
        ataque: 22,
        raridade: "incomum",
        ataques: [
            { nome: "Talho Brutal", mult: 1.0,
              texto: "O machado corta o ar com força e encontra o alvo." },
            { nome: "Queda do Carrasco", mult: 1.5,
              texto: "Você ergue o machado e o faz descer como um trovão." }
        ]
    },
    {
        id: "arco_bosque",
        nome: "Arco do Bosque",
        ataque: 19,
        raridade: "incomum",
        ataques: [
            { nome: "Flecha Perfurante", mult: 1.0,
              texto: "A flecha corta o vento e atravessa a defesa." },
            { nome: "Chuva Verdejante", mult: 1.45,
              texto: "Você dispara uma sequência veloz de flechas." }
        ]
    },
    {
        id: "lamina_sombria",
        nome: "Lâmina Sombria",
        ataque: 35,
        raridade: "raro",
        ataques: [
            { nome: "Corte Umbral", mult: 1.0,
              texto: "A lâmina desaparece por um instante na escuridão." },
            { nome: "Dança das Sombras", mult: 1.25,
              texto: "Você surge ao lado do inimigo e executa um corte diagonal." },
            { nome: "Eclipse Negro", mult: 1.7,
              texto: "Uma onda escura acompanha o golpe e explode ao atingir o alvo." }
        ]
    },
    {
        id: "katana_lunar",
        nome: "Katana Lunar",
        ataque: 43,
        raridade: "raro",
        ataques: [
            { nome: "Meia-Lua", mult: 1.0,
              texto: "A katana desenha um arco prateado no ar." },
            { nome: "Reflexo Lunar", mult: 1.3,
              texto: "Um movimento veloz deixa um brilho semelhante ao luar." },
            { nome: "Lua Partida", mult: 1.75,
              texto: "A energia lunar acompanha um corte devastador." }
        ]
    },
    {
        id: "martelo_golem",
        nome: "Martelo do Golem",
        ataque: 32,
        raridade: "raro",
        ataques: [
            { nome: "Punho de Pedra", mult: 1.0,
              texto: "O martelo atinge o solo e lança fragmentos contra o alvo." },
            { nome: "Abalo Sísmico", mult: 1.3,
              texto: "O impacto faz o terreno tremer sob os pés do inimigo." },
            { nome: "Colapso da Montanha", mult: 1.8,
              texto: "Você reúne força e desfere um golpe capaz de estremecer a arena." }
        ]
    },
    {
        id: "espada_ancestral",
        nome: "Espada Ancestral",
        ataque: 55,
        raridade: "epico",
        ataques: [
            { nome: "Runas Despertas", mult: 1.0,
              texto: "Runas antigas acendem ao longo da lâmina." },
            { nome: "Sentença dos Antigos", mult: 1.25,
              texto: "Uma força ancestral empurra o inimigo para trás." },
            { nome: "Corte das Eras", mult: 1.65,
              texto: "A lâmina libera uma onda de energia esquecida." }
        ]
    },
    {
        id: "lanca_draconica",
        nome: "Lança Dracônica",
        ataque: 68,
        raridade: "epico",
        ataques: [
            { nome: "Estocada Dracônica", mult: 1.0,
              texto: "A lança avança como a presa de um dragão." },
            { nome: "Asa Flamejante", mult: 1.3,
              texto: "Chamas percorrem a haste e envolvem a ponta da arma." },
            { nome: "Rugido Escarlate", mult: 1.7,
              texto: "Uma explosão escarlate acompanha a estocada final." }
        ]
    },
    {
        id: "foice_abismo",
        nome: "Foice do Abismo",
        ataque: 95,
        raridade: "epico",
        ataques: [
            { nome: "Ceifa Noturna", mult: 1.0,
              texto: "A foice traça um arco escuro diante do adversário." },
            { nome: "Véu do Abismo", mult: 1.3,
              texto: "Uma névoa sombria envolve o campo de batalha." },
            { nome: "Colheita das Almas", mult: 1.75,
              texto: "A energia do abismo concentra-se em um único corte." }
        ]
    },
    {
        id: "espada_dragao",
        nome: "Espada do Dragão",
        ataque: 105,
        raridade: "lendario",
        ataques: [
            { nome: "Garra Ígnea", mult: 1.0,
              texto: "A lâmina assume o brilho de uma garra em chamas." },
            { nome: "Tempestade Dracônica", mult: 1.2,
              texto: "Rajadas de fogo cercam o inimigo." },
            { nome: "Devorador de Chamas", mult: 1.5,
              texto: "Uma onda de fogo avança pela arena." },
            { nome: "Despertar do Dragão", mult: 2.0,
              texto: "Uma silhueta dracônica surge atrás de você enquanto a lâmina atinge o alvo." }
        ]
    },
    {
        id: "lamina_caos",
        nome: "Lâmina do Caos",
        ataque: 135,
        raridade: "lendario",
        ataques: [
            { nome: "Fenda Caótica", mult: 1.0,
              texto: "O espaço ao redor da lâmina parece se partir." },
            { nome: "Espiral do Vazio", mult: 1.25,
              texto: "Uma espiral de energia distorce o campo de batalha." },
            { nome: "Ruptura Dimensional", mult: 1.6,
              texto: "Uma fenda dimensional explode no ponto de impacto." },
            { nome: "Decreto do Caos", mult: 2.1,
              texto: "A energia caótica converge para um golpe de poder colossal." }
        ]
    },
    {
        id: "excalibur_estelar",
        nome: "Excalibur Estelar",
        ataque: 160,
        raridade: "lendario",
        ataques: [
            { nome: "Brilho Celeste", mult: 1.0,
              texto: "A espada brilha como uma estrela recém-nascida." },
            { nome: "Órbita Radiante", mult: 1.25,
              texto: "Arcos luminosos giram ao redor do adversário." },
            { nome: "Lança de Constelações", mult: 1.65,
              texto: "Feixes estelares convergem sobre o inimigo." },
            { nome: "Julgamento dos Céus", mult: 2.2,
              texto: "Uma coluna de luz desce sobre a arena no instante do golpe." }
        ]
    },
    {
        id: "punhos_vazio",
        nome: "Punhos do Vazio",
        ataque: 185,
        raridade: "lendario",
        ataques: [
            { nome: "Punho Espectral", mult: 1.0,
              texto: "Seu punho é envolvido por energia do vazio." },
            { nome: "Impacto Dimensional", mult: 1.25,
              texto: "O impacto distorce o ar ao redor do inimigo." },
            { nome: "Rasgo da Realidade", mult: 1.7,
              texto: "Uma onda invisível atravessa a arena." },
            { nome: "Fim de Todas as Coisas", mult: 2.25,
              texto: "A energia do vazio explode em um impacto devastador." }
        ]
    }
];

const ARMADURAS = [
    { id: "couro", nome: "Armadura de Couro", defesa: 8, raridade: "comum" },
    { id: "ferro", nome: "Armadura de Ferro", defesa: 18, raridade: "incomum" },
    { id: "sombria", nome: "Armadura Sombria", defesa: 35, raridade: "raro" },
    { id: "ancestral", nome: "Armadura Ancestral", defesa: 55, raridade: "epico" },
    { id: "dragao", nome: "Armadura do Dragão", defesa: 85, raridade: "lendario" },
    { id: "manto_lunar", nome: "Manto Lunar", defesa: 44, raridade: "raro" },
    { id: "armadura_draconica", nome: "Armadura Dracônica", defesa: 72, raridade: "epico" },
    { id: "egide_estelar", nome: "Égide Estelar", defesa: 115, raridade: "lendario" }
];

function armaPorId(id) {
    return ARMAS.find(a => a.id === id);
}

function armaduraPorId(id) {
    return ARMADURAS.find(a => a.id === id);
}

function ataqueTotal(j) {
    return j.ataque + (armaPorId(j.armaAtual)?.ataque || 0);
}

function defesaTotal(j) {
    return j.defesa + (armaduraPorId(j.armaduraAtual)?.defesa || 0);
}

function xpNecessario(nivel) {
    return Math.floor(100 * Math.pow(1.16, nivel - 1));
}

function adicionarXP(j, quantidade) {
    if (j.nivel >= MAX_LEVEL) {
        j.xp = 0;
        j.xpProx = xpNecessario(j.nivel);
        return 0;
    }

    j.xp += quantidade;
    let subiu = 0;
    j.xpProx = xpNecessario(j.nivel);

    while (j.xp >= j.xpProx && j.nivel < MAX_LEVEL) {
        j.xp -= j.xpProx;
        j.nivel++;
        subiu++;

        j.vidaMax += 20;
        j.vida = j.vidaMax;
        j.ataque += 4;
        j.defesa += 2;
        j.velocidade += 1;
        j.xpProx = xpNecessario(j.nivel);

        if (j.nivel % 10 === 0) j.sorte++;
    }

    return subiu;
}

function recuperarVida(j) {
    j.vida = j.vidaMax;
}

const MAPAS = {
    "Vila Inicial": {
        nivelMin: 1,
        nivelMax: 4,
        cor: 0x3498DB,
        descricao: "Um pequeno povoado cercado por trilhas antigas e perigos escondidos.",
        monstros: [
            "Slime Sombrio", "Goblin Guerreiro", "Morcego das Cavernas",
            "Javali Selvagem", "Aranha Venenosa", "Ladrão da Vila"
        ],
        chefe: "Rei Goblin"
    },
    "Floresta Sombria": {
        nivelMin: 5,
        nivelMax: 14,
        cor: 0x27AE60,
        descricao: "Árvores colossais escondem criaturas que caçam ao cair da noite.",
        monstros: [
            "Lobo Selvagem", "Goblin Guerreiro", "Orc Brutamontes",
            "Aranha Venenosa", "Ent Ancião", "Corvo de Sangue", "Pantera Lunar"
        ],
        chefe: "Senhor dos Lobos"
    },
    "Montanhas de Ferro": {
        nivelMin: 15,
        nivelMax: 29,
        cor: 0x7F8C8D,
        descricao: "Fortalezas abandonadas e cavernas guardam tesouros esquecidos.",
        monstros: [
            "Orc Brutamontes", "Cavaleiro Amaldiçoado", "Golem de Pedra",
            "Troll das Montanhas", "Arqueiro Fantasma"
        ],
        chefe: "General de Ferro"
    },
    "Vale dos Dragões": {
        nivelMin: 30,
        nivelMax: 49,
        cor: 0xE67E22,
        descricao: "Cinzas cobrem o vale onde criaturas aladas disputam território.",
        monstros: [
            "Cavaleiro Amaldiçoado", "Dragão Jovem", "Wyvern de Fogo",
            "Serpente Vulcânica", "Draco de Cristal"
        ],
        chefe: "Dragão Ancião"
    },
    "Terras Demoníacas": {
        nivelMin: 50,
        nivelMax: 79,
        cor: 0xC0392B,
        descricao: "A própria terra pulsa com uma energia antiga e corrompida.",
        monstros: [
            "Demônio das Trevas", "Cavaleiro Amaldiçoado", "Bruxa Carmesim",
            "Gárgula Infernal", "Cão do Abismo"
        ],
        chefe: "Demônio Supremo"
    },
    "Reino das Sombras": {
        nivelMin: 80,
        nivelMax: 119,
        cor: 0x8E44AD,
        descricao: "Um reino silencioso no qual as sombras parecem observar cada passo.",
        monstros: [
            "Demônio das Trevas", "Guardião Sombrio", "Espectro Real",
            "Ceifador Noturno", "Vampiro Ancestral"
        ],
        chefe: "Rei das Sombras"
    },
    "Reino do Caos": {
        nivelMin: 120,
        nivelMax: 300,
        cor: 0x2C3E50,
        descricao: "No limite da realidade, entidades aguardam o desafiante final.",
        monstros: [
            "Guardião Sombrio", "Arauto do Caos", "Colosso do Vazio",
            "Devorador de Mundos", "Serafim Corrompido"
        ],
        chefe: "Deus do Caos"
    }
};

const MONSTROS = {
    "Slime Sombrio": { vida: 80, ataque: 8, defesa: 2, xp: 35, moedas: [8, 20] },
    "Goblin Guerreiro": { vida: 130, ataque: 14, defesa: 5, xp: 60, moedas: [15, 35] },
    "Morcego das Cavernas": { vida: 95, ataque: 10, defesa: 3, xp: 38, moedas: [9, 22] },
    "Javali Selvagem": { vida: 115, ataque: 13, defesa: 4, xp: 48, moedas: [10, 25] },
    "Aranha Venenosa": { vida: 150, ataque: 17, defesa: 6, xp: 72, moedas: [15, 32] },
    "Ladrão da Vila": { vida: 170, ataque: 18, defesa: 7, xp: 78, moedas: [18, 38] },
    "Lobo Selvagem": { vida: 190, ataque: 20, defesa: 8, xp: 90, moedas: [20, 45] },
    "Ent Ancião": { vida: 240, ataque: 23, defesa: 12, xp: 115, moedas: [25, 48] },
    "Corvo de Sangue": { vida: 210, ataque: 25, defesa: 8, xp: 108, moedas: [24, 50] },
    "Pantera Lunar": { vida: 280, ataque: 29, defesa: 12, xp: 135, moedas: [30, 58] },
    "Orc Brutamontes": { vida: 320, ataque: 31, defesa: 15, xp: 150, moedas: [35, 70] },
    "Golem de Pedra": { vida: 420, ataque: 35, defesa: 24, xp: 180, moedas: [40, 80] },
    "Troll das Montanhas": { vida: 480, ataque: 40, defesa: 19, xp: 205, moedas: [45, 90] },
    "Arqueiro Fantasma": { vida: 390, ataque: 44, defesa: 15, xp: 210, moedas: [45, 95] },
    "Cavaleiro Amaldiçoado": { vida: 550, ataque: 48, defesa: 25, xp: 260, moedas: [55, 100] },
    "Dragão Jovem": { vida: 850, ataque: 65, defesa: 35, xp: 420, moedas: [90, 160] },
    "Wyvern de Fogo": { vida: 1050, ataque: 72, defesa: 38, xp: 490, moedas: [100, 180] },
    "Serpente Vulcânica": { vida: 920, ataque: 68, defesa: 42, xp: 455, moedas: [95, 170] },
    "Draco de Cristal": { vida: 1180, ataque: 78, defesa: 48, xp: 540, moedas: [115, 205] },
    "Demônio das Trevas": { vida: 1300, ataque: 90, defesa: 50, xp: 700, moedas: [150, 260] },
    "Bruxa Carmesim": { vida: 1450, ataque: 98, defesa: 48, xp: 740, moedas: [155, 270] },
    "Gárgula Infernal": { vida: 1600, ataque: 102, defesa: 65, xp: 790, moedas: [165, 285] },
    "Cão do Abismo": { vida: 1380, ataque: 105, defesa: 52, xp: 760, moedas: [160, 280] },
    "Guardião Sombrio": { vida: 2100, ataque: 125, defesa: 70, xp: 1100, moedas: [250, 450] },
    "Espectro Real": { vida: 2250, ataque: 132, defesa: 75, xp: 1180, moedas: [260, 470] },
    "Ceifador Noturno": { vida: 2450, ataque: 145, defesa: 80, xp: 1280, moedas: [280, 500] },
    "Vampiro Ancestral": { vida: 2650, ataque: 150, defesa: 88, xp: 1400, moedas: [300, 540] },
    "Arauto do Caos": { vida: 3200, ataque: 170, defesa: 95, xp: 1700, moedas: [400, 700] },
    "Colosso do Vazio": { vida: 3500, ataque: 180, defesa: 105, xp: 1850, moedas: [420, 740] },
    "Devorador de Mundos": { vida: 3900, ataque: 195, defesa: 100, xp: 2050, moedas: [460, 800] },
    "Serafim Corrompido": { vida: 4300, ataque: 205, defesa: 115, xp: 2300, moedas: [500, 900] }
};

const CHEFES = {
    "Rei Goblin": { vida: 550, ataque: 32, defesa: 14, xp: 300, moedas: [150, 250] },
    "Senhor dos Lobos": { vida: 900, ataque: 55, defesa: 25, xp: 600, moedas: [250, 400] },
    "General de Ferro": { vida: 1500, ataque: 80, defesa: 45, xp: 1000, moedas: [400, 700] },
    "Dragão Ancião": { vida: 3000, ataque: 125, defesa: 70, xp: 2200, moedas: [800, 1300] },
    "Demônio Supremo": { vida: 5200, ataque: 190, defesa: 105, xp: 4000, moedas: [1300, 2200] },
    "Rei das Sombras": { vida: 8000, ataque: 270, defesa: 150, xp: 7000, moedas: [2200, 3500] },
    "Deus do Caos": { vida: 15000, ataque: 420, defesa: 220, xp: 15000, moedas: [5000, 9000] }
};
const DUNGEONS = {
    "Caverna dos Goblins": {
        nivel: 5, salas: 3, premio: 250,
        inimigos: ["Goblin Guerreiro", "Orc Brutamontes"]
    },
    "Tumba Amaldicoada": {
        nivel: 20, salas: 4, premio: 600,
        inimigos: ["Cavaleiro Amaldiçoado", "Orc Brutamontes"]
    },
    "Covil do Dragão": {
        nivel: 35, salas: 5, premio: 1300,
        inimigos: ["Dragão Jovem", "Cavaleiro Amaldiçoado"]
    },
    "Abismo Demoníaco": {
        nivel: 60, salas: 6, premio: 3000,
        inimigos: ["Demônio das Trevas", "Guardião Sombrio", "Espectro Real"]
    },
    "Trono do Caos": {
        nivel: 120, salas: 7, premio: 7000,
        inimigos: ["Arauto do Caos", "Colosso do Vazio", "Serafim Corrompido"]
    }
};

function monstroEscalado(nome, nivel, chefe = false) {
    const base = chefe ? CHEFES[nome] : MONSTROS[nome];
    if (!base) return null;

    const fator = 1 + Math.max(0, nivel - 1) *
        (chefe ? 0.025 : 0.018);

    return {
        nome,
        vidaMax: Math.floor(base.vida * fator),
        vida: Math.floor(base.vida * fator),
        ataque: Math.floor(base.ataque * fator),
        defesa: Math.floor(base.defesa * fator),
        xp: Math.floor(base.xp * fator),
        moedas: [
            Math.floor(base.moedas[0] * fator),
            Math.floor(base.moedas[1] * fator)
        ],
        chefe
    };
}

function danoMonstro(j, inimigo) {
    const bruto = numero(
        Math.max(1, Math.floor(inimigo.ataque * 0.8)),
        Math.max(2, Math.floor(inimigo.ataque * 1.15))
    );

    return Math.max(1, bruto - Math.floor(defesaTotal(j) * 0.4));
}

function esquivou(j) {
    return Math.random() < Math.min(0.28, j.velocidade * 0.006);
}

function obterAtaque(j) {
    const arma = armaPorId(j.armaAtual);
    const poderBase = ataqueTotal(j);

    if (!arma) {
        const critico = Math.random() < 0.08;
        const dano = numero(
            Math.max(1, Math.floor(poderBase * 0.85)),
            Math.max(2, Math.floor(poderBase * 1.15))
        );

        return {
            nome: critico ? "Golpe de Precisão" : "Ataque Improvisado",
            texto: critico
                ? "Você identifica uma abertura e acerta um golpe preciso!"
                : "Você avança e desfere um golpe contra o adversário.",
            dano: critico ? dano * 2 : dano,
            critico,
            absoluto: false
        };
    }

    // ABSOLUTO: só pode ativar com vida igual ou inferior a 15%.
    // Mesmo nessa condição, a chance é de apenas 3,5% por turno.
    const vidaCritica = j.vida <= j.vidaMax * ABSOLUTO.vidaMaximaPercentual;

    if (vidaCritica && Math.random() < ABSOLUTO.chance) {
        const dano = Math.max(1, Math.floor(poderBase * ABSOLUTO.multiplicador));

        return {
            nome: ABSOLUTO.nome,
            texto:
                "🌌 **O TEMPO PARECE PARAR!**\n" +
                "Runas ancestrais cobrem a arena. Sua arma ressoa com uma energia impossível. " +
                "No limite de suas forças, você libera o **ABSOLUTO: RUPTURA DO DESTINO**!",
            dano,
            critico: true,
            absoluto: true
        };
    }

    const lista = arma.ataques || [];
    const tecnica = escolher(lista);
    const critico = Math.random() < Math.min(0.22, 0.06 + j.sorte * 0.004);

    const variacao = numero(90, 110) / 100;
    let dano = Math.max(
        1,
        Math.floor(poderBase * tecnica.mult * variacao)
    );

    if (critico) dano *= 2;

    return {
        nome: tecnica.nome,
        texto: tecnica.texto,
        dano,
        critico,
        absoluto: false
    };
}

function chanceDrop(chefe) {
    const r = Math.random() * 100;

    if (chefe) {
        if (r < 3) return "lendario";
        if (r < 18) return "epico";
        if (r < 45) return "raro";
        if (r < 72) return "incomum";
        return "comum";
    }

    if (r < 0.5) return "lendario";
    if (r < 2) return "epico";
    if (r < 6) return "raro";
    if (r < 14) return "incomum";

    return null;
}

function entregarDrop(j, chefe) {
    const raridade = chanceDrop(chefe);
    if (!raridade) return null;

    const ordem = ["comum", "incomum", "raro", "epico", "lendario"];
    const tipoArmadura = Math.random() < 0.35;
    const catalogo = tipoArmadura ? ARMADURAS : ARMAS;

    const disponiveis = catalogo.filter(item =>
        ordem.indexOf(item.raridade) <= ordem.indexOf(raridade)
    );

    const item = escolher(disponiveis);
    const colecao = tipoArmadura ? j.armaduras : j.armas;

    if (!colecao.includes(item.id)) colecao.push(item.id);

    return { ...item, tipoItem: tipoArmadura ? "armadura" : "arma" };
}

function textoRecompensa(item) {
    if (!item) return "Nenhum equipamento caiu desta vez.";

    const raridade = RARIDADES[item.raridade];

    return `${raridade.emoji} **${item.nome}** — ${raridade.nome}\n` +
        (item.tipoItem === "arma"
            ? `⚔️ Ataque: +${item.ataque}`
            : `🛡️ Defesa: +${item.defesa}`);
}

function criarInventario(j) {
    const armas = j.armas.map(armaPorId).filter(Boolean);
    const armaduras = j.armaduras.map(armaduraPorId).filter(Boolean);

    const listaArmas = armas.length
        ? armas.map((a, i) =>
            `**${i + 1}.** ${RARIDADES[a.raridade].emoji} **${a.nome}** — ⚔️ +${a.ataque}\n` +
            `   Técnicas: ${a.ataques.length} ataques + chance de Absoluto Crítico`
        ).join("\n\n")
        : "Nenhuma arma encontrada.";

    const listaArmaduras = armaduras.length
        ? armaduras.map((a, i) =>
            `**${i + 1}.** ${RARIDADES[a.raridade].emoji} **${a.nome}** — 🛡️ +${a.defesa}`
        ).join("\n")
        : "Nenhuma armadura encontrada.";

    return embedBase(
        `🎒 Inventário de ${j.nome}`,
        `💰 **Moedas:** ${j.moedas}\n\n` +
        `⚔️ **ARMAS (${armas.length})**\n${listaArmas}\n\n` +
        `🛡️ **ARMADURAS (${armaduras.length})**\n${listaArmaduras}\n\n` +
        `Arma equipada: **${armaPorId(j.armaAtual)?.nome || "Nenhuma"}**\n` +
        `Armadura equipada: **${armaduraPorId(j.armaduraAtual)?.nome || "Nenhuma"}**`,
        0x3498DB
    );
}

function criarLoja(j) {
    const armas = ARMAS.map(a =>
        `${RARIDADES[a.raridade].emoji} **${a.nome}**\n` +
        `⚔️ Ataque: ${a.ataque} | 💰 ${a.preco || Math.floor(a.ataque * 30)} moedas\n` +
        `ID: \`${a.id}\``
    ).join("\n\n");

    const armaduras = ARMADURAS.map(a =>
        `${RARIDADES[a.raridade].emoji} **${a.nome}**\n` +
        `🛡️ Defesa: ${a.defesa} | 💰 ${a.preco || Math.floor(a.defesa * 25)} moedas\n` +
        `ID: \`${a.id}\``
    ).join("\n\n");

    return embedBase(
        "🏪 Mercado dos Aventureiros",
        `Saldo: **${j.moedas} moedas**\n\n` +
        `**⚔️ ARMAS**\n${armas}\n\n` +
        `**🛡️ ARMADURAS**\n${armaduras}\n\n` +
        "Comprar: `,comprar ID_DO_ITEM`",
        0xF1C40F
    );
}

async function iniciarBatalha(canal, j, nome, chefe = false, multiplicador = 1) {
    if (batalhas.has(j.id)) {
        return canal.send("⚠️ Você já está em uma batalha!");
    }

    const inimigo = monstroEscalado(nome, j.nivel, chefe);
    if (!inimigo) return canal.send("❌ Esse inimigo não está configurado.");

    const sessao = {
        jogador: j,
        inimigo,
        rodada: 0,
        multiplicador,
        canal
    };

    batalhas.set(j.id, sessao);

    const abertura = chefe
        ? `👑 **UMA PRESENÇA COLOSSAL DESPERTA!**\n${nome} surge diante de você. O chão estremece e uma energia esmagadora toma conta da arena.`
        : `🌫️ O vento muda. Passos pesados ecoam à sua frente...\n**${nome}** bloqueia seu caminho. Não há garantia de vitória.`;

    await canal.send({
        embeds: [
            embedBase(
                chefe ? `👑 ${nome} — CHEFE` : `⚔️ Encontro: ${nome}`,
                `${abertura}\n\n` +
                `❤️ **Sua vida:** ${barra(j.vida, j.vidaMax)} ${j.vida}/${j.vidaMax}\n` +
                `👹 **Vida inimiga:** ${barra(inimigo.vida, inimigo.vidaMax)} ${inimigo.vida}/${inimigo.vidaMax}\n\n` +
                "A batalha começou. Cada rodada pode mudar o destino do combate.",
                chefe ? 0xC0392B : 0x5865F2
            )
        ]
    });

    await turnoBatalha(sessao);
}

async function encerrarBatalha(sessao, venceu) {
    const { jogador: j, inimigo, canal, multiplicador } = sessao;

    batalhas.delete(j.id);

    if (venceu) {
        const moedas = Math.floor(
            numero(inimigo.moedas[0], inimigo.moedas[1]) * multiplicador
        );
        const xp = Math.floor(inimigo.xp * multiplicador);

        j.moedas += moedas;
        const niveis = adicionarXP(j, xp);

        j.vitorias++;
        if (inimigo.chefe) j.chefesDerrotados++;
        else j.monstrosDerrotados++;

        const drop = entregarDrop(j, inimigo.chefe);

        // Toda batalha encerrada restaura completamente a vida.
        recuperarVida(j);
        salvarJogador(j);

        let descricao =
            `🏆 **${j.nome}, você venceu!** ${inimigo.nome} caiu diante de sua determinação.\n\n` +
            `💰 Moedas: **+${moedas}**\n✨ Experiência: **+${xp} XP**\n` +
            `❤️ Sua vida foi completamente restaurada: **${j.vida}/${j.vidaMax} HP**`;

        if (niveis) {
            descricao += `\n🎉 Você avançou **${niveis} nível(is)**!`;
        }

        descricao += `\n\n🎁 **Recompensa de equipamento**\n${textoRecompensa(drop)}`;

        if (inimigo.chefe) {
            descricao += "\n\n👑 A queda do chefe será lembrada nas crônicas deste reino.";
        }

        return canal.send({
            embeds: [
                embedBase(
                    inimigo.chefe ? "👑 O CHEFE FOI DERROTADO!" : "⚔️ VITÓRIA!",
                    descricao,
                    0x2ECC71
                )
            ]
        });
    }

    const xp = Math.max(5, Math.floor(j.xpProx * 0.03));
    adicionarXP(j, xp);
    j.derrotas++;
    recuperarVida(j);
    salvarJogador(j);

    return canal.send({
        embeds: [
            embedBase(
                "💀 Derrota — mas não o fim",
                `**${inimigo.nome}** venceu esta batalha.\n` +
                "O campo silencia enquanto você recua para recuperar suas forças.\n\n" +
                `✨ Experiência de combate: **+${xp} XP**\n` +
                `❤️ Sua vida foi completamente restaurada: **${j.vida}/${j.vidaMax} HP**\n\n` +
                "Prepare seu equipamento, fortaleça suas habilidades e volte mais forte.",
                0xE74C3C
            )
        ]
    });
}

async function turnoBatalha(sessao) {
    const { jogador: j, inimigo, canal } = sessao;
    if (!batalhas.has(j.id)) return;

    sessao.rodada++;

    if (sessao.rodada > 45) {
        batalhas.delete(j.id);
        recuperarVida(j);
        salvarJogador(j);
        return canal.send(
            "⏳ O combate foi encerrado após muitas rodadas. Sua vida foi restaurada."
        );
    }

    const ataque = obterAtaque(j);
    inimigo.vida = Math.max(0, inimigo.vida - ataque.dano);

    let titulo = ataque.absoluto
        ? "🌌 O ABSOLUTO DESPERTOU!"
        : ataque.critico
            ? "💥 GOLPE CRÍTICO!"
            : `⚔️ ${ataque.nome}`;

    let narracao =
        `**${ataque.nome}**\n${ataque.texto}\n\n` +
        `💥 Dano causado: **${ataque.dano}**`;

    if (ataque.critico) narracao += "\n✨ O golpe atingiu um ponto vulnerável!";

    if (inimigo.vida <= 0) {
        await canal.send({
            embeds: [
                embedBase(
                    titulo,
                    `${narracao}\n\n` +
                    `👹 **${inimigo.nome}** não consegue continuar e cai diante do seu ataque!`,
                    ataque.absoluto ? 0xF1C40F : 0x2ECC71
                )
            ]
        });

        return encerrarBatalha(sessao, true);
    }

    let contra;

    if (esquivou(j)) {
        contra = "💨 Você percebe o movimento a tempo e esquiva por pouco!";
    } else {
        const dano = danoMonstro(j, inimigo);
        j.vida = Math.max(0, j.vida - dano);

        const frases = [
            `👹 ${inimigo.nome} avança com violência e causa **${dano}** de dano.`,
            `⚡ O adversário encontra uma abertura e atinge você por **${dano}** de dano.`,
            `🛡️ O impacto ecoa pela arena. Você perde **${dano} HP**.`,
            `🌑 ${inimigo.nome} reúne forças e desfere um contra-ataque de **${dano}** de dano.`
        ];

        contra = escolher(frases);
    }

    await canal.send({
        embeds: [
            embedBase(
                `⚔️ Rodada ${sessao.rodada} — ${titulo}`,
                `${narracao}\n\n${contra}\n\n` +
                `**📜 Estado do combate**\n` +
                `❤️ **${j.nome}:** ${barra(j.vida, j.vidaMax)} ${j.vida}/${j.vidaMax}\n` +
                `👹 **${inimigo.nome}:** ${barra(inimigo.vida, inimigo.vidaMax)} ${inimigo.vida}/${inimigo.vidaMax}`,
                ataque.absoluto ? 0xF1C40F : 0x5865F2
            )
        ]
    });

    if (j.vida <= 0) return encerrarBatalha(sessao, false);

    salvarJogador(j);

    setTimeout(() => {
        turnoBatalha(sessao).catch(erro => {
            console.error("[RPG] Erro no turno:", erro);
            batalhas.delete(j.id);
        });
    }, 1600);
}

function embedPerfil(msg, j) {
    const arma = armaPorId(j.armaAtual);
    const armadura = armaduraPorId(j.armaduraAtual);
    const mapa = MAPAS[j.mapaAtual] || MAPAS["Vila Inicial"];

    return new EmbedBuilder()
        .setColor(mapa.cor)
        .setAuthor({
            name: `Crônicas de ${msg.author.username}`,
            iconURL: msg.author.displayAvatarURL({ size: 256 })
        })
        .setTitle(`🧙 ${j.nome} — Nível ${j.nivel}`)
        .setThumbnail(msg.author.displayAvatarURL({ size: 512 }))
        .setDescription(
            `*Sua história ainda está sendo escrita...*\n\n` +
            `**${j.classe}**\n` +
            `${barra(j.xp, j.xpProx, 16)}\n` +
            `✨ ${j.xp}/${j.xpProx} XP`
        )
        .addFields(
            { name: "❤️ Vida", value: `${j.vida}/${j.vidaMax}`, inline: true },
            { name: "⚔️ Ataque", value: `${ataqueTotal(j)}`, inline: true },
            { name: "🛡️ Defesa", value: `${defesaTotal(j)}`, inline: true },
            { name: "💨 Velocidade", value: `${j.velocidade}`, inline: true },
            { name: "🍀 Sorte", value: `${j.sorte}`, inline: true },
            { name: "💰 Moedas", value: `${j.moedas}`, inline: true },
            { name: "🗺️ Região", value: j.mapaAtual, inline: true },
            { name: "⚔️ Arma", value: arma?.nome || "Nenhuma", inline: true },
            { name: "🛡️ Armadura", value: armadura?.nome || "Nenhuma", inline: true },
            { name: "🏆 Vitórias", value: `${j.vitorias}`, inline: true },
            { name: "💀 Derrotas", value: `${j.derrotas}`, inline: true },
            { name: "👹 Monstros", value: `${j.monstrosDerrotados}`, inline: true }
        )
        .setFooter({ text: "RPG • Crônicas do Caos" })
        .setTimestamp();
}

function embedAjuda() {
    return embedBase(
        "📖 CRÔNICAS DO CAOS — Manual do Aventureiro",
        "Bem-vindo ao mundo onde cada vitória constrói uma lenda.\n\n" +
        "**⚔️ COMBATE**\n" +
        "`,cacar` — encontrar um inimigo\n" +
        "`,chefao` — desafiar o chefe da região\n\n" +
        "**🧙 PERSONAGEM**\n" +
        "`,perfil` — visualizar sua ficha\n" +
        "`,status` — ver seus atributos\n" +
        "`,inventario` — consultar seus equipamentos\n" +
        "`,treinar forca 5` — treinar atributos\n\n" +
        "**🎒 EQUIPAMENTOS**\n" +
        "`,loja` — abrir o mercado\n" +
        "`,comprar espada_ferro` — comprar um item\n" +
        "`,equipar 1` — equipar uma arma do inventário\n" +
        "`,equipararmadura 1` — equipar armadura\n\n" +
        "**🌍 EXPLORAÇÃO**\n" +
        "`,mapas` — ver regiões disponíveis\n" +
        "`,viajar Floresta Sombria` — viajar para outra região\n" +
        "`,dungeons` — consultar masmorras\n" +
        "`,dungeon Caverna dos Goblins` — explorar uma masmorra\n\n" +
        "**🌌 ABSOLUTO CRÍTICO**\n" +
        "Armas podem executar técnicas diferentes conforme sua raridade. " +
        "Quando sua vida estiver em **15% ou menos**, existe uma chance rara de **3,5% por turno** de ativar a Ruptura do Destino.\n\n" +
        "⚠️ O Absoluto não pode ser ativado manualmente. É um acontecimento raro do combate.",
        0x8E44AD
    );
}
async function comandoCacar(msg, j) {
    if (batalhas.has(j.id) || encontros.has(j.id)) {
        return msg.reply("⚠️ Você já está envolvido em um combate ou encontro.");
    }

    if (cooldown(j.ultimaCaca, COOLDOWN_CACA)) {
        return msg.reply(
            `⏳ Você precisa aguardar **${restante(j.ultimaCaca, COOLDOWN_CACA)}s** para caçar novamente.`
        );
    }

    const mapa = MAPAS[j.mapaAtual] || MAPAS["Vila Inicial"];
    const nome = escolher(mapa.monstros);

    j.ultimaCaca = Date.now();
    salvarJogador(j);

    const inimigo = monstroEscalado(nome, j.nivel);

    const embed = embedBase(
        "🌲 ENCONTRO INESPERADO",
        `Você avança por **${j.mapaAtual}**. Os galhos estalam, o vento desaparece e uma criatura bloqueia sua passagem.\n\n` +
        `👹 **${nome}**\n` +
        `❤️ Vida: ${inimigo.vida}/${inimigo.vidaMax}\n` +
        `⚔️ Ataque: ${inimigo.ataque}\n\n` +
        "Você pode enfrentar a criatura ou recuar. O que decide seu destino?",
        mapa.cor
    );

    const botoes = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`rpg_lutar_${j.id}`)
            .setLabel("Enfrentar")
            .setEmoji("⚔️")
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`rpg_fugir_${j.id}`)
            .setLabel("Recuar")
            .setEmoji("💨")
            .setStyle(ButtonStyle.Secondary)
    );

    encontros.set(j.id, { nome, chefe: false });

    const resposta = await msg.reply({
        embeds: [embed],
        components: [botoes]
    });

    const coletor = resposta.createMessageComponentCollector({
        time: 60000,
        filter: i => i.user.id === j.id
    });

    coletor.on("collect", async i => {
        try {
            if (i.customId === `rpg_fugir_${j.id}`) {
                encontros.delete(j.id);
                coletor.stop();

                return i.update({
                    embeds: [
                        embedBase(
                            "💨 Retirada estratégica",
                            "Você recua com cautela. A criatura permanece na região, aguardando outro desafiante.",
                            0x95A5A6
                        )
                    ],
                    components: []
                });
            }

            if (i.customId === `rpg_lutar_${j.id}`) {
                encontros.delete(j.id);
                coletor.stop();

                await i.update({
                    embeds: [
                        embedBase(
                            "⚔️ Você escolheu lutar!",
                            "Você aperta sua arma e encara a criatura. O combate começa!",
                            0xE74C3C
                        )
                    ],
                    components: []
                });

                return iniciarBatalha(msg.channel, j, nome, false);
            }
        } catch (erro) {
            console.error("[RPG] Erro no encontro:", erro);
        }
    });

    coletor.on("end", async () => {
        if (encontros.has(j.id)) {
            encontros.delete(j.id);
            await resposta.edit({ components: [] }).catch(() => {});
        }
    });
}

async function comandoChefe(msg, j) {
    if (batalhas.has(j.id) || encontros.has(j.id)) {
        return msg.reply("⚠️ Termine seu combate atual primeiro.");
    }

    if (cooldown(j.ultimoChefe, COOLDOWN_CHEFE)) {
        return msg.reply(
            `⏳ O próximo desafio de chefe estará disponível em **${restante(j.ultimoChefe, COOLDOWN_CHEFE)}s**.`
        );
    }

    const mapa = MAPAS[j.mapaAtual] || MAPAS["Vila Inicial"];

    j.ultimoChefe = Date.now();
    salvarJogador(j);

    return iniciarBatalha(msg.channel, j, mapa.chefe, true, 1.5);
}

async function comandoViajar(msg, j, args) {
    const nome = args.join(" ").trim();

    if (!nome) {
        return msg.reply({
            embeds: [
                embedBase(
                    "🗺️ Escolha seu destino",
                    Object.entries(MAPAS).map(([n, m]) =>
                        `${j.nivel >= m.nivelMin ? "✅" : "🔒"} **${n}** — Nível ${m.nivelMin}`
                    ).join("\n") +
                    "\n\nUse `,viajar NOME DO MAPA`."
                )
            ]
        });
    }

    const destino = Object.keys(MAPAS).find(
        n => n.toLowerCase() === nome.toLowerCase()
    );

    if (!destino) {
        return msg.reply("❌ Mapa não encontrado. Use `,mapas` para consultar as regiões.");
    }

    const mapa = MAPAS[destino];

    if (j.nivel < mapa.nivelMin) {
        return msg.reply(
            `🔒 Você precisa alcançar o nível **${mapa.nivelMin}** para viajar até **${destino}**.`
        );
    }

    if (batalhas.has(j.id) || encontros.has(j.id)) {
        return msg.reply("⚠️ Você não pode viajar durante um combate.");
    }

    j.mapaAtual = destino;
    salvarJogador(j);

    return msg.reply({
        embeds: [
            embedBase(
                `🗺️ Bem-vindo a ${destino}`,
                `${mapa.descricao}\n\n` +
                `📜 Nível recomendado: **${mapa.nivelMin}–${mapa.nivelMax}**\n` +
                `👑 Chefe da região: **${mapa.chefe}**\n\n` +
                "Novos desafios aguardam sua chegada.",
                mapa.cor
            )
        ]
    });
}

async function comandoDungeon(msg, j, args) {
    const nome = args.join(" ").trim();

    if (!nome) {
        return msg.reply({
            embeds: [
                embedBase(
                    "🏰 Masmorras do mundo",
                    Object.entries(DUNGEONS).map(([n, d]) =>
                        `${j.nivel >= d.nivel ? "✅" : "🔒"} **${n}**\n` +
                        `Nível ${d.nivel} • ${d.salas} salas • ${d.premio} moedas`
                    ).join("\n\n") +
                    "\n\nUse `,dungeon NOME DA MASMORRA`."
                )
            ]
        });
    }

    const chave = Object.keys(DUNGEONS).find(
        n => n.toLowerCase() === nome.toLowerCase()
    );

    if (!chave) return msg.reply("❌ Masmorra não encontrada.");

    const d = DUNGEONS[chave];

    if (j.nivel < d.nivel) {
        return msg.reply(`🔒 Você precisa do nível **${d.nivel}** para entrar.`);
    }

    if (batalhas.has(j.id) || encontros.has(j.id)) {
        return msg.reply("⚠️ Termine seu combate atual antes de entrar.");
    }

    let sala = 0;
    let totalXP = 0;

    const avancar = async () => {
        if (sala >= d.salas) {
            j.moedas += d.premio;
            j.dungeonsConcluidas++;
            recuperarVida(j);
            salvarJogador(j);

            return msg.channel.send({
                embeds: [
                    embedBase(
                        "🏆 MASMORRA CONCLUÍDA!",
                        `Você atravessou as salas de **${chave}** e sobreviveu aos desafios!\n\n` +
                        `💰 Recompensa: **${d.premio} moedas**\n` +
                        `✨ XP acumulado: **${totalXP}**\n` +
                        `❤️ Vida restaurada: **${j.vida}/${j.vidaMax} HP**`,
                        0xF1C40F
                    )
                ]
            });
        }

        sala++;

        const inimigo = escolher(d.inimigos);

        const aviso = await msg.channel.send({
            embeds: [
                embedBase(
                    `🏰 ${chave} — Sala ${sala}/${d.salas}`,
                    `Portas antigas se abrem. À frente, **${inimigo}** protege a passagem.\n\n` +
                    "Prepare-se para lutar.",
                    0x9B59B6
                )
            ]
        });

        const batalhaOriginal = iniciarBatalha;

        // A próxima sala só é iniciada depois que a batalha termina.
        const verificar = setInterval(() => {
            if (batalhas.has(j.id)) return;

            clearInterval(verificar);

            const ganho = Math.floor(xpNecessario(j.nivel) * 0.08);
            totalXP += ganho;
            adicionarXP(j, ganho);
            salvarJogador(j);

            if (j.vida > 0) {
                recuperarVida(j);
                avancar().catch(console.error);
            }
        }, 2000);

        await batalhaOriginal(msg.channel, j, inimigo, false, 1.2);
    };

    await avancar();
}

async function comandoTreinar(msg, j, args) {
    if (cooldown(j.ultimoTreino, 5000)) {
        return msg.reply(
            `⏳ Aguarde **${restante(j.ultimoTreino, 5000)}s** para treinar novamente.`
        );
    }

    const atributo = (args[0] || "").toLowerCase();
    const quantidade = Math.max(1, Math.min(20, Number(args[1]) || 1));
    const custo = quantidade * 25;

    const atributos = {
        forca: "ataque",
        força: "ataque",
        ataque: "ataque",
        vida: "vidaMax",
        hp: "vidaMax",
        defesa: "defesa",
        velocidade: "velocidade"
    };

    const alvo = atributos[atributo];

    if (!alvo) {
        return msg.reply(
            "🏋️ Use `,treinar forca 5`, `,treinar vida 5`, `,treinar defesa 5` ou `,treinar velocidade 5`."
        );
    }

    if (j.moedas < custo) {
        return msg.reply(`💰 Você precisa de **${custo} moedas** para esse treinamento.`);
    }

    j.moedas -= custo;

    if (alvo === "vidaMax") {
        j.vidaMax += quantidade * 8;
        j.vida = j.vidaMax;
    } else if (alvo === "velocidade") {
        j.velocidade += quantidade;
    } else {
        j[alvo] += quantidade * 2;
    }

    j.ultimoTreino = Date.now();
    salvarJogador(j);

    return msg.reply({
        embeds: [
            embedBase(
                "🏋️ Treinamento concluído",
                `Você dedicou tempo ao treinamento de **${atributo}**.\n\n` +
                `📈 Pontos treinados: **${quantidade}**\n` +
                `💰 Custo: **${custo} moedas**\n` +
                `💰 Saldo restante: **${j.moedas} moedas**`,
                0x2ECC71
            )
        ]
    });
}

async function comandoComprar(msg, j, args) {
    const id = args.join(" ").toLowerCase();

    const arma = ARMAS.find(a => a.id === id);
    const armadura = ARMADURAS.find(a => a.id === id);
    const item = arma || armadura;

    if (!item) {
        return msg.reply("❌ Item não encontrado. Use `,loja` para consultar os IDs.");
    }

    const preco = item.preco ||
        (arma ? Math.floor(item.ataque * 30) : Math.floor(item.defesa * 25));

    const colecao = arma ? j.armas : j.armaduras;

    if (colecao.includes(item.id)) {
        return msg.reply("⚠️ Você já possui esse equipamento.");
    }

    if (j.moedas < preco) {
        return msg.reply(`💰 Você precisa de **${preco} moedas** para comprar esse item.`);
    }

    j.moedas -= preco;
    colecao.push(item.id);
    salvarJogador(j);

    return msg.reply({
        embeds: [
            embedBase(
                "🛍️ Equipamento adquirido!",
                `Você comprou **${item.nome}**.\n\n` +
                `${arma ? `⚔️ Ataque: +${item.ataque}` : `🛡️ Defesa: +${item.defesa}`}\n` +
                `💰 Preço: **${preco} moedas**\n` +
                `💰 Saldo: **${j.moedas} moedas**\n\n` +
                `Use \`,equipar ${Math.max(1, colecao.length)}\` para equipar o item.`,
                RARIDADES[item.raridade].cor
            )
        ]
    });
}

async function comandoEquipar(msg, j, args, tipo = "arma") {
    const armaduras = tipo === "armadura";
    const colecao = (armaduras ? j.armaduras : j.armas)
        .map(armaduras ? armaduraPorId : armaPorId)
        .filter(Boolean);

    const indice = Number(args[0]) - 1;
    const item = colecao[indice];

    if (!Number.isInteger(indice) || !item) {
        return msg.reply(
            `❌ Número inválido. Consulte seu inventário e use \`,${armaduras ? "equipararmadura" : "equipar"} número\`.`
        );
    }

    if (armaduras) j.armaduraAtual = item.id;
    else j.armaAtual = item.id;

    salvarJogador(j);

    return msg.reply({
        embeds: [
            embedBase(
                "✨ Equipamento equipado",
                `Você equipou **${item.nome}**.\n\n` +
                `${armaduras ? `🛡️ Defesa: +${item.defesa}` : `⚔️ Ataque: +${item.ataque}`}\n` +
                `🌟 Raridade: **${RARIDADES[item.raridade].nome}**`,
                RARIDADES[item.raridade].cor
            )
        ]
    });
}

async function processarMensagem(msg) {
    if (!msg.guild || msg.author.bot || !msg.content.startsWith(PREFIX)) return;

    const partes = msg.content.slice(PREFIX.length).trim().split(/\s+/);
    const comando = (partes.shift() || "").toLowerCase();
    const args = partes;

    if (!comando) return;

    const j = getJogador(msg.author.id, msg.author.username);

    try {
        switch (comando) {
            case "rpg":
            case "rpghelp":
            case "ajuda":
                return msg.reply({ embeds: [embedAjuda()] });

            case "perfil":
                return msg.reply({ embeds: [embedPerfil(msg, j)] });

            case "status":
                return msg.reply({
                    embeds: [
                        embedBase(
                            "📊 Seus atributos",
                            `❤️ Vida: **${j.vida}/${j.vidaMax}**\n` +
                            `⚔️ Ataque: **${ataqueTotal(j)}**\n` +
                            `🛡️ Defesa: **${defesaTotal(j)}**\n` +
                            `💨 Velocidade: **${j.velocidade}**\n` +
                            `🍀 Sorte: **${j.sorte}**\n` +
                            `🌍 Mapa: **${j.mapaAtual}**`
                        )
                    ]
                });

            case "inventario":
            case "inventário":
                return msg.reply({ embeds: [criarInventario(j)] });

            case "loja":
                return msg.reply({ embeds: [criarLoja(j)] });

            case "comprar":
                return comandoComprar(msg, j, args);

            case "cacar":
            case "caçar":
                return comandoCacar(msg, j);

            case "chefao":
            case "chefão":
                return comandoChefe(msg, j);

            case "treinar":
                return comandoTreinar(msg, j, args);

            case "equipar":
                return comandoEquipar(msg, j, args);

            case "equipararmadura":
            case "equipar-armadura":
                return comandoEquipar(msg, j, args, "armadura");

            case "viajar":
                return comandoViajar(msg, j, args);

            case "mapas":
                return msg.reply({
                    embeds: [
                        embedBase(
                            "🗺️ Atlas das regiões",
                            Object.entries(MAPAS).map(([nome, mapa]) =>
                                `${j.nivel >= mapa.nivelMin ? "🟢" : "🔒"} **${nome}**\n` +
                                `${mapa.descricao}\n` +
                                `Nível mínimo: **${mapa.nivelMin}**`
                            ).join("\n\n")
                        )
                    ]
                });

            case "dungeon":
            case "dungeons":
                return comandoDungeon(msg, j, args);

            default:
                return;
        }
    } catch (erro) {
        console.error("[RPG] Erro ao executar comando:", erro);

        if (!msg.replied && !msg.deferred) {
            await msg.reply(
                "❌ Ocorreu um erro ao executar esse comando. Confira o console do bot."
            ).catch(() => {});
        }
    }
}

module.exports = function iniciarRpgBatalhas(client) {
    if (!client || typeof client.on !== "function") {
        throw new Error("[RPG] Cliente Discord inválido.");
    }

    client.on("messageCreate", processarMensagem);

    client.on("interactionCreate", async interaction => {
        if (!interaction.isButton()) return;

        // Os botões de encontro possuem coletores próprios.
        // Esta verificação evita interferência de outros módulos.
        if (interaction.customId.startsWith("rpg_lutar_") ||
            interaction.customId.startsWith("rpg_fugir_")) {
            return;
        }
    });

    console.log(
        `[RPG] Crônicas do Caos carregado: ${Object.keys(MONSTROS).length} monstros, ` +
        `${Object.keys(CHEFES).length} chefes, ${Object.keys(MAPAS).length} mapas.`
    );

    return client;
};
