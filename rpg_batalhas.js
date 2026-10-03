// ============================================================
// 🐉 ZUNO RPG — ARENA DAS CRIATURAS
// ============================================================
// SISTEMA 100% POR COMANDOS COM VÍRGULA
//
// ,rpg
// ,explorar
// ,mapa
// ,viajar
// ,pets
// ,pet
// ,invocar
// ,duelo @membro
// ,juntar
// ,perfil
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

const PETS = {
    dragao_oriente:{id:"dragao_oriente",nome:"Dragão do Oriente",emoji:"🐉",raridade:"Mítico",hp:850,ataque:190,defesa:150,velocidade:120,habilidade:"Chama Oriental",descricao:"Uma criatura ancestral que domina as chamas celestiais.",habilidadeDescricao:"Causa dano aumentado e pode causar queimadura.",tipo:"fogo",chance:8,cor:0xff4d4d,imagem:IMAGENS.dragao_oriente},
    fenrir:{id:"fenrir",nome:"Fenrir",emoji:"🐺",raridade:"Lendário",hp:900,ataque:205,defesa:140,velocidade:150,habilidade:"Fúria Nórdica",descricao:"O lobo colossal das antigas lendas.",habilidadeDescricao:"Aumenta o dano conforme o combate avança.",tipo:"buff",chance:7,cor:0x7f8c8d,imagem:IMAGENS.fenrir},
    grifo_celestial:{id:"grifo_celestial",nome:"Grifo Celestial",emoji:"🦅",raridade:"Lendário",hp:820,ataque:185,defesa:145,velocidade:165,habilidade:"Investida Celestial",descricao:"Guardião dos céus antigos.",habilidadeDescricao:"Ataque rápido com chance maior de crítico.",tipo:"velocidade",chance:6,cor:0xf1c40f,imagem:IMAGENS.grifo_celestial},
    serpente_eclipse:{id:"serpente_eclipse",nome:"Serpente Eclipse",emoji:"🐍",raridade:"Mítico",hp:950,ataque:215,defesa:155,velocidade:135,habilidade:"Eclipse Sombrio",descricao:"Uma serpente ligada às sombras do eclipse.",habilidadeDescricao:"Pode aplicar veneno.",tipo:"veneno",chance:5,cor:0x8e44ad,imagem:IMAGENS.serpente_eclipse},
    unicornio_astral:{id:"unicornio_astral",nome:"Unicórnio Astral",emoji:"🦄",raridade:"Mítico",hp:880,ataque:175,defesa:190,velocidade:150,habilidade:"Luz Astral",descricao:"Uma criatura das dimensões celestiais.",habilidadeDescricao:"Recupera parte da própria vida.",tipo:"cura",chance:4,cor:0x9b59b6,imagem:IMAGENS.unicornio_astral},
    dragao_gelo:{id:"dragao_gelo",nome:"Dragão de Gelo",emoji:"🐲",raridade:"Épico",hp:920,ataque:200,defesa:165,velocidade:115,habilidade:"Sopro Glacial",descricao:"Um dragão capaz de congelar seus inimigos.",habilidadeDescricao:"Ataque de gelo pesado.",tipo:"gelo",chance:8,cor:0x3498db,imagem:IMAGENS.dragao_gelo},
    fenix:{id:"fenix",nome:"Fênix",emoji:"🔥",raridade:"Lendário",hp:780,ataque:220,defesa:125,velocidade:175,habilidade:"Renascimento",descricao:"Uma ave que carrega o poder das chamas.",habilidadeDescricao:"Pode recuperar parte da vida.",tipo:"cura",chance:7,cor:0xe67e22,imagem:IMAGENS.fenix},
    dragao_noite:{id:"dragao_noite",nome:"Dragão da Noite",emoji:"🐉",raridade:"Mítico",hp:1050,ataque:240,defesa:175,velocidade:145,habilidade:"Trevas Eternas",descricao:"Uma criatura que nasceu no vazio.",habilidadeDescricao:"Grande dano sombrio.",tipo:"buff",chance:3,cor:0x2c3e50,imagem:IMAGENS.dragao_noite},
    kraken:{id:"kraken",nome:"Kraken",emoji:"🐙",raridade:"Épico",hp:1100,ataque:185,defesa:205,velocidade:95,habilidade:"Tentáculos do Abismo",descricao:"Monstro gigantesco das profundezas.",habilidadeDescricao:"Ataque pesado.",tipo:"buff",chance:6,cor:0x2980b9,imagem:IMAGENS.kraken},
    minotauro:{id:"minotauro",nome:"Minotauro",emoji:"🐂",raridade:"Épico",hp:1200,ataque:220,defesa:220,velocidade:80,habilidade:"Investida Brutal",descricao:"Um guerreiro das ruínas antigas.",habilidadeDescricao:"Ataque de força.",tipo:"buff",chance:6,cor:0x8e44ad,imagem:IMAGENS.minotauro},
    kitsune:{id:"kitsune",nome:"Kitsune",emoji:"🦊",raridade:"Épico",hp:760,ataque:195,defesa:120,velocidade:190,habilidade:"Ilusão das Nove Caudas",descricao:"Uma raposa espiritual extremamente veloz.",habilidadeDescricao:"Ataque rápido.",tipo:"velocidade",chance:7,cor:0xe67e22,imagem:IMAGENS.kitsune},
    basilisco:{id:"basilisco",nome:"Basilisco",emoji:"🐍",raridade:"Épico",hp:1000,ataque:205,defesa:180,velocidade:115,habilidade:"Olhar Petrificante",descricao:"Uma serpente cujo olhar assusta até guerreiros.",habilidadeDescricao:"Ataque venenoso.",tipo:"veneno",chance:5,cor:0x27ae60,imagem:IMAGENS.basilisco},
    quimera:{id:"quimera",nome:"Quimera",emoji:"🦁",raridade:"Mítico",hp:1150,ataque:250,defesa:185,velocidade:130,habilidade:"Fúria da Quimera",descricao:"Uma criatura formada por várias feras.",habilidadeDescricao:"Ataque devastador.",tipo:"fogo",chance:3,cor:0xc0392b,imagem:IMAGENS.quimera},
    pegasus:{id:"pegasus",nome:"Pégaso",emoji:"🪽",raridade:"Lendário",hp:850,ataque:190,defesa:155,velocidade:200,habilidade:"Voo Celestial",descricao:"Uma criatura dos céus.",habilidadeDescricao:"Grande velocidade.",tipo:"velocidade",chance:5,cor:0xecf0f1,imagem:IMAGENS.pegasus},
    cerbero:{id:"cerbero",nome:"Cérbero",emoji:"🐕",raridade:"Lendário",hp:1300,ataque:245,defesa:210,velocidade:105,habilidade:"Tríplice Mordida",descricao:"O guardião das portas do submundo.",habilidadeDescricao:"Ataque poderoso.",tipo:"fogo",chance:4,cor:0x2c3e50,imagem:IMAGENS.cerbero},
    hidra:{id:"hidra",nome:"Hidra",emoji:"🐲",raridade:"Mítico",hp:1400,ataque:230,defesa:235,velocidade:90,habilidade:"Cabeças Infinitas",descricao:"Uma criatura que parece nunca morrer.",habilidadeDescricao:"Grande resistência.",tipo:"cura",chance:3,cor:0x27ae60,imagem:IMAGENS.hidra},
    leviata:{id:"leviata",nome:"Leviatã",emoji:"🐋",raridade:"Mítico",hp:1550,ataque:270,defesa:245,velocidade:100,habilidade:"Fúria Oceânica",descricao:"Uma das maiores criaturas do mundo.",habilidadeDescricao:"Dano extremo.",tipo:"buff",chance:2,cor:0x2980b9,imagem:IMAGENS.leviata},
    grifo_sombrio:{id:"grifo_sombrio",nome:"Grifo Sombrio",emoji:"🦅",raridade:"Mítico",hp:1000,ataque:260,defesa:165,velocidade:180,habilidade:"Asas das Trevas",descricao:"Uma versão corrompida do grifo celestial.",habilidadeDescricao:"Ataque rápido.",tipo:"buff",chance:2,cor:0x34495e,imagem:IMAGENS.grifo_sombrio},
    lobo_lunar:{id:"lobo_lunar",nome:"Lobo Lunar",emoji:"🐺",raridade:"Inicial",hp:700,ataque:145,defesa:115,velocidade:125,habilidade:"Uivo Lunar",descricao:"Seu primeiro companheiro.",habilidadeDescricao:"Um ataque equilibrado.",tipo:"velocidade",chance:100,cor:0x3498db,imagem:IMAGENS.lobo_lunar},
    guardiao_astral:{id:"guardiao_astral",nome:"Guardião Astral",emoji:"🛡️",raridade:"Divino",hp:1700,ataque:285,defesa:300,velocidade:120,habilidade:"Barreira Estelar",descricao:"Uma entidade que protege os limites do cosmos.",habilidadeDescricao:"Altíssima defesa.",tipo:"cura",chance:1,cor:0x9b59b6,imagem:IMAGENS.guardiao_astral}
};

const BOSSES = {
    dragao_apocalipse:{id:"dragao_apocalipse",nome:"Dragão do Apocalipse",emoji:"🐉",raridade:"Lendário",hp:35000,ataque:780,defesa:650,velocidade:420,recompensas:["dragao_noite","serpente_eclipse","quimera","leviata"]},
    titan_olimpiano:{id:"titan_olimpiano",nome:"Titã Olimpiano",emoji:"⚡",raridade:"Lendário",hp:50000,ataque:920,defesa:800,velocidade:380,recompensas:["guardiao_astral","dragao_noite"]},
    serpente_cosmica:{id:"serpente_cosmica",nome:"Serpente Cósmica",emoji:"🐍",raridade:"Lendário",hp:70000,ataque:1100,defesa:950,velocidade:500,recompensas:["guardiao_astral","dragao_noite","serpente_eclipse"]}
};

function carregarBanco(){
    try{
        if(fs.existsSync(DB_FILE)){
            const dados=JSON.parse(fs.readFileSync(DB_FILE,"utf8"));
            return dados&&typeof dados==="object"?dados:{};
        }
    }catch(e){
        console.error("Banco RPG corrompido:",e.message);
    }
    return {};
}

const MAPAS = [
    {
        id:"floresta_lunar",
        nome:"Floresta Lunar",
        emoji:"🌙",
        nivel:1,
        desc:"Uma floresta tranquila, coberta por névoa prateada.",
        monstros:[
            {nome:"Lobo Lunar Selvagem",emoji:"🐺",hp:180,ataque:24,defesa:12,velocidade:18},
            {nome:"Coruja Sombria",emoji:"🦉",hp:150,ataque:28,defesa:9,velocidade:24},
            {nome:"Javali Lunar",emoji:"🐗",hp:230,ataque:27,defesa:18,velocidade:12},
            {nome:"Pantera da Névoa",emoji:"🐆",hp:200,ataque:32,defesa:14,velocidade:26},
            {nome:"Cervo Fantasma",emoji:"🦌",hp:170,ataque:25,defesa:20,velocidade:20}
        ],
        elite:{nome:"Lobo Alfa Lunar",emoji:"🐺",hp:520,ataque:48,defesa:28,velocidade:28},
        boss:{nome:"Guardião da Lua",emoji:"🌑",hp:2600,ataque:95,defesa:55,velocidade:32,habilidades:["Eclipse Lunar","Uivo da Noite"]}
    },
    {
        id:"reino_glacial",
        nome:"Reino Glacial",
        emoji:"❄️",
        nivel:10,
        desc:"Montanhas congeladas onde criaturas antigas despertam.",
        monstros:[
            {nome:"Lobo Glacial",emoji:"🐺",hp:430,ataque:55,defesa:32,velocidade:24},
            {nome:"Urso de Gelo",emoji:"🐻",hp:620,ataque:62,defesa:48,velocidade:13},
            {nome:"Serpente Congelada",emoji:"🐍",hp:500,ataque:70,defesa:29,velocidade:28},
            {nome:"Corvo de Gelo",emoji:"🐦",hp:360,ataque:64,defesa:25,velocidade:34}
        ],
        elite:{nome:"Gigante Glacial",emoji:"🗿",hp:1250,ataque:105,defesa:75,velocidade:17},
        boss:{nome:"Rei do Gelo",emoji:"👑",hp:5200,ataque:175,defesa:115,velocidade:27,habilidades:["Prisão Congelante","Tempestade Glacial"]}
    },
    {
        id:"vulcao_caos",
        nome:"Vulcão do Caos",
        emoji:"🌋",
        nivel:20,
        desc:"Um território de fogo onde cada passo pode ser perigoso.",
        monstros:[
            {nome:"Lagarto de Lava",emoji:"🦎",hp:850,ataque:100,defesa:55,velocidade:20},
            {nome:"Salamandra Infernal",emoji:"🔥",hp:980,ataque:112,defesa:60,velocidade:23},
            {nome:"Golem de Magma",emoji:"🗿",hp:1200,ataque:105,defesa:85,velocidade:12},
            {nome:"Serpente Ígnea",emoji:"🐍",hp:900,ataque:125,defesa:52,velocidade:29}
        ],
        elite:{nome:"Demônio Vulcânico",emoji:"😈",hp:2400,ataque:190,defesa:105,velocidade:27},
        boss:{nome:"Senhor da Lava",emoji:"🌋",hp:9500,ataque:300,defesa:165,velocidade:25,habilidades:["Erupção Infernal","Chão Incandescente"]}
    },
    {
        id:"abismo_oceanico",
        nome:"Abismo Oceânico",
        emoji:"🌊",
        nivel:35,
        desc:"No fundo do oceano, criaturas gigantes caçam nas sombras.",
        monstros:[
            {nome:"Tubarão Abissal",emoji:"🦈",hp:1800,ataque:190,defesa:105,velocidade:30},
            {nome:"Medusa Sombria",emoji:"🪼",hp:1450,ataque:210,defesa:90,velocidade:22},
            {nome:"Caranguejo Colossal",emoji:"🦀",hp:2200,ataque:175,defesa:155,velocidade:13},
            {nome:"Enguia Elétrica",emoji:"⚡",hp:1600,ataque:225,defesa:95,velocidade:36}
        ],
        elite:{nome:"Leviatã Jovem",emoji:"🐋",hp:4300,ataque:330,defesa:210,velocidade:22},
        boss:{nome:"Abissal",emoji:"👁️",hp:17000,ataque:500,defesa:310,velocidade:31,habilidades:["Tsunami","Tentáculos do Abismo"]}
    },
    {
        id:"ruinas_antigas",
        nome:"Ruínas Antigas",
        emoji:"🏜️",
        nivel:50,
        desc:"Templos esquecidos guardam monstros de eras passadas.",
        monstros:[
            {nome:"Escorpião Ancestral",emoji:"🦂",hp:3000,ataque:330,defesa:180,velocidade:28},
            {nome:"Guardião de Pedra",emoji:"🗿",hp:3900,ataque:310,defesa:280,velocidade:12},
            {nome:"Múmia Real",emoji:"🧟",hp:3300,ataque:350,defesa:205,velocidade:20},
            {nome:"Serpente do Templo",emoji:"🐍",hp:2900,ataque:370,defesa:190,velocidade:32}
        ],
        elite:{nome:"Colosso das Ruínas",emoji:"🗿",hp:8000,ataque:560,defesa:390,velocidade:17},
        boss:{nome:"Colosso Ancestral",emoji:"🏛️",hp:28000,ataque:850,defesa:600,velocidade:22,habilidades:["Terremoto","Maldição das Ruínas"]}
    },
    {
        id:"dimensao_astral",
        nome:"Dimensão Astral",
        emoji:"🌌",
        nivel:65,
        desc:"Uma dimensão onde as estrelas escondem criaturas impossíveis.",
        monstros:[
            {nome:"Lince Estelar",emoji:"🐈",hp:5600,ataque:620,defesa:340,velocidade:40},
            {nome:"Ser Astral",emoji:"🐉",hp:6500,ataque:700,defesa:370,velocidade:32},
            {nome:"Fera Nebulosa",emoji:"👾",hp:7200,ataque:675,defesa:430,velocidade:27},
            {nome:"Corvo Cósmico",emoji:"🐦",hp:5000,ataque:760,defesa:300,velocidade:45}
        ],
        elite:{nome:"Sentinela Astral",emoji:"🛡️",hp:15000,ataque:1050,defesa:760,velocidade:35},
        boss:{nome:"Arauto Astral",emoji:"✨",hp:50000,ataque:1500,defesa:1000,velocidade:42,habilidades:["Chuva Estelar","Distorção Temporal"]}
    },
    {
        id:"reino_apocalipse",
        nome:"Reino do Apocalipse",
        emoji:"☠️",
        nivel:80,
        desc:"Um reino destruído onde o fim parece estar sempre próximo.",
        monstros:[
            {nome:"Cão do Apocalipse",emoji:"🐕",hp:9500,ataque:980,defesa:520,velocidade:36},
            {nome:"Ceifador Menor",emoji:"💀",hp:10500,ataque:1080,defesa:570,velocidade:33},
            {nome:"Demônio da Ruína",emoji:"😈",hp:12000,ataque:1160,defesa:650,velocidade:30},
            {nome:"Ser do Vazio",emoji:"👹",hp:10000,ataque:1240,defesa:600,velocidade:43}
        ],
        elite:{nome:"Arauto da Ruína",emoji:"☠️",hp:26000,ataque:1750,defesa:1100,velocidade:38},
        boss:{nome:"Arauto do Fim",emoji:"☠️",hp:85000,ataque:2500,defesa:1650,velocidade:36,habilidades:["Cataclismo","Marca da Morte"]}
    },
    {
        id:"dominio_divino",
        nome:"Domínio Divino",
        emoji:"👑",
        nivel:100,
        desc:"O último território. Somente os maiores treinadores chegam aqui.",
        monstros:[
            {nome:"Leão Celestial",emoji:"🦁",hp:15000,ataque:1700,defesa:1000,velocidade:40},
            {nome:"Serafim Caído",emoji:"😇",hp:17000,ataque:1900,defesa:1100,velocidade:44},
            {nome:"Guardião Divino",emoji:"🛡️",hp:20000,ataque:1800,defesa:1450,velocidade:30},
            {nome:"Dragão Celestial",emoji:"🐉",hp:23000,ataque:2100,defesa:1300,velocidade:36}
        ],
        elite:{nome:"Arcanjo Supremo",emoji:"👼",hp:50000,ataque:2900,defesa:2100,velocidade:46},
        boss:{nome:"Executor Divino",emoji:"⚜️",hp:140000,ataque:4200,defesa:3000,velocidade:45,habilidades:["Julgamento Celestial","Ira dos Deuses"]}
    }
];

const UNLOCKS = {
    fenrir:{map:"floresta_lunar",tipo:"normal",chance:0.035},
    kitsune:{map:"floresta_lunar",tipo:"normal",chance:0.025},

    dragao_gelo:{map:"reino_glacial",tipo:"normal",chance:0.035},
    dragao_oriente:{map:"reino_glacial",tipo:"elite",chance:0.035},
    grifo_celestial:{map:"reino_glacial",tipo:"elite",chance:0.025},

    fenix:{map:"vulcao_caos",tipo:"elite",chance:0.03},

    minotauro:{map:"ruinas_antigas",tipo:"normal",chance:0.025},
    basilisco:{map:"ruinas_antigas",tipo:"elite",chance:0.025},

    kraken:{map:"abismo_oceanico",tipo:"normal",chance:0.02},
    hidra:{map:"abismo_oceanico",tipo:"elite",chance:0.018},
    serpente_eclipse:{map:"abismo_oceanico",tipo:"elite",chance:0.015},

    pegasus:{map:"dimensao_astral",tipo:"normal",chance:0.02},
    unicornio_astral:{map:"dimensao_astral",tipo:"elite",chance:0.015},
    guardiao_astral:{map:"dimensao_astral",tipo:"boss",chance:0.08},

    cerbero:{map:"reino_apocalipse",tipo:"normal",chance:0.02},
    grifo_sombrio:{map:"reino_apocalipse",tipo:"elite",chance:0.015},
    quimera:{map:"reino_apocalipse",tipo:"elite",chance:0.012},
    dragao_noite:{map:"reino_apocalipse",tipo:"boss",chance:0.06},

    leviata:{map:"dominio_divino",tipo:"boss",chance:0.045}
};

const DB = carregarBanco();
const batalhas = new Map();
const duelos = new Map();

const MAX_PARTICIPANTES = 5;

function salvar(){
    try{
        fs.writeFileSync(
            DB_FILE,
            JSON.stringify(DB,null,2)
        );
    }catch(e){
        console.error("Erro ao salvar RPG:",e);
    }
}

function jogador(id){

    if(!DB[id]){

        DB[id]={
            nivel:1,
            xp:0,
            vitorias:0,
            derrotas:0,
            exploracoes:0,
            bossesDerrotados:0,

            criaturas:{},

            equipe:[],

            petAtivo:"lobo_lunar",

            mapaAtual:"floresta_lunar",

            mapasDescobertos:{
                floresta_lunar:true
            },

            historico:[]
        };
    }

    const u=DB[id];

    u.criaturas??={};
    u.equipe??=[];
    u.mapasDescobertos??={floresta_lunar:true};

    u.mapaAtual??="floresta_lunar";

    if(!u.criaturas.lobo_lunar){

        u.criaturas.lobo_lunar={
            nivel:1,
            xp:0
        };

        if(!u.equipe.includes("lobo_lunar")){
            u.equipe.push("lobo_lunar");
        }
    }

    if(!u.petAtivo || !u.criaturas[u.petAtivo]){
        u.petAtivo=u.equipe[0]||"lobo_lunar";
    }

    return u;
}

function xpPetLimite(nivel){
    return Math.floor(90+nivel*45);
}

function xpTreinadorLimite(nivel){
    return Math.floor(180+nivel*85);
}

function ganharXpTreinador(id,quantidade){

    const u=jogador(id);

    if(u.nivel>=100){
        return false;
    }

    u.xp+=quantidade;

    let subiu=false;

    while(
        u.xp>=xpTreinadorLimite(u.nivel) &&
        u.nivel<100
    ){

        u.xp-=xpTreinadorLimite(u.nivel);

        u.nivel++;

        subiu=true;

        const mapa=mapaPorNivel(u.nivel);

        if(mapa){
            u.mapasDescobertos[mapa.id]=true;
        }
    }

    return subiu;
}

function ganharXpPet(id,pet,quantidade){

    const u=jogador(id);
    const p=u.criaturas[pet];

    if(!p){
        return false;
    }

    if(p.nivel>=100){
        return false;
    }

    p.xp+=quantidade;

    let subiu=false;

    while(
        p.xp>=xpPetLimite(p.nivel) &&
        p.nivel<100
    ){

        p.xp-=xpPetLimite(p.nivel);

        p.nivel++;

        subiu=true;
    }

    return subiu;
}

function mapaPorId(id){
    return MAPAS.find(
        m=>m.id===id
    );
}

function mapaPorNivel(nivel){

    return [...MAPAS]
        .reverse()
        .find(
            m=>nivel>=m.nivel
        )||MAPAS[0];
}

function mapaAtual(u){

    return mapaPorId(
        u.mapaAtual
    )||MAPAS[0];
}

function desbloquearMapas(u){

    for(const mapa of MAPAS){

        if(u.nivel>=mapa.nivel){

            u.mapasDescobertos[
                mapa.id
            ]=true;
        }
    }
}

function normalizar(texto){

    return String(texto||"")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^a-z0-9]/g,"");
}

function acharMapa(texto){

    const n=normalizar(texto);

    return MAPAS.find(
        mapa=>
            normalizar(mapa.id)===n ||
            normalizar(mapa.nome)===n ||
            normalizar(mapa.nome).includes(n)
    );
}

function petNome(id){

    return PETS[id]?.nome||id;
}

function petAtual(id){

    const u=jogador(id);

    return u.petAtivo||u.equipe[0];
}

function petStats(id,petId){

    const pet=PETS[petId];

    const dados=
        jogador(id).criaturas[petId]||
        {
            nivel:1,
            xp:0
        };

    const nivel=dados.nivel||1;

    /*
     * Escala mais suave no início.
     * O Pet começa forte o suficiente para
     * não deixar a batalha chata, mas não
     * fica absurdo logo no nível 1.
     */

    const multiplicador=
        0.62+
        nivel*0.018;

    return{

        maxHp:
            Math.floor(
                pet.hp*
                multiplicador
            ),

        ataque:
            Math.floor(
                pet.ataque*
                multiplicador
            ),

        defesa:
            Math.floor(
                pet.defesa*
                multiplicador
            ),

        velocidade:
            Math.floor(
                pet.velocidade*
                (
                    0.70+
                    nivel*0.012
                )
            ),

        nivel
    };
}

function barra(atual,max,tamanho=14){

    const preenchido=
        Math.max(
            0,
            Math.min(
                tamanho,
                Math.ceil(
                    (atual/max)*
                    tamanho
                )
            )
        );

    return(
        "█".repeat(preenchido)+
        "░".repeat(
            tamanho-preenchido
        )
    );
}

function dano(ataque,defesa){

    const variacao=
        Math.floor(
            ataque*
            (
                0.88+
                Math.random()*0.24
            )
        );

    return Math.max(
        3,
        variacao-
        Math.floor(
            defesa*0.42
        )
    );
}

function idUnico(prefixo){

    return(
        `${prefixo}_`+
        `${Date.now()}_`+
        `${Math.random()
            .toString(36)
            .slice(2,7)}`
    );
}

function raridadePet(id){

    return PETS[id]?.raridade||
        "Comum";
}

function tipoPermitido(registro,tipo){

    return(
        !registro.tipo||
        registro.tipo===tipo||
        registro.tipo==="normal"
    );
}

function tentarPet(id,mapa,tipoEvento){

    const u=jogador(id);

    const possiveis=[];

    for(
        const [pet,registro]
        of Object.entries(UNLOCKS)
    ){

        if(u.criaturas[pet]){
            continue;
        }

        if(registro.map!==mapa.id){
            continue;
        }

        if(
            !tipoPermitido(
                registro,
                tipoEvento
            )
        ){
            continue;
        }

        if(
            Math.random()<
            registro.chance
        ){

            possiveis.push(pet);
        }
    }

    if(!possiveis.length){
        return null;
    }

    const pet=
        possiveis[
            Math.floor(
                Math.random()*
                possiveis.length
            )
        ];

    u.criaturas[pet]={
        nivel:1,
        xp:0
    };

    u.equipe.push(pet);

    salvar();

    return pet;
}

function petUnlockEmbed(pet){

    const p=PETS[pet];

    return new EmbedBuilder()

        .setColor(0xf1c40f)

        .setTitle(
            "✨ NOVO PET DESBLOQUEADO!"
        )

        .setDescription(

            `**${p.emoji} ${p.nome}**\n\n`+

            `${p.descricao||
                "Uma nova criatura entrou para sua coleção."
            }\n\n`+

            `🔓 **Agora ele pertence a você!**\n`+

            `Use \`,pet ${pet}\` para ver os detalhes.`
        );
}

function encontroEmbed(batalha,mensagem=""){

    const inimigo=
        batalha.inimigo;

    const texto=

        `**${batalha.mapa.emoji} ${batalha.mapa.nome}**\n\n`+

        `${inimigo.emoji} **${inimigo.nome}** `+

        `${
            batalha.tipo==="boss"
            ?"👑 LENDÁRIO"
            :batalha.tipo==="elite"
            ?"⭐ ELITE"
            :""
        }\n\n`+

        `❤️ ${barra(
            batalha.hp,
            inimigo.hp
        )} `+

        `${batalha.hp.toLocaleString()}/`+
        `${inimigo.hp.toLocaleString()} HP\n`+

        `⚔️ ${inimigo.ataque} ATK  •  `+
        `🛡️ ${inimigo.defesa} DEF\n\n`+

        `${mensagem||
            "A criatura apareceu durante sua exploração!"
        }`;

    return new EmbedBuilder()

        .setColor(
            batalha.tipo==="boss"
                ?0x8e44ad
                :batalha.tipo==="elite"
                ?0xf39c12
                :0x3498db
        )

        .setTitle(
            "🌙 ENCONTRO!"
        )

        .setDescription(texto);
}

function botoesEncontro(id){

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

function batalhaEmbed(batalha,mensagem=""){

    const participantes=
        batalha.participantes
            .map(
                jogadorBatalha=>

                    `${jogadorBatalha.pet.emoji} `+
                    `**${jogadorBatalha.user.username}** — `+
                    `${jogadorBatalha.pet.nome} `+
                    `Nv.${jogadorBatalha.pet.nivel}\n`+

                    `❤️ ${barra(
                        jogadorBatalha.hp,
                        jogadorBatalha.maxHp
                    )} `+

                    `${Math.max(
                        0,
                        jogadorBatalha.hp
                    ).toLocaleString()}/`+

                    `${jogadorBatalha.maxHp.toLocaleString()}`
            )
            .join("\n\n");

    const inimigo=
        batalha.inimigo;

    return new EmbedBuilder()

        .setColor(
            batalha.tipo==="boss"
                ?0x8e44ad
                :0x3498db
        )

        .setTitle(
            `${batalha.mapa.emoji} `+
            `${batalha.mapa.nome} • `+
            `${inimigo.emoji} `+
            `${inimigo.nome}`
        )

        .setDescription(

            `${participantes}\n\n`+

            `━━━━━━━━━━━━━━━━\n\n`+

            `${inimigo.emoji} **${inimigo.nome}**\n`+

            `❤️ ${barra(
                batalha.hp,
                inimigo.hp
            )} `+

            `${Math.max(
                0,
                batalha.hp
            ).toLocaleString()}/`+

            `${inimigo.hp.toLocaleString()}\n\n`+

            `${
                mensagem||
                "⚔️ O combate está acontecendo automaticamente..."
            }`
        );
}

async function atualizarBatalha(
    batalha,
    mensagem
){

    try{

        const canal=
            await global
                .__ZUNO_RPG_CLIENT__
                .channels
                .fetch(
                    batalha.channelId
                );

        const mensagemDiscord=
            await canal
                .messages
                .fetch(
                    batalha.messageId
                );

        await mensagemDiscord.edit({

            embeds:[
                batalhaEmbed(
                    batalha,
                    mensagem
                )
            ],

            components:[]
        });

    }catch(e){

        console.error(
            "Atualização RPG:",
            e.message
        );
    }
}

function ordenarParticipantes(batalha){

    return batalha
        .participantes
        .filter(
            p=>p.hp>0
        )
        .sort(
            (a,b)=>
                b.pet.velocidade-
                a.pet.velocidade
        );
}

async function finalizarBatalha(
    batalha,
    vitoria
){

    if(batalha.finalizada){
        return;
    }

    batalha.finalizada=true;

    clearInterval(
        batalha.timer
    );

    if(vitoria){

        const xpTreinador=
            batalha.tipo==="boss"
                ?320
                :batalha.tipo==="elite"
                ?130
                :55;

        const xpPet=
            batalha.tipo==="boss"
                ?420
                :batalha.tipo==="elite"
                ?170
                :70;

        for(
            const participante
            of batalha.participantes
        ){

            ganharXpTreinador(
                participante.id,
                xpTreinador
            );

            ganharXpPet(
                participante.id,
                participante.pet.id,
                xpPet
            );

            jogador(
                participante.id
            ).vitorias++;

            if(
                batalha.tipo==="boss"
            ){

                jogador(
                    participante.id
                ).bossesDerrotados++;
            }

            const novoPet=
                tentarPet(
                    participante.id,
                    batalha.mapa,
                    batalha.tipo
                );

            if(novoPet){

                try{

                    const canal=
                        await global
                            .__ZUNO_RPG_CLIENT__
                            .channels
                            .fetch(
                                batalha.channelId
                            );

                    await canal.send({
                        content:
                            `<@${participante.id}>`,
                        embeds:[
                            petUnlockEmbed(
                                novoPet
                            )
                        ]
                    });

                }catch{}
            }
        }

        salvar();

        await atualizarBatalha(

            batalha,

            `🏆 **VITÓRIA!**\n\n`+

            `✨ Os treinadores receberam XP.\n`+

            `🐾 Os Pets receberam XP.`+

            (
                batalha.tipo==="boss"
                    ?"\n👑 O Boss foi derrotado!"
                    :""
            )
        );

    }else{

        for(
            const participante
            of batalha.participantes
        ){

            jogador(
                participante.id
            ).derrotas++;
        }

        salvar();

        await atualizarBatalha(

            batalha,

            `💀 **DERROTA!**\n\n`+

            `A criatura foi forte demais desta vez.\n`+

            `🐾 Treine seu Pet e tente novamente.`
        );
    }

    batalhas.delete(
        batalha.id
    );
}

async function turnoBatalha(batalha){

    if(batalha.finalizada){
        return;
    }

    const vivos=
        ordenarParticipantes(
            batalha
        );

    if(!vivos.length){

        return finalizarBatalha(
            batalha,
            false
        );
    }

    if(batalha.hp<=0){

        return finalizarBatalha(
            batalha,
            true
        );
    }

    batalha.turno++;

    const log=[];

    for(
        const participante
        of vivos
    ){

        if(batalha.hp<=0){
            break;
        }

        const danoCausado=
            dano(
                participante.pet.ataqueFinal,
                batalha.inimigo.defesa
            );

        batalha.hp=
            Math.max(
                0,
                batalha.hp-
                danoCausado
            );

        log.push(

            `⚔️ **${participante.pet.nome}** atacou!\n`+

            `💥 ${danoCausado} de dano.`
        );
    }

    if(batalha.hp<=0){

        return finalizarBatalha(
            batalha,
            true
        );
    }

    const alvo=
        vivos[
            Math.floor(
                Math.random()*
                vivos.length
            )
        ];

    let danoInimigo=
        dano(
            batalha.inimigo.ataque,
            alvo.pet.defesaFinal
        );

    if(
        batalha.tipo==="boss" &&
        batalha.turno%4===0
    ){

        const habilidade=
            batalha
                .inimigo
                .habilidades[
                    (
                        Math.floor(
                            batalha.turno/4
                        )-1
                    )%
                    batalha.inimigo.habilidades.length
                ];

        danoInimigo=
            Math.floor(
                danoInimigo*
                1.45
            );

        log.push(
            `👑 **${batalha.inimigo.nome}** usou **${habilidade}**!`
        );
    }

    alvo.hp=
        Math.max(
            0,
            alvo.hp-
            danoInimigo
        );

    log.push(

        `${batalha.inimigo.emoji} `+
        `contra-atacou <@${alvo.id}>!\n`+

        `💥 ${danoInimigo} de dano.`
    );

    if(
        vivos.every(
            p=>p.hp<=0
        )
    ){

        return finalizarBatalha(
            batalha,
            false
        );
    }

    await atualizarBatalha(

        batalha,

        log.join("\n\n")+

        `\n\n⏳ **Turno ${batalha.turno}**`
    );
}

function criarInimigo(
    mapa,
    tipo
){

    if(tipo==="boss"){

        return{
            ...mapa.boss
        };
    }

    if(tipo==="elite"){

        return{
            ...mapa.elite
        };
    }

    return{
        ...mapa.monstros[
            Math.floor(
                Math.random()*
                mapa.monstros.length
            )
        ]
    };
}

function sortearTipo(){

    const numero=
        Math.random();

    /*
     * Boss:
     * 1,2% de chance.
     *
     * Elite:
     * 6,3% de chance.
     *
     * Normal:
     * 92,5%.
     */

    if(numero<0.012){
        return"boss";
    }

    if(numero<0.075){
        return"elite";
    }

    return"normal";
}

function criarBatalha(
    message,
    mapa,
    tipo
){

    const id=
        idUnico(
            "batalha"
        );

    const inimigo=
        criarInimigo(
            mapa,
            tipo
        );

    return{

        id,

        channelId:
            message.channel.id,

        messageId:null,

        criador:
            message.author.id,

        mapa,

        tipo,

        inimigo,

        hp:
            inimigo.hp,

        turno:0,

        iniciada:false,

        finalizada:false,

        participantes:[],

        timer:null
    };
}

async function entrarNaBatalha(
    batalha,
    user
){

    if(batalha.iniciada){
        return false;
    }

    if(
        batalha.participantes
            .some(
                p=>p.id===user.id
            )
    ){

        return false;
    }

    if(
        batalha.participantes.length>=
        MAX_PARTICIPANTES
    ){

        return false;
    }

    const u=
        jogador(
            user.id
        );

    const petId=
        petAtual(
            user.id
        );

    const stats=
        petStats(
            user.id,
            petId
        );

    batalha.participantes.push({

        id:user.id,

        user,

        pet:{

            ...PETS[petId],

            id:petId,

            nivel:stats.nivel,

            maxHp:stats.maxHp,

            ataqueFinal:stats.ataque,

            defesaFinal:stats.defesa,

            velocidade:stats.velocidade
        },

        hp:stats.maxHp
    });

    return true;
}

async function iniciarBatalha(
    batalha
){

    if(batalha.iniciada){
        return;
    }

    batalha.iniciada=true;

    batalha.timer=
        setInterval(
            ()=>
                turnoBatalha(
                    batalha
                ).catch(
                    console.error
                ),
            4500
        );

    await turnoBatalha(
        batalha
    );
}

function perfilEmbed(id){

    const u=
        jogador(id);

    const petId=
        petAtual(id);

    const pet=
        PETS[petId];

    const stats=
        petStats(
            id,
            petId
        );

    const mapa=
        mapaAtual(u);

    const embed=
        new EmbedBuilder()

            .setColor(
                0x9b59b6
            )

            .setTitle(
                `📜 PERFIL • ${pet.emoji} ${pet.nome}`
            )

            .setDescription(

                `👤 **Treinador:** <@${id}>\n`+

                `🌟 **Nível:** ${u.nivel}/100\n`+

                `✨ **XP:** `+
                `${u.xp}/`+
                `${xpTreinadorLimite(u.nivel)}\n`+

                `🗺️ **Mapa atual:** `+
                `${mapa.emoji} ${mapa.nome}\n\n`+

                `🐾 **Pet ativo:** ${pet.nome}\n`+

                `⭐ **Nível do Pet:** `+
                `${stats.nivel}/100\n`+

                `❤️ **HP:** ${stats.maxHp}\n`+

                `⚔️ **ATK:** ${stats.ataque}\n`+

                `🛡️ **DEF:** ${stats.defesa}\n`+

                `💨 **VEL:** ${stats.velocidade}\n\n`+

                `🏆 Vitórias: ${u.vitorias}\n`+

                `💀 Derrotas: ${u.derrotas}\n`+

                `👑 Bosses derrotados: `+
                `${u.bossesDerrotados}\n`+

                `🧭 Explorações: `+
                `${u.exploracoes}`
            );

    if(
        pet.imagem &&
        !pet.imagem.includes(
            "COLE_LINK"
        )
    ){

        embed.setImage(
            pet.imagem
        );
    }

    return embed;
}

function listaPets(id){

    const u=
        jogador(id);

    let texto="";

    for(
        const [petId,pet]
        of Object.entries(PETS)
    ){

        if(
            u.criaturas[petId]
        ){

            const dados=
                u.criaturas[petId];

            texto+=

                `🔓 ${pet.emoji} **${pet.nome}** `+
                `— Nv.${dados.nivel}/100\n`;

        }else{

            texto+=

                `🔒 ${pet.emoji} **${pet.nome}** `+
                `— ${raridadePet(petId)}\n`;
        }
    }

    return new EmbedBuilder()

        .setColor(
            0x3498db
        )

        .setTitle(
            "🐾 SUA COLEÇÃO"
        )

        .setDescription(

            texto+

            `\n💡 Explore mapas, `+
            `derrote Elites e enfrente Bosses `+
            `para encontrar criaturas raras.`
        );
}

function detalhesPet(
    id,
    nome
){

    const u=
        jogador(id);

    const petId=
        Object.keys(PETS)
            .find(
                k=>
                    normalizar(k)===
                        normalizar(nome) ||

                    normalizar(
                        PETS[k].nome
                    )===
                        normalizar(nome)
            );

    if(!petId){
        return null;
    }

    const pet=
        PETS[petId];

    const dados=
        u.criaturas[petId];

    if(!dados){

        return new EmbedBuilder()

            .setColor(
                0x555555
            )

            .setTitle(
                `🔒 ${pet.nome}`
            )

            .setDescription(

                `Este Pet ainda está bloqueado.\n\n`+

                `🔒 Continue explorando `+
                `para descobrir como conquistá-lo.`
            );
    }

    const stats=
        petStats(
            id,
            petId
        );

    const embed=
        new EmbedBuilder()

            .setColor(
                pet.cor||0x3498db
            )

            .setTitle(
                `${pet.emoji} ${pet.nome}`
            )

            .setDescription(

                `⭐ Nível ${dados.nivel}/100\n`+

                `✨ XP ${dados.xp}/`+
                `${xpPetLimite(dados.nivel)}\n\n`+

                `❤️ ${stats.maxHp} HP\n`+

                `⚔️ ${stats.ataque} ATK\n`+

                `🛡️ ${stats.defesa} DEF\n`+

                `💨 ${stats.velocidade} VEL\n\n`+

                `✨ **${pet.habilidade||"Habilidade"}**\n`+

                `${pet.habilidadeDescricao||
                    pet.descricao||
                    ""
                }`
            );

    if(
        pet.imagem &&
        !pet.imagem.includes(
            "COLE_LINK"
        )
    ){

        embed.setImage(
            pet.imagem
        );
    }

    return embed;
}

function mapaEmbed(id){

    const u=
        jogador(id);

    desbloquearMapas(u);

    let texto="";

    for(
        const mapa
        of MAPAS
    ){

        const desbloqueado=
            !!u.mapasDescobertos[
                mapa.id
            ];

        texto+=

            `${desbloqueado?"🔓":"🔒"} `+
            `${mapa.emoji} **${mapa.nome}** `+
            `— Nv. ${mapa.nivel}`+

            `${
                mapa.id===u.mapaAtual
                    ?" ← **ATUAL**"
                    :""
            }\n`;
    }

    return new EmbedBuilder()

        .setColor(
            0x2ecc71
        )

        .setTitle(
            "🗺️ MAPA DO MUNDO"
        )

        .setDescription(

            `🌟 Seu nível: **${u.nivel}/100**\n\n`+

            texto+

            `\nUse **,viajar nome do mapa** `+
            `para mudar de região.`
        );
}

function ajuda(){

    return new EmbedBuilder()

        .setColor(
            0x9b59b6
        )

        .setTitle(
            "🐉 ZUNO RPG"
        )

        .setDescription(

            "`,explorar` — explorar o mapa atual\n"+

            "`,mapa` — ver mapas e desbloqueios\n"+

            "`,viajar <mapa>` — viajar para outro mapa\n"+

            "`,pets` — ver sua coleção\n"+

            "`,pet <nome>` — ver um Pet\n"+

            "`,invocar <nome>` — escolher Pet ativo\n"+

            "`,perfil` — ver seu perfil\n"+

            "`,duelo @membro` — duelo automático entre Pets\n"+

            "`,juntar` — entrar como aliado em batalha aberta\n"+

            "`,ranking` — ranking de vitórias\n\n"+

            "⚔️ As batalhas começam e continuam automaticamente.\n"+

            "🐾 Cada treinador usa apenas 1 Pet por batalha."
        );
}

function ranking(){

    const lista=
        Object.entries(DB)

            .sort(
                (a,b)=>
                    (b[1].vitorias||0)-
                    (a[1].vitorias||0)
            )

            .slice(
                0,
                10
            );

    return new EmbedBuilder()

        .setColor(
            0xf1c40f
        )

        .setTitle(
            "🏆 RANKING"
        )

        .setDescription(

            lista.length

                ?lista.map(
                    ([id,u],i)=>
                        `**${i+1}.** `+
                        `<@${id}> — `+
                        `⚔️ ${u.vitorias||0} vitórias `+
                        `• 🌟 Nv.${u.nivel||1}`
                ).join("\n")

                :"Ainda não há jogadores."
        );
}

async function iniciarDuelo(
    message,
    alvo
){

    const p1=
        petAtual(
            message.author.id
        );

    const p2=
        petAtual(
            alvo.id
        );

    const s1=
        petStats(
            message.author.id,
            p1
        );

    const s2=
        petStats(
            alvo.id,
            p2
        );

    const id=
        idUnico(
            "duelo"
        );

    const duelo={

        id,

        channelId:
            message.channel.id,

        desafiante:
            message.author.id,

        desafiado:
            alvo.id,

        p1:{
            id:p1,
            nome:petNome(p1),
            emoji:PETS[p1].emoji,
            hp:s1.maxHp,
            maxHp:s1.maxHp,
            ataque:s1.ataque,
            defesa:s1.defesa,
            vel:s1.velocidade
        },

        p2:{
            id:p2,
            nome:petNome(p2),
            emoji:PETS[p2].emoji,
            hp:s2.maxHp,
            maxHp:s2.maxHp,
            ataque:s2.ataque,
            defesa:s2.defesa,
            vel:s2.velocidade
        },

        turno:0,

        iniciado:false
    };

    duelos.set(
        id,
        duelo
    );

    const botoes=
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

        content:
            `${alvo}`,

        embeds:[

            new EmbedBuilder()

                .setColor(
                    0xe74c3c
                )

                .setTitle(
                    "⚔️ DESAFIO DE CRIATURAS"
                )

                .setDescription(

                    `**${message.author.username}** `+
                    `desafiou **${alvo.username}**!\n\n`+

                    `🐾 Os Pets lutam.\n`+

                    `👤 Os membros são apenas treinadores.`
                )
        ],

        components:[
            botoes
        ]
    });
}

function dueloEmbed(
    duelo,
    mensagem=""
){

    return new EmbedBuilder()

        .setColor(
            0x9b59b6
        )

        .setTitle(
            "⚔️ DUELO DE CRIATURAS"
        )

        .setDescription(

            `${duelo.p1.emoji} `+
            `**${duelo.p1.nome}**\n`+

            `❤️ ${barra(
                duelo.p1.hp,
                duelo.p1.maxHp
            )} `+

            `${Math.max(
                0,
                duelo.p1.hp
            )}/${duelo.p1.maxHp}\n\n`+

            `━━━━━━━━━━━━━━\n\n`+

            `${duelo.p2.emoji} `+
            `**${duelo.p2.nome}**\n`+

            `❤️ ${barra(
                duelo.p2.hp,
                duelo.p2.maxHp
            )} `+

            `${Math.max(
                0,
                duelo.p2.hp
            )}/${duelo.p2.maxHp}\n\n`+

            `${mensagem||
                "⚔️ O duelo começa automaticamente."
            }`
        );
}

async function dueloTurno(
    duelo,
    mensagemDiscord
){

    if(!duelo.iniciado){
        return;
    }

    duelo.turno++;

    const primeiro=
        duelo.p1.vel>=duelo.p2.vel
            ?duelo.p1
            :duelo.p2;

    const segundo=
        primeiro===duelo.p1
            ?duelo.p2
            :duelo.p1;

    for(
        const [atacante,defensor]
        of [
            [primeiro,segundo],
            [segundo,primeiro]
        ]
    ){

        if(
            atacante.hp<=0 ||
            defensor.hp<=0
        ){
            continue;
        }

        const danoCausado=
            dano(
                atacante.ataque,
                defensor.defesa
            );

        defensor.hp=
            Math.max(
                0,
                defensor.hp-
                danoCausado
            );

        if(
            defensor.hp<=0
        ){
            break;
        }
    }

    if(
        duelo.p1.hp<=0 ||
        duelo.p2.hp<=0
    ){

        const vencedor=
            duelo.p1.hp>0
                ?duelo.p1
                :duelo.p2;

        const vencedorId=
            duelo.p1.hp>0
                ?duelo.desafiante
                :duelo.desafiado;

        jogador(
            vencedorId
        ).vitorias++;

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

        await mensagemDiscord.edit({

            embeds:[
                dueloEmbed(
                    duelo,
                    `🏆 **${vencedor.nome} venceu o duelo!**`
                )
            ],

            components:[]
        });

        duelos.delete(
            duelo.id
        );

        return;
    }

    await mensagemDiscord.edit({

        embeds:[
            dueloEmbed(
                duelo,
                `⚔️ **Turno ${duelo.turno} concluído.**\n`+
                `A batalha continua automaticamente...`
            )
        ],

        components:[]
    });

    setTimeout(

        ()=>
            dueloTurno(
                duelo,
                mensagemDiscord
            ).catch(
                console.error
            ),

        3500
    );
}

module.exports=(client)=>{

    global.__ZUNO_RPG_CLIENT__=
        client;

    client.on(
        "messageCreate",
        async message=>{

            try{

                if(
                    message.author.bot||
                    !message.guild||
                    !message.content.startsWith(PREFIX)
                ){
                    return;
                }

                const args=
                    message.content
                        .slice(PREFIX.length)
                        .trim()
                        .split(/\s+/);

                const comando=
                    normalizar(
                        args.shift()
                    );

                if(!comando){
                    return;
                }

                if(
                    ["rpg","ajudarpg"]
                        .includes(comando)
                ){

                    return message.reply({
                        embeds:[
                            ajuda()
                        ]
                    });
                }

                if(
                    ["perfil","perfilrpg"]
                        .includes(comando)
                ){

                    return message.reply({
                        embeds:[
                            perfilEmbed(
                                message.author.id
                            )
                        ]
                    });
                }

                if(
                    ["pets","colecao"]
                        .includes(comando)
                ){

                    return message.reply({
                        embeds:[
                            listaPets(
                                message.author.id
                            )
                        ]
                    });
                }

                if(comando==="pet"){

                    return message.reply({

                        embeds:[

                            detalhesPet(
                                message.author.id,
                                args.join(" ")
                            )||

                            new EmbedBuilder()
                                .setDescription(
                                    "❌ Pet não encontrado."
                                )
                        ]
                    });
                }

                if(comando==="invocar"){

                    const u=
                        jogador(
                            message.author.id
                        );

                    const nome=
                        args.join(" ");

                    const petId=
                        Object.keys(PETS)
                            .find(
                                k=>
                                    normalizar(k)===
                                        normalizar(nome)||

                                    normalizar(
                                        PETS[k].nome
                                    )===
                                        normalizar(nome)
                            );

                    if(
                        !petId||
                        !u.criaturas[petId]
                    ){

                        return message.reply(
                            "🔒 Você ainda não possui esse Pet."
                        );
                    }

                    u.petAtivo=
                        petId;

                    salvar();

                    return message.reply(

                        `🐾 Seu Pet ativo agora é `+
                        `**${PETS[petId].emoji} `+
                        `${PETS[petId].nome}**!`
                    );
                }

                if(
                    ["mapa","mapas"]
                        .includes(comando)
                ){

                    const u=
                        jogador(
                            message.author.id
                        );

                    desbloquearMapas(u);

                    salvar();

                    return message.reply({
                        embeds:[
                            mapaEmbed(
                                message.author.id
                            )
                        ]
                    });
                }

                if(comando==="viajar"){

                    const u=
                        jogador(
                            message.author.id
                        );

                    desbloquearMapas(u);

                    const mapa=
                        acharMapa(
                            args.join(" ")
                        );

                    if(!mapa){

                        return message.reply(
                            "❌ Mapa não encontrado. Use `,mapa`."
                        );
                    }

                    if(
                        !u.mapasDescobertos[
                            mapa.id
                        ]
                    ){

                        return message.reply(

                            `🔒 Você precisa chegar ao `+
                            `**nível ${mapa.nivel}** para viajar `+
                            `para **${mapa.nome}**.`
                        );
                    }

                    if(
                        u.mapaAtual===
                        mapa.id
                    ){

                        return message.reply(

                            `📍 Você já está em `+
                            `**${mapa.nome}**.`
                        );
                    }

                    u.mapaAtual=
                        mapa.id;

                    salvar();

                    return message.reply({

                        embeds:[

                            new EmbedBuilder()

                                .setColor(
                                    0x2ecc71
                                )

                                .setTitle(
                                    "🧭 VIAGEM CONCLUÍDA"
                                )

                                .setDescription(

                                    `${mapa.emoji} `+
                                    `Você viajou para `+
                                    `**${mapa.nome}**!\n\n`+

                                    `${mapa.desc}\n\n`+

                                    `⚔️ Agora suas explorações `+
                                    `acontecerão neste mapa.`
                                )
                        ]
                    });
                }

                if(comando==="explorar"){

                    const u=
                        jogador(
                            message.author.id
                        );

                    desbloquearMapas(u);

                    const mapa=
                        mapaAtual(u);

                    u.exploracoes++;

                    salvar();

                    const tipo=
                        sortearTipo();

                    const batalha=
                        criarBatalha(
                            message,
                            mapa,
                            tipo
                        );

                    await entrarNaBatalha(
                        batalha,
                        message.author
                    );

                    batalhas.set(
                        batalha.id,
                        batalha
                    );

                    let texto;

                    if(
                        tipo==="boss"
                    ){

                        texto=
                            "👑 **UM ENCONTRO LENDÁRIO!**\n"+
                            "Este tipo de encontro é extremamente raro.";

                    }else if(
                        tipo==="elite"
                    ){

                        texto=
                            "⭐ **Uma criatura Elite apareceu!**";

                    }else{

                        texto=
                            "🌲 A criatura selvagem surgiu durante sua exploração.";
                    }

                    const resposta=
                        await message.reply({

                            embeds:[
                                encontroEmbed(
                                    batalha,
                                    texto
                                )
                            ],

                            components:[
                                botoesEncontro(
                                    batalha.id
                                )
                            ]
                        });

                    batalha.messageId=
                        resposta.id;

                    return;
                }

                if(comando==="juntar"){

                    const batalha=
                        [
                            ...batalhas.values()
                        ]
                            .reverse()
                            .find(
                                b=>
                                    b.channelId===
                                        message.channel.id&&
                                    !b.iniciada&&
                                    !b.finalizada
                            );

                    if(!batalha){

                        return message.reply(
                            "❌ Não existe uma batalha aberta neste canal."
                        );
                    }

                    const entrou=
                        await entrarNaBatalha(
                            batalha,
                            message.author
                        );

                    if(!entrou){

                        return message.reply(
                            "❌ Você já está na batalha ou ela está cheia."
                        );
                    }

                    await atualizarBatalha(

                        batalha,

                        `🤝 **${message.author.username} entrou na batalha!**\n`+

                        `Use \`,juntar\` para participar enquanto houver vaga.`
                    );

                    return message.reply(
                        "🤝 Você entrou na batalha! Seu Pet ativo será usado automaticamente."
                    );
                }

                if(comando==="duelo"){

                    const alvo=
                        message.mentions.users.first();

                    if(
                        !alvo||
                        alvo.bot||
                        alvo.id===
                            message.author.id
                    ){

                        return message.reply(
                            "❌ Mencione outro membro para duelar."
                        );
                    }

                    return iniciarDuelo(
                        message,
                        alvo
                    );
                }

                if(comando==="ranking"){

                    return message.reply({
                        embeds:[
                            ranking()
                        ]
                    });
                }

            }catch(e){

                console.error(
                    "RPG message:",
                    e
                );

                message.reply(
                    "❌ Ocorreu um erro no RPG. Veja o console do Render."
                ).catch(
                    ()=>{}
                );
            }
        }
    );

    client.on(
        "interactionCreate",
        async interaction=>{

            try{

                if(
                    !interaction.isButton()
                ){
                    return;
                }

                const id=
                    interaction.customId;

                if(
                    id.startsWith(
                        "rpg_iniciar_"
                    )
                ){

                    const batalha=
                        batalhas.get(
                            id.replace(
                                "rpg_iniciar_",
                                ""
                            )
                        );

                    if(!batalha){

                        return interaction.reply({

                            content:
                                "❌ Essa batalha não existe mais.",

                            ephemeral:true
                        });
                    }

                    if(
                        interaction.user.id!==
                        batalha.criador
                    ){

                        return interaction.reply({

                            content:
                                "❌ Somente quem iniciou a exploração pode começar a batalha.",

                            ephemeral:true
                        });
                    }

                    if(batalha.iniciada){

                        return interaction.reply({

                            content:
                                "⚔️ A batalha já começou!",

                            ephemeral:true
                        });
                    }

                    await interaction.update({

                        embeds:[
                            batalhaEmbed(
                                batalha,
                                "⚔️ **BATALHA INICIADA!**\n\n"+
                                "A partir de agora tudo acontece automaticamente."
                            )
                        ],

                        components:[]
                    });

                    batalha.messageId=
                        interaction.message.id;

                    return iniciarBatalha(
                        batalha
                    );
                }

                if(
                    id.startsWith(
                        "rpg_chamar_"
                    )
                ){

                    const batalha=
                        batalhas.get(
                            id.replace(
                                "rpg_chamar_",
                                ""
                            )
                        );

                    if(!batalha){

                        return interaction.reply({

                            content:
                                "❌ Essa batalha não existe mais.",

                            ephemeral:true
                        });
                    }

                    return interaction.reply({

                        content:

                            `👥 **Aliados podem entrar agora!**\n\n`+

                            `Cada pessoa deve usar **,juntar** neste canal.\n`+

                            `Vagas: **${
                                MAX_PARTICIPANTES-
                                batalha.participantes.length
                            }**`,

                        ephemeral:true
                    });
                }

                if(
                    id.startsWith(
                        "rpg_duelo_aceitar_"
                    )
                ){

                    const duelo=
                        duelos.get(
                            id.replace(
                                "rpg_duelo_aceitar_",
                                ""
                            )
                        );

                    if(!duelo){

                        return interaction.reply({

                            content:
                                "❌ Esse duelo expirou.",

                            ephemeral:true
                        });
                    }

                    if(
                        interaction.user.id!==
                        duelo.desafiado
                    ){

                        return interaction.reply({

                            content:
                                "❌ Esse desafio não é seu.",

                            ephemeral:true
                        });
                    }

                    duelo.iniciado=true;

                    await interaction.update({

                        embeds:[
                            dueloEmbed(
                                duelo,
                                "⚔️ **DUELO ACEITO!**\n\n"+
                                "Os Pets vão lutar automaticamente."
                            )
                        ],

                        components:[]
                    });

                    const mensagem=
                        interaction.message;

                    return setTimeout(

                        ()=>
                            dueloTurno(
                                duelo,
                                mensagem
                            ).catch(
                                console.error
                            ),

                        1800
                    );
                }

                if(
                    id.startsWith(
                        "rpg_duelo_recusar_"
                    )
                ){

                    const duelo=
                        duelos.get(
                            id.replace(
                                "rpg_duelo_recusar_",
                                ""
                            )
                        );

                    if(!duelo){

                        return interaction.reply({

                            content:
                                "❌ Esse duelo expirou.",

                            ephemeral:true
                        });
                    }

                    if(
                        interaction.user.id!==
                        duelo.desafiado
                    ){

                        return interaction.reply({

                            content:
                                "❌ Esse desafio não é seu.",

                            ephemeral:true
                        });
                    }

                    duelos.delete(
                        duelo.id
                    );

                    return interaction.update({

                        embeds:[

                            new EmbedBuilder()

                                .setColor(
                                    0x555555
                                )

                                .setTitle(
                                    "⚔️ DUELO RECUSADO"
                                )

                                .setDescription(
                                    "❌ O desafio foi recusado."
                                )
                        ],

                        components:[]
                    });
                }

            }catch(e){

                console.error(
                    "RPG interaction:",
                    e
                );

                if(
                    !interaction.replied&&
                    !interaction.deferred
                ){

                    interaction.reply({

                        content:
                            "❌ Erro ao processar essa ação.",

                        ephemeral:true
                    }).catch(
                        ()=>{}
                    );
                }
            }
        }
    );

    console.log(
        "🐉 ZUNO RPG carregado — exploração, mapas, viagem, Pets, Elites, Bosses e duelos automáticos."
    );
};
