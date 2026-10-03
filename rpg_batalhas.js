// ============================================================
// 🐉 ZUNO RPG — ARENA DAS CRIATURAS
// ============================================================
// SISTEMA 100% POR COMANDOS COM VÍRGULA
//
// ,rpg
// ,invocar
// ,pets
// ,pet
// ,duelo @membro
// ,boss
// ,aliados
// ,perfilrpg
// ,ranking
//
// NO index.js:
//
// require("./rpg_batalhas")(client);
//
// ============================================================

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");

// ============================================================
// ⚙️ CONFIGURAÇÃO
// ============================================================

const PREFIX = ",";
const ADM_ID = "1053803800340746261";

const DB_FILE = path.join(
    __dirname,
    "rpg_batalhas_db.json"
);

// ============================================================
// 🖼️ IMAGENS
// ============================================================

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
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555999729979236352/8c36634c-1390-4d7f-9d70-2f77d84ae4ff.png?backend=b2&ex=6ac2912c&is=6ac13fac&hm=ef7965dc1814fe6a3df209dd449897b2dda7f8f5f5507cdc77cf20440a969188&.png",

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

const IMAGENS_BOSS = {
    dragao_apocalipse:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555984946768646225/IMG-20261003-WA0004.jpg?backend=b2&ex=6ac28368&is=6ac131e8&hm=f4768c07bef82e20faff5163bb836db2c297e2eb5a0d20846703025766eadce7&.png",

    titan_olimpiano:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555985158971203684/IMG-20261003-WA0006.jpg?backend=b2&ex=6ac2839a&is=6ac1321a&hm=88b1f910c1c52f1cad096c91ffd0502492279dd53ed7375ec8a3bef480a14953&.png",

    serpente_cosmica:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555985172334125159/IMG-20261003-WA0005.jpg?backend=b2&ex=6ac2839d&is=6ac1321d&hm=8a5042befe24a2d8dc6529cde6dffa4b617e6a1c054b95c2112cdb46b906e296&.png"
};

// ============================================================
// 🐾 CRIATURAS
// ============================================================

const PETS = {
    dragao_oriente: {
        id: "dragao_oriente",
        nome: "Dragão do Oriente",
        emoji: "🐉",
        raridade: "Mítico",
        hp: 850,
        ataque: 190,
        defesa: 150,
        velocidade: 120,
        habilidade: "Chama Oriental",
        descricao: "Uma criatura ancestral que domina as chamas celestiais.",
        habilidadeDescricao: "Causa dano aumentado e pode causar queimadura.",
        tipo: "fogo",
        chance: 8,
        cor: 0xff4d4d,
        imagem: IMAGENS.dragao_oriente
    },

    fenrir: {
        id: "fenrir",
        nome: "Fenrir",
        emoji: "🐺",
        raridade: "Épico",
        hp: 780,
        ataque: 180,
        defesa: 140,
        velocidade: 160,
        habilidade: "Fúria Nórdica",
        descricao: "O lobo colossal das antigas lendas nórdicas.",
        habilidadeDescricao: "Aumenta o ataque durante alguns turnos.",
        tipo: "buff",
        chance: 18,
        cor: 0x8e44ad,
        imagem: IMAGENS.fenrir
    },

    grifo_celestial: {
        id: "grifo_celestial",
        nome: "Grifo Celestial",
        emoji: "🦅",
        raridade: "Raro",
        hp: 720,
        ataque: 160,
        defesa: 130,
        velocidade: 170,
        habilidade: "Investida Divina",
        descricao: "Uma criatura alada guardiã dos céus.",
        habilidadeDescricao: "Possui grande chance de causar crítico.",
        tipo: "critico",
        chance: 30,
        cor: 0x3498db,
        imagem: IMAGENS.grifo_celestial
    },

    serpente_eclipse: {
        id: "serpente_eclipse",
        nome: "Serpente do Eclipse",
        emoji: "🐍",
        raridade: "Lendário",
        hp: 1200,
        ataque: 260,
        defesa: 200,
        velocidade: 180,
        habilidade: "Eclipse Eterno",
        descricao: "Uma serpente nascida durante um eclipse sobrenatural.",
        habilidadeDescricao: "Causa dano sombrio e reduz a defesa inimiga.",
        tipo: "sombra",
        chance: 5,
        cor: 0x9b59b6,
        imagem: IMAGENS.serpente_eclipse
    },

    unicornio_astral: {
        id: "unicornio_astral",
        nome: "Unicórnio Astral",
        emoji: "🦄",
        raridade: "Raro",
        hp: 650,
        ataque: 140,
        defesa: 160,
        velocidade: 190,
        habilidade: "Cura Estelar",
        descricao: "Uma criatura que carrega a energia das estrelas.",
        habilidadeDescricao: "Recupera parte da vida durante a luta.",
        tipo: "cura",
        chance: 25,
        cor: 0xf1c40f,
        imagem: IMAGENS.unicornio_astral
    },

    dragao_gelo: {
        id: "dragao_gelo",
        nome: "Dragão de Gelo",
        emoji: "🐲",
        raridade: "Épico",
        hp: 900,
        ataque: 210,
        defesa: 180,
        velocidade: 110,
        habilidade: "Sopro Glacial",
        descricao: "Um dragão coberto por gelo ancestral.",
        habilidadeDescricao: "Pode reduzir a velocidade do inimigo.",
        tipo: "gelo",
        chance: 15,
        cor: 0x5dade2,
        imagem: IMAGENS.dragao_gelo
    },

    fenix: {
        id: "fenix",
        nome: "Fênix",
        emoji: "🔥",
        raridade: "Lendário",
        hp: 780,
        ataque: 240,
        defesa: 120,
        velocidade: 200,
        habilidade: "Renascimento",
        descricao: "Uma ave imortal formada pelas chamas.",
        habilidadeDescricao: "Pode sobreviver a um golpe fatal.",
        tipo: "renascimento",
        chance: 7,
        cor: 0xe67e22,
        imagem: IMAGENS.fenix
    },

    dragao_noite: {
        id: "dragao_noite",
        nome: "Dragão da Noite",
        emoji: "🌑",
        raridade: "Lendário",
        hp: 1050,
        ataque: 250,
        defesa: 190,
        velocidade: 150,
        habilidade: "Trevas Eternas",
        descricao: "Um dragão que vive além da luz.",
        habilidadeDescricao: "Aumenta o dano quando está com pouca vida.",
        tipo: "sombra",
        chance: 6,
        cor: 0x2c3e50,
        imagem: IMAGENS.dragao_noite
    },

    kraken: {
        id: "kraken",
        nome: "Kraken",
        emoji: "🐙",
        raridade: "Épico",
        hp: 1300,
        ataque: 210,
        defesa: 220,
        velocidade: 80,
        habilidade: "Tentáculos Abissais",
        descricao: "Monstro colossal dos oceanos.",
        habilidadeDescricao: "Pode atingir o inimigo várias vezes.",
        tipo: "multigolpe",
        chance: 12,
        cor: 0x1abc9c,
        imagem: IMAGENS.kraken
    },

    minotauro: {
        id: "minotauro",
        nome: "Minotauro",
        emoji: "🐂",
        raridade: "Comum",
        hp: 950,
        ataque: 170,
        defesa: 180,
        velocidade: 90,
        habilidade: "Golpe Brutal",
        descricao: "O guerreiro do labirinto.",
        habilidadeDescricao: "Ataques físicos extremamente fortes.",
        tipo: "forca",
        chance: 35,
        cor: 0x795548,
        imagem: IMAGENS.minotauro
    },

    kitsune: {
        id: "kitsune",
        nome: "Kitsune",
        emoji: "🦊",
        raridade: "Raro",
        hp: 620,
        ataque: 155,
        defesa: 110,
        velocidade: 220,
        habilidade: "Ilusão",
        descricao: "Raposa mística de múltiplas caudas.",
        habilidadeDescricao: "Possui grande chance de esquivar.",
        tipo: "esquiva",
        chance: 28,
        cor: 0xe67e22,
        imagem: IMAGENS.kitsune
    },

    basilisco: {
        id: "basilisco",
        nome: "Basilisco",
        emoji: "🐍",
        raridade: "Raro",
        hp: 760,
        ataque: 185,
        defesa: 145,
        velocidade: 100,
        habilidade: "Olhar Mortal",
        descricao: "A serpente cujo olhar paralisa seus inimigos.",
        habilidadeDescricao: "Pode reduzir a defesa inimiga.",
        tipo: "debuff",
        chance: 22,
        cor: 0x27ae60,
        imagem: IMAGENS.basilisco
    },

    quimera: {
        id: "quimera",
        nome: "Quimera",
        emoji: "🦁",
        raridade: "Lendário",
        hp: 1150,
        ataque: 230,
        defesa: 200,
        velocidade: 130,
        habilidade: "Fúria Tripla",
        descricao: "Uma criatura formada por vários monstros.",
        habilidadeDescricao: "Possui três formas de ataque.",
        tipo: "triplo",
        chance: 9,
        cor: 0xc0392b,
        imagem: IMAGENS.quimera
    },

    pegasus: {
        id: "pegasus",
        nome: "Pégaso",
        emoji: "🐎",
        raridade: "Comum",
        hp: 600,
        ataque: 130,
        defesa: 120,
        velocidade: 240,
        habilidade: "Voo Celestial",
        descricao: "Cavalo alado dos céus.",
        habilidadeDescricao: "Extremamente rápido.",
        tipo: "velocidade",
        chance: 40,
        cor: 0xecf0f1,
        imagem: IMAGENS.pegasus
    },

    cerbero: {
        id: "cerbero",
        nome: "Cérbero",
        emoji: "🐕",
        raridade: "Épico",
        hp: 1400,
        ataque: 220,
        defesa: 230,
        velocidade: 100,
        habilidade: "Três Cabeças",
        descricao: "O guardião monstruoso do submundo.",
        habilidadeDescricao: "Pode atacar mais de uma vez.",
        tipo: "multigolpe",
        chance: 13,
        cor: 0x34495e,
        imagem: IMAGENS.cerbero
    },

    hidra: {
        id: "hidra",
        nome: "Hidra",
        emoji: "🐲",
        raridade: "Lendário",
        hp: 1600,
        ataque: 240,
        defesa: 210,
        velocidade: 80,
        habilidade: "Regeneração",
        descricao: "Monstro de várias cabeças.",
        habilidadeDescricao: "Recupera vida durante a batalha.",
        tipo: "cura",
        chance: 7,
        cor: 0x16a085,
        imagem: IMAGENS.hidra
    },

    leviata: {
        id: "leviata",
        nome: "Leviatã",
        emoji: "🌊",
        raridade: "Lendário",
        hp: 1800,
        ataque: 280,
        defesa: 250,
        velocidade: 70,
        habilidade: "Abismo Oceânico",
        descricao: "Uma entidade gigantesca dos oceanos.",
        habilidadeDescricao: "Ataques extremamente poderosos.",
        tipo: "forca",
        chance: 5,
        cor: 0x2980b9,
        imagem: IMAGENS.leviata
    },

    grifo_sombrio: {
        id: "grifo_sombrio",
        nome: "Grifo Sombrio",
        emoji: "🦅",
        raridade: "Épico",
        hp: 820,
        ataque: 220,
        defesa: 140,
        velocidade: 180,
        habilidade: "Asas das Trevas",
        descricao: "Um grifo corrompido pelas sombras.",
        habilidadeDescricao: "Causa dano sombrio.",
        tipo: "sombra",
        chance: 14,
        cor: 0x212121,
        imagem: IMAGENS.grifo_sombrio
    },

    lobo_lunar: {
        id: "lobo_lunar",
        nome: "Lobo Lunar",
        emoji: "🐺",
        raridade: "Inicial",
        hp: 650,
        ataque: 130,
        defesa: 120,
        velocidade: 150,
        habilidade: "Uivo Lunar",
        descricao: "O companheiro inicial dos treinadores.",
        habilidadeDescricao: "Ataque equilibrado.",
        tipo: "normal",
        chance: 100,
        cor: 0x95a5a6,
        imagem: IMAGENS.lobo_lunar
    },

    guardiao_astral: {
        id: "guardiao_astral",
        nome: "Guardião Astral",
        emoji: "🌌",
        raridade: "Mítico",
        hp: 2000,
        ataque: 320,
        defesa: 300,
        velocidade: 180,
        habilidade: "Julgamento Astral",
        descricao: "Um guardião criado pelas próprias estrelas.",
        habilidadeDescricao: "Ataque poderoso de energia astral.",
        tipo: "astral",
        chance: 3,
        cor: 0x8e44ad,
        imagem: IMAGENS.guardiao_astral
    }
};

// ============================================================
// 👹 BOSSES
// ============================================================

const BOSSES = {
    dragao_apocalipse: {
        id: "dragao_apocalipse",
        nome: "Dragão do Apocalipse",
        emoji: "🐉",
        hp: 35000,
        ataque: 780,
        defesa: 650,
        velocidade: 420,
        raridade: "Boss",
        imagem: IMAGENS_BOSS.dragao_apocalipse,
        recompensas: [
            "dragao_noite",
            "serpente_eclipse",
            "quimera",
            "leviata"
        ]
    },

    titan_olimpiano: {
        id: "titan_olimpiano",
        nome: "Titã Olimpiano",
        emoji: "⚡",
        hp: 50000,
        ataque: 920,
        defesa: 800,
        velocidade: 380,
        raridade: "Boss Supremo",
        imagem: IMAGENS_BOSS.titan_olimpiano,
        recompensas: [
            "guardiao_astral",
            "dragao_noite"
        ]
    },

    serpente_cosmica: {
        id: "serpente_cosmica",
        nome: "Serpente Cósmica",
        emoji: "🌌",
        hp: 70000,
        ataque: 1100,
        defesa: 950,
        velocidade: 500,
        raridade: "Boss Lendário",
        imagem: IMAGENS_BOSS.serpente_cosmica,
        recompensas: [
            "guardiao_astral",
            "dragao_noite",
            "serpente_eclipse"
        ]
    }
};

// ============================================================
// 💾 BANCO
// ============================================================

let banco = {};

function carregarBanco() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            banco = {};
            salvarBanco();
            return;
        }

        banco = JSON.parse(
            fs.readFileSync(DB_FILE, "utf8")
        );

        if (!banco || typeof banco !== "object") {
            banco = {};
        }

    } catch (erro) {
        console.error("Erro ao carregar banco:", erro);
        banco = {};
    }
}

function salvarBanco() {
    try {
        fs.writeFileSync(
            DB_FILE,
            JSON.stringify(banco, null, 2)
        );
    } catch (erro) {
        console.error("Erro ao salvar banco:", erro);
    }
}

function jogador(id) {
    if (!banco[id]) {
        banco[id] = {
            moedas: 25,
            nivel: 1,
            xp: 0,
            vitorias: 0,
            derrotas: 0,
            bossesDerrotados: 0,
            invocacaoInicial: false,
            ultimaDaily: 0,
            criaturas: {},
            equipe: [],
            ultimosPets: []
        };

        salvarBanco();
    }

    const p = banco[id];

    p.moedas ??= 25;
    p.nivel ??= 1;
    p.xp ??= 0;
    p.vitorias ??= 0;
    p.derrotas ??= 0;
    p.bossesDerrotados ??= 0;
    p.invocacaoInicial ??= false;
    p.ultimaDaily ??= 0;
    p.criaturas ??= {};
    p.equipe ??= [];
    p.ultimosPets ??= [];

    return p;
}

function normalizarPet(dados) {
    dados.nivel ??= 1;
    dados.xp ??= 0;
    dados.treino ??= 0;
    dados.bonusHp ??= dados.treino * 8;
    dados.bonusAtaque ??= dados.treino * 3;
    dados.bonusDefesa ??= dados.treino * 2;
    dados.bonusVelocidade ??= dados.treino * 2;
    return dados;
}

function petDoJogador(id, petId) {
    const p = jogador(id);

    if (!p.criaturas[petId]) {
        return null;
    }

    return normalizarPet(p.criaturas[petId]);
}

// ============================================================
// ⭐ XP DO TREINADOR
// ============================================================

function limiteXP(nivel) {
    return 250 + ((nivel - 1) * 150);
}

function ganharXP(id, quantidade) {
    const p = jogador(id);

    p.xp += quantidade;

    while (
        p.xp >= limiteXP(p.nivel)
    ) {
        p.xp -= limiteXP(p.nivel);
        p.nivel++;
    }
}

// ============================================================
// 🐾 XP DO PET
// ============================================================

function limiteXPPet(nivel) {
    return 120 + ((nivel - 1) * 90);
}

function ganharXPPet(id, petId, quantidade) {
    const pet = petDoJogador(id, petId);

    if (!pet) return 0;

    let subiu = 0;

    pet.xp += quantidade;

    while (
        pet.xp >= limiteXPPet(pet.nivel) &&
        pet.nivel < 30
    ) {
        pet.xp -= limiteXPPet(pet.nivel);
        pet.nivel++;
        subiu++;
    }

    if (pet.nivel >= 30) {
        pet.nivel = 30;
        pet.xp = 0;
    }

    return subiu;
}

// ============================================================
// 🔓 PETS
// ============================================================

function adicionarPet(id, petId) {
    if (!PETS[petId]) return false;

    const p = jogador(id);

    if (p.criaturas[petId]) {
        return false;
    }

    p.criaturas[petId] = {
        nivel: 1,
        xp: 0,
        treino: 0,
        bonusHp: 0,
        bonusAtaque: 0,
        bonusDefesa: 0,
        bonusVelocidade: 0
    };

    if (!p.equipe.length) {
        p.equipe.push(petId);
    }

    p.ultimosPets.unshift(petId);
    p.ultimosPets = p.ultimosPets.slice(0, 10);

    salvarBanco();

    return true;
}

function removerPet(id, petId) {
    const p = jogador(id);

    if (!p.criaturas[petId]) {
        return false;
    }

    delete p.criaturas[petId];

    p.equipe = p.equipe.filter(
        x => x !== petId
    );

    if (!p.equipe.length) {
        const primeiro = Object.keys(
            p.criaturas
        )[0];

        if (primeiro) {
            p.equipe.push(primeiro);
        }
    }

    salvarBanco();

    return true;
}

function equiparPet(id, petId) {
    const p = jogador(id);

    if (!p.criaturas[petId]) {
        return false;
    }

    p.equipe = [petId];

    salvarBanco();

    return true;
}

// ============================================================
// 📊 STATUS
// ============================================================

function statusPet(id, petId) {
    const pet = PETS[petId];

    if (!pet) return null;

    const dados =
        petDoJogador(id, petId) || {
            nivel: 1,
            treino: 0,
            bonusHp: 0,
            bonusAtaque: 0,
            bonusDefesa: 0,
            bonusVelocidade: 0
        };

    const nivelMult =
        1 + ((dados.nivel - 1) * 0.06);

    const treinoMult =
        1 + (dados.treino * 0.012);

    return {
        hp: Math.floor(
            pet.hp * nivelMult +
            dados.bonusHp
        ),

        ataque: Math.floor(
            pet.ataque *
            nivelMult *
            treinoMult +
            dados.bonusAtaque
        ),

        defesa: Math.floor(
            pet.defesa *
            nivelMult *
            treinoMult +
            dados.bonusDefesa
        ),

        velocidade: Math.floor(
            pet.velocidade *
            nivelMult *
            treinoMult +
            dados.bonusVelocidade
        )
    };
}

// ============================================================
// 🪙 ECONOMIA
// ============================================================

function adicionarMoedas(id, quantidade) {
    const p = jogador(id);

    p.moedas += quantidade;

    if (p.moedas < 0) {
        p.moedas = 0;
    }

    salvarBanco();
}

function gastarMoedas(id, quantidade) {
    const p = jogador(id);

    if (p.moedas < quantidade) {
        return false;
    }

    p.moedas -= quantidade;

    salvarBanco();

    return true;
}

// ============================================================
// 🏋️ TREINAMENTO
// ============================================================

function treinarPet(id, quantidade) {
    const p = jogador(id);

    const petId = p.equipe[0];

    if (!petId) {
        return {
            ok: false,
            texto: "❌ Você não possui nenhum Pet equipado."
        };
    }

    const pet = petDoJogador(
        id,
        petId
    );

    if (!pet) {
        return {
            ok: false,
            texto: "❌ Não foi possível encontrar seu Pet."
        };
    }

    if (![10, 20].includes(quantidade)) {
        return {
            ok: false,
            texto:
                "❌ Use `,treinar 10` ou `,treinar 20`."
        };
    }

    const custoUnitario =
        6 + (pet.nivel * 2);

    const custo =
        custoUnitario * quantidade;

    if (p.moedas < custo) {
        return {
            ok: false,
            texto:
                `❌ Você precisa de **${custo} moedas**.\n` +
                `🪙 Você possui **${p.moedas}**.`
        };
    }

    p.moedas -= custo;

    pet.treino += quantidade;

    pet.bonusHp +=
        8 * quantidade;

    pet.bonusAtaque +=
        3 * quantidade;

    pet.bonusDefesa +=
        2 * quantidade;

    pet.bonusVelocidade +=
        2 * quantidade;

    ganharXPPet(
        id,
        petId,
        10 * quantidade
    );

    ganharXP(
        id,
        2 * quantidade
    );

    salvarBanco();

    return {
        ok: true,
        petId,
        custo,
        quantidade
    };
}

// ============================================================
// 🎁 RECOMPENSA DE PET
// ============================================================

function petNaoPossuido(id, lista = null) {
    const p = jogador(id);

    let possiveis = Object.keys(PETS)
        .filter(petId =>
            petId !== "lobo_lunar" &&
            !p.criaturas[petId]
        );

    if (lista) {
        possiveis =
            lista.filter(
                petId =>
                    PETS[petId] &&
                    !p.criaturas[petId]
            );
    }

    if (!possiveis.length) {
        return null;
    }

    return possiveis[
        Math.floor(
            Math.random() *
            possiveis.length
        )
    ];
}

function recompensaAleatoria(
    id,
    lista = null
) {
    const petId =
        petNaoPossuido(id, lista);

    if (!petId) {
        return null;
    }

    adicionarPet(
        id,
        petId
    );

    return petId;
}

// ============================================================
// ⚔️ DUELOS
// ============================================================

const desafios = new Map();
const duelos = new Map();
const bossesAtivos = new Map();

function criarId(prefixo) {
    return `${prefixo}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function botoesDesafio(id) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(
                    `rpg_duelo_aceitar_${id}`
                )
                .setLabel("Aceitar")
                .setEmoji("⚔️")
                .setStyle(
                    ButtonStyle.Success
                ),

            new ButtonBuilder()
                .setCustomId(
                    `rpg_duelo_recusar_${id}`
                )
                .setLabel("Recusar")
                .setEmoji("❌")
                .setStyle(
                    ButtonStyle.Danger
                )
        );
}

function botoesDuelo(id) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(
                    `rpg_duelo_atacar_${id}`
                )
                .setLabel("Atacar")
                .setEmoji("⚔️")
                .setStyle(
                    ButtonStyle.Danger
                ),

            new ButtonBuilder()
                .setCustomId(
                    `rpg_duelo_habilidade_${id}`
                )
                .setLabel("Habilidade")
                .setEmoji("✨")
                .setStyle(
                    ButtonStyle.Primary
                )
        );
}

function criarDesafio(
    desafiante,
    desafiado
) {
    const id =
        criarId("duelo");

    desafios.set(
        id,
        {
            id,
            desafiante,
            desafiado,
            criado: Date.now()
        }
    );

    return id;
}

function iniciarDuelo(id) {
    const desafio =
        desafios.get(id);

    if (!desafio) {
        return null;
    }

    const a =
        jogador(
            desafio.desafiante
        );

    const b =
        jogador(
            desafio.desafiado
        );

    const petA =
        a.equipe[0];

    const petB =
        b.equipe[0];

    if (
        !petA ||
        !petB
    ) {
        return null;
    }

    const statsA =
        statusPet(
            desafio.desafiante,
            petA
        );

    const statsB =
        statusPet(
            desafio.desafiado,
            petB
        );

    const duelo = {
        id,
        desafiante:
            desafio.desafiante,

        desafiado:
            desafio.desafiado,

        petA,
        petB,

        hpA: statsA.hp,
        hpB: statsB.hp,

        maxHpA: statsA.hp,
        maxHpB: statsB.hp,

        turno:
            statsA.velocidade >= statsB.velocidade
                ? 1
                : 2,

        iniciado: true
    };

    desafios.delete(id);
    duelos.set(id, duelo);

    return duelo;
}

function barra(
    atual,
    max,
    tamanho = 12
) {
    const porcentagem =
        Math.max(
            0,
            Math.min(
                1,
                atual / max
            )
        );

    const cheios =
        Math.round(
            porcentagem * tamanho
        );

    return (
        "🟩".repeat(cheios) +
        "⬛".repeat(
            tamanho - cheios
        )
    );
}

function dueloEmbed(
    duelo,
    texto = ""
) {
    const petA =
        PETS[duelo.petA];

    const petB =
        PETS[duelo.petB];

    const embed =
        new EmbedBuilder()
            .setTitle(
                "⚔️ ARENA DOS PETS"
            )
            .setDescription(
                `${texto}\n\n` +
                `**${petA.emoji} ${petA.nome}**\n` +
                `${barra(duelo.hpA, duelo.maxHpA)}\n` +
                `❤️ ${Math.max(0, duelo.hpA)} / ${duelo.maxHpA}\n\n` +

                `**VS**\n\n` +

                `**${petB.emoji} ${petB.nome}**\n` +
                `${barra(duelo.hpB, duelo.maxHpB)}\n` +
                `❤️ ${Math.max(0, duelo.hpB)} / ${duelo.maxHpB}`
            )
            .setColor(
                petA.cor || 0x5865f2
            );

    if (petA.imagem) {
        embed.setThumbnail(
            petA.imagem
        );
    }

    if (petB.imagem) {
        embed.setImage(
            petB.imagem
        );
    }

    const turno =
        duelo.turno === 1
            ? duelo.desafiante
            : duelo.desafiado;

    embed.addFields({
        name: "🎯 Turno",
        value:
            `<@${turno}>`,
        inline: false
    });

    return embed;
}

function danoDuelo(
    atacante,
    defensor,
    habilidade
) {
    const statsAtacante =
        atacante.stats;

    const statsDefensor =
        defensor.stats;

    let dano =
        statsAtacante.ataque -
        Math.floor(
            statsDefensor.defesa *
            0.45
        );

    dano +=
        Math.floor(
            Math.random() * 30
        );

    if (habilidade) {
        dano *= 1.25;
    }

    if (
        atacante.pet.tipo ===
        "critico" &&
        Math.random() < 0.25
    ) {
        dano *= 1.6;
    }

    if (
        atacante.pet.tipo ===
        "forca" &&
        Math.random() < 0.20
    ) {
        dano *= 1.35;
    }

    if (
        atacante.pet.tipo ===
        "multigolpe"
    ) {
        dano *=
            Math.random() < 0.35
                ? 1.55
                : 1;
    }

    return Math.max(
        20,
        Math.floor(dano)
    );
}

function turnoDuelo(
    duelo,
    habilidade
) {
    const atacanteId =
        duelo.turno === 1
            ? duelo.desafiante
            : duelo.desafiado;

    const defensorId =
        duelo.turno === 1
            ? duelo.desafiado
            : duelo.desafiante;

    const atacantePetId =
        duelo.turno === 1
            ? duelo.petA
            : duelo.petB;

    const defensorPetId =
        duelo.turno === 1
            ? duelo.petB
            : duelo.petA;

    const atacante = {
        pet:
            PETS[atacantePetId],

        stats:
            statusPet(
                atacanteId,
                atacantePetId
            )
    };

    const defensor = {
        pet:
            PETS[defensorPetId],

        stats:
            statusPet(
                defensorId,
                defensorPetId
            )
    };

    const dano =
        danoDuelo(
            atacante,
            defensor,
            habilidade
        );

    if (duelo.turno === 1) {
        duelo.hpB -= dano;
    } else {
        duelo.hpA -= dano;
    }

    const nomeAtacante =
        atacante.pet.nome;

    let texto =
        `${atacante.pet.emoji} **${nomeAtacante}** ` +
        `${habilidade ? "usou sua habilidade" : "atacou"} ` +
        `e causou **${dano} de dano**!`;

    if (
        duelo.hpA <= 0 ||
        duelo.hpB <= 0
    ) {
        return {
            ok: true,
            fim: true,
            texto
        };
    }

    duelo.turno =
        duelo.turno === 1
            ? 2
            : 1;

    return {
        ok: true,
        fim: false,
        texto
    };
}

async function finalizarDuelo(
    interaction,
    duelo
) {
    const vencedor =
        duelo.hpA > 0
            ? duelo.desafiante
            : duelo.desafiado;

    const perdedor =
        vencedor === duelo.desafiante
            ? duelo.desafiado
            : duelo.desafiante;

    const vencedorPet =
        vencedor === duelo.desafiante
            ? duelo.petA
            : duelo.petB;

    ganharXP(
        vencedor,
        80
    );

    ganharXPPet(
        vencedor,
        vencedorPet,
        100
    );

    adicionarMoedas(
        vencedor,
        12
    );

    adicionarMoedas(
        perdedor,
        3
    );

    jogador(vencedor).vitorias++;
    jogador(perdedor).derrotas++;

    let recompensa = null;

    if (
        Math.random() < 0.18
    ) {
        recompensa =
            recompensaAleatoria(
                vencedor
            );
    }

    salvarBanco();

    duelos.delete(
        duelo.id
    );

    let texto =
        `🏆 <@${vencedor}> venceu o duelo!\n\n` +
        `🪙 **+12 moedas** para o vencedor\n` +
        `🪙 **+3 moedas** pela participação\n` +
        `✨ **+80 XP** de treinador\n` +
        `🐾 **+100 XP** para o Pet`;

    if (recompensa) {
        texto +=
            `\n\n🎁 Você desbloqueou **${PETS[recompensa].emoji} ${PETS[recompensa].nome}**!`;
    }

    await interaction.followUp({
        content: texto
    }).catch(() => {});
}

// ============================================================
// 👹 BOSS
// ============================================================

function bossEmbed(
    batalha,
    extra = ""
) {
    const boss =
        BOSSES[batalha.bossId];

    const embed =
        new EmbedBuilder()
            .setTitle(
                `${boss.emoji} ${boss.nome}`
            )
            .setDescription(
                `${extra}\n\n` +
                `❤️ **${Math.max(0, batalha.hp).toLocaleString()} / ${batalha.maxHp.toLocaleString()}**\n` +
                `${barra(batalha.hp, batalha.maxHp, 18)}\n\n` +
                `👥 **Participantes:** ${Object.keys(batalha.jogadores).length}/5`
            )
            .setColor(
                0x8b0000
            );

    if (
        boss.imagem &&
        typeof boss.imagem === "string"
    ) {
        embed.setImage(
            boss.imagem
        );
    }

    const participantes =
        Object.entries(
            batalha.jogadores
        );

    if (participantes.length) {
        embed.addFields({
            name: "⚔️ Equipe",
            value:
                participantes
                    .map(
                        ([id, info]) =>
                            `<@${id}> — ${PETS[info.pet]?.emoji || "🐾"} ${PETS[info.pet]?.nome || info.pet}`
                    )
                    .join("\n"),
            inline: false
        });
    }

    return embed;
}

function botoesBoss(
    id,
    iniciado = false
) {
    if (!iniciado) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        `rpg_boss_entrar_${id}`
                    )
                    .setLabel(
                        "Entrar na batalha"
                    )
                    .setEmoji("⚔️")
                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `rpg_boss_iniciar_${id}`
                    )
                    .setLabel(
                        "Iniciar Boss"
                    )
                    .setEmoji("🔥")
                    .setStyle(
                        ButtonStyle.Danger
                    )
            );
    }

    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(
                    `rpg_boss_atacar_${id}`
                )
                .setLabel(
                    "Atacar Boss"
                )
                .setEmoji("⚔️")
                .setStyle(
                    ButtonStyle.Danger
                )
        );
}

async function finalizarBoss(
    interaction,
    batalha,
    venceu
) {
    const boss =
        BOSSES[batalha.bossId];

    const ids =
        Object.keys(
            batalha.jogadores
        );

    if (!venceu) {
        bossesAtivos.delete(
            batalha.id
        );
        return;
    }

    let mensagem =
        `🏆 **${boss.nome} foi derrotado!**\n\n`;

    for (const id of ids) {
        const info =
            batalha.jogadores[id];

        ganharXP(
            id,
            180
        );

        ganharXPPet(
            id,
            info.pet,
            220
        );

        adicionarMoedas(
            id,
            35
        );

        jogador(id).bossesDerrotados++;

        let recompensa = null;

        if (
            Math.random() < 0.45
        ) {
            recompensa =
                recompensaAleatoria(
                    id,
                    boss.recompensas
                );
        }

        mensagem +=
            `<@${id}> — 🪙 **+35 moedas**`;

        if (recompensa) {
            mensagem +=
                ` — 🎁 **${PETS[recompensa].nome}**`;
        }

        mensagem += "\n";
    }

    bossesAtivos.delete(
        batalha.id
    );

    salvarBanco();

    await interaction.followUp({
        content: mensagem
    }).catch(() => {});
}

// ============================================================
// 🖥️ EMBEDS
// ============================================================

function embedPet(
    id,
    petId
) {
    const pet =
        PETS[petId];

    const dados =
        petDoJogador(
            id,
            petId
        );

    const stats =
        statusPet(
            id,
            petId
        );

    const embed =
        new EmbedBuilder()
            .setTitle(
                `${pet.emoji} ${pet.nome}`
            )
            .setDescription(
                `${pet.descricao}\n\n` +
                `**Habilidade:** ${pet.habilidade}\n` +
                `${pet.habilidadeDescricao}`
            )
            .addFields(
                {
                    name: "⭐ Raridade",
                    value: pet.raridade,
                    inline: true
                },
                {
                    name: "📈 Nível",
                    value:
                        `${dados.nivel}/30`,
                    inline: true
                },
                {
                    name: "🏋️ Treino",
                    value:
                        `${dados.treino}`,
                    inline: true
                },
                {
                    name: "❤️ Vida",
                    value:
                        `${stats.hp}`,
                    inline: true
                },
                {
                    name: "⚔️ Ataque",
                    value:
                        `${stats.ataque}`,
                    inline: true
                },
                {
                    name: "🛡️ Defesa",
                    value:
                        `${stats.defesa}`,
                    inline: true
                },
                {
                    name: "💨 Velocidade",
                    value:
                        `${stats.velocidade}`,
                    inline: true
                },
                {
                    name: "✨ XP",
                    value:
                        `${dados.xp}/${limiteXPPet(dados.nivel)}`,
                    inline: true
                }
            )
            .setColor(
                pet.cor || 0x5865f2
            );

    if (pet.imagem) {
        embed.setImage(
            pet.imagem
        );
    }

    return embed;
}

// ============================================================
// 📚 AJUDA
// ============================================================

function ajudaEmbed() {
    return new EmbedBuilder()
        .setTitle(
            "🐉 ZUNO RPG — COMANDOS"
        )
        .setDescription(
            [
                "### 🐾 Pets",
                "`,invocar` — primeira invocação",
                "`,pets` — ver sua coleção",
                "`,pet nome` — ver informações do Pet",
                "`,equipar nome` — equipar Pet",
                "`,meupet` — ver seu Pet equipado",

                "### 🏋️ Treinamento",
                "`,treinar 10` — treinar 10 vezes",
                "`,treinar 20` — treinar 20 vezes",
                "`,moedas` — ver suas moedas",
                "`,daily` — receber recompensa diária",

                "### ⚔️ Batalhas",
                "`,duelo @membro` — desafiar outro treinador",
                "`,boss` — criar batalha contra Boss",
                "`,aliados` — ver batalha de Boss ativa",

                "### 🏆 Perfil",
                "`,perfilrpg` — seu perfil",
                "`,ranking` — ranking do RPG",

                "### 👑 ADM",
                "`,admpets`",
                "`,addmoedas @membro quantidade`",
                "`,remmoedas @membro quantidade`",
                "`,setmoedas @membro quantidade`",
                "`,darpet @membro nome`",
                "`,removerpet @membro nome`",
                "`,setlevelpet @membro nome nivel`",
                "`,addxp @membro nome quantidade`",
                "`,settreino @membro nome quantidade`"
            ].join("\n")
        )
        .setColor(
            0x5865f2
        );
}

// ============================================================
// 🚀 SISTEMA
// ============================================================

module.exports = (
    client
) => {

    carregarBanco();

    // ========================================================
    // 💬 MENSAGENS
    // ========================================================

    client.on(
        "messageCreate",
        async message => {

            if (
                message.author.bot
            ) return;

            if (
                !message.content.startsWith(
                    PREFIX
                )
            ) return;

            const partes =
                message.content
                    .slice(PREFIX.length)
                    .trim()
                    .split(/\s+/);

            const comando =
                partes.shift()
                    ?.toLowerCase();

            const args =
                partes;

            if (!comando) return;

            try {

                // ====================================================
                // AJUDA
                // ====================================================

                if (
                    comando === "rpg" ||
                    comando === "ajuda"
                ) {
                    return message.reply({
                        embeds: [
                            ajudaEmbed()
                        ]
                    });
                }

                // ====================================================
                // MOEDAS
                // ====================================================

                if (
                    comando === "moedas"
                ) {
                    const p =
                        jogador(
                            message.author.id
                        );

                    return message.reply(
                        `🪙 **${message.author.username}**, você possui **${p.moedas} moedas**.`
                    );
                }

                // ====================================================
                // DAILY
                // ====================================================

                if (
                    comando === "daily"
                ) {
                    const p =
                        jogador(
                            message.author.id
                        );

                    const agora =
                        Date.now();

                    const intervalo =
                        24 * 60 * 60 * 1000;

                    if (
                        agora - p.ultimaDaily <
                        intervalo
                    ) {
                        const restante =
                            intervalo -
                            (
                                agora -
                                p.ultimaDaily
                            );

                        const horas =
                            Math.ceil(
                                restante /
                                (60 * 60 * 1000)
                            );

                        return message.reply(
                            `⏳ Você já pegou sua recompensa diária. Tente novamente em aproximadamente **${horas}h**.`
                        );
                    }

                    p.ultimaDaily =
                        agora;

                    p.moedas += 20;

                    salvarBanco();

                    return message.reply(
                        `🎁 Recompensa diária recebida!\n🪙 **+20 moedas**`
                    );
                }

                // ====================================================
                // INVOCAR
                // ====================================================

                if (
                    comando === "invocar"
                ) {
                    const p =
                        jogador(
                            message.author.id
                        );

                    if (
                        !p.invocacaoInicial
                    ) {
                        adicionarPet(
                            message.author.id,
                            "lobo_lunar"
                        );

                        p.invocacaoInicial =
                            true;

                        salvarBanco();

                        return message.reply({
                            content:
                                "✨ **Sua primeira invocação foi realizada!**\n🐺 Você recebeu o **Lobo Lunar**!",
                            embeds: [
                                embedPet(
                                    message.author.id,
                                    "lobo_lunar"
                                )
                            ]
                        });
                    }

                    const petId =
                        p.equipe[0];

                    if (!petId) {
                        return message.reply(
                            "❌ Você não possui um Pet equipado."
                        );
                    }

                    return message.reply({
                        content:
                            `🐾 Seu Pet atual é **${PETS[petId].nome}**.`,
                        embeds: [
                            embedPet(
                                message.author.id,
                                petId
                            )
                        ]
                    });
                }

                // ====================================================
                // PETS
                // ====================================================

                if (
                    comando === "pets"
                ) {
                    const p =
                        jogador(
                            message.author.id
                        );

                    const lista =
                        Object.keys(
                            PETS
                        )
                            .map(
                                petId => {
                                    const possui =
                                        !!p.criaturas[petId];

                                    const simbolo =
                                        possui
                                            ? "🔓"
                                            : "🔒";

                                    const equipado =
                                        p.equipe.includes(
                                            petId
                                        )
                                            ? " ⭐"
                                            : "";

                                    return `${simbolo} ${PETS[petId].emoji} **${PETS[petId].nome}** — ${PETS[petId].raridade}${equipado}`;
                                }
                            );

                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(
                                    "🐾 SUA COLEÇÃO"
                                )
                                .setDescription(
                                    lista.join(
                                        "\n"
                                    )
                                )
                                .setColor(
                                    0x5865f2
                                )
                        ]
                    });
                }

                // ====================================================
                // PET
                // ====================================================

                if (
                    comando === "pet"
                ) {
                    const nome =
                        args.join(
                            " "
                        )
                            .toLowerCase();

                    const petId =
                        Object.keys(
                            PETS
                        ).find(
                            id =>
                                id.toLowerCase() ===
                                nome ||
                                PETS[id].nome.toLowerCase() ===
                                nome
                        );

                    if (!petId) {
                        return message.reply(
                            "❌ Pet não encontrado. Use `,pets` para ver os nomes."
                        );
                    }

                    const p =
                        jogador(
                            message.author.id
                        );

                    if (
                        !p.criaturas[petId]
                    ) {
                        return message.reply(
                            "🔒 Você ainda não desbloqueou esse Pet."
                        );
                    }

                    return message.reply({
                        embeds: [
                            embedPet(
                                message.author.id,
                                petId
                            )
                        ]
                    });
                }

                // ====================================================
                // EQUIPAR
                // ====================================================

                if (
                    comando === "equipar" ||
                    comando === "equip" ||
                    comando === "equipapet"
                ) {
                    const nome =
                        args.join(
                            " "
                        )
                            .toLowerCase();

                    const petId =
                        Object.keys(
                            PETS
                        ).find(
                            id =>
                                id.toLowerCase() ===
                                nome ||
                                PETS[id].nome.toLowerCase() ===
                                nome
                        );

                    if (!petId) {
                        return message.reply(
                            "❌ Pet não encontrado."
                        );
                    }

                    if (
                        !jogador(
                            message.author.id
                        ).criaturas[petId]
                    ) {
                        return message.reply(
                            "🔒 Você ainda não desbloqueou esse Pet."
                        );
                    }

                    equiparPet(
                        message.author.id,
                        petId
                    );

                    return message.reply(
                        `✅ Você equipou **${PETS[petId].emoji} ${PETS[petId].nome}**.`
                    );
                }

                // ====================================================
                // MEU PET
                // ====================================================

                if (
                    comando === "meupet"
                ) {
                    const p =
                        jogador(
                            message.author.id
                        );

                    const petId =
                        p.equipe[0];

                    if (!petId) {
                        return message.reply(
                            "❌ Você ainda não possui um Pet."
                        );
                    }

                    return message.reply({
                        embeds: [
                            embedPet(
                                message.author.id,
                                petId
                            )
                        ]
                    });
                }

                // ====================================================
                // TREINAR
                // ====================================================

                if (
                    comando === "treinar"
                ) {
                    const quantidade =
                        Number(
                            args[0]
                        );

                    const resultado =
                        treinarPet(
                            message.author.id,
                            quantidade
                        );

                    if (!resultado.ok) {
                        return message.reply(
                            resultado.texto
                        );
                    }

                    const pet =
                        PETS[
                            resultado.petId
                        ];

                    const dados =
                        petDoJogador(
                            message.author.id,
                            resultado.petId
                        );

                    const stats =
                        statusPet(
                            message.author.id,
                            resultado.petId
                        );

                    return message.reply(
                        `🏋️ **Treinamento concluído!**\n\n` +
                        `${pet.emoji} **${pet.nome}**\n` +
                        `🏋️ Treinos: **${dados.treino}**\n` +
                        `❤️ Vida: **${stats.hp}**\n` +
                        `⚔️ Ataque: **${stats.ataque}**\n` +
                        `🛡️ Defesa: **${stats.defesa}**\n` +
                        `💨 Velocidade: **${stats.velocidade}**\n\n` +
                        `🪙 Custo: **${resultado.custo} moedas**`
                    );
                }

                // ====================================================
                // PERFIL
                // ====================================================

                if (
                    comando === "perfilrpg"
                ) {
                    const p =
                        jogador(
                            message.author.id
                        );

                    const petId =
                        p.equipe[0];

                    const embed =
                        new EmbedBuilder()
                            .setTitle(
                                `🏆 Perfil RPG — ${message.author.username}`
                            )
                            .addFields(
                                {
                                    name: "⭐ Nível",
                                    value:
                                        `${p.nivel}`,
                                    inline: true
                                },
                                {
                                    name: "✨ XP",
                                    value:
                                        `${p.xp}/${limiteXP(p.nivel)}`,
                                    inline: true
                                },
                                {
                                    name: "🪙 Moedas",
                                    value:
                                        `${p.moedas}`,
                                    inline: true
                                },
                                {
                                    name: "🏆 Vitórias",
                                    value:
                                        `${p.vitorias}`,
                                    inline: true
                                },
                                {
                                    name: "💀 Derrotas",
                                    value:
                                        `${p.derrotas}`,
                                    inline: true
                                },
                                {
                                    name: "👹 Bosses",
                                    value:
                                        `${p.bossesDerrotados}`,
                                    inline: true
                                },
                                {
                                    name: "🐾 Pets",
                                    value:
                                        `${Object.keys(p.criaturas).length}/${Object.keys(PETS).length}`,
                                    inline: true
                                }
                            )
                            .setColor(
                                0x5865f2
                            );

                    if (petId) {
                        embed.addFields({
                            name: "⭐ Pet equipado",
                            value:
                                `${PETS[petId].emoji} ${PETS[petId].nome}`,
                            inline: false
                        });
                    }

                    return message.reply({
                        embeds: [
                            embed
                        ]
                    });
                }

                // ====================================================
                // RANKING
                // ====================================================

                if (
                    comando === "ranking"
                ) {
                    const ranking =
                        Object.entries(
                            banco
                        )
                            .map(
                                ([id, dados]) => ({
                                    id,
                                    dados: jogador(id)
                                })
                            )
                            .sort(
                                (a, b) =>
                                    (
                                        b.dados.vitorias -
                                        a.dados.vitorias
                                    ) ||
                                    (
                                        b.dados.nivel -
                                        a.dados.nivel
                                    )
                            )
                            .slice(
                                0,
                                10
                            );

                    if (!ranking.length) {
                        return message.reply(
                            "📊 Ainda não existe ninguém no ranking."
                        );
                    }

                    const texto =
                        ranking
                            .map(
                                (item, index) =>
                                    `**${index + 1}.** <@${item.id}> — 🏆 ${item.dados.vitorias} vitórias • ⭐ Nv. ${item.dados.nivel}`
                            )
                            .join("\n");

                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(
                                    "🏆 RANKING RPG"
                                )
                                .setDescription(
                                    texto
                                )
                                .setColor(
                                    0xf1c40f
                                )
                        ]
                    });
                }

                // ====================================================
                // DUELO
                // ====================================================

                if (
                    comando === "duelo"
                ) {
                    const alvo =
                        message.mentions.users.first();

                    if (!alvo) {
                        return message.reply(
                            "❌ Mencione quem você quer desafiar.\nExemplo: `,duelo @usuario`"
                        );
                    }

                    if (
                        alvo.bot
                    ) {
                        return message.reply(
                            "❌ Você não pode desafiar um bot."
                        );
                    }

                    if (
                        alvo.id ===
                        message.author.id
                    ) {
                        return message.reply(
                            "❌ Você não pode duelar consigo mesmo."
                        );
                    }

                    const meuPet =
                        jogador(
                            message.author.id
                        ).equipe[0];

                    const petAlvo =
                        jogador(
                            alvo.id
                        ).equipe[0];

                    if (!meuPet) {
                        return message.reply(
                            "❌ Você precisa ter um Pet equipado."
                        );
                    }

                    if (!petAlvo) {
                        return message.reply(
                            "❌ Essa pessoa ainda não possui um Pet equipado."
                        );
                    }

                    const id =
                        criarDesafio(
                            message.author.id,
                            alvo.id
                        );

                    return message.reply({
                        content:
                            `⚔️ <@${alvo.id}>, **${message.author.username}** desafiou você para um duelo!\n\n` +
                            `🐾 Seu Pet: **${PETS[petAlvo].nome}**\n` +
                            `🐾 Desafiante: **${PETS[meuPet].nome}**`,
                        components: [
                            botoesDesafio(id)
                        ]
                    });
                }

                // ====================================================
                // BOSS
                // ====================================================

                if (
                    comando === "boss"
                ) {
                    const boss =
                        BOSSES.dragao_apocalipse;

                    const id =
                        criarId(
                            "boss"
                        );

                    const petId =
                        jogador(
                            message.author.id
                        ).equipe[0];

                    if (!petId) {
                        return message.reply(
                            "❌ Equipe um Pet antes de criar uma batalha."
                        );
                    }

                    const batalha = {
                        id,
                        bossId:
                            boss.id,
                        criador:
                            message.author.id,
                        hp:
                            boss.hp,
                        maxHp:
                            boss.hp,
                        iniciado:
                            false,
                        jogadores: {
                            [message.author.id]: {
                                pet: petId
                            }
                        }
                    };

                    bossesAtivos.set(
                        id,
                        batalha
                    );

                    return message.reply({
                        embeds: [
                            bossEmbed(
                                batalha,
                                "🔥 **Uma batalha de Boss foi criada!**\n🤝 Outros treinadores podem entrar usando o botão abaixo."
                            )
                        ],
                        components: [
                            botoesBoss(
                                id,
                                false
                            )
                        ]
                    });
                }

                // ====================================================
                // ALIADOS
                // ====================================================

                if (
                    comando === "aliados"
                ) {
                    const lista =
                        [...bossesAtivos.values()]
                            .filter(
                                b =>
                                    !b.iniciado
                            );

                    if (!lista.length) {
                        return message.reply(
                            "❌ Não existe nenhuma batalha de Boss aguardando aliados."
                        );
                    }

                    const batalha =
                        lista[0];

                    return message.reply({
                        embeds: [
                            bossEmbed(
                                batalha,
                                "🤝 **Batalha aguardando aliados!**"
                            )
                        ],
                        components: [
                            botoesBoss(
                                batalha.id,
                                false
                            )
                        ]
                    });
                }

                // ====================================================
                // 👑 ADM
                // ====================================================

                const comandosADM = [
                    "admpets",
                    "addmoedas",
                    "remmoedas",
                    "setmoedas",
                    "darpet",
                    "removerpet",
                    "setlevelpet",
                    "addxp",
                    "settreino"
                ];

                if (
                    comandosADM.includes(
                        comando
                    )
                ) {
                    if (
                        message.author.id !==
                        ADM_ID
                    ) {
                        return message.reply(
                            "🔒 Você não possui permissão para usar esse comando."
                        );
                    }

                    if (
                        comando ===
                        "admpets"
                    ) {
                        return message.reply({
                            embeds: [
                                ajudaEmbed()
                            ]
                        });
                    }

                    const alvo =
                        message.mentions.users.first();

                    if (!alvo) {
                        return message.reply(
                            "❌ Mencione o membro primeiro."
                        );
                    }

                    const dados =
                        jogador(
                            alvo.id
                        );

                    if (
                        comando ===
                        "addmoedas"
                    ) {
                        const quantidade =
                            Number(
                                args[
                                    args.length - 1
                                ]
                            );

                        if (
                            !Number.isFinite(
                                quantidade
                            ) ||
                            quantidade <= 0
                        ) {
                            return message.reply(
                                "❌ Quantidade inválida."
                            );
                        }

                        dados.moedas +=
                            Math.floor(
                                quantidade
                            );

                        salvarBanco();

                        return message.reply(
                            `👑 Foram adicionadas **${Math.floor(quantidade)} moedas** para <@${alvo.id}>.`
                        );
                    }

                    if (
                        comando ===
                        "remmoedas"
                    ) {
                        const quantidade =
                            Number(
                                args[
                                    args.length - 1
                                ]
                            );

                        if (
                            !Number.isFinite(
                                quantidade
                            ) ||
                            quantidade <= 0
                        ) {
                            return message.reply(
                                "❌ Quantidade inválida."
                            );
                        }

                        dados.moedas =
                            Math.max(
                                0,
                                dados.moedas -
                                Math.floor(
                                    quantidade
                                )
                            );

                        salvarBanco();

                        return message.reply(
                            `👑 Foram removidas **${Math.floor(quantidade)} moedas** de <@${alvo.id}>.`
                        );
                    }

                    if (
                        comando ===
                        "setmoedas"
                    ) {
                        const quantidade =
                            Number(
                                args[
                                    args.length - 1
                                ]
                            );

                        if (
                            !Number.isFinite(
                                quantidade
                            ) ||
                            quantidade < 0
                        ) {
                            return message.reply(
                                "❌ Quantidade inválida."
                            );
                        }

                        dados.moedas =
                            Math.floor(
                                quantidade
                            );

                        salvarBanco();

                        return message.reply(
                            `👑 Moedas de <@${alvo.id}> definidas para **${dados.moedas}**.`
                        );
                    }

                    const petTexto =
                        args
                            .filter(
                                (_, index) =>
                                    index !==
                                    args.length - 1
                            )
                            .join(" ")
                            .toLowerCase();

                    let petId =
                        Object.keys(
                            PETS
                        ).find(
                            id =>
                                id.toLowerCase() ===
                                petTexto ||
                                PETS[id].nome.toLowerCase() ===
                                petTexto
                        );

                    if (
                        comando ===
                        "darpet" ||
                        comando ===
                        "removerpet" ||
                        comando ===
                        "setlevelpet" ||
                        comando ===
                        "addxp" ||
                        comando ===
                        "settreino"
                    ) {
                        if (
                            comando ===
                            "darpet" ||
                            comando ===
                            "removerpet"
                        ) {
                            petId =
                                args
                                    .slice(1)
                                    .join(" ")
                                    .toLowerCase();

                            petId =
                                Object.keys(
                                    PETS
                                ).find(
                                    id =>
                                        id.toLowerCase() ===
                                        petId ||
                                        PETS[id].nome.toLowerCase() ===
                                        petId
                                );
                        } else {
                            const ultimaPosicao =
                                args.length - 1;

                            petId =
                                args
                                    .slice(
                                        1,
                                        ultimaPosicao
                                    )
                                    .join(" ")
                                    .toLowerCase();

                            petId =
                                Object.keys(
                                    PETS
                                ).find(
                                    id =>
                                        id.toLowerCase() ===
                                        petId ||
                                        PETS[id].nome.toLowerCase() ===
                                        petId
                                );
                        }

                        if (!petId) {
                            return message.reply(
                                "❌ Pet inválido. Exemplo: `Fenrir`."
                            );
                        }

                        if (
                            comando ===
                            "darpet"
                        ) {
                            if (
                                !adicionarPet(
                                    alvo.id,
                                    petId
                                )
                            ) {
                                return message.reply(
                                    "❌ Esse membro já possui esse Pet."
                                );
                            }

                            return message.reply(
                                `👑 **${PETS[petId].nome}** foi dado para <@${alvo.id}>.`
                            );
                        }

                        if (
                            comando ===
                            "removerpet"
                        ) {
                            if (
                                !removerPet(
                                    alvo.id,
                                    petId
                                )
                            ) {
                                return message.reply(
                                    "❌ Esse membro não possui esse Pet."
                                );
                            }

                            return message.reply(
                                `👑 **${PETS[petId].nome}** foi removido de <@${alvo.id}>.`
                            );
                        }

                        if (
                            comando ===
                            "setlevelpet"
                        ) {
                            const nivel =
                                Number(
                                    args[
                                        args.length - 1
                                    ]
                                );

                            if (
                                !dados.criaturas[
                                    petId
                                ]
                            ) {
                                return message.reply(
                                    "❌ O membro não possui esse Pet."
                                );
                            }

                            if (
                                !Number.isInteger(
                                    nivel
                                ) ||
                                nivel < 1 ||
                                nivel > 30
                            ) {
                                return message.reply(
                                    "❌ O nível deve ficar entre 1 e 30."
                                );
                            }

                            dados.criaturas[
                                petId
                            ].nivel =
                                nivel;

                            dados.criaturas[
                                petId
                            ].xp = 0;

                            salvarBanco();

                            return message.reply(
                                `👑 **${PETS[petId].nome}** de <@${alvo.id}> agora está no nível **${nivel}**.`
                            );
                        }

                        if (
                            comando ===
                            "addxp"
                        ) {
                            const xp =
                                Number(
                                    args[
                                        args.length - 1
                                    ]
                                );

                            if (
                                !dados.criaturas[
                                    petId
                                ]
                            ) {
                                return message.reply(
                                    "❌ O membro não possui esse Pet."
                                );
                            }

                            if (
                                !Number.isFinite(
                                    xp
                                ) ||
                                xp < 0
                            ) {
                                return message.reply(
                                    "❌ XP inválido."
                                );
                            }

                            ganharXPPet(
                                alvo.id,
                                petId,
                                Math.floor(
                                    xp
                                )
                            );

                            salvarBanco();

                            return message.reply(
                                `👑 **+${Math.floor(xp)} XP** para **${PETS[petId].nome}** de <@${alvo.id}>.`
                            );
                        }

                        if (
                            comando ===
                            "settreino"
                        ) {
                            const treino =
                                Number(
                                    args[
                                        args.length - 1
                                    ]
                                );

                            if (
                                !dados.criaturas[
                                    petId
                                ]
                            ) {
                                return message.reply(
                                    "❌ O membro não possui esse Pet."
                                );
                            }

                            if (
                                !Number.isInteger(
                                    treino
                                ) ||
                                treino < 0 ||
                                treino > 1000
                            ) {
                                return message.reply(
                                    "❌ O treino deve ficar entre 0 e 1000."
                                );
                            }

                            dados.criaturas[
                                petId
                            ].treino =
                                treino;

                            dados.criaturas[
                                petId
                            ].bonusHp =
                                treino * 8;

                            dados.criaturas[
                                petId
                            ].bonusAtaque =
                                treino * 3;

                            dados.criaturas[
                                petId
                            ].bonusDefesa =
                                treino * 2;

                            dados.criaturas[
                                petId
                            ].bonusVelocidade =
                                treino * 2;

                            salvarBanco();

                            return message.reply(
                                `👑 Treino de **${PETS[petId].nome}** de <@${alvo.id}> definido para **${treino}**.`
                            );
                        }
                    }
                }

            } catch (erro) {

                console.error(
                    "❌ Erro no RPG:",
                    erro
                );

                if (
                    !message.replied &&
                    !message.deferred
                ) {
                    await message.reply(
                        "❌ Ocorreu um erro no sistema RPG. Verifique o console do Render."
                    ).catch(
                        () => {}
                    );
                }
            }
        }
    );

    // ========================================================
    // 🔘 BOTÕES
    // ========================================================

    client.on(
        "interactionCreate",
        async interaction => {

            try {

                if (
                    !interaction.isButton()
                ) return;

                const id =
                    interaction.customId;

                // ====================================================
                // ACEITAR DUELO
                // ====================================================

                if (
                    id.startsWith(
                        "rpg_duelo_aceitar_"
                    )
                ) {
                    const dueloId =
                        id.replace(
                            "rpg_duelo_aceitar_",
                            ""
                        );

                    const desafio =
                        desafios.get(
                            dueloId
                        );

                    if (!desafio) {
                        return interaction.reply({
                            content:
                                "❌ Esse desafio expirou.",
                            ephemeral: true
                        });
                    }

                    if (
                        interaction.user.id !==
                        desafio.desafiado
                    ) {
                        return interaction.reply({
                            content:
                                "❌ Só o desafiado pode aceitar.",
                            ephemeral: true
                        });
                    }

                    const duelo =
                        iniciarDuelo(
                            dueloId
                        );

                    if (!duelo) {
                        return interaction.reply({
                            content:
                                "❌ Não foi possível iniciar. Ambos precisam ter Pet equipado.",
                            ephemeral: true
                        });
                    }

                    await interaction.update({
                        content: null,
                        embeds: [
                            dueloEmbed(
                                duelo,
                                "⚔️ **O duelo começou!**"
                            )
                        ],
                        components: [
                            botoesDuelo(
                                duelo.id
                            )
                        ]
                    });

                    return;
                }

                // ====================================================
                // RECUSAR DUELO
                // ====================================================

                if (
                    id.startsWith(
                        "rpg_duelo_recusar_"
                    )
                ) {
                    const dueloId =
                        id.replace(
                            "rpg_duelo_recusar_",
                            ""
                        );

                    const desafio =
                        desafios.get(
                            dueloId
                        );

                    if (!desafio) {
                        return interaction.reply({
                            content:
                                "❌ Esse desafio expirou.",
                            ephemeral: true
                        });
                    }

                    if (
                        interaction.user.id !==
                        desafio.desafiado
                    ) {
                        return interaction.reply({
                            content:
                                "❌ Só o desafiado pode recusar.",
                            ephemeral: true
                        });
                    }

                    desafios.delete(
                        dueloId
                    );

                    return interaction.update({
                        content:
                            "❌ Desafio recusado.",
                        embeds: [],
                        components: []
                    });
                }

                // ====================================================
                // ATAQUE / HABILIDADE
                // ====================================================

                if (
                    id.startsWith(
                        "rpg_duelo_atacar_"
                    ) ||
                    id.startsWith(
                        "rpg_duelo_habilidade_"
                    )
                ) {
                    const habilidade =
                        id.startsWith(
                            "rpg_duelo_habilidade_"
                        );

                    const dueloId =
                        id.replace(
                            habilidade
                                ? "rpg_duelo_habilidade_"
                                : "rpg_duelo_atacar_",
                            ""
                        );

                    const duelo =
                        duelos.get(
                            dueloId
                        );

                    if (!duelo) {
                        return interaction.reply({
                            content:
                                "❌ Esse duelo terminou.",
                            ephemeral: true
                        });
                    }

                    const jogadorTurno =
                        duelo.turno === 1
                            ? duelo.desafiante
                            : duelo.desafiado;

                    if (
                        interaction.user.id !==
                        jogadorTurno
                    ) {
                        return interaction.reply({
                            content:
                                "⏳ Não é seu turno.",
                            ephemeral: true
                        });
                    }

                    const resultado =
                        turnoDuelo(
                            duelo,
                            habilidade
                        );

                    if (!resultado.ok) {
                        return interaction.reply({
                            content:
                                `❌ ${resultado.texto}`,
                            ephemeral: true
                        });
                    }

                    if (
                        resultado.fim
                    ) {
                        await interaction.update({
                            embeds: [
                                dueloEmbed(
                                    duelo,
                                    resultado.texto
                                )
                            ],
                            components: []
                        });

                        await finalizarDuelo(
                            interaction,
                            duelo
                        );

                        return;
                    }

                    await interaction.update({
                        embeds: [
                            dueloEmbed(
                                duelo,
                                resultado.texto
                            )
                        ],
                        components: [
                            botoesDuelo(
                                duelo.id
                            )
                        ]
                    });

                    return;
                }

                // ====================================================
                // ENTRAR NO BOSS
                // ====================================================

                if (
                    id.startsWith(
                        "rpg_boss_entrar_"
                    )
                ) {
                    const bossId =
                        id.replace(
                            "rpg_boss_entrar_",
                            ""
                        );

                    const batalha =
                        bossesAtivos.get(
                            bossId
                        );

                    if (!batalha) {
                        return interaction.reply({
                            content:
                                "❌ Essa batalha não existe mais.",
                            ephemeral: true
                        });
                    }

                    if (
                        batalha.iniciado
                    ) {
                        return interaction.reply({
                            content:
                                "❌ O Boss já começou.",
                            ephemeral: true
                        });
                    }

                    if (
                        Object.keys(
                            batalha.jogadores
                        ).length >= 5
                    ) {
                        return interaction.reply({
                            content:
                                "❌ A equipe já está cheia.",
                            ephemeral: true
                        });
                    }

                    if (
                        batalha.jogadores[
                            interaction.user.id
                        ]
                    ) {
                        return interaction.reply({
                            content:
                                "❌ Você já está na equipe.",
                            ephemeral: true
                        });
                    }

                    const petId =
                        jogador(
                            interaction.user.id
                        ).equipe[0];

                    if (!petId) {
                        return interaction.reply({
                            content:
                                "❌ Equipe um Pet antes de entrar.",
                            ephemeral: true
                        });
                    }

                    batalha.jogadores[
                        interaction.user.id
                    ] = {
                        pet: petId
                    };

                    return interaction.update({
                        embeds: [
                            bossEmbed(
                                batalha,
                                "🤝 Aliados podem continuar entrando."
                            )
                        ],
                        components: [
                            botoesBoss(
                                bossId,
                                false
                            )
                        ]
                    });
                }

                // ====================================================
                // INICIAR BOSS
                // ====================================================

                if (
                    id.startsWith(
                        "rpg_boss_iniciar_"
                    )
                ) {
                    const bossId =
                        id.replace(
                            "rpg_boss_iniciar_",
                            ""
                        );

                    const batalha =
                        bossesAtivos.get(
                            bossId
                        );

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
                                "❌ Só quem criou a batalha pode iniciar.",
                            ephemeral: true
                        });
                    }

                    if (
                        !Object.keys(
                            batalha.jogadores
                        ).length
                    ) {
                        return interaction.reply({
                            content:
                                "❌ Entre com um Pet primeiro.",
                            ephemeral: true
                        });
                    }

                    batalha.iniciado =
                        true;

                    return interaction.update({
                        embeds: [
                            bossEmbed(
                                batalha,
                                "⚔️ **O Boss começou!** Ataquem usando o botão abaixo."
                            )
                        ],
                        components: [
                            botoesBoss(
                                bossId,
                                true
                            )
                        ]
                    });
                }

                // ====================================================
                // ATACAR BOSS
                // ====================================================

                if (
                    id.startsWith(
                        "rpg_boss_atacar_"
                    )
                ) {
                    const bossId =
                        id.replace(
                            "rpg_boss_atacar_",
                            ""
                        );

                    const batalha =
                        bossesAtivos.get(
                            bossId
                        );

                    if (
                        !batalha ||
                        !batalha.iniciado
                    ) {
                        return interaction.reply({
                            content:
                                "❌ Essa batalha não está ativa.",
                            ephemeral: true
                        });
                    }

                    const participante =
                        batalha.jogadores[
                            interaction.user.id
                        ];

                    if (!participante) {
                        return interaction.reply({
                            content:
                                "❌ Você não participa dessa batalha.",
                            ephemeral: true
                        });
                    }

                    const petId =
                        participante.pet;

                    const stats =
                        statusPet(
                            interaction.user.id,
                            petId
                        );

                    const boss =
                        BOSSES[
                            batalha.bossId
                        ];

                    let danoBoss =
                        stats.ataque -
                        Math.floor(
                            boss.defesa *
                            0.18
                        ) +
                        Math.floor(
                            Math.random() *
                            80
                        );

                    danoBoss =
                        Math.max(
                            30,
                            danoBoss
                        );

                    batalha.hp =
                        Math.max(
                            0,
                            batalha.hp -
                            danoBoss
                        );

                    if (
                        batalha.hp <= 0
                    ) {
                        await interaction.update({
                            embeds: [
                                bossEmbed(
                                    batalha,
                                    `⚔️ **${PETS[petId].nome}** causou **${danoBoss} de dano** e deu o golpe final!`
                                )
                            ],
                            components: []
                        });

                        await finalizarBoss(
                            interaction,
                            batalha,
                            true
                        );

                        return;
                    }

                    const ids =
                        Object.keys(
                            batalha.jogadores
                        );

                    const alvo =
                        ids[
                            Math.floor(
                                Math.random() *
                                ids.length
                            )
                        ];

                    const contra =
                        Math.max(
                            0,
                            boss.ataque -
                            Math.floor(
                                stats.defesa *
                                0.35
                            )
                        );

                    await interaction.update({
                        embeds: [
                            bossEmbed(
                                batalha,
                                `⚔️ **${PETS[petId].nome}** causou **${danoBoss} de dano**!\n💥 O Boss atacou <@${alvo}> com força de **${contra}**.`
                            )
                        ],
                        components: [
                            botoesBoss(
                                bossId,
                                true
                            )
                        ]
                    });

                    return;
                }

            } catch (erro) {

                console.error(
                    "❌ Erro nas interações RPG:",
                    erro
                );

                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {
                    await interaction.reply({
                        content:
                            "❌ Erro interno no RPG.",
                        ephemeral: true
                    }).catch(
                        () => {}
                    );
                }
            }
        }
    );
};
