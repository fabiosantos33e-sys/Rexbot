// ================================================================
// RPG BATALHAS - VERSÃO COMPLETA
// Discord.js v14 / CommonJS
// Uso no index: require("./rpg_batalhas")(client);
// ================================================================

const {
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const PREFIX = ",";
const ADM_ID = "1053803800340746261";
const MAX_LEVEL = 300;

const DATA_DIR = path.join(__dirname, "dados_rpg");
const PLAYERS_FILE = path.join(DATA_DIR, "jogadores.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const batalhas = new Map();

// ================================================================
// BANCO DE DADOS
// ================================================================

function carregarBanco() {
    try {
        if (!fs.existsSync(PLAYERS_FILE)) return {};

        return JSON.parse(
            fs.readFileSync(PLAYERS_FILE, "utf8")
        );
    } catch (erro) {
        console.log(
            "[RPG] Erro ao carregar banco:",
            erro.message
        );

        return {};
    }
}

let jogadores = carregarBanco();

function salvarBanco() {
    fs.writeFileSync(
        PLAYERS_FILE,
        JSON.stringify(jogadores, null, 2)
    );
}

function criarJogador(id, nome) {
    return {
        id,
        nome,

        nivel: 1,
        xp: 0,
        xpProx: 100,

        moedas: 100,

        vida: 100,
        vidaMax: 100,

        ataque: 10,
        defesa: 5,
        velocidade: 5,
        sorte: 1,

        classe: "Aventureiro",

        armaAtual: null,
        armaduraAtual: null,

        armas: [],
        armaduras: [],
        inventario: [],

        mapaAtual: "Vila Inicial",

        vitorias: 0,
        derrotas: 0,

        monstrosDerrotados: 0,
        chefesDerrotados: 0,
        dungeonsConcluidas: 0,

        conquistas: [],

        ultimoTreino: 0,
        ultimaCaca: 0,
        ultimaDungeon: 0,

        ultimoLogin: Date.now()
    };
}

function getJogador(id, nome) {
    if (!jogadores[id]) {
        jogadores[id] = criarJogador(id, nome);
    }

    const jogador = jogadores[id];

    jogador.nome = nome || jogador.nome || "Aventureiro";

    jogador.nivel ??= 1;
    jogador.xp ??= 0;
    jogador.xpProx ??= 100;

    jogador.moedas ??= 100;

    jogador.vidaMax ??= 100;
    jogador.vida ??= jogador.vidaMax;

    jogador.ataque ??= 10;
    jogador.defesa ??= 5;
    jogador.velocidade ??= 5;
    jogador.sorte ??= 1;

    jogador.classe ??= "Aventureiro";

    jogador.armas ??= [];
    jogador.armaduras ??= [];
    jogador.inventario ??= [];

    jogador.mapaAtual ??= "Vila Inicial";

    jogador.vitorias ??= 0;
    jogador.derrotas ??= 0;

    jogador.monstrosDerrotados ??= 0;
    jogador.chefesDerrotados ??= 0;
    jogador.dungeonsConcluidas ??= 0;

    jogador.conquistas ??= [];

    return jogador;
}

function salvarJogador(jogador) {
    jogador.ultimoLogin = Date.now();
    salvarBanco();
}

// ================================================================
// RARIDADES
// ================================================================

const RARIDADES = {

    comum: {
        nome: "Comum",
        cor: 0x95A5A6,
        multiplicador: 1
    },

    incomum: {
        nome: "Incomum",
        cor: 0x2ECC71,
        multiplicador: 1.25
    },

    raro: {
        nome: "Raro",
        cor: 0x3498DB,
        multiplicador: 1.6
    },

    epico: {
        nome: "Épico",
        cor: 0x9B59B6,
        multiplicador: 2.1
    },

    lendario: {
        nome: "Lendário",
        cor: 0xF1C40F,
        multiplicador: 2.8
    }

};

// ================================================================
// ARMAS
// ================================================================

const ARMAS = [

    {
        id: "espada_ferro",
        nome: "Espada de Ferro",
        ataque: 12,
        raridade: "comum",
        poder: "Corte Poderoso"
    },

    {
        id: "machado_guerreiro",
        nome: "Machado do Guerreiro",
        ataque: 20,
        raridade: "incomum",
        poder: "Golpe Brutal"
    },

    {
        id: "lamina_sombria",
        nome: "Lâmina Sombria",
        ataque: 34,
        raridade: "raro",
        poder: "Golpe Sombrio"
    },

    {
        id: "espada_ancestral",
        nome: "Espada Ancestral",
        ataque: 52,
        raridade: "epico",
        poder: "Corte Ancestral"
    },

    {
        id: "espada_dragao",
        nome: "Espada do Dragão",
        ataque: 80,
        raridade: "lendario",
        poder: "Chama do Dragão"
    },

    {
        id: "lamina_caos",
        nome: "Lâmina do Caos",
        ataque: 120,
        raridade: "lendario",
        poder: "Ruptura do Caos"
    }

];

// ================================================================
// ARMADURAS
// ================================================================

const ARMADURAS = [

    {
        id: "couro",
        nome: "Armadura de Couro",
        defesa: 8,
        raridade: "comum"
    },

    {
        id: "ferro",
        nome: "Armadura de Ferro",
        defesa: 18,
        raridade: "incomum"
    },

    {
        id: "sombria",
        nome: "Armadura Sombria",
        defesa: 35,
        raridade: "raro"
    },

    {
        id: "ancestral",
        nome: "Armadura Ancestral",
        defesa: 55,
        raridade: "epico"
    },

    {
        id: "dragao",
        nome: "Armadura do Dragão",
        defesa: 85,
        raridade: "lendario"
    }

];

function armaPorId(id) {
    return ARMAS.find(a => a.id === id);
}

function armaduraPorId(id) {
    return ARMADURAS.find(a => a.id === id);
}

function ataqueTotal(jogador) {
    return jogador.ataque +
        (armaPorId(jogador.armaAtual)?.ataque || 0);
}

function defesaTotal(jogador) {
    return jogador.defesa +
        (armaduraPorId(jogador.armaduraAtual)?.defesa || 0);
}

// ================================================================
// MAPAS
// ================================================================

const MAPAS = {

    "Vila Inicial": {

        nivelMin: 1,
        nivelMax: 4,

        cor: 0x3498DB,

        desc:
            "O começo da jornada. Aqui vivem monstros fracos e aventureiros iniciantes.",

        monstros: [
            "Slime Sombrio",
            "Goblin Guerreiro"
        ],

        chefe: "Rei Goblin"

    },

    "Floresta Sombria": {

        nivelMin: 5,
        nivelMax: 14,

        cor: 0x27AE60,

        desc:
            "Uma floresta silenciosa onde criaturas ficam mais agressivas durante a noite.",

        monstros: [
            "Lobo Selvagem",
            "Goblin Guerreiro",
            "Orc Brutamontes"
        ],

        chefe: "Senhor dos Lobos"

    },

    "Montanhas de Ferro": {

        nivelMin: 15,
        nivelMax: 29,

        cor: 0x7F8C8D,

        desc:
            "Montanhas cheias de cavernas, guerreiros e criaturas resistentes.",

        monstros: [
            "Orc Brutamontes",
            "Cavaleiro Amaldiçoado"
        ],

        chefe: "General de Ferro"

    },

    "Vale dos Dragões": {

        nivelMin: 30,
        nivelMax: 49,

        cor: 0xE67E22,

        desc:
            "Um vale perigoso dominado por criaturas dracônicas.",

        monstros: [
            "Cavaleiro Amaldiçoado",
            "Dragão Jovem"
        ],

        chefe: "Dragão Ancião"

    },

    "Terras Demoníacas": {

        nivelMin: 50,
        nivelMax: 79,

        cor: 0xC0392B,

        desc:
            "Terras corrompidas onde os monstros possuem poderes muito maiores.",

        monstros: [
            "Demônio das Trevas",
            "Cavaleiro Amaldiçoado"
        ],

        chefe: "Demônio Supremo"

    },

    "Reino das Sombras": {

        nivelMin: 80,
        nivelMax: 119,

        cor: 0x8E44AD,

        desc:
            "Um reino tomado pelas sombras. Apenas guerreiros experientes chegam aqui.",

        monstros: [
            "Demônio das Trevas",
            "Guardião Sombrio"
        ],

        chefe: "Rei das Sombras"

    },

    "Reino do Caos": {

        nivelMin: 120,
        nivelMax: 300,

        cor: 0x2C3E50,

        desc:
            "O território final. Os inimigos mais fortes aguardam os aventureiros.",

        monstros: [
            "Guardião Sombrio",
            "Arauto do Caos"
        ],

        chefe: "Deus do Caos"

    }

};

// ================================================================
// MONSTROS
// ================================================================

const MONSTROS = {

    "Slime Sombrio": {
        vida: 80,
        ataque: 8,
        defesa: 2,
        xp: 35,
        moedas: [8, 20]
    },

    "Goblin Guerreiro": {
        vida: 130,
        ataque: 14,
        defesa: 5,
        xp: 60,
        moedas: [15, 35]
    },

    "Lobo Selvagem": {
        vida: 190,
        ataque: 20,
        defesa: 8,
        xp: 90,
        moedas: [20, 45]
    },

    "Orc Brutamontes": {
        vida: 320,
        ataque: 31,
        defesa: 15,
        xp: 150,
        moedas: [35, 70]
    },

    "Cavaleiro Amaldiçoado": {
        vida: 550,
        ataque: 48,
        defesa: 25,
        xp: 260,
        moedas: [55, 100]
    },

    "Dragão Jovem": {
        vida: 850,
        ataque: 65,
        defesa: 35,
        xp: 420,
        moedas: [90, 160]
    },

    "Demônio das Trevas": {
        vida: 1300,
        ataque: 90,
        defesa: 50,
        xp: 700,
        moedas: [150, 260]
    },

    "Guardião Sombrio": {
        vida: 2100,
        ataque: 125,
        defesa: 70,
        xp: 1100,
        moedas: [250, 450]
    },

    "Arauto do Caos": {
        vida: 3200,
        ataque: 170,
        defesa: 95,
        xp: 1700,
        moedas: [400, 700]
    }

};

// ================================================================
// CHEFES
// ================================================================

const CHEFES = {

    "Rei Goblin": {
        vida: 550,
        ataque: 32,
        defesa: 14,
        xp: 300,
        moedas: [150, 250]
    },

    "Senhor dos Lobos": {
        vida: 900,
        ataque: 55,
        defesa: 25,
        xp: 600,
        moedas: [250, 400]
    },

    "General de Ferro": {
        vida: 1500,
        ataque: 80,
        defesa: 45,
        xp: 1000,
        moedas: [400, 700]
    },

    "Dragão Ancião": {
        vida: 3000,
        ataque: 125,
        defesa: 70,
        xp: 2200,
        moedas: [800, 1300]
    },

    "Demônio Supremo": {
        vida: 5200,
        ataque: 190,
        defesa: 105,
        xp: 4000,
        moedas: [1300, 2200]
    },

    "Rei das Sombras": {
        vida: 8000,
        ataque: 270,
        defesa: 150,
        xp: 7000,
        moedas: [2200, 3500]
    },

    "Deus do Caos": {
        vida: 15000,
        ataque: 420,
        defesa: 220,
        xp: 15000,
        moedas: [5000, 9000]
    }

};

// ================================================================
// DUNGEONS
// ================================================================

const DUNGEONS = {

    "Caverna dos Goblins": {
        nivel: 5,
        salas: 3,
        inimigos: [
            "Goblin Guerreiro",
            "Orc Brutamontes"
        ],
        premio: 250
    },

    "Tumba Amaldiçoada": {
        nivel: 20,
        salas: 4,
        inimigos: [
            "Cavaleiro Amaldiçoado",
            "Orc Brutamontes"
        ],
        premio: 600
    },

    "Covil do Dragão": {
        nivel: 35,
        salas: 5,
        inimigos: [
            "Dragão Jovem",
            "Cavaleiro Amaldiçoado"
        ],
        premio: 1300
    },

    "Abismo Demoníaco": {
        nivel: 60,
        salas: 6,
        inimigos: [
            "Demônio das Trevas",
            "Guardião Sombrio"
        ],
        premio: 3000
    },

    "Trono do Caos": {
        nivel: 120,
        salas: 7,
        inimigos: [
            "Guardião Sombrio",
            "Arauto do Caos"
        ],
        premio: 7000
    }

};

// ================================================================
// UTILIDADES
// ================================================================

function numero(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function escolher(lista) {
    return lista[
        Math.floor(Math.random() * lista.length)
    ];
}

function barra(atual, max, tamanho = 12) {

    const porcentagem =
        Math.max(
            0,
            Math.min(1, atual / max)
        );

    const cheios =
        Math.round(
            porcentagem * tamanho
        );

    return (
        "█".repeat(cheios) +
        "░".repeat(tamanho - cheios)
    );
}

function cooldown(ultimo, segundos) {

    return (
        Date.now() - ultimo <
        segundos * 1000
    );
}

function restante(ultimo, segundos) {

    return Math.ceil(
        (
            segundos * 1000 -
            (Date.now() - ultimo)
        ) / 1000
    );
}

function embedBase(
    titulo,
    descricao,
    cor = 0x5865F2
) {

    return new EmbedBuilder()
        .setColor(cor)
        .setTitle(titulo)
        .setDescription(descricao)
        .setTimestamp();

}

function mapaDoJogador(jogador) {

    return (
        MAPAS[jogador.mapaAtual] ||
        MAPAS["Vila Inicial"]
    );

}

// ================================================================
// VIDA
// ================================================================

function recuperarVidaSilenciosamente(jogador) {

    // Recupera TODA a vida automaticamente.
    // Não envia mensagem avisando sobre a recuperação.

    jogador.vida = jogador.vidaMax;

}

// ================================================================
// XP / LEVEL
// ================================================================

function xpNecessario(nivel) {

    return Math.floor(
        100 *
        Math.pow(1.18, nivel - 1)
    );

}

function adicionarXP(jogador, quantidade) {

    if (jogador.nivel >= MAX_LEVEL) {

        jogador.xp = 0;

        jogador.xpProx =
            xpNecessario(jogador.nivel);

        return 0;
    }

    let niveis = 0;

    jogador.xp += quantidade;

    jogador.xpProx =
        xpNecessario(jogador.nivel);

    while (
        jogador.xp >= jogador.xpProx &&
        jogador.nivel < MAX_LEVEL
    ) {

        jogador.xp -= jogador.xpProx;

        jogador.nivel++;

        niveis++;

        jogador.xpProx =
            xpNecessario(jogador.nivel);

        jogador.vidaMax += 20;
        jogador.vidaMax =
            Math.max(100, jogador.vidaMax);

        jogador.ataque += 4;
        jogador.defesa += 2;
        jogador.velocidade += 1;

        if (jogador.nivel % 10 === 0) {
            jogador.sorte++;
        }

    }

    return niveis;

}

// ================================================================
// DROPS
// ================================================================

function chanceDrop(jogador, tipo) {

    const roll =
        Math.random() * 100;

    // CHEFES:
    // 3% lendário
    // 15% épico
    // 27% raro
    // 25% incomum
    // 30% comum

    if (tipo === "chefe") {

        if (roll < 3)
            return "lendario";

        if (roll < 18)
            return "epico";

        if (roll < 45)
            return "raro";

        if (roll < 70)
            return "incomum";

        return "comum";

    }

    // Monstros normais:
    // drops são propositalmente difíceis.

    if (roll < 0.8)
        return "lendario";

    if (roll < 3)
        return "epico";

    if (roll < 7)
        return "raro";

    if (roll < 15)
        return "incomum";

    return null;

}

function criarArmaDrop(raridade, nivel) {

    const ordem = [
        "comum",
        "incomum",
        "raro",
        "epico",
        "lendario"
    ];

    const possiveis =
        ARMAS.filter(arma => {

            return (
                ordem.indexOf(
                    arma.raridade
                ) <=
                ordem.indexOf(raridade)
            );

        });

    return escolher(
        possiveis.length
            ? possiveis
            : [ARMAS[0]]
    );

}

function entregarDrop(jogador, tipo) {

    const raridade =
        chanceDrop(jogador, tipo);

    if (!raridade)
        return null;

    const arma =
        criarArmaDrop(
            raridade,
            jogador.nivel
        );

    jogador.armas.push(
        arma.id
    );

    return arma;

}

// ================================================================
// DANO
// ================================================================

function danoJogador(jogador) {

    const ataque =
        ataqueTotal(jogador);

    const critico =
        Math.random() <
        Math.min(
            0.25,
            0.08 +
            jogador.sorte * 0.005
        );

    const minimo =
        Math.max(
            1,
            Math.floor(
                ataque * 0.85
            )
        );

    const maximo =
        Math.max(
            2,
            Math.floor(
                ataque * 1.15
            )
        );

    const dano =
        numero(
            minimo,
            maximo
        );

    return {

        dano:
            critico
                ? dano * 2
                : dano,

        critico

    };

}

function esquivou(jogador) {

    return (
        Math.random() <
        Math.min(
            0.25,
            jogador.velocidade * 0.006
        )
    );

}

function danoMonstro(
    jogador,
    monstro
) {

    const bruto =
        numero(
            Math.max(
                1,
                Math.floor(
                    monstro.ataque *
                    0.75
                )
            ),

            Math.max(
                2,
                Math.floor(
                    monstro.ataque *
                    1.15
                )
            )
        );

    return Math.max(
        1,
        bruto -
        Math.floor(
            defesaTotal(jogador) *
            0.45
        )
    );

}

// ================================================================
// ESCALA DOS INIMIGOS
// ================================================================

function monstroEscalado(
    nome,
    nivelJogador,
    chefe = false
) {

    const base =
        chefe
            ? CHEFES[nome]
            : MONSTROS[nome];

    const fator =
        1 +
        Math.max(
            0,
            nivelJogador - 1
        ) *
        (
            chefe
                ? 0.035
                : 0.025
        );

    return {

        nome,

        vidaMax:
            Math.floor(
                base.vida * fator
            ),

        vida:
            Math.floor(
                base.vida * fator
            ),

        ataque:
            Math.floor(
                base.ataque * fator
            ),

        defesa:
            Math.floor(
                base.defesa * fator
            ),

        xp:
            Math.floor(
                base.xp * fator
            ),

        moedas: [

            Math.floor(
                base.moedas[0] *
                fator
            ),

            Math.floor(
                base.moedas[1] *
                fator
            )

        ],

        chefe

    };

}

// ================================================================
// NARRAÇÃO DOS ATAQUES
// ================================================================

function textoPoder(
    jogador,
    dano,
    critico
) {

    const arma =
        armaPorId(
            jogador.armaAtual
        );

    if (!arma) {

        if (critico) {

            return (
                `💥 **GOLPE CRÍTICO!** ` +
                `Você encontrou uma abertura ` +
                `e acertou **${dano}** de dano!`
            );

        }

        return (
            `⚔️ Você avançou contra o inimigo ` +
            `e causou **${dano}** de dano!`
        );

    }

    const frases = {

        "Corte Poderoso":
            `⚔️ Você ergueu a **${arma.nome}** e usou **${arma.poder}**! ` +
            `O golpe acertou em cheio e causou **${dano}** de dano.`,

        "Golpe Brutal":
            `🪓 Você girou o **${arma.nome}** com força e executou **${arma.poder}**! ` +
            `Dano causado: **${dano}**.`,

        "Golpe Sombrio":
            `🌑 A **${arma.nome}** ficou envolta em sombras. ` +
            `Você lançou **${arma.poder}** e causou **${dano}** de dano.`,

        "Corte Ancestral":
            `✨ Runas antigas surgiram na **${arma.nome}**. ` +
            `O **${arma.poder}** atravessou a defesa e causou **${dano}** de dano.`,

        "Chama do Dragão":
            `🔥 A **${arma.nome}** liberou uma chama intensa! ` +
            `**${arma.poder}** causou **${dano}** de dano.`,

        "Ruptura do Caos":
            `🌀 A energia do caos explodiu ao redor da **${arma.nome}**! ` +
            `**${arma.poder}** causou **${dano}** de dano.`

    };

    let texto =
        frases[arma.poder] ||
        `⚔️ Você atacou com **${arma.nome}** e causou **${dano}** de dano.`;

    if (critico) {

        texto +=
            " 💥 **CRÍTICO!**";

    }

    return texto;

}

// ================================================================
// BATALHA
// ================================================================

async function iniciarBatalha(
    canal,
    jogador,
    nomeInimigo,
    chefe = false,
    multiplicadorRecompensa = 1
) {

    if (batalhas.has(jogador.id)) {

        return canal.send({

            embeds: [

                embedBase(
                    "⚠️ Batalha em andamento",
                    "Você já está em uma batalha."
                )

            ]

        });

    }

    const inimigo =
        monstroEscalado(
            nomeInimigo,
            jogador.nivel,
            chefe
        );

    const sessao = {

        jogador,
        inimigo,
        rodada: 0,
        multiplicadorRecompensa

    };

    batalhas.set(
        jogador.id,
        sessao
    );

    const inicio =
        embedBase(

            chefe
                ? `👑 ${inimigo.nome} apareceu!`
                : `⚔️ ${inimigo.nome} apareceu!`,

            `**${jogador.nome}**, prepare-se para lutar!\\n\\n` +

            `❤️ Sua vida: **${jogador.vida}/${jogador.vidaMax}**\\n` +

            `👹 Vida do inimigo: **${inimigo.vida}/${inimigo.vidaMax}**\\n\\n` +

            (
                chefe
                    ? "🔥 **UM CHEFE ENTROU NO CAMPO DE BATALHA!**"
                    : "⚔️ **A BATALHA COMEÇOU!**"
            ),

            chefe
                ? 0xE74C3C
                : 0x5865F2

        );

    await canal.send({
        embeds: [inicio]
    });

    await turnoBatalha(
        canal,
        sessao
    );

}

// ================================================================
// TURNO
// ================================================================

async function turnoBatalha(
    canal,
    sessao
) {

    const jogador =
        sessao.jogador;

    const inimigo =
        sessao.inimigo;

    if (!batalhas.has(jogador.id))
        return;

    sessao.rodada++;

    if (sessao.rodada > 40) {

        recuperarVidaSilenciosamente(
            jogador
        );

        salvarJogador(
            jogador
        );

        batalhas.delete(
            jogador.id
        );

        return canal.send({

            embeds: [

                embedBase(
                    "⏳ Batalha encerrada",
                    "A batalha demorou demais e foi encerrada.",
                    0x95A5A6
                )

            ]

        });

    }

    // ------------------------------------------------------------
    // JOGADOR ATACA
    // ------------------------------------------------------------

    const ataque =
        danoJogador(jogador);

    inimigo.vida =
        Math.max(
            0,
            inimigo.vida -
            ataque.dano
        );

    const narracao =
        textoPoder(
            jogador,
            ataque.dano,
            ataque.critico
        );

    // ------------------------------------------------------------
    // INIMIGO DERROTADO
    // ------------------------------------------------------------

    if (inimigo.vida <= 0) {

        const moedas =
            numero(
                inimigo.moedas[0],
                inimigo.moedas[1]
            ) *
            sessao.multiplicadorRecompensa;

        const xp =
            inimigo.xp *
            sessao.multiplicadorRecompensa;

        jogador.moedas += moedas;

        const niveis =
            adicionarXP(
                jogador,
                xp
            );

        jogador.vitorias++;

        if (inimigo.chefe) {

            jogador.chefesDerrotados++;

        } else {

            jogador.monstrosDerrotados++;

        }

        const drop =
            entregarDrop(
                jogador,
                inimigo.chefe
                    ? "chefe"
                    : "normal"
            );

        // VIDA COMPLETAMENTE RESTAURADA.
        // NENHUMA MENSAGEM DE CURA É ENVIADA.

        recuperarVidaSilenciosamente(
            jogador
        );

        salvarJogador(
            jogador
        );

        batalhas.delete(
            jogador.id
        );

        const premios = [

            `💰 **${moedas}** moedas`,

            `✨ **${xp} XP**`

        ];

        if (niveis) {

            premios.push(
                `🎉 Você subiu **${niveis} nível(is)**!`
            );

        }

        if (drop) {

            premios.push(
                `🎁 Você encontrou **${drop.nome}** ` +
                `(${RARIDADES[drop.raridade].nome})!`
            );

        }

        const fim =
            embedBase(

                inimigo.chefe
                    ? `👑 ${inimigo.nome} derrotado!`
                    : `🏆 ${inimigo.nome} derrotado!`,

                `${narracao}\\n\\n` +
                premios.join("\\n"),

                inimigo.chefe
                    ? 0xF1C40F
                    : 0x2ECC71

            );

        fim.addFields(

            {
                name: "⚔️ Batalha",
                value:
                    `Rodada **${sessao.rodada}**`,
                inline: true
            },

            {
                name: "❤️ Próxima batalha",
                value:
                    "Vida restaurada automaticamente",
                inline: true
            }

        );

        return canal.send({
            embeds: [fim]
        });

    }

    // ------------------------------------------------------------
    // CONTRA-ATAQUE
    // ------------------------------------------------------------

    let contraAtaque;

    if (esquivou(jogador)) {

        contraAtaque =
            "💨 Você desviou do ataque inimigo com velocidade!";

    } else {

        const dano =
            danoMonstro(
                jogador,
                inimigo
            );

        jogador.vida =
            Math.max(
                0,
                jogador.vida -
                dano
            );

        contraAtaque =
            `👹 **${inimigo.nome}** contra-atacou e causou **${dano}** de dano.`;

    }

    const estado =
        embedBase(

            `⚔️ Rodada ${sessao.rodada} — ${inimigo.nome}`,

            `${narracao}\\n\\n` +

            `${contraAtaque}\\n\\n` +

            `❤️ **Você:** ` +
            `${barra(
                jogador.vida,
                jogador.vidaMax
            )} ` +
            `${jogador.vida}/${jogador.vidaMax}\\n` +

            `👹 **Inimigo:** ` +
            `${barra(
                inimigo.vida,
                inimigo.vidaMax
            )} ` +
            `${inimigo.vida}/${inimigo.vidaMax}`,

            0x5865F2

        );

    estado.setFooter({
        text: "A batalha continua..."
    });

    // ------------------------------------------------------------
    // JOGADOR DERROTADO
    // ------------------------------------------------------------

    if (jogador.vida <= 0) {

        const xp =
            Math.max(
                5,
                Math.floor(
                    jogador.xpProx *
                    0.03
                )
            );

        adicionarXP(
            jogador,
            xp
        );

        jogador.derrotas++;

        // RESTAURA TODA A VIDA SILENCIOSAMENTE.

        recuperarVidaSilenciosamente(
            jogador
        );

        salvarJogador(
            jogador
        );

        batalhas.delete(
            jogador.id
        );

        estado.setColor(
            0xE74C3C
        );

        estado.setTitle(
            "💀 Você foi derrotado"
        );

        estado.setDescription(

            `${narracao}\\n\\n` +

            `👹 **${inimigo.nome}** venceu esta batalha.\\n` +

            `✨ Você recebeu **${xp} XP** pela experiência da luta.`

        );

        return canal.send({
            embeds: [estado]
        });

    }

    await canal.send({
        embeds: [estado]
    });

    setTimeout(
        () => {

            turnoBatalha(
                canal,
                sessao
            ).catch(() => {});

        },
        1300
    );

}

// ================================================================
// PERFIL
// ================================================================

function embedPerfil(
    msg,
    jogador
) {

    const arma =
        armaPorId(
            jogador.armaAtual
        );

    const armadura =
        armaduraPorId(
            jogador.armaduraAtual
        );

    const mapa =
        mapaDoJogador(
            jogador
        );

    return new EmbedBuilder()

        .setColor(
            mapa.cor
        )

        .setAuthor({

            name:
                `Perfil de ${msg.author.username}`,

            iconURL:
                msg.author.displayAvatarURL({
                    size: 256
                })

        })

        .setTitle(
            `🧙 ${jogador.nome}`
        )

        // FOTO DO DISCORD
        .setThumbnail(
            msg.author.displayAvatarURL({
                size: 512
            })
        )

        .setDescription(

            `**${jogador.classe}** • ` +
            `Nível **${jogador.nivel}/${MAX_LEVEL}**\\n` +

            `${barra(
                jogador.xp,
                jogador.xpProx,
                16
            )} ` +

            `**${jogador.xp}/${jogador.xpProx} XP**`

        )

        .addFields(

            {
                name: "❤️ Vida",
                value:
                    `${jogador.vida}/${jogador.vidaMax}`,
                inline: true
            },

            {
                name: "⚔️ Ataque",
                value:
                    `${ataqueTotal(jogador)}`,
                inline: true
            },

            {
                name: "🛡️ Defesa",
                value:
                    `${defesaTotal(jogador)}`,
                inline: true
            },

            {
                name: "💨 Velocidade",
                value:
                    `${jogador.velocidade}`,
                inline: true
            },

            {
                name: "🍀 Sorte",
                value:
                    `${jogador.sorte}`,
                inline: true
            },

            {
                name: "💰 Moedas",
                value:
                    `${jogador.moedas}`,
                inline: true
            },

            {
                name: "🗺️ Mapa",
                value:
                    jogador.mapaAtual,
                inline: true
            },

            {
                name: "⚔️ Arma",
                value:
                    arma
                        ? `${arma.nome} • ${RARIDADES[arma.raridade].nome}`
                        : "Nenhuma",
                inline: true
            },

            {
                name: "🛡️ Armadura",
                value:
                    armadura
                        ? `${armadura.nome} • ${RARIDADES[armadura.raridade].nome}`
                        : "Nenhuma",
                inline: true
            },

            {
                name: "🏆 Vitórias",
                value:
                    `${jogador.vitorias}`,
                inline: true
            },

            {
                name: "💀 Derrotas",
                value:
                    `${jogador.derrotas}`,
                inline: true
            },

            {
                name: "👹 Monstros",
                value:
                    `${jogador.monstrosDerrotados}`,
                inline: true
            }

        )

        .setFooter({
            text:
                "RPG • Sua jornada continua"
        })

        .setTimestamp();

}

// ================================================================
// INVENTÁRIO
// ================================================================

function embedInventario(jogador) {

    const armas =
        [
            ...new Set(
                jogador.armas
            )
        ]

            .map(
                id => armaPorId(id)
            )

            .filter(Boolean);

    const armaduras =
        [
            ...new Set(
                jogador.armaduras
            )
        ]

            .map(
                id => armaduraPorId(id)
            )

            .filter(Boolean);

    const listaArmas =
        armas.length

            ? armas
                .map(
                    (arma, i) =>
                        `**${i + 1}.** ` +
                        `${arma.nome} • ` +
                        `${RARIDADES[arma.raridade].nome} • ` +
                        `⚔️ ${arma.ataque}`
                )
                .join("\n")

            : "Nenhuma arma obtida.";

    const listaArmaduras =
        armaduras.length

            ? armaduras
                .map(
                    (armadura, i) =>
                        `**${i + 1}.** ` +
                        `${armadura.nome} • ` +
                        `${RARIDADES[armadura.raridade].nome} • ` +
                        `🛡️ ${armadura.defesa}`
                )
                .join("\n")

            : "Nenhuma armadura obtida.";

    return embedBase(

        "🎒 Inventário",

        `💰 Moedas: **${jogador.moedas}**`,

        0x8E44AD

    ).addFields(

        {
            name: "⚔️ Armas",
            value:
                listaArmas.slice(
                    0,
                    1024
                )
        },

        {
            name: "🛡️ Armaduras",
            value:
                listaArmaduras.slice(
                    0,
                    1024
                )
        }

    );

}

// ================================================================
// MAPAS
// ================================================================

function embedMapas(jogador) {

    const lista =
        Object.entries(
            MAPAS
        )

        .map(
            ([nome, mapa]) => {

                const aberto =
                    jogador.nivel >=
                    mapa.nivelMin;

                return (

                    `${aberto ? "🟢" : "🔒"} ` +

                    `**${nome}** — ` +

                    `nível ${mapa.nivelMin}+ ` +

                    `${aberto
                        ? "• DESBLOQUEADO"
                        : "• BLOQUEADO"}`

                );

            }
        )

        .join("\n");

    return embedBase(

        "🌍 Mapas",

        lista,

        0x3498DB

    )

    .setFooter({

        text:
            "Use ,viajar Nome do Mapa"

    });

}

// ================================================================
// DUNGEONS
// ================================================================

function embedDungeons(jogador) {

    const lista =
        Object.entries(
            DUNGEONS
        )

        .map(
            ([nome, dungeon]) => {

                return (

                    `${jogador.nivel >= dungeon.nivel
                        ? "🟢"
                        : "🔒"} ` +

                    `**${nome}** — ` +

                    `nível ${dungeon.nivel}+ • ` +

                    `${dungeon.salas} salas`

                );

            }
        )

        .join("\n");

    return embedBase(
        "🏰 Dungeons",
        lista,
        0xE67E22
    )

    .setFooter({
        text:
            "Use ,dungeon Nome da Dungeon"
    });

}

// ================================================================
// AJUDA
// ================================================================

function embedAjuda() {

    return embedBase(

        "📖 Comandos do RPG",

        "` ,perfil` — mostra seu personagem\n" +

        "`,cacar` / `,caçar` — caça um monstro\n" +

        "`,chefao` — enfrenta o chefe do mapa\n" +

        "`,treinar forca 5` — aumenta ataque\n" +

        "`,treinar vida 5` — aumenta vida máxima\n" +

        "`,treinar defesa 5` — aumenta defesa\n" +

        "`,treinar velocidade 5` — aumenta velocidade\n" +

        "`,viajar` — mostra os mapas\n" +

        "`,viajar Nome do Mapa` — viaja para um mapa desbloqueado\n" +

        "`,dungeon` — mostra as dungeons\n" +

        "`,dungeon Nome` — entra em uma dungeon\n" +

        "`,inventario` — mostra seus itens\n" +

        "`,equipar 1` — equipa uma arma\n" +

        "`,status` — mostra seus atributos\n" +

        "`,rpghelp` — mostra esta ajuda",

        0x5865F2

    );

}

// ================================================================
// TREINAMENTO
// ================================================================

function treinar(
    jogador,
    atributo,
    quantidade
) {

    quantidade =
        Math.max(
            1,
            Math.min(
                50,
                Number(quantidade) || 1
            )
        );

    const custo =
        quantidade * 25;

    if (
        jogador.moedas <
        custo
    ) {

        return {
            erro:
                `Você precisa de **${custo} moedas**.`
        };

    }

    jogador.moedas -=
        custo;

    if (
        atributo === "forca" ||
        atributo === "força" ||
        atributo === "ataque"
    ) {

        jogador.ataque +=
            quantidade * 2;

    }

    else if (
        atributo === "vida" ||
        atributo === "hp"
    ) {

        jogador.vidaMax +=
            quantidade * 8;

        jogador.vida =
            jogador.vidaMax;

    }

    else if (
        atributo === "defesa"
    ) {

        jogador.defesa +=
            quantidade * 2;

    }

    else if (
        atributo === "velocidade"
    ) {

        jogador.velocidade +=
            quantidade;

    }

    else {

        return {
            erro:
                "Use `forca`, `vida`, `defesa` ou `velocidade`."
        };

    }

    return {
        custo,
        quantidade
    };

}

// ================================================================
// LOCALIZAR NOME
// ================================================================

function encontrarNome(
    args,
    lista
) {

    const texto =
        args.join(" ").trim();

    if (lista[texto])
        return texto;

    const minusculo =
        texto.toLowerCase();

    return Object.keys(lista)
        .find(
            nome =>
                nome.toLowerCase() ===
                minusculo
        ) || null;

}

// ================================================================
// CAÇAR
// ================================================================

async function comandoCacar(
    msg,
    jogador
) {

    if (
        batalhas.has(
            jogador.id
        )
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "⚠️ Já em batalha",
                    "Termine sua batalha atual antes de começar outra."
                )

            ]

        });

    }

    if (
        cooldown(
            jogador.ultimaCaca,
            8
        )
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "⏳ Aguarde",
                    `Você poderá caçar novamente em **${restante(
                        jogador.ultimaCaca,
                        8
                    )}s**.`,
                    0xF1C40F
                )

            ]

        });

    }

    jogador.ultimaCaca =
        Date.now();

    const mapa =
        mapaDoJogador(
            jogador
        );

    const inimigo =
        escolher(
            mapa.monstros
        );

    salvarJogador(
        jogador
    );

    return iniciarBatalha(
        msg.channel,
        jogador,
        inimigo,
        false
    );

}

// ================================================================
// CHEFE
// ================================================================

async function comandoChefao(
    msg,
    jogador
) {

    if (
        batalhas.has(
            jogador.id
        )
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "⚠️ Já em batalha",
                    "Termine sua batalha atual primeiro."
                )

            ]

        });

    }

    const mapa =
        mapaDoJogador(
            jogador
        );

    return iniciarBatalha(
        msg.channel,
        jogador,
        mapa.chefe,
        true,
        1
    );

}

// ================================================================
// DUNGEON
// ================================================================

async function comandoDungeon(
    msg,
    jogador,
    args
) {

    if (!args.length) {

        return msg.reply({

            embeds: [
                embedDungeons(
                    jogador
                )
            ]

        });

    }

    if (
        batalhas.has(
            jogador.id
        )
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "⚠️ Já em batalha",
                    "Você já está lutando."
                )

            ]

        });

    }

    if (
        cooldown(
            jogador.ultimaDungeon,
            25
        )
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "⏳ Dungeon em recarga",
                    `Aguarde **${restante(
                        jogador.ultimaDungeon,
                        25
                    )}s**.`
                )

            ]

        });

    }

    const nome =
        encontrarNome(
            args,
            DUNGEONS
        );

    if (!nome) {

        return msg.reply({

            embeds: [

                embedBase(
                    "❌ Dungeon não encontrada",
                    "Use `,dungeon` para ver as opções.",
                    0xE74C3C
                )

            ]

        });

    }

    const dungeon =
        DUNGEONS[nome];

    if (
        jogador.nivel <
        dungeon.nivel
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "🔒 Dungeon bloqueada",
                    `Você precisa do nível **${dungeon.nivel}**.\n` +
                    `Seu nível: **${jogador.nivel}**.`,
                    0xE74C3C
                )

            ]

        });

    }

    jogador.ultimaDungeon =
        Date.now();

    salvarJogador(
        jogador
    );

    const inimigo =
        escolher(
            dungeon.inimigos
        );

    return iniciarBatalha(

        msg.channel,

        jogador,

        inimigo,

        false,

        Math.max(
            1,
            Math.floor(
                dungeon.premio /
                250
            )
        )

    );

}

// ================================================================
// VIAJAR
// ================================================================

async function comandoViajar(
    msg,
    jogador,
    args
) {

    if (!args.length) {

        return msg.reply({

            embeds: [
                embedMapas(
                    jogador
                )
            ]

        });

    }

    const nome =
        encontrarNome(
            args,
            MAPAS
        );

    if (!nome) {

        return msg.reply({

            embeds: [

                embedBase(
                    "❌ Mapa não encontrado",
                    "Use `,viajar` para ver os mapas.",
                    0xE74C3C
                )

            ]

        });

    }

    const mapa =
        MAPAS[nome];

    if (
        jogador.nivel <
        mapa.nivelMin
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "🔒 Mapa bloqueado",
                    `Você precisa do nível **${mapa.nivelMin}** para entrar em **${nome}**.\n` +
                    `Seu nível: **${jogador.nivel}**.`,
                    0xE74C3C
                )

            ]

        });

    }

    jogador.mapaAtual =
        nome;

    salvarJogador(
        jogador
    );

    return msg.reply({

        embeds: [

            embedBase(

                `🌍 ${nome}`,

                `${mapa.desc}\n\n` +

                `⚔️ **Monstros:** ` +
                `${mapa.monstros.join(", ")}\n` +

                `👑 **Chefe:** ` +
                `${mapa.chefe}\n` +

                `🔓 **Nível mínimo:** ` +
                `${mapa.nivelMin}`,

                mapa.cor

            )

        ]

    });

}

// ================================================================
// TREINAR COMANDO
// ================================================================

async function comandoTreinar(
    msg,
    jogador,
    args
) {

    if (
        cooldown(
            jogador.ultimoTreino,
            5
        )
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "⏳ Treino em recarga",
                    `Aguarde **${restante(
                        jogador.ultimoTreino,
                        5
                    )}s**.`
                )

            ]

        });

    }

    const atributo =
        args[0]?.toLowerCase();

    const quantidade =
        args[1];

    const resultado =
        treinar(
            jogador,
            atributo,
            quantidade
        );

    if (resultado.erro) {

        return msg.reply({

            embeds: [

                embedBase(
                    "❌ Treino",
                    resultado.erro,
                    0xE74C3C
                )

            ]

        });

    }

    jogador.ultimoTreino =
        Date.now();

    salvarJogador(
        jogador
    );

    return msg.reply({

        embeds: [

            embedBase(

                "🏋️ Treino concluído",

                `Você treinou **${resultado.quantidade}** ponto(s) em **${atributo}**.\n` +

                `💰 Custo: **${resultado.custo} moedas**.`,

                0x2ECC71

            )

        ]

    });

}

// ================================================================
// EQUIPAR
// ================================================================

async function comandoEquipar(
    msg,
    jogador,
    args
) {

    const numeroItem =
        Number(args[0]);

    const armas =
        [
            ...new Set(
                jogador.armas
            )
        ]

        .map(
            id =>
                armaPorId(id)
        )

        .filter(Boolean);

    if (
        !numeroItem ||
        !armas[numeroItem - 1]
    ) {

        return msg.reply({

            embeds: [

                embedBase(
                    "❌ Arma inválida",
                    "Use `,inventario` para ver suas armas e depois `,equipar número`.",
                    0xE74C3C
                )

            ]

        });

    }

    const arma =
        armas[numeroItem - 1];

    jogador.armaAtual =
        arma.id;

    salvarJogador(
        jogador
    );

    return msg.reply({

        embeds: [

            embedBase(

                "⚔️ Arma equipada",

                `Você equipou **${arma.nome}**.\n` +

                `⚔️ Ataque da arma: **${arma.ataque}**\n` +

                `✨ Poder: **${arma.poder}**`,

                RARIDADES[
                    arma.raridade
                ].cor

            )

        ]

    });

}

// ================================================================
// STATUS
// ================================================================

async function comandoStatus(
    msg,
    jogador
) {

    return msg.reply({

        embeds: [

            embedBase(

                "📊 Status",

                `❤️ Vida: **${jogador.vida}/${jogador.vidaMax}**\n` +

                `⚔️ Ataque: **${ataqueTotal(jogador)}**\n` +

                `🛡️ Defesa: **${defesaTotal(jogador)}**\n` +

                `💨 Velocidade: **${jogador.velocidade}**\n` +

                `🍀 Sorte: **${jogador.sorte}**\n` +

                `🌍 Mapa: **${jogador.mapaAtual}**`,

                0x5865F2

            )

        ]

    });

}

// ================================================================
// PROCESSAMENTO DAS MENSAGENS
// ================================================================

async function processarMensagem(msg) {

    if (
        !msg.guild ||
        msg.author.bot ||
        !msg.content.startsWith(PREFIX)
    ) {
        return;
    }

    const partes =
        msg.content
            .slice(PREFIX.length)
            .trim()
            .split(/\s+/);

    const comando =
        partes
            .shift()
            ?.toLowerCase();

    const args =
        partes;

    if (!comando)
        return;

    const jogador =
        getJogador(
            msg.author.id,
            msg.author.username
        );

    salvarJogador(
        jogador
    );

    try {

        switch (comando) {

            case "rpg":
            case "rpghelp":
            case "ajuda":

                return msg.reply({

                    embeds: [
                        embedAjuda()
                    ]

                });

            case "perfil":

                return msg.reply({

                    embeds: [
                        embedPerfil(
                            msg,
                            jogador
                        )
                    ]

                });

            case "status":

                return comandoStatus(
                    msg,
                    jogador
                );

            case "inventario":
            case "inventário":

                return msg.reply({

                    embeds: [
                        embedInventario(
                            jogador
                        )
                    ]

                });

            case "cacar":
            case "caçar":

                return comandoCacar(
                    msg,
                    jogador
                );

            case "chefao":
            case "chefão":

                return comandoChefao(
                    msg,
                    jogador
                );

            case "treinar":

                return comandoTreinar(
                    msg,
                    jogador,
                    args
                );

            case "viajar":

                return comandoViajar(
                    msg,
                    jogador,
                    args
                );

            case "dungeon":
            case "dangeou":

                return comandoDungeon(
                    msg,
                    jogador,
                    args
                );

            case "equipar":

                return comandoEquipar(
                    msg,
                    jogador,
                    args
                );

            default:
                return;

        }

    } catch (erro) {

        console.error(
            "[RPG] Erro:",
            erro
        );

        if (
            !msg.replied &&
            !msg.deferred
        ) {

            await msg.reply({

                embeds: [

                    embedBase(
                        "❌ Erro no RPG",
                        "Ocorreu um erro ao executar esse comando.",
                        0xE74C3C
                    )

                ]

            }).catch(
                () => {}
            );

        }

    }

}

// ================================================================
// INICIALIZAÇÃO
// ================================================================

module.exports =
    function iniciarRpgBatalhas(
        botClient
    ) {

        if (
            !botClient ||
            !botClient.on
        ) {

            throw new Error(
                "[RPG] Cliente Discord inválido."
            );

        }

        botClient.on(
            "messageCreate",
            processarMensagem
        );

        console.log(
            "✅ Sistema RPG Batalhas carregado."
        );

        console.log(
            `⚔️ ${Object.keys(MONSTROS).length} monstros | ` +
            `👑 ${Object.keys(CHEFES).length} chefes | ` +
            `🌍 ${Object.keys(MAPAS).length} mapas`
        );

        return botClient;

    };
