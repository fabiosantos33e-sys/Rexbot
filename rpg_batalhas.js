// ZUNO RPG — BATALHAS AUTOMÁTICAS
// Prefixo: ,
// No index.js:
// require("./rpg_batalhas")(client);

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
        tipo: "fogo",
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
        tipo: "buff",
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
        tipo: "critico",
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
        tipo: "sombra",
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
        tipo: "cura",
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
        tipo: "gelo",
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
        tipo: "renascimento",
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
        tipo: "dreno",
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
        tipo: "agua",
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
        tipo: "brutal",
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
        tipo: "evasao",
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
        tipo: "veneno",
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
        tipo: "multi",
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
        tipo: "velocidade",
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
        tipo: "triplo",
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
        tipo: "regen",
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
        tipo: "agua",
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
        tipo: "execucao",
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
        tipo: "buff",
        cor: 0x5dade2,
        imagem: IMAGENS.lobo_lunar
    },

    guardiao_astral: {
        id: "guardiao_astral",
        nome: "Guardião Astral",
        emoji: "🌌",
        raridade: "Mítico",
        hp: 1800,
        ataque: 340,
        defesa: 280,
        velocidade: 170,
        habilidade: "Explosão Astral",
        tipo: "astral",
        cor: 0x8e44ad,
        imagem: IMAGENS.guardiao_astral
    }
};


// ============================================================
// 🗺️ MAPAS
// ============================================================

const MAPAS = [

    {
        id: "floresta_lunar",
        nome: "🌙 Floresta Lunar",
        nivel: 1,

        monstros: [
            {
                nome: "Lobo Lunar Selvagem",
                emoji: "🐺",
                hp: 900,
                ataque: 115,
                defesa: 75,
                xp: 45
            },
            {
                nome: "Coruja da Névoa",
                emoji: "🦉",
                hp: 760,
                ataque: 130,
                defesa: 60,
                xp: 50
            },
            {
                nome: "Urso Prateado",
                emoji: "🐻",
                hp: 1250,
                ataque: 145,
                defesa: 100,
                xp: 65
            },
            {
                nome: "Pantera Lunar",
                emoji: "🐆",
                hp: 1050,
                ataque: 175,
                defesa: 80,
                xp: 70
            },
            {
                nome: "Serpente da Lua",
                emoji: "🐍",
                hp: 980,
                ataque: 165,
                defesa: 85,
                xp: 72
            },
            {
                nome: "Cervo Astral",
                emoji: "🦌",
                hp: 1350,
                ataque: 150,
                defesa: 120,
                xp: 80
            }
        ],

        boss: {
            nome: "Guardião da Lua",
            emoji: "🌑",
            hp: 9000,
            ataque: 390,
            defesa: 260,
            xp: 650,
            poderes: [
                "Eclipse Lunar",
                "Uivo da Noite"
            ]
        }
    },

    {
        id: "reino_glacial",
        nome: "❄️ Reino Glacial",
        nivel: 10,

        monstros: [
            {
                nome: "Lobo de Gelo",
                emoji: "🐺",
                hp: 1900,
                ataque: 250,
                defesa: 170,
                xp: 110
            },
            {
                nome: "Golem Congelado",
                emoji: "🗿",
                hp: 2700,
                ataque: 220,
                defesa: 260,
                xp: 135
            },
            {
                nome: "Serpente Glacial",
                emoji: "🐍",
                hp: 2300,
                ataque: 310,
                defesa: 180,
                xp: 145
            },
            {
                nome: "Yeti Ancestral",
                emoji: "👹",
                hp: 3300,
                ataque: 290,
                defesa: 250,
                xp: 165
            }
        ],

        boss: {
            nome: "Rei do Gelo",
            emoji: "👑",
            hp: 18000,
            ataque: 620,
            defesa: 430,
            xp: 1100,
            poderes: [
                "Prisão Congelante",
                "Tempestade Glacial"
            ]
        }
    },

    {
        id: "vulcao_caos",
        nome: "🌋 Vulcão do Caos",
        nivel: 20,

        monstros: [
            {
                nome: "Salamandra Infernal",
                emoji: "🦎",
                hp: 3800,
                ataque: 440,
                defesa: 260,
                xp: 210
            },
            {
                nome: "Golem de Magma",
                emoji: "🗿",
                hp: 5200,
                ataque: 390,
                defesa: 430,
                xp: 250
            },
            {
                nome: "Demônio de Cinzas",
                emoji: "👿",
                hp: 4500,
                ataque: 520,
                defesa: 300,
                xp: 270
            },
            {
                nome: "Serpente de Lava",
                emoji: "🐍",
                hp: 4900,
                ataque: 550,
                defesa: 320,
                xp: 290
            }
        ],

        boss: {
            nome: "Senhor da Lava",
            emoji: "🔥",
            hp: 32000,
            ataque: 920,
            defesa: 610,
            xp: 1900,
            poderes: [
                "Erupção Infernal",
                "Chão Incandescente"
            ]
        }
    },

    {
        id: "abismo_oceanico",
        nome: "🌊 Abismo Oceânico",
        nivel: 35,

        monstros: [
            {
                nome: "Tubarão Abissal",
                emoji: "🦈",
                hp: 7200,
                ataque: 680,
                defesa: 430,
                xp: 360
            },
            {
                nome: "Medusa Sombria",
                emoji: "🪼",
                hp: 6500,
                ataque: 740,
                defesa: 390,
                xp: 390
            },
            {
                nome: "Serpente Marinha",
                emoji: "🐍",
                hp: 8800,
                ataque: 710,
                defesa: 510,
                xp: 430
            },
            {
                nome: "Kraken Jovem",
                emoji: "🐙",
                hp: 10500,
                ataque: 780,
                defesa: 590,
                xp: 480
            }
        ],

        boss: {
            nome: "Abissal",
            emoji: "👹",
            hp: 52000,
            ataque: 1350,
            defesa: 850,
            xp: 3100,
            poderes: [
                "Tsunami",
                "Tentáculos do Abismo"
            ]
        }
    },

    {
        id: "ruinas_antigas",
        nome: "🏜️ Ruínas Antigas",
        nivel: 50,

        monstros: [
            {
                nome: "Guardião de Pedra",
                emoji: "🗿",
                hp: 12000,
                ataque: 850,
                defesa: 800,
                xp: 560
            },
            {
                nome: "Esfinge Perdida",
                emoji: "🦁",
                hp: 13500,
                ataque: 980,
                defesa: 700,
                xp: 620
            },
            {
                nome: "Múmia Real",
                emoji: "🧟",
                hp: 11000,
                ataque: 1050,
                defesa: 650,
                xp: 590
            },
            {
                nome: "Colosso de Areia",
                emoji: "🏜️",
                hp: 16000,
                ataque: 920,
                defesa: 920,
                xp: 700
            }
        ],

        boss: {
            nome: "Colosso Ancestral",
            emoji: "🗿",
            hp: 76000,
            ataque: 1800,
            defesa: 1200,
            xp: 4700,
            poderes: [
                "Terremoto",
                "Maldição das Ruínas"
            ]
        }
    },

    {
        id: "dimensao_astral",
        nome: "🌌 Dimensão Astral",
        nivel: 65,

        monstros: [
            {
                nome: "Espirito Estelar",
                emoji: "✨",
                hp: 19000,
                ataque: 1350,
                defesa: 900,
                xp: 800
            },
            {
                nome: "Serafim Caído",
                emoji: "😇",
                hp: 23000,
                ataque: 1550,
                defesa: 1100,
                xp: 950
            },
            {
                nome: "Devorador Cósmico",
                emoji: "👁️",
                hp: 27000,
                ataque: 1700,
                defesa: 1200,
                xp: 1100
            },
            {
                nome: "Espectro do Vazio",
                emoji: "👻",
                hp: 21000,
                ataque: 1800,
                defesa: 850,
                xp: 1050
            }
        ],

        boss: {
            nome: "Arauto Astral",
            emoji: "🌠",
            hp: 115000,
            ataque: 2500,
            defesa: 1650,
            xp: 7000,
            poderes: [
                "Chuva Estelar",
                "Distorção Temporal"
            ]
        }
    },

    {
        id: "reino_apocalipse",
        nome: "☠️ Reino do Apocalipse",
        nivel: 80,

        monstros: [
            {
                nome: "Cavaleiro do Fim",
                emoji: "💀",
                hp: 30000,
                ataque: 2200,
                defesa: 1500,
                xp: 1350
            },
            {
                nome: "Fera Apocalíptica",
                emoji: "👹",
                hp: 36000,
                ataque: 2400,
                defesa: 1650,
                xp: 1500
            },
            {
                nome: "Ceifador Sombrio",
                emoji: "☠️",
                hp: 33000,
                ataque: 2700,
                defesa: 1400,
                xp: 1650
            },
            {
                nome: "Dragão da Ruína",
                emoji: "🐲",
                hp: 45000,
                ataque: 2800,
                defesa: 1900,
                xp: 1900
            }
        ],

        boss: {
            nome: "Arauto do Fim",
            emoji: "☠️",
            hp: 180000,
            ataque: 3900,
            defesa: 2500,
            xp: 11000,
            poderes: [
                "Cataclismo",
                "Marca da Morte"
            ]
        }
    },

    {
        id: "dominio_divino",
        nome: "👑 Domínio Divino",
        nivel: 100,

        monstros: [
            {
                nome: "Anjo Guardião",
                emoji: "👼",
                hp: 52000,
                ataque: 3400,
                defesa: 2500,
                xp: 2200
            },
            {
                nome: "Titã Celestial",
                emoji: "⚡",
                hp: 68000,
                ataque: 3900,
                defesa: 3100,
                xp: 2600
            },
            {
                nome: "Serafim Supremo",
                emoji: "✨",
                hp: 75000,
                ataque: 4300,
                defesa: 3300,
                xp: 3000
            },
            {
                nome: "Avatar Divino",
                emoji: "🌟",
                hp: 90000,
                ataque: 4700,
                defesa: 3600,
                xp: 3500
            }
        ],

        boss: {
            nome: "Executor Divino",
            emoji: "👑",
            hp: 300000,
            ataque: 6200,
            defesa: 4700,
            xp: 18000,
            poderes: [
                "Julgamento Celestial",
                "Ira dos Deuses"
            ]
        }
    }
];


const MAPA_BATALHAS = new Map();
const CONVITES = new Map();
const DUELOS = new Map();
const cooldownExplorar = new Map();


// ============================================================
// 💾 BANCO
// ============================================================

function carregarBanco() {

    try {

        if (!fs.existsSync(DB_FILE)) {

            fs.writeFileSync(
                DB_FILE,
                JSON.stringify({}, null, 2)
            );

        }

        return JSON.parse(
            fs.readFileSync(
                DB_FILE,
                "utf8"
            )
        );

    } catch (e) {

        console.error(
            "Erro lendo banco RPG:",
            e
        );

        return {};
    }
}


let db = carregarBanco();


function salvarBanco() {

    try {

        fs.writeFileSync(
            DB_FILE,
            JSON.stringify(
                db,
                null,
                2
            )
        );

    } catch (e) {

        console.error(
            "Erro salvando banco RPG:",
            e
        );
    }
}


// ============================================================
// 👤 JOGADOR
// ============================================================

function jogador(id) {

    if (!db[id]) {

        db[id] = {

            nivel: 1,
            xp: 0,

            vitorias: 0,
            derrotas: 0,

            bossesDerrotados: 0,

            criaturas: {},

            equipe: [],

            ultimosPets: [],

            exploracoes: 0
        };
    }


    if (!db[id].criaturas)
        db[id].criaturas = {};

    if (!db[id].equipe)
        db[id].equipe = [];

    if (!db[id].ultimosPets)
        db[id].ultimosPets = [];

    if (!db[id].exploracoes)
        db[id].exploracoes = 0;

    if (!db[id].nivel)
        db[id].nivel = 1;

    if (!db[id].xp)
        db[id].xp = 0;


    if (!db[id].equipe.length) {

        db[id].criaturas.lobo_lunar =
            db[id].criaturas.lobo_lunar ||
            {
                nivel: 1,
                xp: 0
            };

        db[id].equipe.push(
            "lobo_lunar"
        );
    }


    return db[id];
}


// ============================================================
// 🐾 PET ATIVO
// ============================================================

function petDoJogador(id) {

    const u = jogador(id);

    const idPet =
        u.equipe[0];

    if (
        idPet &&
        PETS[idPet]
    ) {
        return idPet;
    }

    return (
        Object.keys(
            u.criaturas
        )[0] ||
        "lobo_lunar"
    );
}


// ============================================================
// 📊 STATUS DO PET
// ============================================================

function dadosPet(id, petId) {

    const u =
        jogador(id);

    const base =
        PETS[petId];

    if (
        !base ||
        !u.criaturas[petId]
    ) {
        return null;
    }


    const nivel =
        Math.max(
            1,
            Math.min(
                100,
                u.criaturas[petId].nivel || 1
            )
        );


    const mult =
        1 +
        ((nivel - 1) * 0.08);


    return {

        id: petId,

        nome: base.nome,

        emoji: base.emoji,

        raridade: base.raridade,

        nivel,

        xp:
            u.criaturas[petId].xp || 0,

        maxHp:
            Math.floor(
                base.hp * mult
            ),

        hp:
            Math.floor(
                base.hp * mult
            ),

        ataque:
            Math.floor(
                base.ataque * mult
            ),

        defesa:
            Math.floor(
                base.defesa * mult
            ),

        velocidade:
            Math.floor(
                base.velocidade * mult
            ),

        habilidade:
            base.habilidade,

        tipo:
            base.tipo,

        imagem:
            base.imagem
    };
}


// ============================================================
// ✨ XP DO PET
// ============================================================

function xpPetLimite(nivel) {

    return (
        100 +
        (nivel * 50)
    );
}


function darXPPet(
    id,
    quantidade
) {

    const petId =
        petDoJogador(id);

    const u =
        jogador(id);

    if (
        !u.criaturas[petId]
    ) {

        u.criaturas[petId] = {

            nivel: 1,

            xp: 0
        };
    }


    const p =
        u.criaturas[petId];


    let subiu = false;


    p.xp =
        (p.xp || 0) +
        quantidade;


    while (
        p.nivel < 100 &&
        p.xp >=
        xpPetLimite(p.nivel)
    ) {

        p.xp -=
            xpPetLimite(
                p.nivel
            );

        p.nivel++;

        subiu = true;
    }


    if (
        p.nivel >= 100
    ) {

        p.xp =
            Math.min(
                p.xp,
                xpPetLimite(100) - 1
            );
    }


    return {

        petId,

        nivel:
            p.nivel,

        subiu
    };
}


// ============================================================
// 🌟 XP DO TREINADOR
// ============================================================

function xpTreinadorLimite(
    nivel
) {

    return (
        250 +
        (nivel * 180)
    );
}


function darXPTreinador(
    id,
    quantidade
) {

    const u =
        jogador(id);

    let subiu =
        false;


    u.xp +=
        quantidade;


    while (
        u.nivel < 100 &&
        u.xp >=
        xpTreinadorLimite(
            u.nivel
        )
    ) {

        u.xp -=
            xpTreinadorLimite(
                u.nivel
            );

        u.nivel++;

        subiu = true;
    }


    if (
        u.nivel >= 100
    ) {

        u.xp =
            Math.min(
                u.xp,
                xpTreinadorLimite(100) - 1
            );
    }


    return subiu;
}


// ============================================================
// 🗺️ MAPA DO JOGADOR
// ============================================================

function mapaDoNivel(
    nivel
) {

    let escolhido =
        MAPAS[0];


    for (
        const mapa
        of MAPAS
    ) {

        if (
            nivel >=
            mapa.nivel
        ) {

            escolhido =
                mapa;
        }
    }


    return escolhido;
}


// ============================================================
// ❤️ BARRA
// ============================================================

function barra(
    valor,
    max,
    tamanho = 18
) {

    max =
        Math.max(
            1,
            max
        );


    valor =
        Math.max(
            0,
            Math.min(
                max,
                valor
            )
        );


    const cheios =
        Math.round(
            (valor / max) *
            tamanho
        );


    return (
        "█".repeat(
            cheios
        ) +
        "░".repeat(
            tamanho -
            cheios
        )
    );
}


// ============================================================
// 🖼️ IMAGEM
// ============================================================

function imagemValida(
    url
) {

    return (
        typeof url ===
        "string" &&
        url.startsWith(
            "http"
        )
    );
}


// ============================================================
// 👤 PERFIL
// ============================================================

function petPerfilEmbed(
    userId,
    alvoUser
) {

    const u =
        jogador(userId);

    const petId =
        petDoJogador(
            userId
        );

    const pet =
        PETS[petId];

    const dados =
        dadosPet(
            userId,
            petId
        );


    const embed =
        new EmbedBuilder()

            .setColor(
                pet.cor ||
                0x6c5ce7
            )

            .setTitle(
                `👤 PERFIL RPG — ${alvoUser.username}`
            )

            .setDescription(

                `🌟 **Treinador Nv. ${u.nivel}**\n` +

                `✨ XP: **${u.xp}/${xpTreinadorLimite(u.nivel)}**\n` +

                `⚔️ Vitórias: **${u.vitorias || 0}**\n` +

                `💀 Derrotas: **${u.derrotas || 0}**\n` +

                `🗺️ Explorações: **${u.exploracoes || 0}**\n\n` +

                `🐾 **Pet ativo**\n` +

                `${pet.emoji} **${pet.nome}** — Nv. **${dados.nivel}**\n` +

                `🌟 ${pet.raridade}\n` +

                `✨ XP: **${dados.xp}/${xpPetLimite(dados.nivel)}**\n` +

                `❤️ HP: **${dados.maxHp.toLocaleString()}**\n` +

                `⚔️ ATK: **${dados.ataque.toLocaleString()}**\n` +

                `🛡️ DEF: **${dados.defesa.toLocaleString()}**\n` +

                `💨 VEL: **${dados.velocidade.toLocaleString()}**`
            )

            .setFooter({
                text:
                    "A imagem do Pet aparece somente no perfil."
            });


    if (
        imagemValida(
            pet.imagem
        )
    ) {

        embed.setImage(
            pet.imagem
        );
    }


    return embed;
}


// ============================================================
// 🐾 COLEÇÃO
// ============================================================

function colecaoEmbed(
    userId
) {

    const u =
        jogador(userId);

    let texto = "";


    for (
        const [
            id,
            dados
        ]
        of Object.entries(
            u.criaturas
        )
    ) {

        const p =
            PETS[id];

        if (!p)
            continue;


        texto +=
            `${p.emoji} **${p.nome}** — Nv. ${dados.nivel || 1} — ${p.raridade}\n`;
    }


    if (!texto) {

        texto =
            "❌ Você ainda não possui criaturas.";
    }


    return new EmbedBuilder()

        .setColor(
            0x8e44ad
        )

        .setTitle(
            "🐾 SUA COLEÇÃO"
        )

        .setDescription(
            texto
        );
}


// ============================================================
// 🎲 MONSTRO
// ============================================================

function escolherMonstro(
    mapa
) {

    return mapa.monstros[
        Math.floor(
            Math.random() *
            mapa.monstros.length
        )
    ];
}


// ============================================================
// 👑 CHANCE DE BOSS
// ============================================================

function raro() {

    return (
        Math.random() <
        0.02
    );
}


// ============================================================
// ⚔️ CRIAR BATALHA
// ============================================================

function criarBatalhaMapa(
    criadorId,
    mapa,
    inimigo,
    ehBoss = false
) {

    const id =
        `map_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;


    MAPA_BATALHAS.set(
        id,
        {

            id,

            criadorId,

            mapaId:
                mapa.id,

            inimigo:
                {
                    ...inimigo
                },

            ehBoss,

            participantes:
                [
                    criadorId
                ],

            iniciado:
                false,

            turno:
                1,

            canalId:
                null,

            mensagemId:
                null
        }
    );


    return id;
}


// ============================================================
// 👥 CONVITE
// ============================================================

function conviteEmbed(
    batalha
) {

    const mapa =
        MAPAS.find(
            x =>
                x.id ===
                batalha.mapaId
        );

    const inimigo =
        batalha.inimigo;


    const nomes =
        batalha.participantes
            .map(
                id =>
                    `<@${id}>`
            )
            .join(", ");


    return new EmbedBuilder()

        .setColor(
            batalha.ehBoss
                ? 0x8e44ad
                : 0xe67e22
        )

        .setTitle(

            batalha.ehBoss

                ? `👑 ENCONTRO LENDÁRIO — ${inimigo.nome}`

                : `⚔️ ${inimigo.nome} APARECEU!`
        )

        .setDescription(

            `${mapa.nome}\n\n` +

            `${inimigo.emoji} **${inimigo.nome}**\n` +

            `❤️ ${inimigo.hp.toLocaleString()} HP\n` +

            `⚔️ ${inimigo.ataque.toLocaleString()} ATK\n` +

            `🛡️ ${inimigo.defesa.toLocaleString()} DEF\n\n` +

            `👥 **Treinadores:** ${nomes}\n\n` +

            (
                batalha.ehBoss

                    ? `🌑 Este é um Boss do mapa. Ele não é um Pet e possui poderes próprios.\n\n`

                    : `🐾 Seu Pet enfrentará esta criatura.\n\n`
            ) +

            `⚔️ **Iniciar Batalha** para começar automaticamente.\n` +

            `👥 **Chamar Aliados** para abrir a batalha para seus amigos.`
        );
}


// ============================================================
// 🔘 BOTÕES
// ============================================================

function botoesInicio(
    id
) {

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


// ============================================================
// ⚔️ EMBED DA BATALHA
// ============================================================

function batalhaEmbed(
    batalha,
    narrativa = ""
) {

    const inimigo =
        batalha.inimigo;

    const mapa =
        MAPAS.find(
            x =>
                x.id ===
                batalha.mapaId
        );


    const hp =
        Math.max(
            0,
            batalha.hpInimigo ||
            inimigo.hp
        );


    const participantes =
        batalha.participantes

            .map(
                id => {

                    const p =
                        dadosPet(
                            id,
                            petDoJogador(id)
                        );

                    const vida =
                        batalha.pets?.[id]?.hp ??
                        p.maxHp;


                    return (

                        `${p.emoji} **${p.nome}** — <@${id}>\n` +

                        `❤️ ${barra(
                            vida,
                            p.maxHp
                        )} ${vida.toLocaleString()}/${p.maxHp.toLocaleString()}`
                    );
                }
            )

            .join("\n");


    return new EmbedBuilder()

        .setColor(
            batalha.ehBoss
                ? 0x8e44ad
                : 0xe67e22
        )

        .setTitle(
            `${batalha.ehBoss ? "👑" : "⚔️"} ${mapa.nome}`
        )

        .setDescription(

            `╭─────────────── ✦ ───────────────╮\n` +

            `${inimigo.emoji} **${inimigo.nome}**\n` +

            `❤️ ${barra(
                hp,
                inimigo.hp
            )} ${hp.toLocaleString()}/${inimigo.hp.toLocaleString()}\n` +

            `╰─────────────────────────────────╯\n\n` +

            `👥 **Treinadores e Pets**\n` +

            `${participantes}\n\n` +

            `⚔️ **TURNO ${batalha.turno}**\n\n` +

            `${narrativa || "A batalha está prestes a começar..."}`
        )

        .setFooter({
            text:
                "A batalha acontece automaticamente. Nenhuma ação é necessária."
        });
}


// ============================================================
// 💥 DANO
// ============================================================

function dano(
    atacante,
    defensor
) {

    const variacao =
        0.85 +
        Math.random() *
        0.30;


    const crit =
        Math.random() <
        Math.min(
            0.25,
            0.05 +
            atacante.velocidade /
            3000
        );


    let valor =
        Math.floor(

            Math.max(

                20,

                (
                    atacante.ataque -
                    defensor.defesa *
                    0.42
                ) *
                variacao
            )
        );


    if (crit) {

        valor =
            Math.floor(
                valor * 1.5
            );
    }


    return {
        valor,
        crit
    };
}


// ============================================================
// 👑 PODER DO BOSS
// ============================================================

function escolherPoderBoss(
    boss,
    turno
) {

    if (
        !boss.poderes?.length
    ) {
        return null;
    }


    if (
        turno % 4 === 0
    ) {

        return (
            boss.poderes[1] ||
            boss.poderes[0]
        );
    }


    if (
        Math.random() <
        0.22
    ) {

        return boss.poderes[
            Math.floor(
                Math.random() *
                boss.poderes.length
            )
        ];
    }


    return null;
}


// ============================================================
// 🔄 ATUALIZAR
// ============================================================

async function atualizarBatalha(
    message,
    batalha,
    texto
) {

    try {

        await message.edit({

            embeds: [
                batalhaEmbed(
                    batalha,
                    texto
                )
            ],

            components: []
        });

    } catch (e) {

        console.error(
            "Erro atualizando batalha:",
            e
        );
    }
}


// ============================================================
// ⚔️ BATALHA AUTOMÁTICA
// ============================================================

async function executarBatalhaMapa(
    message,
    batalha
) {

    if (
        !batalha ||
        batalha.iniciado
    ) {
        return;
    }


    batalha.iniciado =
        true;

    batalha.hpInimigo =
        batalha.inimigo.hp;

    batalha.pets = {};


    for (
        const id
        of batalha.participantes
    ) {

        const p =
            dadosPet(
                id,
                petDoJogador(id)
            );


        batalha.pets[id] = {

            hp:
                p.maxHp,

            maxHp:
                p.maxHp,

            defesa:
                p.defesa,

            velocidade:
                p.velocidade
        };
    }


    await atualizarBatalha(
        message,
        batalha,
        "🌙 O silêncio desaparece... A batalha começou!"
    );


    await new Promise(
        r =>
            setTimeout(
                r,
                2200
            )
    );


    while (
        MAPA_BATALHAS.has(
            batalha.id
        )
    ) {

        const vivos =
            batalha.participantes.filter(
                id =>
                    batalha.pets[id].hp >
                    0
            );


        if (
            !vivos.length ||
            batalha.hpInimigo <= 0
        ) {
            break;
        }


        batalha.turno++;


        const ordem =
            [...vivos].sort(
                (a, b) => {

                    const pa =
                        dadosPet(
                            a,
                            petDoJogador(a)
                        );

                    const pb =
                        dadosPet(
                            b,
                            petDoJogador(b)
                        );


                    return (

                        (
                            pb.velocidade +
                            Math.random() *
                            50
                        ) -

                        (
                            pa.velocidade +
                            Math.random() *
                            50
                        )
                    );
                }
            );


        let narrativa =
            "";


        for (
            const id
            of ordem
        ) {

            if (
                batalha.hpInimigo <= 0
            ) {
                break;
            }


            if (
                batalha.pets[id].hp <= 0
            ) {
                continue;
            }


            const p =
                dadosPet(
                    id,
                    petDoJogador(id)
                );


            const d =
                dano(
                    p,
                    batalha.inimigo
                );


            batalha.hpInimigo =
                Math.max(
                    0,
                    batalha.hpInimigo -
                    d.valor
                );


            narrativa +=

                `${p.emoji} **${p.nome} ataca!**\n` +

                `💥 ${d.valor.toLocaleString()} de dano` +

                (
                    d.crit
                        ? " — 💢 CRÍTICO!"
                        : ""
                ) +

                `\n`;
        }


        if (
            batalha.hpInimigo <= 0
        ) {
            break;
        }


        const alvoId =
            vivos[
                Math.floor(
                    Math.random() *
                    vivos.length
                )
            ];


        const alvo =
            dadosPet(
                alvoId,
                petDoJogador(
                    alvoId
                )
            );


        const poder =
            batalha.ehBoss

                ? escolherPoderBoss(
                    batalha.inimigo,
                    batalha.turno
                )

                : null;


        let ataqueBoss = {

            valor:

                Math.max(

                    15,

                    Math.floor(

                        (
                            batalha.inimigo.ataque -

                            alvo.defesa *
                            0.35

                        ) *

                        (
                            0.88 +
                            Math.random() *
                            0.24
                        )
                    )
                ),

            crit:
                false
        };


        if (poder) {

            ataqueBoss.valor =
                Math.floor(
                    ataqueBoss.valor *
                    1.45
                );
        }


        batalha.pets[
            alvoId
        ].hp =

            Math.max(

                0,

                batalha.pets[
                    alvoId
                ].hp -
                ataqueBoss.valor
            );


        narrativa +=

            `\n${batalha.inimigo.emoji} **${batalha.inimigo.nome} contra-ataca!**\n`;


        if (poder) {

            narrativa +=
                `✨ **${poder}!**\n`;
        }


        narrativa +=

            `💥 ${ataqueBoss.valor.toLocaleString()} de dano em ${alvo.emoji} **${alvo.nome}**!`;


        await atualizarBatalha(
            message,
            batalha,
            narrativa
        );


        await new Promise(
            r =>
                setTimeout(
                    r,
                    2400
                )
        );
    }


    const venceu =
        batalha.hpInimigo <= 0;


    if (venceu) {

        const recompensa =
            batalha.inimigo.xp;


        let subidas = [];


        for (
            const id
            of batalha.participantes
        ) {

            const petXp =
                darXPPet(
                    id,
                    Math.floor(
                        recompensa *
                        (
                            batalha.ehBoss
                                ? 0.9
                                : 1
                        )
                    )
                );


            const trainerUp =
                darXPTreinador(
                    id,
                    Math.floor(
                        recompensa *
                        0.55
                    )
                );


            if (
                petXp.subiu
            ) {

                subidas.push(
                    `<@${id}> — 🐾 Pet chegou ao **Nv. ${petXp.nivel}**!`
                );
            }


            if (
                trainerUp
            ) {

                subidas.push(
                    `<@${id}> — 🌟 Treinador chegou ao **Nv. ${jogador(id).nivel}**!`
                );
            }


            if (
                batalha.ehBoss
            ) {

                jogador(id).bossesDerrotados =
                    (
                        jogador(id)
                            .bossesDerrotados ||
                        0
                    ) + 1;
            }
        }


        salvarBanco();


        await message.edit({

            embeds: [

                new EmbedBuilder()

                    .setColor(
                        0x2ecc71
                    )

                    .setTitle(
                        "🏆 VITÓRIA!"
                    )

                    .setDescription(

                        `${batalha.inimigo.emoji} **${batalha.inimigo.nome} foi derrotado!**\n\n` +

                        `✨ Recompensa de batalha: **+${recompensa} XP**\n` +

                        `🐾 O XP foi distribuído aos Pets participantes.\n\n` +

                        (
                            subidas.length

                                ? `🎉 **EVOLUÇÕES!**\n${subidas.join("\n")}`

                                : "🌟 Continue explorando para ficar mais forte!"
                        )
                    )
            ],

            components: []
        });

    } else {

        salvarBanco();


        await message.edit({

            embeds: [

                new EmbedBuilder()

                    .setColor(
                        0xe74c3c
                    )

                    .setTitle(
                        "💀 DERROTA"
                    )

                    .setDescription(

                        `O grupo não conseguiu derrotar **${batalha.inimigo.nome}**.\n\n` +

                        `🐾 Seus Pets sobreviveram ao treinamento, mas a batalha foi perdida.\n` +

                        `💡 Fortaleça seus Pets e tente novamente.`
                    )
            ],

            components: []
        });
    }


    MAPA_BATALHAS.delete(
        batalha.id
    );
}


// ============================================================
// ⚔️ DUELO AUTOMÁTICO
// ============================================================

function dueloEmbedAuto(
    duelo,
    texto = ""
) {

    const p1 =
        dadosPet(
            duelo.a,
            petDoJogador(
                duelo.a
            )
        );


    const p2 =
        dadosPet(
            duelo.b,
            petDoJogador(
                duelo.b
            )
        );


    return new EmbedBuilder()

        .setColor(
            0x9b59b6
        )

        .setTitle(
            "⚔️ DUELO DE CRIATURAS"
        )

        .setDescription(

            `${p1.emoji} **${p1.nome}** — <@${duelo.a}>\n` +

            `❤️ ${barra(
                duelo.hpA,
                p1.maxHp
            )} ${duelo.hpA.toLocaleString()}/${p1.maxHp.toLocaleString()}\n\n` +

            `━━━━━━━━━━━━━━━━━━━━\n\n` +

            `${p2.emoji} **${p2.nome}** — <@${duelo.b}>\n` +

            `❤️ ${barra(
                duelo.hpB,
                p2.maxHp
            )} ${duelo.hpB.toLocaleString()}/${p2.maxHp.toLocaleString()}\n\n` +

            `⚔️ **TURNO ${duelo.turno}**\n\n` +

            `${texto || "A batalha está começando..."}`
        )

        .setFooter({
            text:
                "Duelo Pet vs Pet — batalha automática."
        });
}


// ============================================================
// ⚔️ EXECUTAR DUELO
// ============================================================

async function executarDuelo(
    message,
    duelo
) {

    duelo.iniciado =
        true;


    const p1 =
        dadosPet(
            duelo.a,
            petDoJogador(
                duelo.a
            )
        );


    const p2 =
        dadosPet(
            duelo.b,
            petDoJogador(
                duelo.b
            )
        );


    duelo.hpA =
        p1.maxHp;

    duelo.hpB =
        p2.maxHp;


    await message.edit({

        embeds: [

            dueloEmbedAuto(
                duelo,
                "⚔️ Os dois Pets entram na arena!"
            )
        ],

        components: []
    });


    await new Promise(
        r =>
            setTimeout(
                r,
                2200
            )
    );


    while (
        duelo.hpA > 0 &&
        duelo.hpB > 0
    ) {

        duelo.turno++;


        const primeiro =

            (
                p1.velocidade +
                Math.random() *
                100
            ) >=

            (
                p2.velocidade +
                Math.random() *
                100
            )

                ? "a"
                : "b";


        const segundo =
            primeiro === "a"
                ? "b"
                : "a";


        let texto =
            "";


        for (
            const lado
            of [
                primeiro,
                segundo
            ]
        ) {

            if (
                duelo.hpA <= 0 ||
                duelo.hpB <= 0
            ) {
                break;
            }


            const atk =
                lado === "a"
                    ? p1
                    : p2;


            const def =
                lado === "a"
                    ? p2
                    : p1;


            const res =
                dano(
                    atk,
                    def
                );


            if (
                lado === "a"
            ) {

                duelo.hpB =
                    Math.max(
                        0,
                        duelo.hpB -
                        res.valor
                    );

            } else {

                duelo.hpA =
                    Math.max(
                        0,
                        duelo.hpA -
                        res.valor
                    );
            }


            texto +=

                `${atk.emoji} **${atk.nome} ataca!**\n` +

                `💥 ${res.valor.toLocaleString()} de dano` +

                (
                    res.crit
                        ? " — 💢 CRÍTICO!"
                        : ""
                ) +

                `\n\n`;
        }


        await message.edit({

            embeds: [

                dueloEmbedAuto(
                    duelo,
                    texto
                )
            ],

            components: []
        });


        await new Promise(
            r =>
                setTimeout(
                    r,
                    2300
                )
        );
    }


    const vencedor =
        duelo.hpA > 0
            ? duelo.a
            : duelo.b;


    const perdedor =
        vencedor === duelo.a
            ? duelo.b
            : duelo.a;


    jogador(
        vencedor
    ).vitorias =

        (
            jogador(
                vencedor
            ).vitorias ||
            0
        ) + 1;


    jogador(
        perdedor
    ).derrotas =

        (
            jogador(
                perdedor
            ).derrotas ||
            0
        ) + 1;


    darXPPet(
        vencedor,
        100
    );


    darXPTreinador(
        vencedor,
        80
    );


    salvarBanco();


    const pv =
        dadosPet(
            vencedor,
            petDoJogador(
                vencedor
            )
        );


    await message.edit({

        embeds: [

            new EmbedBuilder()

                .setColor(
                    0xf1c40f
                )

                .setTitle(
                    "🏆 FIM DO DUELO"
                )

                .setDescription(

                    `${pv.emoji} **${pv.nome}** venceu o duelo!\n\n` +

                    `🏆 Vencedor: <@${vencedor}>\n` +

                    `💀 Derrotado: <@${perdedor}>\n\n` +

                    `✨ Vencedor recebeu **+100 XP de Pet** e **+80 XP de Treinador**.`
                )
        ],

        components: []
    });


    DUELOS.delete(
        duelo.id
    );
}


// ============================================================
// 🚀 EXPORTAÇÃO
// ============================================================

module.exports = (
    client
) => {

    console.log(
        "🐉 ZUNO RPG — sistema de exploração e batalhas automáticas carregado."
    );


    // ========================================================
    // 💬 COMANDOS
    // ========================================================

    client.on(
        "messageCreate",
        async message => {

            try {

                if (
                    message.author.bot ||
                    !message.guild
                ) {
                    return;
                }


                if (
                    !message.content.startsWith(
                        PREFIX
                    )
                ) {
                    return;
                }


                const partes =
                    message.content
                        .slice(
                            PREFIX.length
                        )
                        .trim()
                        .split(
                            /\s+/
                        );


                const comando =
                    (
                        partes.shift() ||
                        ""
                    ).toLowerCase();


                const args =
                    partes;


                if (!comando)
                    return;


                // =================================================
                // ,RPG
                // =================================================

                if (
                    comando === "rpg" ||
                    comando === "ajudarpg"
                ) {

                    jogador(
                        message.author.id
                    );


                    return message.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0x6c5ce7
                                )

                                .setTitle(
                                    "🐉 ZUNO — ARENA DAS CRIATURAS"
                                )

                                .setDescription(

                                    `🗺️ **,explorar** — explorar seu mapa e encontrar criaturas.\n\n` +

                                    `👤 **,perfil** ou **,perfilrpg** — ver seu perfil e imagem do Pet ativo.\n\n` +

                                    `🐾 **,pets** — ver sua coleção.\n\n` +

                                    `🔎 **,pet nome** — ver informações de uma criatura.\n\n` +

                                    `⚔️ **,duelo @membro** — Pet contra Pet, automaticamente.\n\n` +

                                    `🤝 **,juntar** — entrar na batalha de um amigo.\n\n` +

                                    `🗺️ **,mapa** — ver mapas e requisitos.\n\n` +

                                    `🏆 **,ranking** — ver os maiores treinadores.\n\n` +

                                    `💡 **Nas batalhas de mapa você não escolhe ataques. Tudo acontece automaticamente por turnos.**`
                                )
                        ]
                    });
                }


                // =================================================
                // ,PERFIL
                // =================================================

                if (
                    comando === "perfil" ||
                    comando === "perfilrpg"
                ) {

                    const alvo =
                        message.mentions.users.first() ||
                        message.author;


                    jogador(
                        alvo.id
                    );


                    return message.reply({

                        embeds: [

                            petPerfilEmbed(
                                alvo.id,
                                alvo
                            )
                        ]
                    });
                }


                // =================================================
                // ,PETS
                // =================================================

                if (
                    comando === "pets"
                ) {

                    return message.reply({

                        embeds: [

                            colecaoEmbed(
                                message.author.id
                            )
                        ]
                    });
                }


                // =================================================
                // ,PET
                // =================================================

                if (
                    comando === "pet"
                ) {

                    if (
                        !args.length
                    ) {

                        return message.reply(
                            "🐾 Use: `,pet nome da criatura`"
                        );
                    }


                    const busca =
                        args
                            .join(" ")
                            .toLowerCase();


                    const id =
                        Object.keys(
                            PETS
                        ).find(

                            k =>

                                k ===
                                busca.replace(
                                    /\s+/g,
                                    "_"
                                ) ||

                                PETS[k]
                                    .nome
                                    .toLowerCase() ===
                                busca
                        );


                    if (!id) {

                        return message.reply(
                            "❌ Não encontrei essa criatura."
                        );
                    }


                    const p =
                        PETS[id];


                    const owned =
                        !!jogador(
                            message.author.id
                        ).criaturas[id];


                    const embed =
                        new EmbedBuilder()

                            .setColor(
                                p.cor ||
                                0x8e44ad
                            )

                            .setTitle(
                                `${p.emoji} ${p.nome}`
                            )

                            .setDescription(

                                `🌟 **${p.raridade}**\n` +

                                `❤️ HP base: **${p.hp.toLocaleString()}**\n` +

                                `⚔️ ATK base: **${p.ataque.toLocaleString()}**\n` +

                                `🛡️ DEF base: **${p.defesa.toLocaleString()}**\n` +

                                `💨 VEL base: **${p.velocidade.toLocaleString()}**\n\n` +

                                `✨ **${p.habilidade}**\n` +

                                `O efeito da habilidade é aplicado automaticamente durante a batalha.\n\n` +

                                (
                                    owned

                                        ? "🔓 Você possui esta criatura."

                                        : "🔒 Você ainda não possui esta criatura."
                                )
                            );


                    return message.reply({

                        embeds: [
                            embed
                        ]
                    });
                }


                // =================================================
                // ,MAPA
                // =================================================

                if (
                    comando === "mapa" ||
                    comando === "mapas"
                ) {

                    const nivel =
                        jogador(
                            message.author.id
                        ).nivel;


                    const atual =
                        mapaDoNivel(
                            nivel
                        );


                    const texto =
                        MAPAS

                            .map(

                                m =>

                                    `${
                                        nivel >=
                                        m.nivel
                                            ? "🔓"
                                            : "🔒"
                                    } ${m.nome} — Nv. ${m.nivel}` +

                                    (
                                        m.id ===
                                        atual.id
                                            ? "  ← **ATUAL**"
                                            : ""
                                    )
                            )

                            .join("\n");


                    return message.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0x3498db
                                )

                                .setTitle(
                                    "🗺️ MAPA DO MUNDO"
                                )

                                .setDescription(

                                    `🌟 Seu nível de treinador: **${nivel}**\n\n` +

                                    `${texto}\n\n` +

                                    `🎯 **Mapa atual:** ${atual.nome}\n` +

                                    `⚠️ Os Bosses aparecem raramente durante a exploração.`
                                )
                        ]
                    });
                }


                // =================================================
                // ,EXPLORAR
                // =================================================

                if (
                    comando === "explorar"
                ) {

                    const id =
                        message.author.id;


                    const agora =
                        Date.now();


                    const ultimo =
                        cooldownExplorar.get(
                            id
                        ) || 0;


                    if (
                        agora -
                        ultimo <
                        7000
                    ) {

                        return message.reply(

                            `⏳ Espere **${
                                Math.ceil(
                                    (
                                        7000 -
                                        (
                                            agora -
                                            ultimo
                                        )
                                    ) / 1000
                                )
                            }s** antes de explorar novamente.`
                        );
                    }


                    cooldownExplorar.set(
                        id,
                        agora
                    );


                    const u =
                        jogador(id);


                    const mapa =
                        mapaDoNivel(
                            u.nivel
                        );


                    u.exploracoes++;


                    salvarBanco();


                    const ehBoss =
                        raro();


                    const inimigo =
                        ehBoss

                            ? {
                                ...mapa.boss
                            }

                            : {
                                ...escolherMonstro(
                                    mapa
                                )
                            };


                    const batalhaId =
                        criarBatalhaMapa(
                            id,
                            mapa,
                            inimigo,
                            ehBoss
                        );


                    const batalha =
                        MAPA_BATALHAS.get(
                            batalhaId
                        );


                    batalha.canalId =
                        message.channel.id;


                    const embed =
                        new EmbedBuilder()

                            .setColor(
                                ehBoss
                                    ? 0x8e44ad
                                    : 0x2ecc71
                            )

                            .setTitle(
                                `🗺️ ${mapa.nome}`
                            )

                            .setDescription(

                                `╭─────────────── ✦ ───────────────╮\n` +

                                `A exploração continua...\n` +

                                `╰─────────────────────────────────╯\n\n` +

                                (

                                    ehBoss

                                        ? `🌑 **UM ENCONTRO LENDÁRIO!**\n\n${inimigo.emoji} **${inimigo.nome}** surgiu diante de você!\n\n`

                                        : `🌲 As sombras se movimentam...\n\n${inimigo.emoji} **${inimigo.nome} APARECEU!**\n\n`
                                ) +

                                `❤️ ${inimigo.hp.toLocaleString()} HP\n` +

                                `⚔️ ${inimigo.ataque.toLocaleString()} ATK\n` +

                                `🛡️ ${inimigo.defesa.toLocaleString()} DEF\n\n` +

                                `⚠️ **O que você encontrou não é um Pet.**\n` +

                                `🐾 Seu Pet será o único Pet usado por você nesta batalha.`
                            );


                    const sent =
                        await message.reply({

                            embeds: [

                                embed,

                                conviteEmbed(
                                    batalha
                                )
                            ],

                            components: [

                                botoesInicio(
                                    batalhaId
                                )
                            ]
                        });


                    batalha.mensagemId =
                        sent.id;


                    return;
                }


                // =================================================
                // ,JUNTAR
                // =================================================

                if (
                    comando === "juntar"
                ) {

                    const abertas =
                        [
                            ...MAPA_BATALHAS.values()
                        ]

                            .filter(

                                b =>

                                    !b.iniciado &&

                                    b.participantes
                                        .length < 5 &&

                                    b.criadorId !==
                                    message.author.id
                            );


                    const batalha =
                        abertas.sort(
                            (a, b) =>
                                b.id.localeCompare(
                                    a.id
                                )
                        )[0];


                    if (!batalha) {

                        return message.reply(
                            "🤝 Não encontrei nenhuma batalha aberta aceitando aliados."
                        );
                    }


                    if (
                        batalha.participantes
                            .includes(
                                message.author.id
                            )
                    ) {

                        return message.reply(
                            "✅ Você já está nessa batalha."
                        );
                    }


                    const nivel =
                        jogador(
                            message.author.id
                        ).nivel;


                    const mapa =
                        MAPAS.find(
                            m =>
                                m.id ===
                                batalha.mapaId
                        );


                    if (
                        nivel <
                        mapa.nivel
                    ) {

                        return message.reply(

                            `🔒 Seu treinador precisa estar no **Nv. ${mapa.nivel}** para ajudar nessa área.`
                        );
                    }


                    batalha.participantes.push(
                        message.author.id
                    );


                    return message.reply(

                        `🤝 Você entrou na batalha de <@${batalha.criadorId}> com **${PETS[petDoJogador(message.author.id)].nome}**!`
                    );
                }


                // =================================================
                // ,DUELO
                // =================================================

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
                            "⚔️ Use: `,duelo @membro`"
                        );
                    }


                    jogador(
                        message.author.id
                    );

                    jogador(
                        alvo.id
                    );


                    const pid =
                        petDoJogador(
                            message.author.id
                        );


                    const aid =
                        petDoJogador(
                            alvo.id
                        );


                    const id =
                        `duelo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;


                    DUELOS.set(
                        id,
                        {

                            id,

                            a:
                                message.author.id,

                            b:
                                alvo.id,

                            iniciado:
                                false,

                            turno:
                                0,

                            hpA:
                                0,

                            hpB:
                                0
                        }
                    );


                    const pa =
                        PETS[pid];

                    const pb =
                        PETS[aid];


                    const row =
                        new ActionRowBuilder()

                            .addComponents(

                                new ButtonBuilder()

                                    .setCustomId(
                                        `rpg_duelo_aceitar_${id}`
                                    )

                                    .setLabel(
                                        "⚔️ Aceitar duelo"
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

                        content:
                            `<@${alvo.id}>`,

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0xe74c3c
                                )

                                .setTitle(
                                    "⚔️ DESAFIO DE PETS"
                                )

                                .setDescription(

                                    `**${message.author.username}** desafiou **${alvo.username}**!\n\n` +

                                    `🐾 ${pa.emoji} **${pa.nome}** vs ${pb.emoji} **${pb.nome}**\n\n` +

                                    `👤 Os treinadores não lutam. Os Pets lutam automaticamente.`
                                )
                        ],

                        components: [
                            row
                        ]
                    });
                }


                // =================================================
                // ,RANKING
                // =================================================

                if (
                    comando === "ranking"
                ) {

                    const ranking =
                        Object.entries(
                            db
                        )

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


                    const texto =
                        ranking.length

                            ? ranking

                                .map(

                                    (x, i) =>

                                        `${i + 1}. <@${x[0]}> — 🌟 Nv. ${x[1].nivel || 1} — 🏆 ${x[1].vitorias || 0} vitórias`
                                )

                                .join(
                                    "\n"
                                )

                            : "Nenhum treinador registrado.";


                    return message.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0xf1c40f
                                )

                                .setTitle(
                                    "🏆 RANKING DOS TREINADORES"
                                )

                                .setDescription(
                                    texto
                                )
                        ]
                    });
                }

            } catch (e) {

                console.error(
                    "Erro no RPG messageCreate:",
                    e
                );


                if (
                    !message.replied
                ) {

                    message.reply(
                        "❌ Ocorreu um erro no sistema RPG."
                    ).catch(
                        () => {}
                    );
                }
            }
        }
    );


    // ============================================================
    // 🔘 INTERAÇÕES DOS BOTÕES
    // ============================================================

    client.on(
        "interactionCreate",
        async interaction => {

            try {

                if (
                    !interaction.isButton()
                ) {
                    return;
                }


                const id =
                    interaction.customId;


                // =================================================
                // ⚔️ INICIAR BATALHA
                // =================================================

                if (
                    id.startsWith(
                        "rpg_iniciar_"
                    )
                ) {

                    const batalhaId =
                        id.replace(
                            "rpg_iniciar_",
                            ""
                        );


                    const batalha =
                        MAPA_BATALHAS.get(
                            batalhaId
                        );


                    if (!batalha) {

                        return interaction.reply({

                            content:
                                "❌ Essa batalha não existe mais.",

                            ephemeral:
                                true
                        });
                    }


                    if (
                        batalha.iniciado
                    ) {

                        return interaction.reply({

                            content:
                                "⚔️ A batalha já começou.",

                            ephemeral:
                                true
                        });
                    }


                    if (
                        interaction.user.id !==
                        batalha.criadorId
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Somente quem encontrou o inimigo pode iniciar a batalha.",

                            ephemeral:
                                true
                        });
                    }


                    await interaction.deferUpdate();


                    return executarBatalhaMapa(
                        interaction.message,
                        batalha
                    );
                }


                // =================================================
                // 👥 CHAMAR ALIADOS
                // =================================================

                if (
                    id.startsWith(
                        "rpg_chamar_"
                    )
                ) {

                    const batalhaId =
                        id.replace(
                            "rpg_chamar_",
                            ""
                        );


                    const batalha =
                        MAPA_BATALHAS.get(
                            batalhaId
                        );


                    if (!batalha) {

                        return interaction.reply({

                            content:
                                "❌ Essa batalha não existe mais.",

                            ephemeral:
                                true
                        });
                    }


                    if (
                        batalha.iniciado
                    ) {

                        return interaction.reply({

                            content:
                                "⚔️ A batalha já começou.",

                            ephemeral:
                                true
                        });
                    }


                    CONVITES.set(
                        interaction.channel.id,
                        batalhaId
                    );


                    return interaction.reply({

                        content:

                            `🚨 **PEDIDO DE AJUDA!**\n\n` +

                            `<@${batalha.criadorId}> encontrou **${batalha.inimigo.nome}**!\n\n` +

                            `👥 Quem quiser ajudar pode usar **,juntar**.\n` +

                            `🐾 Cada aliado entra com apenas 1 Pet.`
                    });
                }


                // =================================================
                // ⚔️ ACEITAR DUELO
                // =================================================

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


                    const duelo =
                        DUELOS.get(
                            dueloId
                        );


                    if (!duelo) {

                        return interaction.reply({

                            content:
                                "❌ Esse desafio expirou.",

                            ephemeral:
                                true
                        });
                    }


                    if (
                        interaction.user.id !==
                        duelo.b
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Esse desafio não é seu.",

                            ephemeral:
                                true
                        });
                    }


                    if (
                        duelo.iniciado
                    ) {

                        return interaction.reply({

                            content:
                                "⚔️ O duelo já começou.",

                            ephemeral:
                                true
                        });
                    }


                    duelo.iniciado =
                        true;


                    await interaction.update({

                        embeds: [

                            dueloEmbedAuto(

                                duelo,

                                "⚔️ Desafio aceito! Os Pets estão entrando na arena..."
                            )
                        ],

                        components: []
                    });


                    return executarDuelo(
                        interaction.message,
                        duelo
                    );
                }


                // =================================================
                // ❌ RECUSAR DUELO
                // =================================================

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


                    const duelo =
                        DUELOS.get(
                            dueloId
                        );


                    if (!duelo) {

                        return interaction.reply({

                            content:
                                "❌ Esse desafio expirou.",

                            ephemeral:
                                true
                        });
                    }


                    if (
                        interaction.user.id !==
                        duelo.b
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Esse desafio não é seu.",

                            ephemeral:
                                true
                        });
                    }


                    DUELOS.delete(
                        dueloId
                    );


                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0x95a5a6
                                )

                                .setTitle(
                                    "❌ DUELO RECUSADO"
                                )

                                .setDescription(

                                    `**${interaction.user.username}** recusou o desafio.`
                                )
                        ],

                        components: []
                    });
                }

            } catch (e) {

                console.error(
                    "Erro no RPG interactionCreate:",
                    e
                );


                if (
                    interaction.deferred ||
                    interaction.replied
                ) {
                    return;
                }


                interaction.reply({

                    content:
                        "❌ Erro ao processar essa ação.",

                    ephemeral:
                        true

                }).catch(
                    () => {}
                );
            }
        }
    );
};
