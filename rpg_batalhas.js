// ============================================================
// 🐉 ZUNO RPG — ARENA DAS CRIATURAS
// ============================================================
// SISTEMA 100% POR COMANDOS COM VÍRGULA
//
// ,rpg
// ,invocar
// ,pets
// ,pet
// ,equipar
// ,mapas
// ,explorar
// ,meumapa
// ,treinar 10
// ,treinar 20
// ,duelo @membro
// ,perfilrpg
// ,ranking
// ,daily
// ,moedas
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
const PREFIX_RPG = ",";
const ADM_ID = "1053803800340746261";
const MAX_LEVEL = 100;
const MAX_BATALHA = 1;

const DB_FILE = path.join(__dirname, "rpg_batalhas_db.json");

// ============================================================
// 🖼️ IMAGENS DOS PETS
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

// ============================================================
// 👑 IMAGENS DOS BOSSES
// ============================================================

const IMAGENS_BOSS = {

    dragao_apocalipse:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555984946768646225/IMG-20261003-WA0004.jpg?backend=b2&ex=6ac28368&is=6ac131e8&hm=f4768c07bef82e20faff5163bb836db2c297e2eb5a0d20846703025766eadce7&.png",

    titan_olimpiano:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555985158971203684/IMG-20261003-WA0006.jpg?backend=b2&ex=6ac2839a&is=6ac1321a&hm=88b1f910c1c52f1cad096c91ffd0502492279dd53ed7375ec8a3bef480a14953&.png",

    serpente_cosmica:
        "https://cdn.discordapp.com/attachments/1555632676709343285/1555985172334125159/IMG-20261003-WA0005.jpg?backend=b2&ex=6ac2839d&is=6ac1321d&hm=8a5042befe24a2d8dc6529cde6dffa4b617e6a1c054b95c2112cdb46b906e296&.png"
};

// ============================================================
// 🐾 PETS
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
        habilidadeDescricao: "Recupera uma parte da própria vida.",
        tipo: "cura",
        chance: 30,
        cor: 0xb084ff,
        imagem: IMAGENS.unicornio_astral
    },

    dragao_gelo: {
        id: "dragao_gelo",
        nome: "Dragão de Gelo",
        emoji: "🐉",
        raridade: "Raro",
        hp: 950,
        ataque: 210,
        defesa: 170,
        velocidade: 140,
        habilidade: "Tempestade Glacial",
        descricao: "Um dragão capaz de congelar campos inteiros.",
        habilidadeDescricao: "Pode congelar o inimigo e impedir seu próximo ataque.",
        tipo: "gelo",
        chance: 25,
        cor: 0x5dade2,
        imagem: IMAGENS.dragao_gelo
    },

    fenix: {
        id: "fenix",
        nome: "Fênix",
        emoji: "🔥",
        raridade: "Lendário",
        hp: 900,
        ataque: 220,
        defesa: 150,
        velocidade: 160,
        habilidade: "Renascimento",
        descricao: "Uma criatura que retorna das próprias cinzas.",
        habilidadeDescricao: "Pode reviver uma vez com parte da vida.",
        tipo: "renascimento",
        chance: 7,
        cor: 0xff7b00,
        imagem: IMAGENS.fenix
    },

    dragao_noite: {
        id: "dragao_noite",
        nome: "Dragão da Noite",
        emoji: "🐉",
        raridade: "Secreto",
        hp: 1400,
        ataque: 320,
        defesa: 250,
        velocidade: 200,
        habilidade: "Vórtice Sombrio",
        descricao: "Uma criatura misteriosa que habita dimensões de escuridão.",
        habilidadeDescricao: "Causa enorme dano e drena parte da vida.",
        tipo: "dreno",
        chance: 2,
        cor: 0x3b235e,
        imagem: IMAGENS.dragao_noite
    },

    kraken: {
        id: "kraken",
        nome: "Kraken",
        emoji: "🐙",
        raridade: "Épico",
        hp: 1100,
        ataque: 210,
        defesa: 190,
        velocidade: 100,
        habilidade: "Abismo Oceânico",
        descricao: "O monstro colossal das profundezas.",
        habilidadeDescricao: "Causa dano pesado e reduz a velocidade inimiga.",
        tipo: "agua",
        chance: 15,
        cor: 0x2980b9,
        imagem: IMAGENS.kraken
    },

    minotauro: {
        id: "minotauro",
        nome: "Minotauro",
        emoji: "🐂",
        raridade: "Incomum",
        hp: 1000,
        ataque: 180,
        defesa: 220,
        velocidade: 80,
        habilidade: "Investida Brutal",
        descricao: "O guardião monstruoso do antigo labirinto.",
        habilidadeDescricao: "Golpe físico extremamente poderoso.",
        tipo: "brutal",
        chance: 40,
        cor: 0x8b4513,
        imagem: IMAGENS.minotauro
    },

    kitsune: {
        id: "kitsune",
        nome: "Kitsune",
        emoji: "🦊",
        raridade: "Épico",
        hp: 680,
        ataque: 200,
        defesa: 100,
        velocidade: 230,
        habilidade: "Ilusão das Nove Caudas",
        descricao: "Uma raposa mística capaz de manipular ilusões.",
        habilidadeDescricao: "Pode esquivar completamente de um ataque.",
        tipo: "evasao",
        chance: 15,
        cor: 0xe84393,
        imagem: IMAGENS.kitsune
    },

    basilisco: {
        id: "basilisco",
        nome: "Basilisco",
        emoji: "🐍",
        raridade: "Raro",
        hp: 850,
        ataque: 180,
        defesa: 140,
        velocidade: 130,
        habilidade: "Olhar Mortal",
        descricao: "A criatura cujo olhar pode paralisar seus inimigos.",
        habilidadeDescricao: "Aplica veneno e pode impedir o próximo ataque.",
        tipo: "veneno",
        chance: 28,
        cor: 0x27ae60,
        imagem: IMAGENS.basilisco
    },

    quimera: {
        id: "quimera",
        nome: "Quimera",
        emoji: "🦁",
        raridade: "Lendário",
        hp: 1250,
        ataque: 270,
        defesa: 180,
        velocidade: 150,
        habilidade: "Fúria das Três Almas",
        descricao: "Uma criatura formada pela união de três feras.",
        habilidadeDescricao: "Realiza múltiplos golpes.",
        tipo: "multi",
        chance: 6,
        cor: 0xd35400,
        imagem: IMAGENS.quimera
    },

    pegasus: {
        id: "pegasus",
        nome: "Pegasus",
        emoji: "🪽",
        raridade: "Raro",
        hp: 700,
        ataque: 150,
        defesa: 120,
        velocidade: 240,
        habilidade: "Asas Celestiais",
        descricao: "Uma criatura alada capaz de atravessar os céus.",
        habilidadeDescricao: "Possui grande chance de atacar primeiro.",
        tipo: "velocidade",
        chance: 30,
        cor: 0xffffff,
        imagem: IMAGENS.pegasus
    },

    cerbero: {
        id: "cerbero",
        nome: "Cérbero",
        emoji: "🐺",
        raridade: "Lendário",
        hp: 1300,
        ataque: 280,
        defesa: 210,
        velocidade: 130,
        habilidade: "Tríplice Mordida",
        descricao: "O lendário cão guardião do submundo.",
        habilidadeDescricao: "Ataca o adversário três vezes.",
        tipo: "triplo",
        chance: 6,
        cor: 0xc0392b,
        imagem: IMAGENS.cerbero
    },

    hidra: {
        id: "hidra",
        nome: "Hidra",
        emoji: "🐲",
        raridade: "Épico",
        hp: 1500,
        ataque: 190,
        defesa: 230,
        velocidade: 90,
        habilidade: "Cabeças Regenerativas",
        descricao: "Uma criatura cujas cabeças parecem nunca parar de crescer.",
        habilidadeDescricao: "Recupera vida constantemente.",
        tipo: "regen",
        chance: 14,
        cor: 0x16a085,
        imagem: IMAGENS.hidra
    },

    leviata: {
        id: "leviata",
        nome: "Leviatã",
        emoji: "🐉",
        raridade: "Lendário",
        hp: 1700,
        ataque: 300,
        defesa: 240,
        velocidade: 110,
        habilidade: "Maré Devastadora",
        descricao: "Uma criatura colossal dos oceanos primordiais.",
        habilidadeDescricao: "Ataque de água extremamente poderoso.",
        tipo: "agua",
        chance: 4,
        cor: 0x2471a3,
        imagem: IMAGENS.leviata
    },

    grifo_sombrio: {
        id: "grifo_sombrio",
        nome: "Grifo Sombrio",
        emoji: "🦅",
        raridade: "Épico",
        hp: 900,
        ataque: 230,
        defesa: 130,
        velocidade: 190,
        habilidade: "Garras da Escuridão",
        descricao: "Um grifo corrompido pelas sombras.",
        habilidadeDescricao: "Causa dano aumentado contra inimigos fracos.",
        tipo: "execucao",
        chance: 13,
        cor: 0x6c3483,
        imagem: IMAGENS.grifo_sombrio
    },

    lobo_lunar: {
        id: "lobo_lunar",
        nome: "Lobo Lunar",
        emoji: "🐺",
        raridade: "Incomum",
        hp: 600,
        ataque: 130,
        defesa: 100,
        velocidade: 200,
        habilidade: "Uivo Lunar",
        descricao: "Um lobo que recebe poder da lua.",
        habilidadeDescricao: "Aumenta ataque e velocidade.",
        tipo: "buff",
        chance: 45,
        cor: 0x5dade2,
        imagem: IMAGENS.lobo_lunar
    },

    guardiao_astral: {
        id: "guardiao_astral",
        nome: "Guardião Astral",
        emoji: "🛡️",
        raridade: "Secreto",
        hp: 1800,
        ataque: 350,
        defesa: 300,
        velocidade: 170,
        habilidade: "Julgamento Astral",
        descricao: "Uma entidade que protege os limites entre os mundos.",
        habilidadeDescricao: "Libera um ataque astral devastador.",
        tipo: "astral",
        chance: 1,
        cor: 0x8e44ad,
        imagem: IMAGENS.guardiao_astral
    }
};

// ============================================================
// 👑 BOSSES
// ============================================================

const BOSSES = {

    dragao_apocalipse: {
        id: "dragao_apocalipse",
        nome: "Dragão do Apocalipse",
        emoji: "🐉",
        raridade: "Boss Lendário",
        hp: 35000,
        ataque: 780,
        defesa: 650,
        velocidade: 420,
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
        raridade: "Boss Mítico",
        hp: 50000,
        ataque: 920,
        defesa: 800,
        velocidade: 380,
        imagem: IMAGENS_BOSS.titan_olimpiano,
        recompensas: [
            "guardiao_astral",
            "dragao_noite"
        ]
    },

    serpente_cosmica: {
        id: "serpente_cosmica",
        nome: "Serpente Cósmica",
        emoji: "🐍",
        raridade: "Boss Secreto",
        hp: 70000,
        ataque: 1100,
        defesa: 950,
        velocidade: 500,
        imagem: IMAGENS_BOSS.serpente_cosmica,
        recompensas: [
            "guardiao_astral",
            "dragao_noite",
            "serpente_eclipse"
        ]
    }
};

// ============================================================
// 🗺️ MAPAS
// ============================================================

const MAPAS = {

    floresta_lunar: {
        nome: "Floresta Lunar",
        emoji: "🌙",
        nivel: 1,
        descricao:
            "Uma floresta coberta pela luz da lua, onde criaturas antigas observam entre as árvores.",
        monstros: [
            "lobo_lunar",
            "kitsune",
            "grifo_celestial"
        ],
        elite: "fenrir",
        bossChance: 0.004
    },

    reino_glacial: {
        nome: "Reino Glacial",
        emoji: "❄️",
        nivel: 10,
        descricao:
            "Montanhas congeladas escondem predadores que suportam o frio eterno.",
        monstros: [
            "dragao_gelo",
            "unicornio_astral",
            "grifo_celestial"
        ],
        elite: "dragao_gelo",
        bossChance: 0.003
    },

    vulcao_caos: {
        nome: "Vulcão do Caos",
        emoji: "🌋",
        nivel: 20,
        descricao:
            "Rios de lava atravessam um território dominado por criaturas de grande poder.",
        monstros: [
            "fenix",
            "dragao_oriente",
            "basilisco",
            "quimera"
        ],
        elite: "dragao_oriente",
        bossChance: 0.003
    },

    abismo_oceanico: {
        nome: "Abismo Oceânico",
        emoji: "🌊",
        nivel: 35,
        descricao:
            "Nas profundezas do oceano, monstros colossais aguardam os treinadores.",
        monstros: [
            "kraken",
            "leviata",
            "serpente_eclipse"
        ],
        elite: "leviata",
        bossChance: 0.0025
    },

    ruinas_ancestrais: {
        nome: "Ruínas Ancestrais",
        emoji: "🏜️",
        nivel: 50,
        descricao:
            "Templos esquecidos guardam criaturas que sobreviveram a eras inteiras.",
        monstros: [
            "minotauro",
            "cerbero",
            "hidra",
            "basilisco"
        ],
        elite: "hidra",
        bossChance: 0.002
    },

    dimensao_astral: {
        nome: "Dimensão Astral",
        emoji: "🌌",
        nivel: 65,
        descricao:
            "Um lugar fora do mundo conhecido, onde a própria realidade parece viva.",
        monstros: [
            "guardiao_astral",
            "unicornio_astral",
            "grifo_sombrio",
            "serpente_eclipse"
        ],
        elite: "guardiao_astral",
        bossChance: 0.0015
    },

    reino_apocalipse: {
        nome: "Reino do Apocalipse",
        emoji: "☠️",
        nivel: 80,
        descricao:
            "Um território destruído por forças ancestrais. Apenas os treinadores preparados chegam aqui.",
        monstros: [
            "dragao_noite",
            "quimera",
            "leviata",
            "grifo_sombrio"
        ],
        elite: "dragao_noite",
        bossChance: 0.001
    },

    dominio_divino: {
        nome: "Domínio Divino",
        emoji: "👑",
        nivel: 100,
        descricao:
            "O último mapa conhecido. Criaturas lendárias habitam este domínio.",
        monstros: [
            "guardiao_astral",
            "dragao_oriente",
            "serpente_eclipse",
            "dragao_noite"
        ],
        elite: "serpente_eclipse",
        bossChance: 0.0007
    }
};

const ORDEM_MAPAS = Object.keys(MAPAS);

// ============================================================
// 💾 BANCO DE DADOS
// ============================================================

const batalhas = new Map();

function carregarBanco() {

    try {

        if (!fs.existsSync(DB_FILE)) {

            fs.writeFileSync(
                DB_FILE,
                JSON.stringify({}, null, 2)
            );

            return {};
        }

        return JSON.parse(
            fs.readFileSync(DB_FILE, "utf8")
        );

    } catch (erro) {

        console.error(
            "❌ Erro ao carregar banco RPG:",
            erro
        );

        return {};
    }
}

let db = carregarBanco();

function salvarBanco() {

    try {

        fs.writeFileSync(
            DB_FILE,
            JSON.stringify(db, null, 2)
        );

    } catch (erro) {

        console.error(
            "❌ Erro ao salvar banco RPG:",
            erro
        );
    }
}

// ============================================================
// 👤 JOGADOR
// ============================================================

function jogador(id) {

    if (!db[id]) {

        db[id] = {

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

            ultimosPets: [],

            mapasDescobertos: {}
        };

        salvarBanco();
    }

    const p = db[id];

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
    p.mapasDescobertos ??= {};

    return p;
}

// ============================================================
// 🐾 DADOS DO PET
// ============================================================

function dadosPet(id, petId) {

    const p = jogador(id);

    if (!p.criaturas[petId]) {

        p.criaturas[petId] = {

            nivel: 1,

            xp: 0,

            treino: 0,

            bonusHp: 0,

            bonusAtaque: 0,

            bonusDefesa: 0,

            bonusVelocidade: 0
        };
    }

    const d = p.criaturas[petId];

    d.nivel ??= 1;
    d.xp ??= 0;
    d.treino ??= 0;
    d.bonusHp ??= 0;
    d.bonusAtaque ??= 0;
    d.bonusDefesa ??= 0;
    d.bonusVelocidade ??= 0;

    return d;
}

// ============================================================
// 📈 XP
// ============================================================

function xpTreinador(nivel) {

    return 250 + ((nivel - 1) * 150);
}

function xpPet(nivel) {

    return 120 + ((nivel - 1) * 90);
}

function ganharXpTreinador(id, quantidade) {

    const p = jogador(id);

    p.xp += quantidade;

    let subiu = 0;

    while (
        p.nivel < MAX_LEVEL &&
        p.xp >= xpTreinador(p.nivel)
    ) {

        p.xp -= xpTreinador(p.nivel);

        p.nivel++;

        subiu++;
    }

    return subiu;
}

function ganharXpPet(id, petId, quantidade) {

    const d = dadosPet(id, petId);

    d.xp += quantidade;

    let subiu = 0;

    while (
        d.nivel < MAX_LEVEL &&
        d.xp >= xpPet(d.nivel)
    ) {

        d.xp -= xpPet(d.nivel);

        d.nivel++;

        subiu++;
    }

    return subiu;
}

// ============================================================
// 🐾 ADICIONAR PET
// ============================================================

function adicionarPet(id, petId) {

    const p = jogador(id);

    if (!PETS[petId]) return false;

    dadosPet(id, petId);

    if (!p.equipe.includes(petId)) {

        p.equipe.push(petId);
    }

    if (!p.equipe.length) {

        p.equipe.push(petId);
    }

    salvarBanco();

    return true;
}

// ============================================================
// 🐾 PET EQUIPADO
// ============================================================

function petEquipado(id) {

    const p = jogador(id);

    return (
        p.equipe[0] &&
        PETS[p.equipe[0]]
    )
        ? p.equipe[0]
        : null;
}

// ============================================================
// 📊 STATUS DO PET
// ============================================================

function statsPet(id, petId) {

    const base = PETS[petId];

    const d = dadosPet(
        id,
        petId
    );

    const nivelMult =
        1 + ((d.nivel - 1) * 0.06);

    const treinoMult =
        1 + (d.treino * 0.012);

    return {

        hp:
            Math.floor(
                base.hp * nivelMult +
                d.bonusHp
            ),

        ataque:
            Math.floor(
                base.ataque *
                nivelMult *
                treinoMult +
                d.bonusAtaque
            ),

        defesa:
            Math.floor(
                base.defesa *
                nivelMult *
                treinoMult +
                d.bonusDefesa
            ),

        velocidade:
            Math.floor(
                base.velocidade *
                nivelMult *
                treinoMult +
                d.bonusVelocidade
            )
    };
}

// ============================================================
// ❤️ BARRA DE VIDA
// ============================================================

function barraVida(
    atual,
    maximo,
    tamanho = 18
) {

    maximo =
        Math.max(
            1,
            maximo
        );

    atual =
        Math.max(
            0,
            Math.min(
                atual,
                maximo
            )
        );

    const cheios =
        Math.round(
            (atual / maximo) *
            tamanho
        );

    return (
        "█".repeat(cheios) +
        "░".repeat(
            tamanho - cheios
        )
    );
}

function porcentagem(
    atual,
    maximo
) {

    return Math.round(
        (
            Math.max(
                0,
                atual
            ) /
            Math.max(
                1,
                maximo
            )
        ) * 100
    );
}

// ============================================================
// 🖼️ FUNÇÕES VISUAIS
// ============================================================

function imagemValida(url) {

    return (
        typeof url === "string" &&
        url.startsWith("http")
    );
}

function raridadeEmoji(raridade) {

    if (!raridade)
        return "⚪";

    if (
        /Lendário|Secreto/i
            .test(raridade)
    )
        return "🌟";

    if (
        /Mítico/i
            .test(raridade)
    )
        return "🔮";

    if (
        /Épico/i
            .test(raridade)
    )
        return "💜";

    if (
        /Raro/i
            .test(raridade)
    )
        return "💎";

    return "⚪";
}

// ============================================================
// 🗺️ MAPA
// ============================================================

function nivelMapaLiberado(
    p,
    mapaId
) {

    return (
        p.nivel >=
        MAPAS[mapaId].nivel
    );
}

function mapaAtualSugerido(p) {

    let escolhido =
        ORDEM_MAPAS[0];

    for (
        const id of ORDEM_MAPAS
    ) {

        if (
            p.nivel >=
            MAPAS[id].nivel
        ) {

            escolhido = id;

        } else {

            break;
        }
    }

    return escolhido;
}

// ============================================================
// 👹 MONSTRO
// ============================================================

function monstroDoMapa(
    mapa
) {

    const candidatos =
        mapa.monstros.filter(
            id => PETS[id]
        );

    if (!candidatos.length)
        return "lobo_lunar";

    return candidatos[
        Math.floor(
            Math.random() *
            candidatos.length
        )
    ];
}

function nivelInimigo(
    mapa,
    jogadorNivel,
    elite = false
) {

    const base = mapa.nivel;

    const variacao =
        Math.floor(
            Math.random() * 4
        ) - 1;

    return Math.min(
        MAX_LEVEL,
        Math.max(
            1,
            base +
            variacao +
            (elite ? 4 : 0),
            jogadorNivel - 4
        )
    );
}

function statsMonstro(
    petId,
    nivel,
    elite = false
) {

    const base =
        PETS[petId];

    const mult =
        1 + (
            (nivel - 1) *
            0.06
        );

    const eliteMult =
        elite
            ? 1.30
            : 1;

    return {

        hp:
            Math.floor(
                base.hp *
                mult *
                eliteMult
            ),

        ataque:
            Math.floor(
                base.ataque *
                mult *
                eliteMult
            ),

        defesa:
            Math.floor(
                base.defesa *
                mult *
                eliteMult
            ),

        velocidade:
            Math.floor(
                base.velocidade *
                mult *
                eliteMult
            )
    };
}

// ============================================================
// 💰 RECOMPENSAS
// ============================================================

function recompensaBatalha(
    nivel,
    elite = false
) {

    const moedas =
        elite
            ? 12 + nivel
            : 5 + Math.floor(
                nivel / 2
            );

    const xpPetVal =
        elite
            ? 90 + nivel * 4
            : 45 + nivel * 3;

    const xpTreinadorVal =
        elite
            ? 30 + Math.floor(
                nivel / 2
            )
            : 15 + Math.floor(
                nivel / 3
            );

    return {

        moedas,

        xpPet:
            xpPetVal,

        xpTreinador:
            xpTreinadorVal
    };
}

// ============================================================
// ⚔️ CRIAR BATALHA
// ============================================================

function criarBatalha(
    userId,
    mapaId,
    inimigoId,
    inimigoNivel,
    elite = false,
    bossId = null
) {

    const petId =
        petEquipado(userId);

    if (!petId)
        return null;

    const meuStats =
        statsPet(
            userId,
            petId
        );

    const inimigo =
        bossId
            ? BOSSES[bossId]
            : PETS[inimigoId];

    const inimigoStats =
        bossId
            ? {

                hp: inimigo.hp,

                ataque:
                    inimigo.ataque,

                defesa:
                    inimigo.defesa,

                velocidade:
                    inimigo.velocidade
            }
            : statsMonstro(
                inimigoId,
                inimigoNivel,
                elite
            );

    const id =
        `${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const batalha = {

        id,

        tipo: "exploracao",

        userId,

        mapaId,

        petId,

        inimigoId,

        inimigoNivel,

        bossId,

        elite,

        turno: 1,

        defensor: false,

        meuHpMax:
            meuStats.hp,

        meuHp:
            meuStats.hp,

        inimigoHpMax:
            inimigoStats.hp,

        inimigoHp:
            inimigoStats.hp,

        meuStats,

        inimigoStats,

        criada:
            Date.now(),

        log: []
    };

    batalhas.set(
        id,
        batalha
    );

    return batalha;
}

// ============================================================
// 🎨 EMBED DA BATALHA
// ============================================================

function batalhaEmbed(b) {

    const mapa =
        MAPAS[b.mapaId];

    const pet =
        PETS[b.petId];

    const inimigo =
        b.bossId
            ? BOSSES[b.bossId]
            : PETS[b.inimigoId];

    const hpPet =
        `${barraVida(
            b.meuHp,
            b.meuHpMax
        )} ${b.meuHp}/${b.meuHpMax} (${porcentagem(
            b.meuHp,
            b.meuHpMax
        )}%)`;

    const hpInimigo =
        `${barraVida(
            b.inimigoHp,
            b.inimigoHpMax
        )} ${b.inimigoHp}/${b.inimigoHpMax} (${porcentagem(
            b.inimigoHp,
            b.inimigoHpMax
        )}%)`;

    const titulo =
        b.bossId
            ? `👑 ${inimigo.nome}`
            : `${inimigo.emoji} ${inimigo.nome}`;

    const descricao =
        b.log.slice(-5)
            .join("\n\n") ||
        "A batalha começou...";

    const embed =
        new EmbedBuilder()
            .setColor(
                b.bossId
                    ? 0xffc107
                    : (
                        pet.cor ||
                        0x8e44ad
                    )
            )
            .setTitle(
                `${mapa.emoji} ${mapa.nome} • ⚔️ Turno ${b.turno}`
            )
            .setDescription(
                `**🐾 ${pet.nome} — Nv. ${dadosPet(
                    b.userId,
                    b.petId
                ).nivel}**\n` +
                `❤️ ${hpPet}\n\n` +
                `**${titulo} — Nv. ${b.inimigoNivel || "???"}**\n` +
                `❤️ ${hpInimigo}\n\n` +
                `${descricao}`
            )
            .setFooter({
                text:
                    "ZUNO RPG • 1 treinador = 1 pet por batalha"
            });

    if (
        imagemValida(
            inimigo.imagem
        )
    ) {

        embed.setImage(
            inimigo.imagem
        );

    } else if (
        imagemValida(
            pet.imagem
        )
    ) {

        embed.setThumbnail(
            pet.imagem
        );
    }

    return embed;
}

// ============================================================
// 🔘 BOTÕES DA BATALHA
// ============================================================

function botoesBatalha(
    b,
    disabled = false
) {

    return [

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        `rpg_batalha_atacar_${b.id}`
                    )
                    .setLabel("Atacar")
                    .setEmoji("⚔️")
                    .setStyle(
                        ButtonStyle.Primary
                    )
                    .setDisabled(
                        disabled
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `rpg_batalha_habilidade_${b.id}`
                    )
                    .setLabel("Habilidade")
                    .setEmoji("✨")
                    .setStyle(
                        ButtonStyle.Success
                    )
                    .setDisabled(
                        disabled
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `rpg_batalha_defender_${b.id}`
                    )
                    .setLabel("Defender")
                    .setEmoji("🛡️")
                    .setStyle(
                        ButtonStyle.Secondary
                    )
                    .setDisabled(
                        disabled
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `rpg_batalha_fugir_${b.id}`
                    )
                    .setLabel("Fugir")
                    .setEmoji("🏃")
                    .setStyle(
                        ButtonStyle.Danger
                    )
                    .setDisabled(
                        disabled
                    )
            )
    ];
}

// ============================================================
// 📖 NARRAÇÃO INICIAL
// ============================================================

function narrativaInicio(b) {

    const mapa =
        MAPAS[b.mapaId];

    const inimigo =
        b.bossId
            ? BOSSES[b.bossId]
            : PETS[b.inimigoId];

    const pet =
        PETS[b.petId];

    if (b.bossId) {

        b.log.push(
            `╭────────────── ✦ ──────────────╮\n` +
            `**🌟 ENCONTRO LENDÁRIO**\n\n` +
            `A paisagem muda completamente.\n` +
            `Uma presença colossal surge diante de ${pet.nome}.\n\n` +
            `**👑 ${inimigo.nome.toUpperCase()} APARECEU!**\n` +
            `╰───────────────────────────────╯`
        );

    } else {

        b.log.push(
            `╭────────────── ✦ ──────────────╮\n` +
            `**${mapa.emoji} ${mapa.nome.toUpperCase()}**\n\n` +
            `${mapa.descricao}\n` +
            `╰───────────────────────────────╯\n\n` +
            `🌲 Algo se move entre os caminhos...\n\n` +
            `**${inimigo.emoji} ${inimigo.nome.toUpperCase()} APARECEU!**\n\n` +
            `${pet.emoji} **${pet.nome}** se posiciona para a batalha.`
        );
    }
}

// ============================================================
// 💥 DANO
// ============================================================

function dano(
    atk,
    defesa,
    multiplicador = 1
) {

    const base =
        Math.max(
            1,
            atk -
            Math.floor(
                defesa * 0.45
            )
        );

    const variacao =
        0.85 +
        Math.random() *
        0.30;

    return Math.max(
        1,
        Math.floor(
            base *
            multiplicador *
            variacao
        )
    );
}

// ============================================================
// 💀 DERROTA
// ============================================================

function mensagemDerrota(b) {

    const pet =
        PETS[b.petId];

    return (
        `💀 **A batalha terminou.**\n\n` +
        `${pet.emoji} ${pet.nome} caiu após uma longa luta.\n\n` +
        `✨ *Treine seu pet e tente novamente.*`
    );
}

// ============================================================
// 🏆 VITÓRIA
// ============================================================

function mensagemVitoria(b) {

    const pet =
        PETS[b.petId];

    const recompensa =
        recompensaBatalha(
            b.inimigoNivel || 1,
            b.elite
        );

    const subiuPet =
        ganharXpPet(
            b.userId,
            b.petId,
            recompensa.xpPet
        );

    const subiuTreinador =
        ganharXpTreinador(
            b.userId,
            recompensa.xpTreinador
        );

    const p =
        jogador(b.userId);

    p.moedas +=
        recompensa.moedas;

    p.vitorias++;

    if (b.bossId) {

        p.bossesDerrotados++;
    }

    salvarBanco();

    return (
        `🏆 **VITÓRIA!**\n\n` +
        `${pet.emoji} **${pet.nome}** venceu a batalha.\n\n` +
        `💰 +${recompensa.moedas} moedas\n` +
        `✨ +${recompensa.xpPet} XP do pet\n` +
        `📈 +${recompensa.xpTreinador} XP do treinador` +

        (
            subiuPet
                ? `\n🎉 **Seu pet subiu ${subiuPet} nível(is)!**`
                : ""
        ) +

        (
            subiuTreinador
                ? `\n🌟 **Você subiu ${subiuTreinador} nível(is)!**`
                : ""
        )
    );
}

// ============================================================
// ⚔️ EXECUTAR TURNO
// ============================================================

async function executarTurno(
    interaction,
    b,
    acao
) {

    const pet =
        PETS[b.petId];

    const inimigo =
        b.bossId
            ? BOSSES[b.bossId]
            : PETS[b.inimigoId];

    let texto = "";

    let mult = 1;

    // --------------------------------------------------------
    // 🏃 FUGIR
    // --------------------------------------------------------

    if (acao === "fugir") {

        const chance =
            b.bossId
                ? 0.10
                : 0.45;

        if (
            Math.random() <
            chance
        ) {

            batalhas.delete(
                b.id
            );

            return interaction.update({

                content:
                    "🏃 **Você conseguiu fugir da batalha.**",

                embeds: [],

                components: []
            });
        }

        texto =
            "🏃 **Tentativa de fuga!**\n\n" +
            "A criatura bloqueia o caminho. **Você não conseguiu escapar.**";
    }

    // --------------------------------------------------------
    // 🛡️ DEFENDER
    // --------------------------------------------------------

    else if (
        acao === "defender"
    ) {

        b.defensor = true;

        texto =
            `🛡️ **${pet.nome} entra em posição defensiva.**\n\n` +
            `O próximo ataque recebido terá seu dano reduzido.`;
    }

    // --------------------------------------------------------
    // ⚔️ ATAQUE
    // --------------------------------------------------------

    else {

        if (
            acao === "habilidade"
        ) {

            mult = 1.45;

            texto =
                `✨ **${pet.nome} usa ${pet.habilidade}!**\n\n` +
                `${pet.habilidadeDescricao}`;

        } else {

            texto =
                `⚔️ **${pet.nome} ataca!**\n\n` +
                `${pet.nome} avança e desfere um golpe preciso.`;
        }

        let critico =
            Math.random() <
            (
                acao === "habilidade"
                    ? 0.12
                    : 0.08
            );

        if (critico) {

            mult *= 1.45;
        }

        const danoCausado =
            dano(
                b.meuStats.ataque,
                b.inimigoStats.defesa,
                mult
            );

        b.inimigoHp =
            Math.max(
                0,
                b.inimigoHp -
                danoCausado
            );

        texto +=
            `\n\n💥 **${critico ? "ACERTO CRÍTICO! " : ""}${danoCausado} de dano!**\n` +
            `❤️ Inimigo: **${b.inimigoHp}/${b.inimigoHpMax} HP**`;
    }

    b.log.push(texto);

    // --------------------------------------------------------
    // 🏆 INIMIGO DERROTADO
    // --------------------------------------------------------

    if (
        b.inimigoHp <= 0
    ) {

        const fim =
            mensagemVitoria(b);

        batalhas.delete(
            b.id
        );

        return interaction.update({

            embeds: [

                new EmbedBuilder()
                    .setColor(
                        0x2ecc71
                    )
                    .setTitle(
                        "🏆 Vitória"
                    )
                    .setDescription(
                        `${texto}\n\n${fim}`
                    )
            ],

            components: []
        });
    }

    // --------------------------------------------------------
    // 👹 TURNO DO INIMIGO
    // --------------------------------------------------------

    const defesaMult =
        b.defensor
            ? 0.45
            : 1;

    const danoInimigo =
        dano(
            b.inimigoStats.ataque,
            b.meuStats.defesa,
            defesaMult
        );

    b.meuHp =
        Math.max(
            0,
            b.meuHp -
            danoInimigo
        );

    b.log.push(
        `🐾 **TURNO DO INIMIGO**\n\n` +
        `${inimigo.emoji || "👹"} **${inimigo.nome} ataca!**\n\n` +
        `💥 **${danoInimigo} de dano!**` +
        (
            b.defensor
                ? "\n🛡️ A defesa reduziu o impacto do golpe."
                : ""
        )
    );

    b.defensor = false;

    // --------------------------------------------------------
    // 💀 JOGADOR DERROTADO
    // --------------------------------------------------------

    if (
        b.meuHp <= 0
    ) {

        jogador(
            b.userId
        ).derrotas++;

        salvarBanco();

        const fim =
            mensagemDerrota(b);

        batalhas.delete(
            b.id
        );

        return interaction.update({

            embeds: [

                new EmbedBuilder()
                    .setColor(
                        0xe74c3c
                    )
                    .setTitle(
                        "💀 Derrota"
                    )
                    .setDescription(
                        `${texto}\n\n${fim}`
                    )
            ],

            components: []
        });
    }

    b.turno++;

    salvarBanco();

    return interaction.update({

        embeds: [
            batalhaEmbed(b)
        ],

        components:
            botoesBatalha(b)
    });
}

// ============================================================
// 🗺️ EMBED MAPAS
// ============================================================

function mapaEmbed(p) {

    const linhas =
        ORDEM_MAPAS.map(
            id => {

                const m =
                    MAPAS[id];

                const aberto =
                    nivelMapaLiberado(
                        p,
                        id
                    );

                return (
                    `${aberto ? "🔓" : "🔒"} **${m.nome}** — Nv. ${m.nivel}\n` +
                    (
                        aberto
                            ? `　${m.emoji} ${m.descricao}`
                            : "　*Desbloqueie aumentando seu nível.*"
                    )
                );
            }
        );

    return new EmbedBuilder()
        .setColor(
            0x8e44ad
        )
        .setTitle(
            "🗺️ Mapas de ZUNO RPG"
        )
        .setDescription(
            `Seu nível: **${p.nivel}/${MAX_LEVEL}**\n\n` +
            linhas.join("\n\n")
        )
        .setFooter({
            text:
                "Explore mapas desbloqueados para encontrar criaturas."
        });
}

// ============================================================
// 📜 PERFIL
// ============================================================

function perfilEmbed(
    id,
    user
) {

    const p =
        jogador(id);

    const petId =
        petEquipado(id);

    const pet =
        petId
            ? PETS[petId]
            : null;

    const d =
        petId
            ? dadosPet(
                id,
                petId
            )
            : null;

    const s =
        petId
            ? statsPet(
                id,
                petId
            )
            : null;

    return new EmbedBuilder()
        .setColor(
            0x8e44ad
        )
        .setTitle(
            `📜 Perfil de ${user.username}`
        )
        .setDescription(

            `🌟 **Treinador Nv. ${p.nivel}/${MAX_LEVEL}**\n` +
            `✨ XP: ${p.xp}/${xpTreinador(p.nivel)}\n` +
            `💰 Moedas: **${p.moedas}**\n` +
            `🏆 Vitórias: **${p.vitorias}**\n` +
            `💀 Derrotas: **${p.derrotas}**\n` +
            `👑 Bosses derrotados: **${p.bossesDerrotados}**\n\n` +

            (
                pet

                    ? (
                        `${pet.emoji} **${pet.nome} — Nv. ${d.nivel}/${MAX_LEVEL}**\n` +
                        `❤️ ${s.hp} HP  •  ⚔️ ${s.ataque} ATK  •  🛡️ ${s.defesa} DEF  •  💨 ${s.velocidade} SPD`
                    )

                    : "🐾 Nenhum pet equipado."
            )
        )

        .setThumbnail(
            pet?.imagem || null
        );
}

// ============================================================
// ❓ AJUDA
// ============================================================

function ajudaEmbed() {

    return new EmbedBuilder()

        .setColor(
            0x8e44ad
        )

        .setTitle(
            "🐉 ZUNO RPG — Arena das Criaturas"
        )

        .setDescription(

            [

                "**🌟 COMEÇO**",

                "`,invocar` — recebe sua primeira criatura",

                "`,pets` — mostra suas criaturas",

                "`,pet nome` — detalhes de um pet",

                "`,equipar nome` — escolhe seu único pet ativo",

                "",

                "**🗺️ EXPLORAÇÃO**",

                "`,mapas` — mostra os mapas e níveis",

                "`,explorar` — procura uma batalha no mapa adequado",

                "`,meumapa` — mostra o mapa atual",

                "",

                "**⚔️ PROGRESSÃO**",

                "`,treinar 10` ou `,treinar 20` — treina o pet equipado",

                "`,perfilrpg` — seu perfil",

                "`,ranking` — ranking de treinadores",

                "`,daily` — recompensa diária",

                "`,moedas` — suas moedas",

                "",

                "**⚔️ SOCIAL**",

                "`,duelo @membro` — duelo entre treinadores",

                "",

                "Cada batalha usa **1 único pet por jogador**."

            ].join("\n")
        );
}

// ============================================================
// 🔎 ENCONTRAR PET PELO NOME
// ============================================================

function nomePorTexto(texto) {

    const limpo =
        texto
            .toLowerCase()
            .trim();

    const alvo =
        limpo.replace(
            /\s+/g,
            "_"
        );

    if (
        PETS[alvo]
    )
        return alvo;

    return Object.keys(
        PETS
    ).find(
        id =>
            PETS[id]
                .nome
                .toLowerCase() ===
            limpo
    ) || null;
}

// ============================================================
// 🏋️ TREINAMENTO
// ============================================================

function treinamento(
    id,
    quantidade
) {

    const p =
        jogador(id);

    const petId =
        petEquipado(id);

    if (!petId) {

        return {
            erro:
                "Você não possui um pet equipado."
        };
    }

    if (
        ![10, 20]
            .includes(
                quantidade
            )
    ) {

        return {
            erro:
                "Use `,treinar 10` ou `,treinar 20`."
        };
    }

    const d =
        dadosPet(
            id,
            petId
        );

    const custoCada =
        6 +
        (d.nivel * 2);

    const custo =
        custoCada *
        quantidade;

    if (
        p.moedas <
        custo
    ) {

        return {

            erro:
                `Você precisa de **${custo} moedas** para esse treino. Você possui **${p.moedas}**.`
        };
    }

    p.moedas -=
        custo;

    d.treino +=
        quantidade;

    d.bonusHp +=
        8 *
        quantidade;

    d.bonusAtaque +=
        3 *
        quantidade;

    d.bonusDefesa +=
        2 *
        quantidade;

    d.bonusVelocidade +=
        2 *
        quantidade;

    const subiu =
        ganharXpPet(
            id,
            petId,
            10 *
            quantidade
        );

    ganharXpTreinador(
        id,
        2 *
        quantidade
    );

    salvarBanco();

    return {

        petId,

        custo,

        subiu,

        treino:
            d.treino
    };
}

// ============================================================
// ⚔️ VERIFICAR BATALHA DO USUÁRIO
// ============================================================

function batalhasHasUser(id) {

    for (
        const b of batalhas.values()
    ) {

        if (
            b.userId === id
        )
            return true;
    }

    return false;
}

// ============================================================
// 🌲 EXPLORAR
// ============================================================

async function iniciarExploracao(
    message
) {

    const p =
        jogador(
            message.author.id
        );

    const petId =
        petEquipado(
            message.author.id
        );

    if (!petId) {

        return message.reply(
            "🐾 Primeiro use `,invocar` para receber seu pet inicial."
        );
    }

    if (
        batalhasHasUser(
            message.author.id
        )
    ) {

        return message.reply(
            "⚔️ Você já está em uma batalha. Termine-a antes de explorar novamente."
        );
    }

    const mapaId =
        mapaAtualSugerido(p);

    const mapa =
        MAPAS[mapaId];

    p.mapasDescobertos[
        mapaId
    ] = true;

    // ========================================================
    // 👑 BOSS EXTREMAMENTE RARO
    // ========================================================

    const bossRoll =
        Math.random();

    if (
        bossRoll <
        mapa.bossChance
    ) {

        const bossIds =
            Object.keys(
                BOSSES
            );

        const bossId =
            bossIds[
                Math.floor(
                    Math.random() *
                    bossIds.length
                )
            ];

        const boss =
            BOSSES[bossId];

        const b =
            criarBatalha(
                message.author.id,
                mapaId,
                null,
                100,
                false,
                bossId
            );

        if (!b) {

            return message.reply(
                "❌ Não foi possível iniciar a batalha."
            );
        }

        b.inimigoNivel =
            Math.min(
                MAX_LEVEL,
                Math.max(
                    p.nivel,
                    mapa.nivel
                )
            );

        narrativaInicio(b);

        salvarBanco();

        return message.reply({

            embeds: [
                batalhaEmbed(b)
            ],

            components:
                botoesBatalha(b)
        });
    }

    // ========================================================
    // 👑 ELITE
    // ========================================================

    const elite =
        Math.random() <
        0.035;

    const inimigoId =
        elite
            ? mapa.elite
            : monstroDoMapa(
                mapa
            );

    const nivel =
        nivelInimigo(
            mapa,
            p.nivel,
            elite
        );

    const b =
        criarBatalha(
            message.author.id,
            mapaId,
            inimigoId,
            nivel,
            elite,
            null
        );

    if (!b) {

        return message.reply(
            "❌ Não foi possível iniciar a batalha."
        );
    }

    narrativaInicio(b);

    salvarBanco();

    return message.reply({

        embeds: [
            batalhaEmbed(b)
        ],

        components:
            botoesBatalha(b)
    });
}

// ============================================================
// ⚔️ DUELO
// ============================================================

async function iniciarDuelo(
    message,
    alvo
) {

    if (
        !alvo ||
        alvo.bot ||
        alvo.id ===
        message.author.id
    ) {

        return message.reply(
            "⚔️ Escolha um treinador válido para duelar."
        );
    }

    if (
        batalhasHasUser(
            message.author.id
        )
    ) {

        return message.reply(
            "⚔️ Termine sua batalha de exploração primeiro."
        );
    }

    const p1 =
        jogador(
            message.author.id
        );

    const p2 =
        jogador(
            alvo.id
        );

    const pet1 =
        petEquipado(
            message.author.id
        );

    const pet2 =
        petEquipado(
            alvo.id
        );

    if (
        !pet1 ||
        !pet2
    ) {

        return message.reply(
            "🐾 Os dois treinadores precisam ter um pet equipado."
        );
    }

    const s1 =
        statsPet(
            message.author.id,
            pet1
        );

    const s2 =
        statsPet(
            alvo.id,
            pet2
        );

    const primeiro =
        s1.velocidade >=
        s2.velocidade
            ? message.author.id
            : alvo.id;

    const id =
        `duelo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const desafio = {

        id,

        p1:
            message.author.id,

        p2:
            alvo.id,

        pet1,

        pet2,

        hp1:
            s1.hp,

        hp2:
            s2.hp,

        max1:
            s1.hp,

        max2:
            s2.hp,

        s1,

        s2,

        turno:
            primeiro,

        log: [

            `⚔️ **${message.author.username}** desafiou **${alvo.username}**!\n\n` +

            `🐾 Cada treinador entrou com **1 único pet**.\n\n` +

            `🏁 **${
                primeiro ===
                message.author.id
                    ? message.author.username
                    : alvo.username
            } começa por possuir maior velocidade.`
        ]
    };

    batalhas.set(
        id,
        {
            ...desafio,
            tipo: "duelo",
            userId:
                message.author.id
        }
    );

    return message.reply({

        content:
            `⚔️ **DUELO INICIADO**\n${message.author} vs ${alvo}`,

        embeds: [
            dueloEmbed(
                desafio,
                message.client
            )
        ],

        components:
            dueloBotoes(
                desafio,
                message.author.id
            )
    });
}

// ============================================================
// ⚔️ EMBED DUELO
// ============================================================

function dueloEmbed(
    d,
    client
) {

    const u1 =
        client.users.cache.get(
            d.p1
        );

    const u2 =
        client.users.cache.get(
            d.p2
        );

    const pet1 =
        PETS[d.pet1];

    const pet2 =
        PETS[d.pet2];

    return new EmbedBuilder()

        .setColor(
            0xe67e22
        )

        .setTitle(
            `⚔️ Duelo • Turno ${
                d.turno === d.p1
                    ? u1?.username
                    : u2?.username
            }`
        )

        .setDescription(

            `**${u1?.username || "Treinador 1"}**\n` +

            `${pet1.emoji} ${pet1.nome}\n` +

            `❤️ ${barraVida(
                d.hp1,
                d.max1
            )} ${d.hp1}/${d.max1}\n\n` +

            `**${u2?.username || "Treinador 2"}**\n` +

            `${pet2.emoji} ${pet2.nome}\n` +

            `❤️ ${barraVida(
                d.hp2,
                d.max2
            )} ${d.hp2}/${d.max2}\n\n` +

            d.log
                .slice(-4)
                .join("\n\n")
        );
}

// ============================================================
// 🔘 BOTÕES DO DUELO
// ============================================================

function dueloBotoes(
    d,
    userId
) {

    return [

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        `rpg_duelo_atacar_${d.id}`
                    )
                    .setLabel(
                        "Atacar"
                    )
                    .setEmoji(
                        "⚔️"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    )
                    .setDisabled(
                        d.turno !==
                        userId
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `rpg_duelo_habilidade_${d.id}`
                    )
                    .setLabel(
                        "Habilidade"
                    )
                    .setEmoji(
                        "✨"
                    )
                    .setStyle(
                        ButtonStyle.Success
                    )
                    .setDisabled(
                        d.turno !==
                        userId
                    )
            )
    ];
}

// ============================================================
// ⚔️ TURNO DO DUELO
// ============================================================

async function turnoDuelo(
    interaction,
    d,
    acao
) {

    const atacante =
        d.turno;

    const defensor =
        atacante === d.p1
            ? d.p2
            : d.p1;

    const petAtk =
        atacante === d.p1
            ? d.pet1
            : d.pet2;

    const petDef =
        defensor === d.p1
            ? d.pet1
            : d.pet2;

    const sAtk =
        atacante === d.p1
            ? d.s1
            : d.s2;

    const sDef =
        defensor === d.p1
            ? d.s1
            : d.s2;

    let mult =
        acao === "habilidade"
            ? 1.4
            : 1;

    const danoCausado =
        dano(
            sAtk.ataque,
            sDef.defesa,
            mult
        );

    if (
        defensor === d.p1
    ) {

        d.hp1 =
            Math.max(
                0,
                d.hp1 -
                danoCausado
            );

    } else {

        d.hp2 =
            Math.max(
                0,
                d.hp2 -
                danoCausado
            );
    }

    d.log.push(

        `⚔️ **${PETS[petAtk].nome}** ` +

        (
            acao === "habilidade"
                ? `usa **${PETS[petAtk].habilidade}**`
                : "ataca"
        ) +

        `.\n\n💥 **${danoCausado} de dano!**`
    );

    // ========================================================
    // 🏆 FIM DO DUELO
    // ========================================================

    if (
        (
            defensor === d.p1
                ? d.hp1
                : d.hp2
        ) <= 0
    ) {

        const vencedor =
            atacante;

        const perdedor =
            defensor;

        jogador(
            vencedor
        ).vitorias++;

        jogador(
            vencedor
        ).moedas += 12;

        ganharXpTreinador(
            vencedor,
            80
        );

        ganharXpPet(
            vencedor,
            petAtk,
            100
        );

        jogador(
            perdedor
        ).derrotas++;

        jogador(
            perdedor
        ).moedas += 3;

        salvarBanco();

        batalhas.delete(
            d.id
        );

        return interaction.update({

            embeds: [

                new EmbedBuilder()

                    .setColor(
                        0x2ecc71
                    )

                    .setTitle(
                        "🏆 Fim do duelo"
                    )

                    .setDescription(

                        `${d.log.slice(-1)[0]}\n\n` +

                        `🏆 <@${vencedor}> venceu o duelo!\n` +

                        `💰 +12 moedas\n` +

                        `✨ +80 XP treinador\n` +

                        `🐾 +100 XP pet`
                    )
            ],

            components: []
        });
    }

    d.turno =
        defensor;

    salvarBanco();

    return interaction.update({

        embeds: [
            dueloEmbed(
                d,
                interaction.client
            )
        ],

        components:
            dueloBotoes(
                d,
                d.turno
            )
    });
}

// ============================================================
// 🎮 SISTEMA PRINCIPAL
// ============================================================

module.exports = (client) => {

    // ========================================================
    // 💬 COMANDOS COM VÍRGULA
    // ========================================================

    client.on(
        "messageCreate",
        async message => {

            try {

                if (
                    message.author.bot
                )
                    return;

                if (
                    !message.content.startsWith(
                        PREFIX_RPG
                    )
                )
                    return;

                const partes =
                    message.content
                        .slice(
                            PREFIX_RPG.length
                        )
                        .trim()
                        .split(/\s+/);

                const comando =
                    (
                        partes.shift() ||
                        ""
                    ).toLowerCase();

                const args =
                    partes;

                if (!comando)
                    return;

                const p =
                    jogador(
                        message.author.id
                    );

                // ====================================================
                // ❓ RPG / AJUDA
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
                // 🌙 INVOCAR
                // ====================================================

                if (
                    comando === "invocar"
                ) {

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

                            embeds: [

                                new EmbedBuilder()

                                    .setColor(
                                        0x8e44ad
                                    )

                                    .setTitle(
                                        "🌙 Sua primeira invocação"
                                    )

                                    .setDescription(
                                        "A lua ilumina o caminho...\n\n" +
                                        "🐺 **Lobo Lunar** apareceu para acompanhar sua jornada!\n\n" +
                                        "Use `,explorar` para começar sua aventura."
                                    )

                                    .setImage(
                                        PETS
                                            .lobo_lunar
                                            .imagem
                                    )
                            ]
                        });
                    }

                    const id =
                        petEquipado(
                            message.author.id
                        );

                    return message.reply(
                        `🐾 Seu pet ativo é **${PETS[id].nome}**.\n` +
                        `Use \`,pets\` para ver suas criaturas.`
                    );
                }

                // ====================================================
                // 🐾 PETS
                // ====================================================

                if (
                    comando === "pets"
                ) {

                    const ids =
                        Object.keys(
                            p.criaturas
                        )
                        .filter(
                            id =>
                                PETS[id]
                        );

                    if (
                        !ids.length
                    ) {

                        return message.reply(
                            "🐾 Você ainda não possui criaturas. Use `,invocar`."
                        );
                    }

                    const texto =
                        ids
                            .map(
                                id => {

                                    const d =
                                        dadosPet(
                                            message.author.id,
                                            id
                                        );

                                    return (
                                        `${p.equipe.includes(id) ? "🔓" : "🔒"} ` +
                                        `${raridadeEmoji(PETS[id].raridade)} ` +
                                        `**${PETS[id].nome}** — ` +
                                        `Nv. ${d.nivel}/${MAX_LEVEL}`
                                    );
                                }
                            )
                            .join("\n");

                    return message.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0x8e44ad
                                )

                                .setTitle(
                                    "🐾 Suas criaturas"
                                )

                                .setDescription(
                                    texto
                                )
                        ]
                    });
                }

                // ====================================================
                // 🐾 PET
                // ====================================================

                if (
                    comando === "pet" ||
                    comando === "meupet"
                ) {

                    const id =
                        comando === "meupet"

                            ? petEquipado(
                                message.author.id
                            )

                            : (
                                nomePorTexto(
                                    args.join(" ")
                                ) ||
                                petEquipado(
                                    message.author.id
                                )
                            );

                    if (
                        !id ||
                        !PETS[id]
                    ) {

                        return message.reply(
                            "🐾 Pet não encontrado."
                        );
                    }

                    const d =
                        dadosPet(
                            message.author.id,
                            id
                        );

                    const s =
                        statsPet(
                            message.author.id,
                            id
                        );

                    const pet =
                        PETS[id];

                    return message.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    pet.cor ||
                                    0x8e44ad
                                )

                                .setTitle(
                                    `${pet.emoji} ${pet.nome}`
                                )

                                .setDescription(

                                    `${raridadeEmoji(
                                        pet.raridade
                                    )} **${pet.raridade}**\n\n` +

                                    `📈 Nível: **${d.nivel}/${MAX_LEVEL}**\n` +

                                    `✨ XP: ${d.xp}/${xpPet(d.nivel)}\n` +

                                    `🏋️ Treino: ${d.treino}\n\n` +

                                    `❤️ HP: **${s.hp}**\n` +

                                    `⚔️ Ataque: **${s.ataque}**\n` +

                                    `🛡️ Defesa: **${s.defesa}**\n` +

                                    `💨 Velocidade: **${s.velocidade}**\n\n` +

                                    `✨ **${pet.habilidade}**\n` +

                                    `${pet.habilidadeDescricao}`
                                )

                                .setImage(
                                    pet.imagem
                                )
                        ]
                    });
                }

                // ====================================================
                // 🐾 EQUIPAR
                // ====================================================

                if (
                    comando === "equipar" ||
                    comando === "equip" ||
                    comando === "equipapet"
                ) {

                    const id =
                        nomePorTexto(
                            args.join(" ")
                        );

                    if (
                        !id ||
                        !p.criaturas[id]
                    ) {

                        return message.reply(
                            "🔒 Você ainda não possui esse pet."
                        );
                    }

                    // SOMENTE UM PET ATIVO
                    p.equipe = [
                        id
                    ];

                    salvarBanco();

                    return message.reply(
                        `🐾 Seu pet ativo agora é **${PETS[id].nome}**.`
                    );
                }

                // ====================================================
                // 🗺️ MAPAS
                // ====================================================

                if (
                    comando === "mapas"
                ) {

                    return message.reply({

                        embeds: [
                            mapaEmbed(p)
                        ]
                    });
                }

                // ====================================================
                // 🗺️ MEU MAPA
                // ====================================================

                if (
                    comando === "meumapa"
                ) {

                    const id =
                        mapaAtualSugerido(p);

                    const m =
                        MAPAS[id];

                    return message.reply(

                        `🗺️ Seu mapa atual é **${m.emoji} ${m.nome}**.\n` +

                        `🔓 Desbloqueado no nível **${m.nivel}**.\n\n` +

                        `${m.descricao}\n\n` +

                        `Use **,explorar** para procurar uma criatura.`
                    );
                }

                // ====================================================
                // 🌲 EXPLORAR
                // ====================================================

                if (
                    comando === "explorar"
                ) {

                    return iniciarExploracao(
                        message
                    );
                }

                // ====================================================
                // 🏋️ TREINAR
                // ====================================================

                if (
                    comando === "treinar"
                ) {

                    const r =
                        treinamento(
                            message.author.id,
                            Number(
                                args[0]
                            )
                        );

                    if (
                        r.erro
                    ) {

                        return message.reply(
                            `❌ ${r.erro}`
                        );
                    }

                    return message.reply(

                        `🏋️ **Treinamento concluído!**\n\n` +

                        `🐾 ${PETS[r.petId].nome}\n` +

                        `📈 Treino total: **${r.treino}**\n` +

                        `💰 Custo: **${r.custo} moedas**` +

                        (
                            r.subiu
                                ? `\n🎉 Seu pet subiu **${r.subiu} nível(is)!**`
                                : ""
                        )
                    );
                }

                // ====================================================
                // 💰 MOEDAS
                // ====================================================

                if (
                    comando === "moedas"
                ) {

                    return message.reply(
                        `💰 Você possui **${p.moedas} moedas**.`
                    );
                }

                // ====================================================
                // 🎁 DAILY
                // ====================================================

                if (
                    comando === "daily"
                ) {

                    if (
                        Date.now() -
                        p.ultimaDaily <
                        86400000
                    ) {

                        return message.reply(
                            "⏳ Você já pegou sua recompensa diária. Volte depois de 24 horas."
                        );
                    }

                    p.ultimaDaily =
                        Date.now();

                    p.moedas +=
                        20;

                    salvarBanco();

                    return message.reply(
                        "🎁 **Recompensa diária!**\n\n" +
                        "💰 Você recebeu **20 moedas**."
                    );
                }

                // ====================================================
                // 📜 PERFIL
                // ====================================================

                if (
                    comando === "perfilrpg"
                ) {

                    return message.reply({

                        embeds: [
                            perfilEmbed(
                                message.author.id,
                                message.author
                            )
                        ]
                    });
                }

                // ====================================================
                // 🏆 RANKING
                // ====================================================

                if (
                    comando === "ranking"
                ) {

                    const ranking =
                        Object.entries(db)

                            .sort(
                                (a, b) =>

                                    (
                                        b[1].nivel ||
                                        1
                                    ) -
                                    (
                                        a[1].nivel ||
                                        1
                                    )

                                    ||

                                    (
                                        b[1].vitorias ||
                                        0
                                    ) -
                                    (
                                        a[1].vitorias ||
                                        0
                                    )
                            )

                            .slice(
                                0,
                                10
                            );

                    const linhas =
                        ranking

                            .map(
                                (
                                    [id, x],
                                    i
                                ) =>

                                    `${i + 1}. <@${id}> — ` +
                                    `Nv. **${x.nivel || 1}** • ` +
                                    `🏆 ${x.vitorias || 0}`
                            );

                    return message.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0xe67e22
                                )

                                .setTitle(
                                    "🏆 Ranking dos Treinadores"
                                )

                                .setDescription(
                                    linhas.join("\n") ||
                                    "Nenhum treinador ainda."
                                )
                        ]
                    });
                }

                // ====================================================
                // ⚔️ DUELO
                // ====================================================

                if (
                    comando === "duelo"
                ) {

                    const alvo =
                        message.mentions.users.first();

                    return iniciarDuelo(
                        message,
                        alvo
                    );
                }

                // ====================================================
                // 🛠️ COMANDOS ADMIN
                // ====================================================

                if (
                    [
                        "admpets",
                        "addmoedas",
                        "remmoedas",
                        "setmoedas",
                        "darpet",
                        "removerpet",
                        "setlevelpet",
                        "addxp",
                        "settreino"
                    ].includes(
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

                        return message.reply(

                            "🛠️ **Admin RPG**\n" +

                            "`,addmoedas @membro 100`\n" +

                            "`,remmoedas @membro 50`\n" +

                            "`,setmoedas @membro 500`\n" +

                            "`,darpet @membro Fenrir`\n" +

                            "`,removerpet @membro Fenrir`\n" +

                            "`,setlevelpet @membro Fenrir 20`\n" +

                            "`,addxp @membro Fenrir 500`\n" +

                            "`,settreino @membro Fenrir 100`"
                        );
                    }

                    const alvo =
                        message.mentions.users.first();

                    if (!alvo) {

                        return message.reply(
                            "❌ Mencione o membro."
                        );
                    }

                    const valor =
                        Number(
                            args[
                                args.length - 1
                            ]
                        );

                    // ------------------------------------------------
                    // 💰 ADMIN MOEDAS
                    // ------------------------------------------------

                    if (
                        [
                            "addmoedas",
                            "remmoedas",
                            "setmoedas"
                        ].includes(
                            comando
                        )
                    ) {

                        if (
                            !Number.isFinite(
                                valor
                            )
                        ) {

                            return message.reply(
                                "❌ Informe um valor válido."
                            );
                        }

                        const alvoP =
                            jogador(
                                alvo.id
                            );

                        if (
                            comando ===
                            "addmoedas"
                        ) {

                            alvoP.moedas +=
                                valor;
                        }

                        if (
                            comando ===
                            "remmoedas"
                        ) {

                            alvoP.moedas =
                                Math.max(
                                    0,
                                    alvoP.moedas -
                                    valor
                                );
                        }

                        if (
                            comando ===
                            "setmoedas"
                        ) {

                            alvoP.moedas =
                                Math.max(
                                    0,
                                    valor
                                );
                        }

                        salvarBanco();

                        return message.reply(
                            `💰 Saldo de <@${alvo.id}>: **${alvoP.moedas} moedas**.`
                        );
                    }

                    // ------------------------------------------------
                    // 🐾 ADMIN PET
                    // ------------------------------------------------

                    const petNome =
                        args
                            .slice(
                                1,
                                -1
                            )
                            .join(" ");

                    const petId =
                        nomePorTexto(
                            petNome
                        );

                    if (!petId) {

                        return message.reply(
                            "❌ Pet não encontrado."
                        );
                    }

                    if (
                        comando ===
                        "darpet"
                    ) {

                        adicionarPet(
                            alvo.id,
                            petId
                        );

                        return message.reply(
                            `🐾 **${PETS[petId].nome}** entregue a <@${alvo.id}>.`
                        );
                    }

                    if (
                        comando ===
                        "removerpet"
                    ) {

                        delete jogador(
                            alvo.id
                        ).criaturas[
                            petId
                        ];

                        jogador(
                            alvo.id
                        ).equipe =
                            jogador(
                                alvo.id
                            ).equipe.filter(
                                x =>
                                    x !==
                                    petId
                            );

                        salvarBanco();

                        return message.reply(
                            `🗑️ **${PETS[petId].nome}** removido de <@${alvo.id}>.`
                        );
                    }

                    const d =
                        dadosPet(
                            alvo.id,
                            petId
                        );

                    if (
                        comando ===
                        "setlevelpet"
                    ) {

                        d.nivel =
                            Math.max(
                                1,
                                Math.min(
                                    MAX_LEVEL,
                                    valor
                                )
                            );

                        d.xp = 0;
                    }

                    if (
                        comando ===
                        "addxp"
                    ) {

                        ganharXpPet(
                            alvo.id,
                            petId,
                            Math.max(
                                0,
                                valor
                            )
                        );
                    }

                    if (
                        comando ===
                        "settreino"
                    ) {

                        d.treino =
                            Math.max(
                                0,
                                valor
                            );
                    }

                    salvarBanco();

                    return message.reply(
                        `✅ Pet **${PETS[petId].nome}** atualizado para <@${alvo.id}>.`
                    );
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

                    message.reply(
                        "❌ Ocorreu um erro no sistema RPG."
                    )
                    .catch(
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
                )
                    return;

                const id =
                    interaction.customId;

                // ====================================================
                // ⚔️ BATALHA DE EXPLORAÇÃO
                // ====================================================

                if (
                    id.startsWith(
                        "rpg_batalha_"
                    )
                ) {

                    const partes =
                        id.split("_");

                    const acao =
                        partes[2];

                    const batalhaId =
                        partes
                            .slice(3)
                            .join("_");

                    const b =
                        batalhas.get(
                            batalhaId
                        );

                    if (
                        !b ||
                        b.tipo ===
                        "duelo"
                    ) {

                        return interaction.reply({

                            content:
                                "⚔️ Essa batalha já terminou.",

                            ephemeral:
                                true
                        });
                    }

                    if (
                        b.userId !==
                        interaction.user.id
                    ) {

                        return interaction.reply({

                            content:
                                "🔒 Essa batalha pertence a outro treinador.",

                            ephemeral:
                                true
                        });
                    }

                    await interaction.deferUpdate();

                    return executarTurno(

                        {
                            update:
                                async data =>
                                    interaction.editReply(
                                        data
                                    )
                        },

                        b,

                        acao
                    );
                }

                // ====================================================
                // ⚔️ DUELO
                // ====================================================

                if (
                    id.startsWith(
                        "rpg_duelo_"
                    )
                ) {

                    const partes =
                        id.split("_");

                    const acao =
                        partes[2];

                    const dueloId =
                        partes
                            .slice(3)
                            .join("_");

                    const d =
                        batalhas.get(
                            dueloId
                        );

                    if (
                        !d ||
                        d.tipo !==
                        "duelo"
                    ) {

                        return interaction.reply({

                            content:
                                "⚔️ Esse duelo já terminou.",

                            ephemeral:
                                true
                        });
                    }

                    if (
                        d.turno !==
                        interaction.user.id
                    ) {

                        return interaction.reply({

                            content:
                                "⏳ Ainda não é seu turno.",

                            ephemeral:
                                true
                        });
                    }

                    await interaction.deferUpdate();

                    return turnoDuelo(

                        {
                            update:
                                async data =>
                                    interaction.editReply(
                                        data
                                    ),

                            client:
                                interaction.client
                        },

                        d,

                        acao
                    );
                }

            } catch (erro) {

                console.error(
                    "❌ Erro no botão RPG:",
                    erro
                );

                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {

                    interaction.reply({

                        content:
                            "❌ Erro ao processar a batalha.",

                        ephemeral:
                            true
                    })
                    .catch(
                        () => {}
                    );
                }
            }
        }
    );

    console.log(
        "🐉 ZUNO RPG carregado: mapas, exploração e batalhas por turnos."
    );
};
