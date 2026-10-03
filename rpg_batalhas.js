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

const DB_FILE = path.join(
    __dirname,
    "rpg_batalhas_db.json"
);


// ============================================================
// 🖼️ IMAGENS DOS PETS
// ============================================================
// COLOQUE AQUI OS LINKS DAS SUAS IMAGENS.
//
// Exemplo:
//
// dragao_oriente:
//     "https://....png"
//
// Você pode deixar "COLE_LINK_AQUI" até colocar a imagem.
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

        descricao:
            "Uma criatura ancestral que domina as chamas celestiais.",

        habilidadeDescricao:
            "Causa dano aumentado e pode causar queimadura.",

        tipo: "fogo",

        chance: 8,

        cor: 0xff4d4d,

        imagem:
            IMAGENS.dragao_oriente
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

        descricao:
            "O lobo colossal das antigas lendas nórdicas.",

        habilidadeDescricao:
            "Aumenta o ataque durante alguns turnos.",

        tipo: "buff",

        chance: 18,

        cor: 0x8e44ad,

        imagem:
            IMAGENS.fenrir
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

        descricao:
            "Uma criatura alada guardiã dos céus.",

        habilidadeDescricao:
            "Possui grande chance de causar crítico.",

        tipo: "critico",

        chance: 30,

        cor: 0x3498db,

        imagem:
            IMAGENS.grifo_celestial
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

        descricao:
            "Uma serpente nascida durante um eclipse sobrenatural.",

        habilidadeDescricao:
            "Causa dano sombrio e reduz a defesa inimiga.",

        tipo: "sombra",

        chance: 5,

        cor: 0x9b59b6,

        imagem:
            IMAGENS.serpente_eclipse
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

        descricao:
            "Uma criatura que carrega a energia das estrelas.",

        habilidadeDescricao:
            "Recupera uma parte da própria vida.",

        tipo: "cura",

        chance: 30,

        cor: 0xb084ff,

        imagem:
            IMAGENS.unicornio_astral
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

        descricao:
            "Um dragão capaz de congelar campos inteiros.",

        habilidadeDescricao:
            "Pode congelar o inimigo e impedir seu próximo ataque.",

        tipo: "gelo",

        chance: 25,

        cor: 0x5dade2,

        imagem:
            IMAGENS.dragao_gelo
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

        descricao:
            "Uma criatura que retorna das próprias cinzas.",

        habilidadeDescricao:
            "Pode reviver uma vez com parte da vida.",

        tipo: "renascimento",

        chance: 7,

        cor: 0xff7b00,

        imagem:
            IMAGENS.fenix
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

        descricao:
            "Uma criatura misteriosa que habita dimensões de escuridão.",

        habilidadeDescricao:
            "Causa enorme dano e drena parte da vida.",

        tipo: "dreno",

        chance: 2,

        cor: 0x3b235e,

        imagem:
            IMAGENS.dragao_noite
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

        descricao:
            "O monstro colossal das profundezas.",

        habilidadeDescricao:
            "Causa dano pesado e reduz a velocidade inimiga.",

        tipo: "agua",

        chance: 15,

        cor: 0x2980b9,

        imagem:
            IMAGENS.kraken
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

        descricao:
            "O guardião monstruoso do antigo labirinto.",

        habilidadeDescricao:
            "Golpe físico extremamente poderoso.",

        tipo: "brutal",

        chance: 40,

        cor: 0x8b4513,

        imagem:
            IMAGENS.minotauro
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

        descricao:
            "Uma raposa mística capaz de manipular ilusões.",

        habilidadeDescricao:
            "Pode esquivar completamente de um ataque.",

        tipo: "evasao",

        chance: 15,

        cor: 0xe84393,

        imagem:
            IMAGENS.kitsune
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

        descricao:
            "A criatura cujo olhar pode paralisar seus inimigos.",

        habilidadeDescricao:
            "Aplica veneno e pode impedir o próximo ataque.",

        tipo: "veneno",

        chance: 28,

        cor: 0x27ae60,

        imagem:
            IMAGENS.basilisco
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

        descricao:
            "Uma criatura formada pela união de três feras.",

        habilidadeDescricao:
            "Realiza múltiplos golpes.",

        tipo: "multi",

        chance: 6,

        cor: 0xd35400,

        imagem:
            IMAGENS.quimera
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

        descricao:
            "Uma criatura alada capaz de atravessar os céus.",

        habilidadeDescricao:
            "Possui grande chance de atacar primeiro.",

        tipo: "velocidade",

        chance: 30,

        cor: 0xffffff,

        imagem:
            IMAGENS.pegasus
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

        descricao:
            "O lendário cão guardião do submundo.",

        habilidadeDescricao:
            "Ataca o adversário três vezes.",

        tipo: "triplo",

        chance: 6,

        cor: 0xc0392b,

        imagem:
            IMAGENS.cerbero
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

        descricao:
            "Uma criatura cujas cabeças parecem nunca parar de crescer.",

        habilidadeDescricao:
            "Recupera vida constantemente.",

        tipo: "regen",

        chance: 14,

        cor: 0x16a085,

        imagem:
            IMAGENS.hidra
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

        descricao:
            "Uma criatura colossal dos oceanos primordiais.",

        habilidadeDescricao:
            "Ataque de água extremamente poderoso.",

        tipo: "agua",

        chance: 4,

        cor: 0x2471a3,

        imagem:
            IMAGENS.leviata
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

        descricao:
            "Um grifo corrompido pelas sombras.",

        habilidadeDescricao:
            "Causa dano aumentado contra inimigos fracos.",

        tipo: "execucao",

        chance: 13,

        cor: 0x6c3483,

        imagem:
            IMAGENS.grifo_sombrio
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

        descricao:
            "Um lobo que recebe poder da lua.",

        habilidadeDescricao:
            "Aumenta ataque e velocidade.",

        tipo: "buff",

        chance: 45,

        cor: 0x5dade2,

        imagem:
            IMAGENS.lobo_lunar
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

        descricao:
            "Uma entidade que protege os limites entre os mundos.",

        habilidadeDescricao:
            "Libera um ataque astral devastador.",

        tipo: "astral",

        chance: 1,

        cor: 0x8e44ad,

        imagem:
            IMAGENS.guardiao_astral
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

        imagem:
            IMAGENS_BOSS.dragao_apocalipse,

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

        imagem:
            IMAGENS_BOSS.titan_olimpiano,

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

        imagem:
            IMAGENS_BOSS.serpente_cosmica,

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

function carregarBanco() {

    try {

        if (
            !fs.existsSync(DB_FILE)
        ) {

            fs.writeFileSync(
                DB_FILE,
                JSON.stringify(
                    {},
                    null,
                    2
                )
            );

            return {};
        }

        return JSON.parse(
            fs.readFileSync(
                DB_FILE,
                "utf8"
            )
        );

    } catch (erro) {

        console.error(
            "❌ Erro ao carregar banco:",
            erro
        );

        return {};
    }
}


let db =
    carregarBanco();


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

    } catch (erro) {

        console.error(
            "❌ Erro ao salvar banco:",
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

            nivel: 1,

            xp: 0,

            vitorias: 0,

            derrotas: 0,

            bossesDerrotados: 0,

            criaturas: {},

            equipe: [],

            ultimosPets: []
        };

        // Primeiro pet
        db[id].criaturas.lobo_lunar = {

            nivel: 1,

            xp: 0
        };

        db[id].equipe.push(
            "lobo_lunar"
        );

        salvarBanco();
    }

    return db[id];
}


// ============================================================
// ⭐ XP
// ============================================================

function xpNecessario(
    nivel
) {

    return 100 + (
        (nivel - 1) * 75
    );
}


function ganharXP(
    id,
    quantidade
) {

    const user =
        jogador(id);

    user.xp +=
        quantidade;

    let subiu =
        false;

    while (
        user.xp >=
        xpNecessario(
            user.nivel
        )
    ) {

        user.xp -=
            xpNecessario(
                user.nivel
            );

        user.nivel++;

        subiu =
            true;
    }

    salvarBanco();

    return subiu;
}


// ============================================================
// 🐾 XP PET
// ============================================================

function ganharXPPet(
    id,
    petId,
    quantidade
) {

    const user =
        jogador(id);

    if (
        !user.criaturas[petId]
    ) {

        return false;
    }

    const pet =
        user.criaturas[petId];

    pet.xp +=
        quantidade;

    let limite =
        100 +
        (pet.nivel * 50);

    let evoluiu =
        false;

    while (
        pet.xp >= limite &&
        pet.nivel < 10
    ) {

        pet.xp -=
            limite;

        pet.nivel++;

        limite =
            100 +
            (pet.nivel * 50);

        evoluiu =
            true;
    }

    salvarBanco();

    return evoluiu;
}


// ============================================================
// 🔓 DESBLOQUEAR
// ============================================================

function desbloquear(
    userId,
    petId
) {

    const user =
        jogador(userId);

    if (
        user.criaturas[petId]
    ) {

        return false;
    }

    user.criaturas[petId] = {

        nivel: 1,

        xp: 0
    };

    salvarBanco();

    return true;
}


// ============================================================
// 📊 STATUS
// ============================================================

function statusPet(
    petId,
    nivel
) {

    const pet =
        PETS[petId];

    const multiplicador =
        1 +
        ((nivel - 1) * 0.08);

    return {

        hp: Math.floor(
            pet.hp *
            multiplicador
        ),

        ataque: Math.floor(
            pet.ataque *
            multiplicador
        ),

        defesa: Math.floor(
            pet.defesa *
            multiplicador
        ),

        velocidade:
            Math.floor(
                pet.velocidade *
                multiplicador
            )
    };
}


// ============================================================
// 🔢 BARRA DE HP
// ============================================================

function barraHP(
    atual,
    maximo,
    tamanho = 12
) {

    const porcentagem =
        Math.max(
            0,
            Math.min(
                1,
                atual / maximo
            )
        );

    const cheios =
        Math.round(
            porcentagem *
            tamanho
        );

    const vazios =
        tamanho -
        cheios;

    return (
        "🟩".repeat(
            cheios
        ) +
        "⬛".repeat(
            vazios
        )
    );
}


// ============================================================
// 🖼️ IMAGEM VÁLIDA
// ============================================================

function imagemValida(
    imagem
) {

    if (!imagem)
        return false;

    if (
        imagem ===
        "COLE_LINK_AQUI"
    ) {

        return false;
    }

    return (
        imagem.startsWith(
            "http://"
        ) ||
        imagem.startsWith(
            "https://"
        )
    );
}


// ============================================================
// 🐾 EMBED PET
// ============================================================

function embedPet(
    petId,
    nivel
) {

    const pet =
        PETS[petId];

    const stats =
        statusPet(
            petId,
            nivel
        );

    const embed =
        new EmbedBuilder()

            .setColor(
                pet.cor
            )

            .setTitle(
                `${pet.emoji} ${pet.nome}`
            )

            .setDescription(

                `🌟 **${pet.raridade}**\n\n` +

                `❤️ **HP:** ${stats.hp}\n` +

                `⚔️ **Ataque:** ${stats.ataque}\n` +

                `🛡️ **Defesa:** ${stats.defesa}\n` +

                `⚡ **Velocidade:** ${stats.velocidade}\n\n` +

                `✨ **${pet.habilidade}**\n` +

                `${pet.habilidadeDescricao}\n\n` +

                `📈 **Nível:** ${nivel}`
            );

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
// 📖 COLEÇÃO
// ============================================================

function colecaoEmbed(
    userId
) {

    const user =
        jogador(userId);

    const grupos = {};

    for (
        const pet of
        Object.values(PETS)
    ) {

        if (
            !grupos[pet.raridade]
        ) {

            grupos[
                pet.raridade
            ] = [];
        }

        const desbloqueado =
            !!user.criaturas[
                pet.id
            ];

        grupos[
            pet.raridade
        ].push(

            `${desbloqueado ? "🔓" : "🔒"} ${pet.emoji} **${pet.nome}**`
        );
    }

    let texto = "";

    const ordem = [
        "Comum",
        "Incomum",
        "Raro",
        "Épico",
        "Lendário",
        "Mítico",
        "Secreto"
    ];

    for (
        const raridade
        of ordem
    ) {

        if (
            !grupos[raridade]
        )
            continue;

        texto +=
            `### ${raridade}\n`;

        texto +=
            grupos[
                raridade
            ].join("\n");

        texto +=
            "\n\n";
    }

    return new EmbedBuilder()

        .setColor(
            0x8e44ad
        )

        .setTitle(
            "📖 Enciclopédia de Criaturas"
        )

        .setDescription(

            `🔓 **Desbloqueadas:** ` +
            `${Object.keys(user.criaturas).length}/${Object.keys(PETS).length}\n\n` +

            `🔓 = Você possui\n` +
            `🔒 = Ainda não encontrada\n\n` +

            texto
        );
}


// ============================================================
// 👤 PERFIL
// ============================================================

function perfilEmbed(
    userId,
    nome
) {

    const user =
        jogador(userId);

    return new EmbedBuilder()

        .setColor(
            0x3498db
        )

        .setTitle(
            `👤 Treinador — ${nome}`
        )

        .setDescription(

            `⭐ **Nível:** ${user.nivel}\n` +

            `✨ **XP:** ${user.xp}/${xpNecessario(user.nivel)}\n\n` +

            `⚔️ **Vitórias:** ${user.vitorias}\n` +

            `💀 **Derrotas:** ${user.derrotas}\n` +

            `👑 **Bosses derrotados:** ${user.bossesDerrotados}\n\n` +

            `🐾 **Criaturas:** ` +
            `${Object.keys(user.criaturas).length}/${Object.keys(PETS).length}`
        );
}


// ============================================================
// 🐾 MOSTRAR PET
// ============================================================

function encontrarPet(
    nome
) {

    const pesquisa =
        nome
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    return Object.values(PETS)
        .find(
            pet =>
                pet.nome
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    )
                    .includes(
                        pesquisa
                    )
        );
}


// ============================================================
// ⚔️ DUELOS ATIVOS
// ============================================================

const duelos =
    new Map();


// ============================================================
// 👑 BOSSES ATIVOS
// ============================================================

const bossesAtivos =
    new Map();


// ============================================================
// 🎁 RECOMPENSA
// ============================================================

function recompensaPet(
    userId,
    dificuldade = 1,
    recompensasEspecificas = null
) {

    const user =
        jogador(userId);

    const possiveis =
        recompensasEspecificas

            ? recompensasEspecificas
                .map(
                    id => PETS[id]
                )
                .filter(Boolean)
                .filter(
                    pet =>
                        !user.criaturas[
                            pet.id
                        ]
                )

            : Object.values(PETS)
                .filter(
                    pet =>
                        !user.criaturas[
                            pet.id
                        ]
                );

    if (
        !possiveis.length
    ) {

        return null;
    }

    // Chance de receber pet.
    // Não é garantido.

    let chance =
        15 +
        (dificuldade * 5);

    chance =
        Math.min(
            chance,
            35
        );

    if (
        Math.random() * 100 >
        chance
    ) {

        return null;
    }

    // Quanto maior a raridade,
    // menor o peso.

    const pesos = [];

    for (
        const pet of
        possiveis
    ) {

        let peso = 1;

        if (
            pet.raridade ===
            "Incomum"
        )
            peso = 5;

        if (
            pet.raridade ===
            "Raro"
        )
            peso = 4;

        if (
            pet.raridade ===
            "Épico"
        )
            peso = 2.5;

        if (
            pet.raridade ===
            "Lendário"
        )
            peso = 1.3;

        if (
            pet.raridade ===
            "Mítico"
        )
            peso = 0.7;

        if (
            pet.raridade ===
            "Secreto"
        )
            peso = 0.3;

        for (
            let i = 0;
            i < peso * 10;
            i++
        ) {

            pesos.push(
                pet
            );
        }
    }

    const escolhido =
        pesos[
            Math.floor(
                Math.random() *
                pesos.length
            )
        ];

    desbloquear(
        userId,
        escolhido.id
    );

    return escolhido;
}


// ============================================================
// 🎁 EMBED RECOMPENSA
// ============================================================

function recompensaEmbed(
    pet,
    xp
) {

    if (!pet) {

        return new EmbedBuilder()

            .setColor(
                0x95a5a6
            )

            .setTitle(
                "🏆 Vitória!"
            )

            .setDescription(

                `Você venceu a batalha!\n\n` +

                `✨ **+${xp} XP**\n\n` +

                `🎁 Desta vez nenhuma criatura foi encontrada.\n` +

                `Continue batalhando.`
            );
    }

    const embed =
        new EmbedBuilder()

            .setColor(
                pet.cor
            )

            .setTitle(
                "🎁 NOVA CRIATURA!"
            )

            .setDescription(

                `Uma nova criatura entrou para sua coleção!\n\n` +

                `${pet.emoji} **${pet.nome}**\n` +

                `🌟 **${pet.raridade}**\n\n` +

                `✨ **+${xp} XP**`
            );

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
// ⚔️ CRIAR DUELO
// ============================================================

function criarDuelo(
    desafiante,
    desafiado
) {

const id =
    `duelo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    duelos.set(
        id,
        {

            id,

            desafiante,

            desafiado,

            pet1: null,

            pet2: null,

            hp1: 0,

            hp2: 0,

            maxHp1: 0,

            maxHp2: 0,

            turno: null,

            habilidade1: true,

            habilidade2: true,

            status: "aguardando",

            canal: null
        }
    );

    return id;
}


// ============================================================
// 👑 CRIAR BOSS
// ============================================================

function criarBoss(
    bossId,
    criador,
    canal
) {

const id =
    `boss_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

        bossesAtivos.set(
        id,
        {

            id,

            bossId,

            criador,

            canal,

            hp: BOSSES[bossId].hp,

            maxHp:
                BOSSES[bossId].hp,

            jogadores: {},

            iniciado: false,

            turno: 1
        }
    );

    return id;
}


// ============================================================
// 🐾 EMBED DA BATALHA
// ============================================================

function dueloEmbed(
    duelo,
    mensagemExtra = ""
) {

    const p1 =
        PETS[
            duelo.pet1
        ];

    const p2 =
        PETS[
            duelo.pet2
        ];

    return new EmbedBuilder()

        .setColor(
            0x9b59b6
        )

        .setTitle(
            "⚔️ DUELO DE CRIATURAS"
        )

        .setDescription(

            `${p1.emoji} **${p1.nome}**\n` +

            `${barraHP(
                duelo.hp1,
                duelo.maxHp1
            )}\n` +

            `❤️ ${duelo.hp1.toLocaleString()}/${duelo.maxHp1.toLocaleString()}\n\n` +

            `━━━━━━━━━━━━━━━━\n\n` +

            `${p2.emoji} **${p2.nome}**\n` +

            `${barraHP(
                duelo.hp2,
                duelo.maxHp2
            )}\n` +

            `❤️ ${duelo.hp2.toLocaleString()}/${duelo.maxHp2.toLocaleString()}\n\n` +

            `━━━━━━━━━━━━━━━━\n\n` +

            `${mensagemExtra || "⚔️ Escolha uma ação."}`
        );
}


// ============================================================
// 🎮 BOTÕES DE DUELO
// ============================================================

function botoesDuelo(
    id,
    turno
) {

    return new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()

                .setCustomId(
                    `rpg_atacar_${id}`
                )

                .setLabel(
                    "⚔️ Atacar"
                )

                .setStyle(
                    ButtonStyle.Danger
                ),

            new ButtonBuilder()

                .setCustomId(
                    `rpg_habilidade_${id}`
                )

                .setLabel(
                    "✨ Habilidade"
                )

                .setStyle(
                    ButtonStyle.Primary
                )
        );
}


// ============================================================
// ⚔️ DANO
// ============================================================

function calcularDano(
    atacante,
    defensor
) {

    const base =
        atacante.ataque -
        Math.floor(
            defensor.defesa *
            0.4
        );

    const variacao =
        Math.floor(
            Math.random() *
            40
        );

    return Math.max(
        20,
        base + variacao
    );
}


// ============================================================
// ✨ HABILIDADE
// ============================================================

function habilidade(
    pet,
    atacante,
    defensor
) {

    let dano = 0;

    let cura = 0;

    let texto =
        `✨ **${pet.habilidade}**!`;

    switch (
        pet.tipo
    ) {

        case "cura":

            cura =
                Math.floor(
                    atacante.maxHp *
                    0.28
                );

            atacante.hp =
                Math.min(
                    atacante.maxHp,
                    atacante.hp + cura
                );

            texto +=
                `\n💚 Recuperou **${cura} HP**.`;

            break;


        case "buff":

            atacante.bonus =
                (atacante.bonus || 0) +
                70;

            texto +=
                `\n⚔️ O ataque aumentou!`;

            break;


        case "critico":

            dano =
                Math.floor(
                    atacante.ataque *
                    1.9
                );

            texto +=
                `\n💥 Golpe crítico!`;

            break;


        case "brutal":

            dano =
                Math.floor(
                    atacante.ataque *
                    1.7
                );

            texto +=
                `\n💥 Investida brutal!`;

            break;


        case "multi":

            dano =
                Math.floor(
                    atacante.ataque *
                    1.8
                );

            texto +=
                `\n💥 Três forças atacaram ao mesmo tempo!`;

            break;


        case "triplo":

            dano =
                Math.floor(
                    atacante.ataque *
                    2
                );

            texto +=
                `\n🐺 Três mordidas atingiram o inimigo!`;

            break;


        case "dreno":

            dano =
                Math.floor(
                    atacante.ataque *
                    1.8
                );

            cura =
                Math.floor(
                    dano *
                    0.25
                );

            atacante.hp =
                Math.min(
                    atacante.maxHp,
                    atacante.hp + cura
                );

            texto +=
                `\n🩸 Drenou **${cura} HP**.`;

            break;


        case "astral":

            dano =
                Math.floor(
                    atacante.ataque *
                    2.1
                );

            texto +=
                `\n🌌 O campo foi tomado por energia astral!`;

            break;


        default:

            dano =
                Math.floor(
                    atacante.ataque *
                    1.5
                );

            break;
    }

    if (
        dano > 0
    ) {

        defensor.hp =
            Math.max(
                0,
                defensor.hp -
                dano
            );

        texto +=
            `\n💥 **-${dano} HP**`;
    }

    return {
        dano,
        cura,
        texto
    };
}


// ============================================================
// 🏆 FINALIZAR DUELO
// ============================================================

async function finalizarDuelo(
    message,
    duelo,
    vencedor
) {

    const vencedorId =
        vencedor === 1
            ? duelo.desafiante
            : duelo.desafiado;

    const perdedorId =
        vencedor === 1
            ? duelo.desafiado
            : duelo.desafiante;

    const vencedorPet =
        vencedor === 1
            ? duelo.pet1
            : duelo.pet2;

    const user =
        jogador(
            vencedorId
        );

    const derrotado =
        jogador(
            perdedorId
        );

    user.vitorias++;

    derrotado.derrotas++;

    ganharXP(
        vencedorId,
        80
    );

    ganharXPPet(
        vencedorId,
        vencedorPet,
        100
    );

    const pet =
        recompensaPet(
            vencedorId,
            1
        );

    salvarBanco();

    await message.channel.send({

        embeds: [

            new EmbedBuilder()

                .setColor(
                    0xf1c40f
                )

                .setTitle(
                    "🏆 FIM DO DUELO!"
                )

                .setDescription(

                    `👑 Vencedor: <@${vencedorId}>\n\n` +

                    `🐾 ${PETS[vencedorPet].emoji} **${PETS[vencedorPet].nome}** venceu!\n\n` +

                    `✨ **+80 XP do treinador**\n` +

                    `🐾 **+100 XP do Pet**`
                )
        ]
    });

    await message.channel.send({

        embeds: [

            recompensaEmbed(
                pet,
                80
            )
        ]
    });

    duelos.delete(
        duelo.id
    );
}


// ============================================================
// 👑 EMBED BOSS
// ============================================================

function bossEmbed(
    batalha,
    mensagem = ""
) {

    const boss =
        BOSSES[
            batalha.bossId
        ];

    const jogadores =
        Object.entries(
            batalha.jogadores
        );

    const equipe =
        jogadores.length
            ? jogadores
                .map(
                    ([id, dados]) =>
                        `${dados.pet ? PETS[dados.pet].emoji : "⏳"} <@${id}> — ${dados.pet ? PETS[dados.pet].nome : "Escolhendo..."}`
                )
                .join("\n")
            : "Nenhum aliado ainda.";

    return new EmbedBuilder()

        .setColor(
            0xff3030
        )

        .setTitle(
            `👑 BOSS — ${boss.nome}`
        )

        .setDescription(

            `🌟 **${boss.raridade}**\n\n` +

            `❤️ **${batalha.hp.toLocaleString()} / ${batalha.maxHp.toLocaleString()}**\n` +

            `${barraHP(
                batalha.hp,
                batalha.maxHp,
                18
            )}\n\n` +

            `🤝 **Equipe:**\n` +

            equipe +

            `\n\n` +

            `${mensagem}`
        );
}


// ============================================================
// 🤝 BOTÕES DO BOSS
// ============================================================

function botoesBoss(
    id,
    podeIniciar = true
) {

    const row =
        new ActionRowBuilder();

    row.addComponents(

        new ButtonBuilder()

            .setCustomId(
                `rpg_boss_entrar_${id}`
            )

            .setLabel(
                "🤝 Entrar na batalha"
            )

            .setStyle(
                ButtonStyle.Success
            ),

        new ButtonBuilder()

            .setCustomId(
                `rpg_boss_iniciar_${id}`
            )

            .setLabel(
                "⚔️ Iniciar"
            )

            .setStyle(
                ButtonStyle.Danger
            )
    );

    return row;
}


// ============================================================
// 🏆 FINALIZAR BOSS
// ============================================================

async function finalizarBoss(
    message,
    batalha,
    venceu
) {

    const boss =
        BOSSES[
            batalha.bossId
        ];

    const jogadores =
        Object.entries(
            batalha.jogadores
        );

    if (
        !venceu
    ) {

        for (
            const [id] of
            jogadores
        ) {

            jogador(id).derrotas++;
        }

        salvarBanco();

        await message.channel.send({

            embeds: [

                new EmbedBuilder()

                    .setColor(
                        0x2c3e50
                    )

                    .setTitle(
                        "💀 A EQUIPE FOI DERROTADA"
                    )

                    .setDescription(

                        `O **${boss.nome}** venceu a batalha.\n\n` +

                        `Mas não acabou.\n` +

                        `Vocês podem tentar novamente.`
                    )
            ]
        });

        bossesAtivos.delete(
            batalha.id
        );

        return;
    }


    let texto =
        `👑 **${boss.nome} foi derrotado!**\n\n`;

    for (
        const [id, dados]
        of jogadores
    ) {

        const user =
            jogador(id);

        user.vitorias++;

        user.bossesDerrotados++;

        ganharXP(
            id,
            180
        );

        if (
            dados.pet
        ) {

            ganharXPPet(
                id,
                dados.pet,
                220
            );
        }
    }

    salvarBanco();

    await message.channel.send({

        embeds: [

            new EmbedBuilder()

                .setColor(
                    0xf1c40f
                )

                .setTitle(
                    "👑 BOSS DERROTADO!"
                )

                .setDescription(
                    texto +
                    `✨ Todos os participantes receberam XP.\n\n` +
                    `🎁 Agora cada participante possui uma chance de encontrar uma criatura.`
                )
        ]
    });


    for (
        const [id]
        of jogadores
    ) {

        const pet =
            recompensaPet(
                id,
                4,
                boss.recompensas
            );

        await message.channel.send({

            content:
                `<@${id}>`,

            embeds: [

                recompensaEmbed(
                    pet,
                    180
                )
            ]
        });
    }

    bossesAtivos.delete(
        batalha.id
    );
}


// ============================================================
// 🚀 EXPORTAÇÃO
// ============================================================

module.exports = (
    client
) => {

    console.log(
        "🐉 RPG de criaturas carregado."
    );


    // ========================================================
    // MENSAGENS
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
                    !message.content
                        .startsWith(
                            PREFIX
                        )
                )
                    return;

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
                    )
                    .toLowerCase();

                const args =
                    partes;


                // =================================================
                // ,RPG
                // =================================================

                if (
                    comando ===
                    "rpg"
                ) {

                    jogador(
                        message.author.id
                    );

                    const embed =
                        new EmbedBuilder()

                            .setColor(
                                0x6c5ce7
                            )

                            .setTitle(
                                "🐉 ZUNO — ARENA DAS CRIATURAS"
                            )

                            .setDescription(

                                `Bem-vindo à Arena, <@${message.author.id}>.\n\n` +

                                `🐾 **,invocar**\n` +
                                `Escolha o Pet que irá usar.\n\n` +

                                `📖 **,pets**\n` +
                                `Veja sua coleção.\n\n` +

                                `🔎 **,pet nome**\n` +
                                `Veja informações de uma criatura.\n\n` +

                                `⚔️ **,duelo @membro**\n` +
                                `Desafie outro treinador.\n\n` +

                                `👑 **,boss**\n` +
                                `Veja os Bosses.\n\n` +

                                `🤝 **,aliados**\n` +
                                `Veja Bosses aceitando jogadores.\n\n` +

                                `👤 **,perfilrpg**\n` +
                                `Veja seu progresso.\n\n` +

                                `🏆 **,ranking**\n` +
                                `Veja os maiores treinadores.`
                            );

                    return message.reply({
                        embeds: [
                            embed
                        ]
                    });
                }


                // =================================================
                // ,PETS
                // =================================================

                if (
                    comando ===
                    "pets"
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
                    comando ===
                    "pet"
                ) {

                    if (
                        !args.length
                    ) {

                        return message.reply(
                            "🐾 Use: `,pet nome da criatura`"
                        );
                    }

                    const nome =
                        args.join(" ");

                    const pet =
                        encontrarPet(
                            nome
                        );

                    if (!pet) {

                        return message.reply(
                            "❌ Não encontrei essa criatura."
                        );
                    }

                    const user =
                        jogador(
                            message.author.id
                        );

                    const dados =
                        user.criaturas[
                            pet.id
                        ];

                    if (!dados) {

                        return message.reply({

                            embeds: [

                                new EmbedBuilder()

                                    .setColor(
                                        0x555555
                                    )

                                    .setTitle(
                                        `${pet.emoji} ${pet.nome}`
                                    )

                                    .setDescription(

                                        `🔒 **CRIATURA BLOQUEADA**\n\n` +

                                        `Você ainda não possui essa criatura.\n\n` +

                                        `🌟 Raridade: **${pet.raridade}**`
                                    )
                            ]
                        });
                    }

                    return message.reply({

                        embeds: [

                            embedPet(
                                pet.id,
                                dados.nivel
                            )
                        ]
                    });
                }


                // =================================================
                // ,INVOCAR
                // =================================================

                if (
                    comando ===
                    "invocar"
                ) {

                    const user =
                        jogador(
                            message.author.id
                        );

                    const pets =
                        Object.keys(
                            user.criaturas
                        );

                    if (
                        !pets.length
                    ) {

                        return message.reply(
                            "❌ Você ainda não possui nenhuma criatura."
                        );
                    }

                    const petEscolhido =
                        user.equipe[0] ||
                        pets[0];

                    user.ultimosPets =
                        user.ultimosPets || [];

                    user.ultimosPets.unshift(
                        petEscolhido
                    );

                    user.ultimosPets =
                        user.ultimosPets.slice(
                            0,
                            10
                        );

                    salvarBanco();

                    return message.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    PETS[petEscolhido].cor
                                )

                                .setTitle(
                                    `${PETS[petEscolhido].emoji} PET INVOCADO`
                                )

                                .setDescription(

                                    `**${PETS[petEscolhido].nome}** apareceu!\n\n` +

                                    `🌟 ${PETS[petEscolhido].raridade}\n\n` +

                                    `🐾 Esse será o Pet usado quando você entrar em uma batalha, caso ainda não escolha outro.`
                                ),

                            embedPet(
                                petEscolhido,
                                user.criaturas[
                                    petEscolhido
                                ].nivel
                            )
                        ]
                    });
                }


                // =================================================
                // ,DUEL0
                // =================================================

                if (
                    comando ===
                    "duelo"
                ) {

                    const alvo =
                        message.mentions.users.first();

                    if (!alvo) {

                        return message.reply(
                            "⚔️ Use: `,duelo @membro`"
                        );
                    }

                    if (
                        alvo.id ===
                        message.author.id
                    ) {

                        return message.reply(
                            "❌ Você não pode duelar contra você mesmo."
                        );
                    }

                    if (
                        alvo.bot
                    ) {

                        return message.reply(
                            "❌ Bots não podem participar dos duelos."
                        );
                    }

                    jogador(
                        message.author.id
                    );

                    jogador(
                        alvo.id
                    );

                    const id =
                        criarDuelo(
                            message.author.id,
                            alvo.id
                        );

                    duelos.get(id).canal =
                        message.channel.id;

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
                            `${alvo}`,

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0xe74c3c
                                )

                                .setTitle(
                                    "⚔️ DESAFIO DE CRIATURAS"
                                )

                                .setDescription(

                                    `**${message.author.username}** desafiou **${alvo.username}**!\n\n` +

                                    `🐾 Aqui quem luta são os Pets.\n` +

                                    `👤 Os membros são apenas os treinadores.\n\n` +

                                    `Aceite para escolher sua criatura.`
                                )
                        ],

                        components: [
                            row
                        ]
                    });
                }


                // =================================================
                // ,BOSS
                // =================================================

                if (
                    comando ===
                    "boss"
                ) {

                    let texto = "";

                    for (
                        const boss
                        of Object.values(
                            BOSSES
                        )
                    ) {

                        texto +=

                            `${boss.emoji} **${boss.nome}**\n` +

                            `🌟 ${boss.raridade}\n` +

                            `❤️ ${boss.hp.toLocaleString()} HP\n\n`;
                    }

                    const row =
                        new ActionRowBuilder()
                            .addComponents(

                                new ButtonBuilder()

                                    .setCustomId(
                                        "rpg_boss_criar_dragao_apocalipse"
                                    )

                                    .setLabel(
                                        "🐉 Dragão do Apocalipse"
                                    )

                                    .setStyle(
                                        ButtonStyle.Danger
                                    )
                            );

                    return message.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0xff3030
                                )

                                .setTitle(
                                    "👑 BOSSES"
                                )

                                .setDescription(

                                    texto +

                                    `\n🤝 **Os Bosses podem ser enfrentados por vários membros.**\n` +

                                    `Cada aliado entra usando seu próprio Pet.`
                                )
                        ],

                        components: [
                            row
                        ]
                    });
                }


                // =================================================
                // ,ALIADOS
                // =================================================

                if (
                    comando ===
                    "aliados"
                ) {

                    const ativos =
                        [...bossesAtivos.values()]
                            .filter(
                                b =>
                                    !b.iniciado
                            );

                    if (
                        !ativos.length
                    ) {

                        return message.reply(
                            "🤝 Não existem batalhas de Boss abertas no momento."
                        );
                    }

                    const batalha =
                        ativos[0];

                    const boss =
                        BOSSES[
                            batalha.bossId
                        ];

                    return message.reply({

                        embeds: [

                            bossEmbed(
                                batalha,
                                "🤝 Essa batalha está aceitando aliados!"
                            )
                        ],

                        components: [

                            new ActionRowBuilder()
                                .addComponents(

                                    new ButtonBuilder()

                                        .setCustomId(
                                            `rpg_boss_entrar_${batalha.id}`
                                        )

                                        .setLabel(
                                            "🤝 Entrar na batalha"
                                        )

                                        .setStyle(
                                            ButtonStyle.Success
                                        )
                                )
                        ]
                    });
                }


                // =================================================
                // ,PERFILRPG
                // =================================================

                if (
                    comando ===
                    "perfilrpg"
                ) {

                    return message.reply({

                        embeds: [

                            perfilEmbed(
                                message.author.id,
                                message.author.username
                            )
                        ]
                    });
                }


                // =================================================
                // ,RANKING
                // =================================================

                if (
                    comando ===
                    "ranking"
                ) {

                    const ranking =
                        Object.entries(
                            db
                        )
                        .sort(
                            (a, b) =>
                                b[1].vitorias -
                                a[1].vitorias
                        )
                        .slice(
                            0,
                            10
                        );

                    if (
                        !ranking.length
                    ) {

                        return message.reply(
                            "🏆 Ainda não existem treinadores no ranking."
                        );
                    }

                    let texto = "";

                    ranking.forEach(
                        ([id, user], index) => {

                            texto +=

                                `**${index + 1}.** <@${id}> — ` +

                                `⚔️ ${user.vitorias} vitórias\n`;
                        }
                    );

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

            } catch (
                erro
            ) {

                console.error(
                    "❌ Erro RPG mensagem:",
                    erro
                );
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


                // =================================================
                // ACEITAR DUELO
                // =================================================

                if (
                    interaction.customId
                        .startsWith(
                            "rpg_duelo_aceitar_"
                        )
                ) {

                    const id =
                        interaction.customId
                            .replace(
                                "rpg_duelo_aceitar_",
                                ""
                            );

                    const duelo =
                        duelos.get(id);

                    if (!duelo) {

                        return interaction.reply({

                            content:
                                "❌ Esse duelo não existe mais.",

                            ephemeral: true
                        });
                    }

                    if (
                        interaction.user.id !==
                        duelo.desafiado
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Somente o membro desafiado pode aceitar.",

                            ephemeral: true
                        });
                    }

                    duelo.status =
                        "escolhendo";

                    const user1 =
                        jogador(
                            duelo.desafiante
                        );

                    const user2 =
                        jogador(
                            duelo.desafiado
                        );

                    await interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    0x9b59b6
                                )

                                .setTitle(
                                    "⚔️ DUELO ACEITO!"
                                )

                                .setDescription(

                                    `🐾 O duelo vai começar!\n\n` +

                                    `👤 <@${duelo.desafiante}> escolha seu Pet usando:\n` +

                                    `**,invocar**\n\n` +

                                    `👤 <@${duelo.desafiado}> escolha seu Pet usando:\n` +

                                    `**,invocar**\n\n` +

                                    `Depois, o sistema usará o Pet escolhido para a batalha.`
                                )
                        ],

                        components: []
                    });

                    return;
                }


                // =================================================
                // RECUSAR
                // =================================================

                if (
                    interaction.customId
                        .startsWith(
                            "rpg_duelo_recusar_"
                        )
                ) {

                    const id =
                        interaction.customId
                            .replace(
                                "rpg_duelo_recusar_",
                                ""
                            );

                    const duelo =
                        duelos.get(id);

                    if (!duelo) {

                        return interaction.reply({

                            content:
                                "❌ Esse duelo já terminou.",

                            ephemeral: true
                        });
                    }

                    if (
                        interaction.user.id !==
                        duelo.desafiado
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Somente o desafiado pode recusar.",

                            ephemeral: true
                        });
                    }

                    duelos.delete(
                        id
                    );

                    return interaction.update({

                        content:
                            "❌ O duelo foi recusado.",

                        embeds: [],

                        components: []
                    });
                }


                // =================================================
                // CRIAR BOSS
                // =================================================

                if (
                    interaction.customId ===
                    "rpg_boss_criar_dragao_apocalipse"
                ) {

                    const batalhaId =
                        criarBoss(
                            "dragao_apocalipse",
                            interaction.user.id,
                            interaction.channel.id
                        );

                    const batalha =
                        bossesAtivos.get(
                            batalhaId
                        );

                    batalha.jogadores[
                        interaction.user.id
                    ] = {

                        pet: null
                    };

                    const row =
                        new ActionRowBuilder()
                            .addComponents(

                                new ButtonBuilder()

                                    .setCustomId(
                                        `rpg_boss_escolher_${batalhaId}`
                                    )

                                    .setLabel(
                                        "🐾 Escolher meu Pet"
                                    )

                                    .setStyle(
                                        ButtonStyle.Primary
                                    )
                            );

                    return interaction.reply({

                        embeds: [

                            bossEmbed(
                                batalha,
                                "👑 Você iniciou a batalha!\n\nEscolha seu Pet e depois chame seus aliados."
                            )
                        ],

                        components: [
                            row
                        ]
                    });
                }


                // =================================================
                // ENTRAR NO BOSS
                // =================================================

                if (
                    interaction.customId
                        .startsWith(
                            "rpg_boss_entrar_"
                        )
                ) {

                    const id =
                        interaction.customId
                            .replace(
                                "rpg_boss_entrar_",
                                ""
                            );

                    const batalha =
                        bossesAtivos.get(
                            id
                        );

                    if (!batalha) {

                        return interaction.reply({

                            content:
                                "❌ Essa batalha não está mais disponível.",

                            ephemeral: true
                        });
                    }

                    if (
                        batalha.iniciado
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Essa batalha já começou.",

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
                                "❌ A equipe já está cheia. Máximo: 5 treinadores.",

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
                                "🐾 Você já está nessa batalha.",

                            ephemeral: true
                        });
                    }

                    jogador(
                        interaction.user.id
                    );

                    batalha.jogadores[
                        interaction.user.id
                    ] = {

                        pet:
                            null
                    };

                    return interaction.reply({

                        embeds: [

                            bossEmbed(
                                batalha,
                                "🐾 Você entrou! Agora escolha seu Pet com `,invocar`."
                            )
                        ]
                    });
                }


                // =================================================
                // INICIAR BOSS
                // =================================================

                if (
                    interaction.customId
                        .startsWith(
                            "rpg_boss_iniciar_"
                        )
                ) {

                    const id =
                        interaction.customId
                            .replace(
                                "rpg_boss_iniciar_",
                                ""
                            );

                    const batalha =
                        bossesAtivos.get(
                            id
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
                                "❌ Somente quem criou a batalha pode iniciá-la.",

                            ephemeral: true
                        });
                    }

                    const membros =
                        Object.entries(
                            batalha.jogadores
                        );

                    if (
                        !membros.length
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Ninguém entrou na batalha.",

                            ephemeral: true
                        });
                    }

                    // Usa o Pet invocado atualmente
                    // por cada membro.

                    for (
                        const [
                            userId,
                            dados
                        ]
                        of membros
                    ) {

                        const user =
                            jogador(
                                userId
                            );

                        dados.pet =
                            user.equipe[0] ||
                            Object.keys(
                                user.criaturas
                            )[0];
                    }

                    batalha.iniciado =
                        true;

                    await interaction.update({

                        embeds: [

                            bossEmbed(
                                batalha,
                                "⚔️ **A BATALHA COMEÇOU!**"
                            )
                        ],

                        components: []
                    });

                    iniciarTurnoBoss(
                        interaction.channel,
                        batalha
                    );

                    return;
                }


                // =================================================
                // ATAQUE DO DUELO
                // =================================================

                if (
                    interaction.customId
                        .startsWith(
                            "rpg_atacar_"
                        )
                ) {

                    const id =
                        interaction.customId
                            .replace(
                                "rpg_atacar_",
                                ""
                            );

                    const duelo =
                        duelos.get(id);

                    if (!duelo) {

                        return interaction.reply({

                            content:
                                "❌ Esse duelo terminou.",

                            ephemeral: true
                        });
                    }

                    const ehJogador1 =
                        interaction.user.id ===
                        duelo.desafiante;

                    const ehJogador2 =
                        interaction.user.id ===
                        duelo.desafiado;

                    if (
                        !ehJogador1 &&
                        !ehJogador2
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Você não participa desse duelo.",

                            ephemeral: true
                        });
                    }

                    const turnoAtualEhVoce =
                        (
                            duelo.turno === 1 &&
                            ehJogador1
                        ) ||
                        (
                            duelo.turno === 2 &&
                            ehJogador2
                        );

                    if (
                        !turnoAtualEhVoce
                    ) {

                        return interaction.reply({

                            content:
                                "⏳ Ainda não é seu turno.",

                            ephemeral: true
                        });
                    }

                    const petAtacante =
                        duelo.turno === 1
                            ? duelo.pet1
                            : duelo.pet2;

                    const petDefensor =
                        duelo.turno === 1
                            ? duelo.pet2
                            : duelo.pet1;

                    const nivel1 =
                        jogador(
                            duelo.desafiante
                        ).criaturas[
                            duelo.pet1
                        ]?.nivel || 1;

                    const nivel2 =
                        jogador(
                            duelo.desafiado
                        ).criaturas[
                            duelo.pet2
                        ]?.nivel || 1;

                    const atacante =
                        statusPet(
                            petAtacante,
                            duelo.turno === 1
                                ? nivel1
                                : nivel2
                        );

                    const defensor =
                        statusPet(
                            petDefensor,
                            duelo.turno === 1
                                ? nivel2
                                : nivel1
                        );

                    const dano =
                        calcularDano(
                            atacante,
                            defensor
                        );

                    if (
                        duelo.turno === 1
                    ) {

                        duelo.hp2 =
                            Math.max(
                                0,
                                duelo.hp2 -
                                dano
                            );

                    } else {

                        duelo.hp1 =
                            Math.max(
                                0,
                                duelo.hp1 -
                                dano
                            );
                    }

                    const morreu =
                        duelo.turno === 1
                            ? duelo.hp2 <= 0
                            : duelo.hp1 <= 0;

                    if (
                        morreu
                    ) {

                        await interaction.update({

                            embeds: [

                                dueloEmbed(
                                    duelo,
                                    `💥 **${PETS[petAtacante].nome} causou ${dano} de dano!**\n\n🏆 O adversário foi derrotado!`
                                )
                            ],

                            components: []
                        });

                        await finalizarDuelo(
                            interaction.message,
                            duelo,
                            duelo.turno
                        );

                        return;
                    }

                    duelo.turno =
                        duelo.turno === 1
                            ? 2
                            : 1;

                    return interaction.update({

                        embeds: [

                            dueloEmbed(
                                duelo,
                                `💥 **${PETS[petAtacante].nome} causou ${dano} de dano!**\n\n` +

                                `⚡ Agora é a vez de ` +

                                `<@${duelo.turno === 1 ? duelo.desafiante : duelo.desafiado}>.`
                            )
                        ],

                        components: [

                            botoesDuelo(
                                duelo.id,
                                duelo.turno
                            )
                        ]
                    });
                }


                // =================================================
                // HABILIDADE
                // =================================================

                if (
                    interaction.customId
                        .startsWith(
                            "rpg_habilidade_"
                        )
                ) {

                    const id =
                        interaction.customId
                            .replace(
                                "rpg_habilidade_",
                                ""
                            );

                    const duelo =
                        duelos.get(id);

                    if (!duelo) {

                        return interaction.reply({

                            content:
                                "❌ Esse duelo terminou.",

                            ephemeral: true
                        });
                    }

                    const ehJogador1 =
                        interaction.user.id ===
                        duelo.desafiante;

                    const ehJogador2 =
                        interaction.user.id ===
                        duelo.desafiado;

                    const correto =
                        (
                            duelo.turno === 1 &&
                            ehJogador1
                        ) ||
                        (
                            duelo.turno === 2 &&
                            ehJogador2
                        );

                    if (!correto) {

                        return interaction.reply({

                            content:
                                "⏳ Não é seu turno.",

                            ephemeral: true
                        });
                    }

                    const petId =
                        duelo.turno === 1
                            ? duelo.pet1
                            : duelo.pet2;

                    const pode =
                        duelo.turno === 1
                            ? duelo.habilidade1
                            : duelo.habilidade2;

                    if (!pode) {

                        return interaction.reply({

                            content:
                                "❌ Essa habilidade já foi usada nesta batalha.",

                            ephemeral: true
                        });
                    }

                    if (
                        duelo.turno === 1
                    )
                        duelo.habilidade1 =
                            false;
                    else
                        duelo.habilidade2 =
                            false;

                    const nivel =
                        jogador(
                            interaction.user.id
                        ).criaturas[
                            petId
                        ]?.nivel || 1;

                    const atacanteBase =
                        statusPet(
                            petId,
                            nivel
                        );

                    const outroId =
                        duelo.turno === 1
                            ? duelo.pet2
                            : duelo.pet1;

                    const outroNivel =
                        jogador(
                            duelo.turno === 1
                                ? duelo.desafiado
                                : duelo.desafiante
                        ).criaturas[
                            outroId
                        ]?.nivel || 1;

                    const defensorBase =
                        statusPet(
                            outroId,
                            outroNivel
                        );

                    const atacante = {

                        ...atacanteBase,

                        hp:
                            duelo.turno === 1
                                ? duelo.hp1
                                : duelo.hp2,

                        maxHp:
                            duelo.turno === 1
                                ? duelo.maxHp1
                                : duelo.maxHp2
                    };

                    const defensor = {

                        ...defensorBase,

                        hp:
                            duelo.turno === 1
                                ? duelo.hp2
                                : duelo.hp1,

                        maxHp:
                            duelo.turno === 1
                                ? duelo.maxHp2
                                : duelo.maxHp1
                    };

                    const resultado =
                        habilidade(
                            PETS[petId],
                            atacante,
                            defensor
                        );

                    if (
                        duelo.turno === 1
                    ) {

                        duelo.hp1 =
                            Math.min(
                                duelo.maxHp1,
                                atacante.hp
                            );

                        duelo.hp2 =
                            Math.max(
                                0,
                                defensor.hp
                            );

                    } else {

                        duelo.hp2 =
                            Math.min(
                                duelo.maxHp2,
                                atacante.hp
                            );

                        duelo.hp1 =
                            Math.max(
                                0,
                                defensor.hp
                            );
                    }

                    const morreu =
                        duelo.turno === 1
                            ? duelo.hp2 <= 0
                            : duelo.hp1 <= 0;

                    if (
                        morreu
                    ) {

                        await interaction.update({

                            embeds: [

                                dueloEmbed(
                                    duelo,
                                    resultado.texto +
                                    `\n\n🏆 **Vitória!**`
                                )
                            ],

                            components: []
                        });

                        await finalizarDuelo(
                            interaction.message,
                            duelo,
                            duelo.turno
                        );

                        return;
                    }

                    duelo.turno =
                        duelo.turno === 1
                            ? 2
                            : 1;

                    return interaction.update({

                        embeds: [

                            dueloEmbed(
                                duelo,
                                resultado.texto +
                                `\n\n⚡ Agora é a vez de <@${duelo.turno === 1 ? duelo.desafiante : duelo.desafiado}>.`
                            )
                        ],

                        components: [

                            botoesDuelo(
                                duelo.id,
                                duelo.turno
                            )
                        ]
                    });
                }

            } catch (
                erro
            ) {

                console.error(
                    "❌ Erro RPG botão:",
                    erro
                );

                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {

                    try {

                        await interaction.reply({

                            content:
                                "❌ Ocorreu um erro nessa ação.",

                            ephemeral: true
                        });

                    } catch {}
                }
            }
        }
    );


    // ========================================================
    // 🐾 TURNO DOS BOSSES
    // ========================================================

    async function iniciarTurnoBoss(
        canal,
        batalha
    ) {

        if (
            !batalha.iniciado
        )
            return;

        const boss =
            BOSSES[
                batalha.bossId
            ];

        if (
            batalha.hp <= 0
        ) {

            const fakeMessage = {
                channel: canal
            };

            await finalizarBoss(
                fakeMessage,
                batalha,
                true
            );

            return;
        }

        const membros =
            Object.entries(
                batalha.jogadores
            )
            .filter(
                ([, dados]) =>
                    dados.pet
            );

        if (
            !membros.length
        ) {

            return;
        }

        // Escolhe aleatoriamente
        // um Pet da equipe.

        const atacante =
            membros[
                Math.floor(
                    Math.random() *
                    membros.length
                )
            ];

        const [
            jogadorId,
            dados
        ] = atacante;

        const user =
            jogador(
                jogadorId
            );

        const petId =
            dados.pet;

        const nivel =
            user.criaturas[
                petId
            ]?.nivel || 1;

        const pet =
            statusPet(
                petId,
                nivel
            );

        const dano =
            calcularDano(
                pet,
                boss
            );

        batalha.hp =
            Math.max(
                0,
                batalha.hp -
                dano
            );

        await canal.send({

            embeds: [

                bossEmbed(

                    batalha,

                    `⚔️ ${PETS[petId].emoji} **${PETS[petId].nome}** atacou o **${boss.nome}**!\n\n` +

                    `💥 Dano causado: **${dano}**`
                )
            ]
        });

        if (
            batalha.hp <= 0
        ) {

            const fakeMessage = {
                channel: canal
            };

            await finalizarBoss(
                fakeMessage,
                batalha,
                true
            );

            return;
        }

        // Agora o Boss contra-ataca.

        const alvo =
            membros[
                Math.floor(
                    Math.random() *
                    membros.length
                )
            ];

        const [
            alvoId,
            alvoDados
        ] = alvo;

        const alvoUser =
            jogador(
                alvoId
            );

        const alvoNivel =
            alvoUser.criaturas[
                alvoDados.pet
            ]?.nivel || 1;

        const alvoStats =
            statusPet(
                alvoDados.pet,
                alvoNivel
            );

        const danoBoss =
            Math.max(
                30,
                boss.ataque -
                Math.floor(
                    alvoStats.defesa *
                    0.35
                ) +
                Math.floor(
                    Math.random() *
                    80
                )
            );

        await canal.send({

            embeds: [

                new EmbedBuilder()

                    .setColor(
                        0xff3030
                    )

                    .setDescription(

                        `👑 **${boss.nome} contra-atacou!**\n\n` +

                        `🎯 Alvo: <@${alvoId}>\n` +

                        `💥 Dano: **${danoBoss}**\n\n` +

                        `❤️ O Pet recebeu o impacto.`
                    )
            ]
        });

        batalha.turno++;

        setTimeout(
            () =>
                iniciarTurnoBoss(
                    canal,
                    batalha
                ),
            4000
        );
    }


    console.log(
        "⚔️ Comandos do RPG: ,rpg | ,invocar | ,pets | ,pet | ,duelo | ,boss | ,aliados | ,perfilrpg | ,ranking"
    );
};
