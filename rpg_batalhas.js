const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const PREFIX = ",";
const DB_FILE = path.join(__dirname, "rpg_batalhas_db.json");

const IMAGENS = {
    dragao_oriente:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999482402050178/0ccb8cb8-4655-492c-a2ad-108f2aa05c03.png?backend=b2&ex=6ac290f1&is=6ac13f71&hm=8035f92b487e4309e5ef031520b7dfa357490ab63a5a295a4e918c626ad9b64d&.png",

    fenrir:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999228268904740/0a46ddd9-eda2-4dd9-9af7-c0ca33a459f6.png?backend=b2&ex=6ac290b5&is=6ac13f35&hm=e9c02c1b7b950bf3e1bf35058d89517179b79ac8866bb06827e4b2e04b62fe7c&.png",

    grifo_celestial:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999585250574537/9fbe1b65-bdd8-42c2-a00d-916d6f7718f1.png?backend=b2&ex=6ac2910a&is=6ac13f8a&hm=8c59db4dabc8204e2e6005f57853af95b80b66064d938ee3edf43a61d53a4081&.png",

    serpente_eclipse:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999666833981450/20762b16-0ee9-49a1-8233-967c3efbe1f5.png?backend=b2&ex=6ac2911d&is=6ac13f9d&hm=a4e1a54169bba26689350e306e8abf3930c7bed08035d313c7f7f31a0b029df2&.png",

    unicornio_astral:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999729979236352/8c36634c-1390-4d7f-9d70-2f77d84ae4ff.png?backend=b2&ex=6ac2912c&is=6ac13fac&hm=ef7965dc1814fe6a3df209dd449897b2dda7f8f5f5507cdc77cf2040a969188&.png",

    dragao_gelo:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999811680079932/749a5594-31c3-448a-9003-e72c226aacd7.png?backend=b2&ex=6ac29140&is=6ac13fc0&hm=7c99139644cb4a71e7c546a82908cac6f33b31177a4ab4c042c3dfe4e7c4143f&.png",

    fenix:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999911000932462/231c04c4-a1ee-4c65-b499-6db234641f00.png?backend=b2&ex=6ac29157&is=6ac13fd7&hm=ba096948446f2d2f059f43c24426a46eab97a07281a46e7f3283e227d505a936&.png",

    dragao_noite:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999987140137170/26405306-8df5-40ff-8496-3ca4c7148151.png?backend=b2&ex=6ac2916a&is=6ac13fea&hm=579ae7a5ae645a64cba1a5b4c7902ef8bde1db353549b64ca55dab6ee9926e57&.png",

    kraken:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000069839233124/afbd7b4b-c626-44d4-949a-f2b8062cd923.png?backend=b2&ex=6ac2917d&is=6ac13ffd&hm=02ae3751fabfb2ee495b009b22abc20af6156ac381ba4a518524a0a0cdc0ff68&.png",

    minotauro:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000173837000764/48f4d181-7912-428e-8a8c-9eac0470b201.png?backend=b2&ex=6ac29196&is=6ac14016&hm=5ae82efbe1ee593007694d013348f64f4bd61ef599f91eba843c538de1ca4bc5&.png",

    kitsune:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000273388933171/ac3ba6bf-085c-4189-abdd-c7b3b6c7b5de.png?backend=b2&ex=6ac291ae&is=6ac1402e&hm=10f9e585e5e93500617b82b064e17ac93a516606edfcfd56c4588cc7cdb48cf0&.png",

    basilisco:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000399146619090/cb0b74cd-08ae-41d6-8304-6e31df9ba68c.png?backend=b2&ex=6ac291cc&is=6ac1404c&hm=51e4371c1441559af26e8a669d99b86936cba2a6f6efd65f29c9e7cb2af0ae82&.png",

    quimera:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000610221039697/7b7bc185-e46a-4df3-a4a5-eb5f7768aaa0.png?backend=b2&ex=6ac291fe&is=6ac1407e&hm=c93127068c6e80b2cc3c753fd2bfe127c9a754bac75893a0af1a8c4e959d5f3a&.png",

    pegasus:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000694736130169/1bfce28c-d0bc-46e2-9b53-4e16dbcc8e7d.png?backend=b2&ex=6ac29212&is=6ac14092&hm=91b4b7798c5526689b514e6a592481a28b1088c5eae3398b6ae2e9c21e532095&.png",

    cerbero:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000793499275435/eca510ab-68ed-4c3c-92c4-21b7bfb35728.png?backend=b2&ex=6ac2922a&is=6ac140aa&hm=7393a45e0b7b551b1e1978350411cc424c82c7b4aef46b447e79517c5d20d654&.png",

    hidra:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000869294805116/76e0d3b8-473e-437f-87e8-acc8c9004811.png?backend=b2&ex=6ac2923c&is=6ac140bc&hm=1ad8feee03fe54265b19f1679aa99aef14da4b5f53e458306e44d0a0e1c545e7&.png",

    leviata:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556000983195066438/51ab2e53-065e-43e5-8e33-abbf767d6751.png?backend=b2&ex=6ac29257&is=6ac140d7&hm=c0801f465092d75124ea48cdb13c4f3a9bb66ba6964ebe34b49af17b9fe7f545&.png",

    grifo_sombrio:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556001086777589770/cfa594b1-c2ab-438d-96e7-e80df5e3979e.png?backend=b2&ex=6ac29270&is=6ac140f0&hm=95d1f456dbd1c1661a996b673093a6c8c766a16f43012cbc65c2098eee8d589c&.png",

    lobo_lunar:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1556001324674326619/5f18d5bf-87eb-4c66-80c5-ed26f2bddbdb.png?backend=b2&ex=6ac292a8&is=6ac14128&hm=f2d60dd8a99d0b74cc3fa56c27b44ce3def9da7f6718c1a93f78ba0ca7d04f18&.png",

    guardiao_astral:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555993560698847262/Screenshot_20261003-1413022.jpg?backend=b2&ex=6ac28b6d&is=6ac139ed&hm=1a25112b8c4dfce3de89e22bec32a46f3d4975d8177c9998b76be76759cb6a52&.png"
};

const PETS = {
    lobo_lunar: {
        nome: "Lobo Lunar",
        emoji: "🐺",
        raridade: "Comum",
        hp: 300,
        ataque: 55,
        defesa: 40,
        velocidade: 55
    },

    fenrir: {
        nome: "Fenrir",
        emoji: "🐺",
        raridade: "Épico",
        hp: 780,
        ataque: 180,
        defesa: 140,
        velocidade: 160
    },

    kitsune: {
        nome: "Kitsune",
        emoji: "🦊",
        raridade: "Raro",
        hp: 520,
        ataque: 125,
        defesa: 100,
        velocidade: 155
    },

    dragao_gelo: {
        nome: "Dragão de Gelo",
        emoji: "🐉",
        raridade: "Raro",
        hp: 950,
        ataque: 210,
        defesa: 170,
        velocidade: 140
    },

    dragao_oriente: {
        nome: "Dragão do Oriente",
        emoji: "🐉",
        raridade: "Mítico",
        hp: 850,
        ataque: 190,
        defesa: 150,
        velocidade: 120
    },

    grifo_celestial: {
        nome: "Grifo Celestial",
        emoji: "🦅",
        raridade: "Raro",
        hp: 720,
        ataque: 160,
        defesa: 130,
        velocidade: 170
    },

    unicornio_astral: {
        nome: "Unicórnio Astral",
        emoji: "🦄",
        raridade: "Raro",
        hp: 650,
        ataque: 140,
        defesa: 160,
        velocidade: 190
    },

    fenix: {
        nome: "Fênix",
        emoji: "🔥",
        raridade: "Lendário",
        hp: 900,
        ataque: 220,
        defesa: 150,
        velocidade: 160
    },

    kraken: {
        nome: "Kraken",
        emoji: "🦑",
        raridade: "Lendário",
        hp: 1250,
        ataque: 270,
        defesa: 220,
        velocidade: 105
    },

    minotauro: {
        nome: "Minotauro",
        emoji: "🐂",
        raridade: "Raro",
        hp: 1050,
        ataque: 230,
        defesa: 190,
        velocidade: 95
    },

    basilisco: {
        nome: "Basilisco",
        emoji: "🐍",
        raridade: "Épico",
        hp: 1150,
        ataque: 255,
        defesa: 180,
        velocidade: 145
    },

    hidra: {
        nome: "Hidra",
        emoji: "🐲",
        raridade: "Lendário",
        hp: 1450,
        ataque: 300,
        defesa: 230,
        velocidade: 125
    },

    serpente_eclipse: {
        nome: "Serpente do Eclipse",
        emoji: "🐍",
        raridade: "Lendário",
        hp: 1200,
        ataque: 260,
        defesa: 200,
        velocidade: 180
    },

    pegasus: {
        nome: "Pégasus",
        emoji: "🪽",
        raridade: "Épico",
        hp: 900,
        ataque: 210,
        defesa: 170,
        velocidade: 210
    },

    guardiao_astral: {
        nome: "Guardião Astral",
        emoji: "🛡️",
        raridade: "Secreto",
        hp: 1800,
        ataque: 350,
        defesa: 300,
        velocidade: 170
    },

    cerbero: {
        nome: "Cérbero",
        emoji: "🐺",
        raridade: "Épico",
        hp: 1550,
        ataque: 330,
        defesa: 250,
        velocidade: 150
    },

    grifo_sombrio: {
        nome: "Grifo Sombrio",
        emoji: "🦅",
        raridade: "Lendário",
        hp: 1500,
        ataque: 340,
        defesa: 240,
        velocidade: 200
    },

    quimera: {
        nome: "Quimera",
        emoji: "🦁",
        raridade: "Lendário",
        hp: 1700,
        ataque: 380,
        defesa: 280,
        velocidade: 160
    },

    dragao_noite: {
        nome: "Dragão da Noite",
        emoji: "🐉",
        raridade: "Secreto",
        hp: 1900,
        ataque: 420,
        defesa: 320,
        velocidade: 200
    },

    leviata: {
        nome: "Leviatã",
        emoji: "🌊",
        raridade: "Secreto",
        hp: 2300,
        ataque: 500,
        defesa: 380,
        velocidade: 180
    }
};

for (const [id, pet] of Object.entries(PETS)) {
    pet.id = id;
    pet.imagem = IMAGENS[id] || null;
}

const MAPAS = [
    {
        id: "floresta_lunar",
        nome: "Floresta Lunar",
        emoji: "🌙",
        nivel: 1,
        monstros: [
            ["Lobo Lunar Selvagem", "🐺", 180, 24, 12, 18],
            ["Coruja Sombria", "🦉", 150, 28, 9, 24],
            ["Javali Lunar", "🐗", 230, 27, 18, 12],
            ["Pantera da Névoa", "🐆", 200, 32, 14, 26]
        ],
        elite: ["Lobo Alfa Lunar", "🐺", 520, 48, 28, 28],
        boss: ["Guardião da Lua", "🌑", 2600, 95, 55, 32]
    },

    {
        id: "reino_glacial",
        nome: "Reino Glacial",
        emoji: "❄️",
        nivel: 10,
        monstros: [
            ["Lobo Glacial", "🐺", 430, 55, 32, 24],
            ["Urso de Gelo", "🐻", 620, 62, 48, 13],
            ["Serpente Congelada", "🐍", 500, 70, 29, 28],
            ["Corvo de Gelo", "🐦", 360, 64, 25, 34]
        ],
        elite: ["Gigante Glacial", "🗿", 1250, 105, 75, 17],
        boss: ["Rei do Gelo", "👑", 5200, 175, 115, 27]
    },

    {
        id: "vulcao_caos",
        nome: "Vulcão do Caos",
        emoji: "🌋",
        nivel: 20,
        monstros: [
            ["Lagarto de Lava", "🦎", 850, 100, 55, 20],
            ["Salamandra Infernal", "🔥", 980, 112, 60, 23],
            ["Golem de Magma", "🗿", 1200, 105, 85, 12],
            ["Serpente Ígnea", "🐍", 900, 125, 52, 29]
        ],
        elite: ["Demônio Vulcânico", "😈", 2400, 190, 105, 27],
        boss: ["Senhor da Lava", "🌋", 9500, 300, 165, 25]
    },

    {
        id: "abismo_oceanico",
        nome: "Abismo Oceânico",
        emoji: "🌊",
        nivel: 35,
        monstros: [
            ["Tubarão Abissal", "🦈", 1800, 190, 105, 30],
            ["Medusa Sombria", "🪼", 1450, 210, 90, 22],
            ["Caranguejo Colossal", "🦀", 2200, 175, 155, 13],
            ["Enguia Elétrica", "⚡", 1600, 225, 95, 36]
        ],
        elite: ["Leviatã Jovem", "🐋", 4300, 330, 210, 22],
        boss: ["Abissal", "👁️", 17000, 500, 310, 31]
    },

    {
        id: "ruinas_antigas",
        nome: "Ruínas Antigas",
        emoji: "🏜️",
        nivel: 50,
        monstros: [
            ["Escorpião Ancestral", "🦂", 3000, 330, 180, 28],
            ["Guardião de Pedra", "🗿", 3900, 310, 280, 12],
            ["Múmia Real", "🧟", 3300, 350, 205, 20],
            ["Serpente do Templo", "🐍", 2900, 370, 190, 32]
        ],
        elite: ["Colosso das Ruínas", "🗿", 8000, 560, 390, 17],
        boss: ["Colosso Ancestral", "🏛️", 28000, 850, 600, 22]
    },

    {
        id: "dimensao_astral",
        nome: "Dimensão Astral",
        emoji: "🌌",
        nivel: 65,
        monstros: [
            ["Lince Estelar", "🐈", 5600, 620, 340, 40],
            ["Ser Astral", "🐉", 6500, 700, 370, 32],
            ["Fera Nebulosa", "👾", 7200, 675, 430, 27],
            ["Corvo Cósmico", "🐦", 5000, 760, 300, 45]
        ],
        elite: ["Sentinela Astral", "🛡️", 15000, 1050, 760, 35],
        boss: ["Arauto Astral", "✨", 50000, 1500, 1000, 42]
    },

    {
        id: "reino_apocalipse",
        nome: "Reino do Apocalipse",
        emoji: "☠️",
        nivel: 80,
        monstros: [
            ["Cão do Apocalipse", "🐕", 9500, 980, 520, 36],
            ["Ceifador Menor", "💀", 10500, 1080, 570, 33],
            ["Demônio da Ruína", "😈", 12000, 1160, 650, 30],
            ["Ser do Vazio", "👹", 10000, 1240, 600, 43]
        ],
        elite: ["Arauto da Ruína", "☠️", 26000, 1750, 1100, 38],
        boss: ["Arauto do Fim", "☠️", 85000, 2500, 1650, 36]
    },

    {
        id: "dominio_divino",
        nome: "Domínio Divino",
        emoji: "👑",
        nivel: 100,
        monstros: [
            ["Leão Celestial", "🦁", 15000, 1700, 1000, 40],
            ["Serafim Caído", "😇", 17000, 1900, 1100, 44],
            ["Guardião Divino", "🛡️", 20000, 1800, 1450, 30],
            ["Dragão Celestial", "🐉", 23000, 2100, 1300, 36]
        ],
        elite: ["Arcanjo Supremo", "👼", 50000, 2900, 2100, 46],
        boss: ["Executor Divino", "⚜️", 140000, 4200, 3000, 45]
    }
];

const UNLOCKS = {
    fenrir: ["floresta_lunar", "normal", 0.035],
    kitsune: ["floresta_lunar", "normal", 0.025],

    dragao_gelo: ["reino_glacial", "normal", 0.035],
    dragao_oriente: ["reino_glacial", "elite", 0.035],
    grifo_celestial: ["reino_glacial", "elite", 0.025],

    fenix: ["vulcao_caos", "elite", 0.03],

    minotauro: ["ruinas_antigas", "normal", 0.025],
    basilisco: ["ruinas_antigas", "elite", 0.025],

    kraken: ["abismo_oceanico", "normal", 0.02],
    hidra: ["abismo_oceanico", "elite", 0.018],
    serpente_eclipse: ["abismo_oceanico", "elite", 0.015],

    pegasus: ["dimensao_astral", "normal", 0.02],
    unicornio_astral: ["dimensao_astral", "elite", 0.015],
    guardiao_astral: ["dimensao_astral", "boss", 0.08],

    cerbero: ["reino_apocalipse", "normal", 0.02],
    grifo_sombrio: ["reino_apocalipse", "elite", 0.015],
    quimera: ["reino_apocalipse", "elite", 0.012],
    dragao_noite: ["reino_apocalipse", "boss", 0.06],

    leviata: ["dominio_divino", "boss", 0.045]
};

let DB = {};

try {
    if (fs.existsSync(DB_FILE)) {
        DB = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    }
} catch {
    DB = {};
}

const batalhas = new Map();
const duelos = new Map();
const MAX_PARTICIPANTES = 5;

function normalizar(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

function salvar() {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(DB, null, 2)
    );
}

function jogador(id) {
    if (!DB[id]) {
        DB[id] = {
            nivel: 1,
            xp: 0,
            vitorias: 0,
            derrotas: 0,
            bossesDerrotados: 0,
            exploracoes: 0,

            criaturas: {
                lobo_lunar: {
                    nivel: 1,
                    xp: 0
                }
            },

            equipe: ["lobo_lunar"],
            petAtivo: "lobo_lunar",

            mapaAtual: "floresta_lunar",

            mapasDescobertos: {
                floresta_lunar: true
            }
        };
    }

    const u = DB[id];

    u.criaturas = u.criaturas || {};
    u.equipe = u.equipe || Object.keys(u.criaturas);

    if (!u.criaturas.lobo_lunar) {
        u.criaturas.lobo_lunar = {
            nivel: 1,
            xp: 0
        };

        if (!u.equipe.includes("lobo_lunar")) {
            u.equipe.push("lobo_lunar");
        }
    }

    u.petAtivo = u.petAtivo || "lobo_lunar";
    u.mapaAtual = u.mapaAtual || "floresta_lunar";

    u.mapasDescobertos =
        u.mapasDescobertos || {
            floresta_lunar: true
        };

    return u;
}

function pegarMapa(id) {
    return (
        MAPAS.find(m => m.id === id) ||
        MAPAS[0]
    );
}

function desbloquearMapas(u) {
    for (const mapa of MAPAS) {
        if (u.nivel >= mapa.nivel) {
            u.mapasDescobertos[mapa.id] = true;
        }
    }
}

function procurarMapa(nome) {
    const busca = normalizar(nome);

    return MAPAS.find(mapa =>
        normalizar(mapa.id) === busca ||
        normalizar(mapa.nome) === busca ||
        (
            busca &&
            normalizar(mapa.nome).includes(busca)
        ) ||
        (
            busca &&
            normalizar(mapa.id).includes(busca)
        )
    );
}

function procurarPet(nome) {
    const busca = normalizar(nome);

    return Object.keys(PETS).find(id =>
        normalizar(id) === busca ||
        normalizar(PETS[id].nome) === busca ||
        normalizar(PETS[id].nome).includes(busca)
    );
}

function estatisticasPet(userId, petId) {
    const u = jogador(userId);
    const pet = PETS[petId];

    const nivel = Math.min(
        100,
        u.criaturas[petId]?.nivel || 1
    );

    const multiplicador =
        0.62 + nivel * 0.018;

    return {
        maxHp: Math.floor(
            pet.hp * multiplicador
        ),

        ataque: Math.floor(
            pet.ataque * multiplicador
        ),

        defesa: Math.floor(
            pet.defesa * multiplicador
        ),

        velocidade: Math.floor(
            pet.velocidade *
            (0.7 + nivel * 0.012)
        )
    };
}

function ganharXpPet(userId, petId, quantidade) {
    const u = jogador(userId);

    if (!u.criaturas[petId]) {
        return;
    }

    const pet = u.criaturas[petId];

    while (pet.nivel < 100) {
        const limite =
            90 + pet.nivel * 45;

        if (
            pet.xp + quantidade <
            limite
        ) {
            pet.xp += quantidade;
            break;
        }

        pet.xp += quantidade - limite;
        pet.nivel++;
    }

    if (pet.nivel >= 100) {
        pet.nivel = 100;
        pet.xp = 0;
    }
}

function ganharXpTreinador(userId, quantidade) {
    const u = jogador(userId);

    while (u.nivel < 100) {
        const limite =
            180 + u.nivel * 85;

        if (
            u.xp + quantidade <
            limite
        ) {
            u.xp += quantidade;
            break;
        }

        u.xp += quantidade - limite;
        u.nivel++;

        desbloquearMapas(u);
    }

    if (u.nivel >= 100) {
        u.nivel = 100;
        u.xp = 0;
    }
}

function barraHp(hp, maxHp) {
    const total = 14;

    const preenchido = Math.max(
        0,
        Math.min(
            total,
            Math.round(
                (hp / maxHp) * total
            )
        )
    );

    return (
        "█".repeat(preenchido) +
        "░".repeat(total - preenchido)
    );
}

function calcularDano(ataque, defesa) {
    return Math.max(
        5,
        Math.floor(
            ataque *
                (0.72 + Math.random() * 0.32) -
            defesa *
                (0.25 + Math.random() * 0.18)
        )
    );
}

function sortearTipo() {
    const sorteio = Math.random();

    if (sorteio < 0.012) {
        return "boss";
    }

    if (sorteio < 0.075) {
        return "elite";
    }

    return "normal";
}

function criarInimigo(mapa, tipo) {
    let dados;

    if (tipo === "normal") {
        dados =
            mapa.monstros[
                Math.floor(
                    Math.random() *
                    mapa.monstros.length
                )
            ];
    }

    if (tipo === "elite") {
        dados = mapa.elite;
    }

    if (tipo === "boss") {
        dados = mapa.boss;
    }

    return {
        nome: dados[0],
        emoji: dados[1],

        maxHp: dados[2],
        hp: dados[2],

        ataque: dados[3],
        defesa: dados[4],
        velocidade: dados[5],

        tipo,
        turno: 0
    };
}

function tentarDesbloquearPet(
    u,
    mapa,
    tipo
) {
    const candidatos = [];

    for (
        const [petId, regra]
        of Object.entries(UNLOCKS)
    ) {
        if (u.criaturas[petId]) {
            continue;
        }

        const mapaNecessario = regra[0];
        const tipoNecessario = regra[1];
        const chance = regra[2];

        if (
            mapaNecessario !== mapa.id ||
            tipoNecessario !== tipo
        ) {
            continue;
        }

        if (Math.random() < chance) {
            candidatos.push(petId);
        }
    }

    if (!candidatos.length) {
        return null;
    }

    return candidatos[
        Math.floor(
            Math.random() *
            candidatos.length
        )
    ];
}

function embedPetDesbloqueado(petId) {
    const pet = PETS[petId];

    const embed = new EmbedBuilder()
        .setColor(0xf1c40f)
        .setTitle(
            "✨ NOVO PET DESBLOQUEADO!"
        )
        .setDescription(
            `${pet.emoji} **${pet.nome}**\n\n` +
            `⭐ Raridade: **${pet.raridade}**\n\n` +
            `Use **,invocar ${petId}** ` +
            `para escolher este Pet.`
        );

    if (pet.imagem) {
        embed.setImage(pet.imagem);
    }

    return embed;
}

function embedEncontro(batalha, texto) {
    const mapa = batalha.mapa;
    const inimigo = batalha.enemy;

    return new EmbedBuilder()
        .setColor(
            batalha.tipo === "boss"
                ? 0x8e44ad
                : batalha.tipo === "elite"
                ? 0xf1c40f
                : 0x3498db
        )
        .setTitle(
            `${mapa.emoji} ${mapa.nome}`
        )
        .setDescription(
            `🌲 Você está explorando esta região...\n\n` +
            `${inimigo.emoji} **${inimigo.nome}** apareceu!\n\n` +
            `❤️ **${inimigo.hp} HP**\n` +
            `⚔️ **${inimigo.ataque} ATK**\n` +
            `🛡️ **${inimigo.defesa} DEF**\n\n` +
            texto
        );
}

function embedBatalha(batalha, texto = "") {
    let descricao =
        `${batalha.enemy.emoji} **${batalha.enemy.nome}**\n` +
        `❤️ ${barraHp(
            batalha.enemy.hp,
            batalha.enemy.maxHp
        )} ` +
        `${Math.max(
            0,
            batalha.enemy.hp
        )}/${batalha.enemy.maxHp}\n\n`;

    for (
        const participante
        of batalha.participantes
    ) {
        descricao +=
            `${participante.emoji} **${participante.nome}** — <@${participante.id}>\n` +
            `❤️ ${barraHp(
                participante.hp,
                participante.maxHp
            )} ` +
            `${Math.max(
                0,
                participante.hp
            )}/${participante.maxHp}\n\n`;
    }

    descricao += texto;

    return new EmbedBuilder()
        .setColor(0xe67e22)
        .setTitle(
            `⚔️ BATALHA — ${batalha.mapa.nome}`
        )
        .setDescription(descricao);
}

function botoesEncontro(id) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(
                    `rpg_iniciar_${id}`
                )
                .setLabel(
                    "⚔️ Iniciar Batalha"
                )
                .setStyle(
                    ButtonStyle.Danger
                ),

            new ButtonBuilder()
                .setCustomId(
                    `rpg_chamar_${id}`
                )
                .setLabel(
                    "👥 Chamar Aliados"
                )
                .setStyle(
                    ButtonStyle.Primary
                )
        );
}

function adicionarParticipante(
    batalha,
    userId
) {
    if (
        batalha.participantes.some(
            p => p.id === userId
        )
    ) {
        return false;
    }

    if (
        batalha.participantes.length >=
        MAX_PARTICIPANTES
    ) {
        return false;
    }

    const u = jogador(userId);

    const petId =
        u.petAtivo ||
        "lobo_lunar";

    const stats =
        estatisticasPet(
            userId,
            petId
        );

    const pet = PETS[petId];

    batalha.participantes.push({
        id: userId,
        pet: petId,

        nome: pet.nome,
        emoji: pet.emoji,

        hp: stats.maxHp,
        maxHp: stats.maxHp,

        ataque: stats.ataque,
        defesa: stats.defesa,
        vel: stats.velocidade
    });

    return true;
}

async function finalizarBatalha(
    batalha,
    canal,
    venceu
) {
    batalha.finalizada = true;

    batalhas.delete(
        batalha.id
    );

    for (
        const participante
        of batalha.participantes
    ) {
        const u =
            jogador(participante.id);

        if (venceu) {
            u.vitorias++;

            const xpTreinador =
                batalha.tipo === "boss"
                    ? 320
                    : batalha.tipo === "elite"
                    ? 130
                    : 55;

            const xpPet =
                batalha.tipo === "boss"
                    ? 420
                    : batalha.tipo === "elite"
                    ? 170
                    : 70;

            ganharXpTreinador(
                participante.id,
                xpTreinador
            );

            ganharXpPet(
                participante.id,
                participante.pet,
                xpPet
            );

            if (
                batalha.tipo === "boss"
            ) {
                u.bossesDerrotados++;
            }

            const novoPet =
                tentarDesbloquearPet(
                    u,
                    batalha.mapa,
                    batalha.tipo
                );

            if (novoPet) {
                u.criaturas[novoPet] = {
                    nivel: 1,
                    xp: 0
                };

                if (
                    !u.equipe.includes(
                        novoPet
                    )
                ) {
                    u.equipe.push(
                        novoPet
                    );
                }

                await canal
                    .send({
                        embeds: [
                            embedPetDesbloqueado(
                                novoPet
                            )
                        ]
                    })
                    .catch(() => {});
            }
        } else {
            u.derrotas++;
        }
    }

    salvar();
}

async function executarBatalha(
    batalha,
    canal
) {
    let turno = 0;

    while (
        batalha.enemy.hp > 0 &&
        batalha.participantes.some(
            p => p.hp > 0
        )
    ) {
        turno++;

        const vivos =
            batalha.participantes
                .filter(p => p.hp > 0)
                .sort(
                    (a, b) =>
                        b.vel - a.vel
                );

        let narrativa =
            `⚔️ **TURNO ${turno}**\n`;

        for (
            const atacante of vivos
        ) {
            if (
                batalha.enemy.hp <= 0
            ) {
                break;
            }

            const dano =
                calcularDano(
                    atacante.ataque,
                    batalha.enemy.defesa
                );

            batalha.enemy.hp =
                Math.max(
                    0,
                    batalha.enemy.hp -
                        dano
                );

            narrativa +=
                `\n${atacante.emoji} **${atacante.nome} ATACA!**\n` +
                `💥 **${dano} de dano!**\n` +
                `❤️ Inimigo: ${barraHp(
                    batalha.enemy.hp,
                    batalha.enemy.maxHp
                )} ` +
                `${batalha.enemy.hp}/${batalha.enemy.maxHp}\n`;
        }

        if (
            batalha.enemy.hp <= 0
        ) {
            break;
        }

        const alvo =
            vivos[
                Math.floor(
                    Math.random() *
                    vivos.length
                )
            ];

        let multiplicador = 1;

        if (
            batalha.tipo === "boss" &&
            turno % 4 === 0
        ) {
            multiplicador = 1.45;

            narrativa +=
                `\n👑 **${batalha.enemy.nome} usa uma habilidade especial!**\n`;
        }

        const dano =
            calcularDano(
                batalha.enemy.ataque *
                    multiplicador,
                alvo.defesa
            );

        alvo.hp =
            Math.max(
                0,
                alvo.hp - dano
            );

        narrativa +=
            `\n${batalha.enemy.emoji} **${batalha.enemy.nome} ATACA ${alvo.nome}!**\n` +
            `💥 **${dano} de dano!**\n` +
            `❤️ ${alvo.nome}: ${barraHp(
                alvo.hp,
                alvo.maxHp
            )} ${alvo.hp}/${alvo.maxHp}`;

        try {
            const msg =
                await canal.messages.fetch(
                    batalha.messageId
                );

            await msg.edit({
                embeds: [
                    embedBatalha(
                        batalha,
                        narrativa
                    )
                ],
                components: []
            });
        } catch {}

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    4200
                )
        );
    }

    const venceu =
        batalha.enemy.hp <= 0;

    try {
        const msg =
            await canal.messages.fetch(
                batalha.messageId
            );

        await msg.edit({
            embeds: [
                embedBatalha(
                    batalha,
                    venceu
                        ? "🏆 **VITÓRIA!**\nA criatura foi derrotada!"
                        : "💀 **DERROTA!**\nTodos os Pets caíram."
                )
            ],
            components: []
        });
    } catch {}

    await finalizarBatalha(
        batalha,
        canal,
        venceu
    );
}

function embedPerfil(userId) {
    const u = jogador(userId);

    const petId =
        u.petAtivo ||
        "lobo_lunar";

    const pet =
        PETS[petId];

    const stats =
        estatisticasPet(
            userId,
            petId
        );

    const mapa =
        pegarMapa(
            u.mapaAtual
        );

    const nivelPet =
        u.criaturas[petId]
            ?.nivel || 1;

    const embed =
        new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle(
                `👤 PERFIL RPG — ${pet.emoji} ${pet.nome}`
            )
            .setDescription(
                `🌟 Treinador: **Nv. ${u.nivel}/100**\n` +
                `✨ XP: **${u.xp}**\n` +
                `🗺️ Mapa: **${mapa.emoji} ${mapa.nome}**\n\n` +

                `🐾 Pet ativo: **${pet.nome} Nv. ${nivelPet}/100**\n` +
                `❤️ HP: **${stats.maxHp}**\n` +
                `⚔️ ATK: **${stats.ataque}**\n` +
                `🛡️ DEF: **${stats.defesa}**\n` +
                `💨 VEL: **${stats.velocidade}**\n\n` +

                `🏆 Vitórias: **${u.vitorias}**\n` +
                `💀 Derrotas: **${u.derrotas}**\n` +
                `👑 Bosses: **${u.bossesDerrotados}**\n` +
                `🌲 Explorações: **${u.exploracoes}**`
            );

    if (pet.imagem) {
        embed.setImage(
            pet.imagem
        );
    }

    return embed;
}

function embedPets(userId) {
    const u =
        jogador(userId);

    const lista =
        Object.entries(PETS)
            .map(
                ([id, pet]) => {
                    if (
                        u.criaturas[id]
                    ) {
                        return (
                            `🔓 ${pet.emoji} **${pet.nome}** — ` +
                            `Nv.${u.criaturas[id].nivel} — ` +
                            `${pet.raridade}`
                        );
                    }

                    return (
                        `🔒 ${pet.emoji} **${pet.nome}** — ` +
                        `${pet.raridade}`
                    );
                }
            )
            .join("\n");

    return new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle(
            "🐾 COLEÇÃO DE PETS"
        )
        .setDescription(lista);
}

function detalhesPet(
    userId,
    nome
) {
    const petId =
        procurarPet(nome);

    if (!petId) {
        return new EmbedBuilder()
            .setDescription(
                "❌ Pet não encontrado."
            );
    }

    const u =
        jogador(userId);

    const pet =
        PETS[petId];

    if (!u.criaturas[petId]) {
        return new EmbedBuilder()
            .setColor(0x555555)
            .setTitle(
                "🔒 PET BLOQUEADO"
            )
            .setDescription(
                `${pet.emoji} **${pet.nome}**\n\n` +
                `⭐ Raridade: **${pet.raridade}**\n\n` +
                `Continue vencendo batalhas ` +
                `para tentar desbloqueá-lo.`
            );
    }

    const stats =
        estatisticasPet(
            userId,
            petId
        );

    const embed =
        new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle(
                `${pet.emoji} ${pet.nome}`
            )
            .setDescription(
                `⭐ Raridade: **${pet.raridade}**\n` +
                `📈 Nível: **${u.criaturas[petId].nivel}/100**\n\n` +
                `❤️ HP: **${stats.maxHp}**\n` +
                `⚔️ ATK: **${stats.ataque}**\n` +
                `🛡️ DEF: **${stats.defesa}**\n` +
                `💨 VEL: **${stats.velocidade}**`
            );

    if (pet.imagem) {
        embed.setImage(
            pet.imagem
        );
    }

    return embed;
}

function embedMapas(userId) {
    const u =
        jogador(userId);

    desbloquearMapas(u);

    const lista =
        MAPAS.map(
            mapa => {
                const desbloqueado =
                    !!u.mapasDescobertos[
                        mapa.id
                    ];

                return (
                    `${desbloqueado ? "🔓" : "🔒"} ` +
                    `${mapa.emoji} **${mapa.nome}** — ` +
                    `Nv. ${mapa.nivel}` +
                    (
                        u.mapaAtual ===
                        mapa.id
                            ? " ← **ATUAL**"
                            : ""
                    )
                );
            }
        ).join("\n");

    return new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle(
            "🗺️ MAPA DO MUNDO"
        )
        .setDescription(
            `🌟 Seu nível: **${u.nivel}/100**\n\n` +
            lista +
            `\n\nUse **,viajar nome** para viajar.`
        );
}

function ajuda() {
    return new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle(
            "🐉 ZUNO RPG"
        )
        .setDescription(
            [
                ",explorar — explorar e encontrar criaturas",
                ",juntar — entrar como aliado",
                ",mapa — ver mapas",
                ",viajar <mapa> — viajar",
                ",pets — coleção",
                ",pet <nome> — detalhes",
                ",invocar <nome> — escolher Pet",
                ",perfil — perfil",
                ",duelo @membro — duelo automático",
                ",ranking — ranking",
                "",
                "⚔️ As batalhas são automáticas.",
                "🎁 Pets são desbloqueados nas vitórias.",
                "💎 Pets raros possuem chances muito menores."
            ].join("\n")
        );
}

function ranking() {
    const lista =
        Object.entries(DB)
            .sort(
                (a, b) =>
                    (b[1].vitorias || 0) -
                    (a[1].vitorias || 0)
            )
            .slice(0, 10);

    return new EmbedBuilder()
        .setColor(0xf1c40f)
        .setTitle(
            "🏆 RANKING"
        )
        .setDescription(
            lista.length
                ? lista
                      .map(
                          (item, index) =>
                              `**${index + 1}.** ` +
                              `<@${item[0]}> — ` +
                              `⚔️ ${item[1].vitorias || 0} vitórias`
                      )
                      .join("\n")
                : "Nenhum jogador ainda."
        );
}

async function iniciarDuelo(
    message,
    alvo
) {
    const pet1 =
        jogador(
            message.author.id
        ).petAtivo;

    const pet2 =
        jogador(
            alvo.id
        ).petAtivo;

    const stats1 =
        estatisticasPet(
            message.author.id,
            pet1
        );

    const stats2 =
        estatisticasPet(
            alvo.id,
            pet2
        );

    const id =
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .slice(2, 7);

    duelos.set(id, {
        id,

        desafiante:
            message.author.id,

        desafiado:
            alvo.id,

        p1: {
            id: pet1,
            nome: PETS[pet1].nome,
            emoji: PETS[pet1].emoji,

            hp: stats1.maxHp,
            maxHp: stats1.maxHp,

            ataque: stats1.ataque,
            defesa: stats1.defesa,
            vel: stats1.velocidade
        },

        p2: {
            id: pet2,
            nome: PETS[pet2].nome,
            emoji: PETS[pet2].emoji,

            hp: stats2.maxHp,
            maxHp: stats2.maxHp,

            ataque: stats2.ataque,
            defesa: stats2.defesa,
            vel: stats2.velocidade
        }
    });

    const row =
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        `rpg_duelo_aceitar_${id}`
                    )
                    .setLabel(
                        "⚔️ Aceitar"
                    )
                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `rpg_duelo_recusar_${id}`
                    )
                    .setLabel(
                        "❌ Recusar"
                    )
                    .setStyle(
                        ButtonStyle.Danger
                    )
            );

    return message.reply({
        content: `${alvo}`,

        embeds: [
            new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle(
                    "⚔️ DESAFIO DE PETS"
                )
                .setDescription(
                    `**${message.author.username}** ` +
                    `desafiou **${alvo.username}**!\n\n` +
                    `🐾 Os Pets vão lutar.\n` +
                    `👤 Os membros são apenas treinadores.`
                )
        ],

        components: [row]
    });
}

async function executarDuelo(
    duelo,
    mensagem
) {
    let turno = 0;

    while (
        duelo.p1.hp > 0 &&
        duelo.p2.hp > 0
    ) {
        turno++;

        const primeiro =
            duelo.p1.vel >= duelo.p2.vel
                ? duelo.p1
                : duelo.p2;

        const segundo =
            primeiro === duelo.p1
                ? duelo.p2
                : duelo.p1;

        const dano1 =
            calcularDano(
                primeiro.ataque,
                segundo.defesa
            );

        segundo.hp =
            Math.max(
                0,
                segundo.hp - dano1
            );

        if (
            segundo.hp > 0
        ) {
            const dano2 =
                calcularDano(
                    segundo.ataque,
                    primeiro.defesa
                );

            primeiro.hp =
                Math.max(
                    0,
                    primeiro.hp - dano2
                );
        }

        const embed =
            new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle(
                    "⚔️ DUELO DE PETS"
                )
                .setDescription(
                    `${duelo.p1.emoji} **${duelo.p1.nome}**\n` +
                    `❤️ ${barraHp(
                        duelo.p1.hp,
                        duelo.p1.maxHp
                    )} ${duelo.p1.hp}/${duelo.p1.maxHp}\n\n` +

                    `${duelo.p2.emoji} **${duelo.p2.nome}**\n` +
                    `❤️ ${barraHp(
                        duelo.p2.hp,
                        duelo.p2.maxHp
                    )} ${duelo.p2.hp}/${duelo.p2.maxHp}\n\n` +

                    `⚔️ Turno **${turno}**`
                );

        await mensagem
            .edit({
                embeds: [embed],
                components: []
            })
            .catch(() => {});

        if (
            duelo.p1.hp <= 0 ||
            duelo.p2.hp <= 0
        ) {
            break;
        }

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    3500
                )
        );
    }

    const vencedor =
        duelo.p1.hp > 0
            ? duelo.p1
            : duelo.p2;

    const vencedorId =
        duelo.p1.hp > 0
            ? duelo.desafiante
            : duelo.desafiado;

    jogador(vencedorId).vitorias++;

    ganharXpTreinador(
        vencedorId,
        120
    );

    ganharXpPet(
        vencedorId,
        vencedor.id,
        150
    );

    salvar();

    await mensagem
        .edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(
                        0x2ecc71
                    )
                    .setTitle(
                        "🏆 DUELO TERMINADO"
                    )
                    .setDescription(
                        `${vencedor.emoji} ` +
                        `**${vencedor.nome} venceu!**`
                    )
            ],
            components: []
        })
        .catch(() => {});

    duelos.delete(
        duelo.id
    );
}

module.exports = client => {

    client.on(
        "messageCreate",
        async message => {
            try {
                if (
                    message.author.bot ||
                    !message.guild ||
                    !message.content.startsWith(
                        PREFIX
                    )
                ) {
                    return;
                }

                const args =
                    message.content
                        .slice(
                            PREFIX.length
                        )
                        .trim()
                        .split(/\s+/);

                const comando =
                    normalizar(
                        args.shift()
                    );

                if (!comando) {
                    return;
                }

                if (
                    [
                        "rpg",
                        "ajudarpg"
                    ].includes(comando)
                ) {
                    return message.reply({
                        embeds: [
                            ajuda()
                        ]
                    });
                }

                if (
                    [
                        "perfil",
                        "perfilrpg"
                    ].includes(comando)
                ) {
                    return message.reply({
                        embeds: [
                            embedPerfil(
                                message.author.id
                            )
                        ]
                    });
                }

                if (
                    [
                        "pets",
                        "colecao"
                    ].includes(comando)
                ) {
                    return message.reply({
                        embeds: [
                            embedPets(
                                message.author.id
                            )
                        ]
                    });
                }

                if (
                    comando === "pet"
                ) {
                    return message.reply({
                        embeds: [
                            detalhesPet(
                                message.author.id,
                                args.join(" ")
                            )
                        ]
                    });
                }

                if (
                    comando === "invocar"
                ) {
                    const petId =
                        procurarPet(
                            args.join(" ")
                        );

                    const u =
                        jogador(
                            message.author.id
                        );

                    if (
                        !petId ||
                        !u.criaturas[
                            petId
                        ]
                    ) {
                        return message.reply(
                            "🔒 Você ainda não possui esse Pet."
                        );
                    }

                    u.petAtivo =
                        petId;

                    salvar();

                    return message.reply(
                        `🐾 Seu Pet ativo agora é **${PETS[petId].emoji} ${PETS[petId].nome}**!`
                    );
                }

                if (
                    [
                        "mapa",
                        "mapas"
                    ].includes(comando)
                ) {
                    return message.reply({
                        embeds: [
                            embedMapas(
                                message.author.id
                            )
                        ]
                    });
                }

                if (
                    comando === "viajar"
                ) {
                    const u =
                        jogador(
                            message.author.id
                        );

                    desbloquearMapas(u);

                    const mapa =
                        procurarMapa(
                            args.join(" ")
                        );

                    if (!mapa) {
                        return message.reply(
                            "❌ Mapa não encontrado. Use `,mapa`."
                        );
                    }

                    if (
                        !u.mapasDescobertos[
                            mapa.id
                        ]
                    ) {
                        return message.reply(
                            `🔒 Você precisa chegar ao **nível ${mapa.nivel}** para viajar para esse mapa.`
                        );
                    }

                    if (
                        u.mapaAtual ===
                        mapa.id
                    ) {
                        return message.reply(
                            `📍 Você já está em **${mapa.nome}**.`
                        );
                    }

                    u.mapaAtual =
                        mapa.id;

                    salvar();

                    return message.reply(
                        `🧭 Você viajou para **${mapa.emoji} ${mapa.nome}**!\n\n🌲 Agora suas explorações acontecerão neste mapa.`
                    );
                }

                if (
                    comando === "explorar"
                ) {
                    const u =
                        jogador(
                            message.author.id
                        );

                    desbloquearMapas(u);

                    const mapa =
                        pegarMapa(
                            u.mapaAtual
                        );

                    const tipo =
                        sortearTipo();

                    const batalha = {
                        id:
                            Date.now()
                                .toString(36) +
                            Math.random()
                                .toString(36)
                                .slice(2, 7),

                        channelId:
                            message.channel.id,

                        messageId:
                            null,

                        criador:
                            message.author.id,

                        iniciada:
                            false,

                        finalizada:
                            false,

                        tipo,

                        mapa,

                        enemy:
                            criarInimigo(
                                mapa,
                                tipo
                            ),

                        participantes: []
                    };

                    adicionarParticipante(
                        batalha,
                        message.author.id
                    );

                    u.exploracoes++;

                    salvar();

                    batalhas.set(
                        batalha.id,
                        batalha
                    );

                    const mensagem =
                        await message.reply({
                            embeds: [
                                embedEncontro(
                                    batalha,

                                    tipo ===
                                    "boss"
                                        ? "👑 **ENCONTRO LENDÁRIO!**\nEsse tipo de encontro é extremamente raro."
                                        : tipo ===
                                          "elite"
                                        ? "⭐ **CRIATURA ELITE!**\nEla pode liberar Pets mais raros."
                                        : "🌲 Uma criatura selvagem apareceu durante sua exploração!"
                                )
                            ],

                            components: [
                                botoesEncontro(
                                    batalha.id
                                )
                            ]
                        });

                    batalha.messageId =
                        mensagem.id;

                    return;
                }

                if (
                    comando === "juntar"
                ) {
                    const batalha =
                        [
                            ...batalhas.values()
                        ]
                            .reverse()
                            .find(
                                b =>
                                    b.channelId ===
                                        message.channel.id &&
                                    !b.iniciada &&
                                    !b.finalizada
                            );

                    if (!batalha) {
                        return message.reply(
                            "❌ Não existe uma batalha aberta neste canal."
                        );
                    }

                    if (
                        !adicionarParticipante(
                            batalha,
                            message.author.id
                        )
                    ) {
                        return message.reply(
                            "❌ Você já está na batalha ou ela está cheia."
                        );
                    }

                    salvar();

                    try {
                        const msg =
                            await message.channel.messages.fetch(
                                batalha.messageId
                            );

                        await msg.edit({
                            embeds: [
                                embedEncontro(
                                    batalha,
                                    `🤝 **${message.author.username} entrou na batalha!**\n\n👥 Participantes: **${batalha.participantes.length}/${MAX_PARTICIPANTES}**`
                                )
                            ],
                            components: [
                                botoesEncontro(
                                    batalha.id
                                )
                            ]
                        });
                    } catch {}

                    return message.reply(
                        "🤝 Você entrou na batalha! Seu Pet ativo será usado automaticamente."
                    );
                }

                if (
                    comando === "duelo"
                ) {
                    const alvo =
                        message.mentions.users.first();

                    if (
                        !alvo ||
                        alvo.bot ||
                        alvo.id ===
                            message.author.id
                    ) {
                        return message.reply(
                            "❌ Mencione outro membro para duelar."
                        );
                    }

                    return iniciarDuelo(
                        message,
                        alvo
                    );
                }

                if (
                    comando === "ranking"
                ) {
                    return message.reply({
                        embeds: [
                            ranking()
                        ]
                    });
                }

            } catch (erro) {
                console.error(
                    "❌ RPG MESSAGE:",
                    erro
                );

                message.reply(
                    "❌ Ocorreu um erro no RPG. Veja o console do Render."
                ).catch(() => {});
            }
        }
    );

    client.on(
        "interactionCreate",
        async interaction => {
            try {
                if (
                    !interaction.isButton()
                ) {
                    return;
                }

                const customId =
                    interaction.customId;

                /*
                 * INICIAR BATALHA
                 */
                if (
                    customId.startsWith(
                        "rpg_iniciar_"
                    )
                ) {
                    const id =
                        customId.slice(
                            "rpg_iniciar_"
                                .length
                        );

                    const batalha =
                        batalhas.get(id);

                    if (!batalha) {
                        return interaction.reply({
                            content:
                                "❌ Essa batalha não existe mais.",
                            ephemeral: true
                        });
                    }

                    if (
                        interaction.user.id !==
                        batalha.criador
                    ) {
                        return interaction.reply({
                            content:
                                "❌ Somente quem iniciou a exploração pode começar a batalha.",
                            ephemeral: true
                        });
                    }

                    if (
                        batalha.iniciada
                    ) {
                        return interaction.reply({
                            content:
                                "⚔️ Essa batalha já começou!",
                            ephemeral: true
                        });
                    }

                    /*
                     * IMPORTANTE:
                     * confirma o botão antes
                     * de começar o processo
                     */
                    await interaction.deferUpdate();

                    batalha.iniciada =
                        true;

                    batalha.messageId =
                        interaction.message.id;

                    await interaction.message.edit({
                        embeds: [
                            embedBatalha(
                                batalha,
                                "⚔️ **BATALHA INICIADA!**\n\nA partir de agora tudo acontece automaticamente."
                            )
                        ],
                        components: []
                    });

                    return executarBatalha(
                        batalha,
                        interaction.channel
                    );
                }

                /*
                 * CHAMAR ALIADOS
                 */
                if (
                    customId.startsWith(
                        "rpg_chamar_"
                    )
                ) {
                    const id =
                        customId.slice(
                            "rpg_chamar_"
                                .length
                        );

                    const batalha =
                        batalhas.get(id);

                    if (!batalha) {
                        return interaction.reply({
                            content:
                                "❌ Essa batalha não existe mais.",
                            ephemeral: true
                        });
                    }

                    return interaction.reply({
                        content:
                            "👥 **Chame seus aliados!**\n\nCada pessoa deve usar **,juntar** neste canal.\n\n👥 Vagas disponíveis: **" +
                            (
                                MAX_PARTICIPANTES -
                                batalha.participantes
                                    .length
                            ) +
                            "**",
                        ephemeral: true
                    });
                }

                /*
                 * ACEITAR DUELO
                 */
                if (
                    customId.startsWith(
                        "rpg_duelo_aceitar_"
                    )
                ) {
                    const id =
                        customId.slice(
                            "rpg_duelo_aceitar_"
                                .length
                        );

                    const duelo =
                        duelos.get(id);

                    if (!duelo) {
                        return interaction.reply({
                            content:
                                "❌ Esse desafio expirou.",
                            ephemeral: true
                        });
                    }

                    if (
                        interaction.user.id !==
                        duelo.desafiado
                    ) {
                        return interaction.reply({
                            content:
                                "❌ Esse desafio não é seu.",
                            ephemeral: true
                        });
                    }

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(
                                    0x2ecc71
                                )
                                .setTitle(
                                    "⚔️ DUELO ACEITO!"
                                )
                                .setDescription(
                                    "🐾 Os Pets vão lutar automaticamente."
                                )
                        ],
                        components: []
                    });

                    return executarDuelo(
                        duelo,
                        interaction.message
                    );
                }

                /*
                 * RECUSAR DUELO
                 */
                if (
                    customId.startsWith(
                        "rpg_duelo_recusar_"
                    )
                ) {
                    const id =
                        customId.slice(
                            "rpg_duelo_recusar_"
                                .length
                        );

                    const duelo =
                        duelos.get(id);

                    if (!duelo) {
                        return interaction.reply({
                            content:
                                "❌ Esse desafio expirou.",
                            ephemeral: true
                        });
                    }

                    if (
                        interaction.user.id !==
                        duelo.desafiado
                    ) {
                        return interaction.reply({
                            content:
                                "❌ Esse desafio não é seu.",
                            ephemeral: true
                        });
                    }

                    duelos.delete(
                        duelo.id
                    );

                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(
                                    0x555555
                                )
                                .setTitle(
                                    "❌ DUELO RECUSADO"
                                )
                                .setDescription(
                                    "O desafio foi recusado."
                                )
                        ],
                        components: []
                    });
                }

            } catch (erro) {
                console.error(
                    "❌ RPG BOTÃO:",
                    erro
                );

                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {
                    interaction.reply({
                        content:
                            "❌ Erro ao processar essa ação.",
                        ephemeral: true
                    }).catch(() => {});
                }
            }
        }
    );

    console.log(
        "🐉 ZUNO RPG carregado!"
    );
};
