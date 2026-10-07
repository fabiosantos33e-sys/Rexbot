// ================================================================
// RPG BATALHAS - MUNDO ABERTO
// VERSÃO NOVA - BATALHA SOLO NARRADA POR TURNOS
// ================================================================

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");

// ================================================================
// CONFIGURAÇÕES
// ================================================================

const PREFIX = ",";
const ADM_ID = "1053803800340746261";

const MAX_LEVEL = 300;

const DATA_DIR = path.join(__dirname, "dados_rpg");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PLAYERS_FILE = path.join(DATA_DIR, "jogadores.json");

let client = null;
let inicializado = false;

// ================================================================
// BANCO DE DADOS
// ================================================================

function carregarJSON(arquivo, padrao) {
    try {
        if (!fs.existsSync(arquivo)) {
            fs.writeFileSync(
                arquivo,
                JSON.stringify(padrao, null, 2)
            );

            return padrao;
        }

        const texto = fs.readFileSync(
            arquivo,
            "utf8"
        ).trim();

        if (!texto) {
            fs.writeFileSync(
                arquivo,
                JSON.stringify(padrao, null, 2)
            );

            return padrao;
        }

        return JSON.parse(texto);

    } catch (erro) {
        console.error(
            "[RPG] Erro carregando:",
            arquivo,
            erro
        );

        return padrao;
    }
}

function salvarJSON(arquivo, dados) {
    try {
        fs.writeFileSync(
            arquivo,
            JSON.stringify(dados, null, 2)
        );
    } catch (erro) {
        console.error(
            "[RPG] Erro salvando:",
            erro
        );
    }
}

const jogadores = carregarJSON(
    PLAYERS_FILE,
    {}
);

// ================================================================
// UTILIDADES
// ================================================================

function numero(valor, padrao = 0) {
    const n = Number(valor);

    return Number.isFinite(n)
        ? n
        : padrao;
}

function aleatorio(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function chance(porcentagem) {
    return Math.random() * 100 < porcentagem;
}

function limitar(valor, min, max) {
    return Math.max(
        min,
        Math.min(max, valor)
    );
}

function formatarNumero(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR"
    );
}

function barraVida(atual, maximo, tamanho = 12) {
    maximo = Math.max(
        1,
        numero(maximo, 1)
    );

    atual = limitar(
        numero(atual),
        0,
        maximo
    );

    const quantidade = Math.round(
        (atual / maximo) * tamanho
    );

    return (
        "█".repeat(quantidade) +
        "░".repeat(tamanho - quantidade)
    );
}

function xpNecessario(nivel) {
    return Math.floor(
        100 * Math.pow(1.18, Math.max(0, nivel - 1))
    );
}

// ================================================================
// CRIAÇÃO DO JOGADOR
// ================================================================

function criarJogador(user) {
    return {
        id: user.id,
        nome: user.username,

        nivel: 1,
        xp: 0,
        xpProx: xpNecessario(1),

        moedas: 100,

        vida: 100,
        vidaMax: 100,

        ataque: 10,
        defesa: 5,
        velocidade: 5,
        sorte: 1,

        classe: "Aventureiro",

        arma: null,
        armadura: null,

        inventario: [],

        armas: [],

        missões: [],
        conquistas: [],

        mapa: "Vila Inicial",

        vitorias: 0,
        derrotas: 0,

        monstrosDerrotados: 0,

        tempoJogado: 0,

        ultimoTreino: 0,
        ultimoCacar: 0,

        criadoEm: Date.now()
    };
}

function obterJogador(user) {
    if (!jogadores[user.id]) {
        jogadores[user.id] =
            criarJogador(user);

        salvarJSON(
            PLAYERS_FILE,
            jogadores
        );
    }

    const jogador =
        jogadores[user.id];

    jogador.nome = user.username;

    corrigirJogador(jogador);

    return jogador;
}

function corrigirJogador(jogador) {
    const base = criarJogador({
        id: jogador.id || "0",
        username: jogador.nome || "Aventureiro"
    });

    for (const chave of Object.keys(base)) {
        if (jogador[chave] === undefined) {
            jogador[chave] =
                base[chave];
        }
    }

    jogador.nivel = limitar(
        numero(jogador.nivel, 1),
        1,
        MAX_LEVEL
    );

    jogador.vidaMax = Math.max(
        1,
        numero(jogador.vidaMax, 100)
    );

    jogador.vida = limitar(
        numero(jogador.vida, jogador.vidaMax),
        0,
        jogador.vidaMax
    );

    jogador.xp = Math.max(
        0,
        numero(jogador.xp)
    );

    jogador.xpProx =
        xpNecessario(jogador.nivel);

    if (!Array.isArray(jogador.inventario)) {
        jogador.inventario = [];
    }

    if (!Array.isArray(jogador.armas)) {
        jogador.armas = [];
    }

    if (!Array.isArray(jogador.conquistas)) {
        jogador.conquistas = [];
    }

    if (!Array.isArray(jogador.missões)) {
        jogador.missões = [];
    }
}

// ================================================================
// SALVAR
// ================================================================

function salvarJogador(jogador) {
    jogadores[jogador.id] = jogador;

    salvarJSON(
        PLAYERS_FILE,
        jogadores
    );
}

// ================================================================
// EQUIPAMENTOS
// ================================================================

const ARMAS = [
    {
        id: "espada_ferro",
        nome: "Espada de Ferro",
        ataque: 8,
        raridade: "Comum"
    },

    {
        id: "espada_aco",
        nome: "Espada de Aço",
        ataque: 18,
        raridade: "Incomum"
    },

    {
        id: "lamina_sombria",
        nome: "Lâmina Sombria",
        ataque: 35,
        raridade: "Rara"
    },

    {
        id: "espada_dragao",
        nome: "Espada do Dragão",
        ataque: 60,
        raridade: "Lendária"
    }
];

const ARMADURAS = [
    {
        id: "couro",
        nome: "Armadura de Couro",
        defesa: 5
    },

    {
        id: "ferro",
        nome: "Armadura de Ferro",
        defesa: 12
    },

    {
        id: "aco",
        nome: "Armadura de Aço",
        defesa: 25
    }
];

function ataqueTotal(jogador) {
    return numero(jogador.ataque) +
        numero(
            jogador.arma?.ataque
        );
}

function defesaTotal(jogador) {
    return numero(jogador.defesa) +
        numero(
            jogador.armadura?.defesa
        );
}

// ================================================================
// MONSTROS
// ================================================================

const MONSTROS = [
    {
        nome: "Slime Sombrio",
        nivelMin: 1,
        vida: 70,
        ataque: 8,
        defesa: 2,
        xp: 35,
        moedas: 15
    },

    {
        nome: "Goblin Guerreiro",
        nivelMin: 3,
        vida: 110,
        ataque: 13,
        defesa: 5,
        xp: 55,
        moedas: 25
    },

    {
        nome: "Lobo Selvagem",
        nivelMin: 5,
        vida: 150,
        ataque: 18,
        defesa: 7,
        xp: 80,
        moedas: 35
    },

    {
        nome: "Orc Brutamontes",
        nivelMin: 10,
        vida: 250,
        ataque: 28,
        defesa: 12,
        xp: 130,
        moedas: 60
    },

    {
        nome: "Cavaleiro Amaldiçoado",
        nivelMin: 20,
        vida: 420,
        ataque: 42,
        defesa: 20,
        xp: 220,
        moedas: 100
    },

    {
        nome: "Dragão Jovem",
        nivelMin: 35,
        vida: 700,
        ataque: 65,
        defesa: 30,
        xp: 400,
        moedas: 180
    },

    {
        nome: "Demônio das Trevas",
        nivelMin: 50,
        vida: 1100,
        ataque: 95,
        defesa: 45,
        xp: 650,
        moedas: 300
    }
];

const CHEFES = [
    {
        nome: "Rei Goblin",
        nivelMin: 10,
        vida: 500,
        ataque: 45,
        defesa: 18,
        xp: 300,
        moedas: 200
    },

    {
        nome: "Senhor dos Lobos",
        nivelMin: 25,
        vida: 1000,
        ataque: 75,
        defesa: 30,
        xp: 650,
        moedas: 400
    },

    {
        nome: "Dragão Ancião",
        nivelMin: 50,
        vida: 2500,
        ataque: 150,
        defesa: 70,
        xp: 1600,
        moedas: 900
    }
];

function criarMonstro(jogador) {
    const nivel =
        jogador.nivel;

    const disponiveis =
        MONSTROS.filter(
            m => m.nivelMin <= nivel + 5
        );

    const escolhido =
        disponiveis[
            aleatorio(
                0,
                Math.max(
                    0,
                    disponiveis.length - 1
                )
            )
        ] || MONSTROS[0];

    const escala =
        1 +
        Math.max(
            0,
            nivel - escolhido.nivelMin
        ) * 0.08;

    return {
        ...escolhido,

        vida: Math.floor(
            escolhido.vida * escala
        ),

        vidaMax: Math.floor(
            escolhido.vida * escala
        ),

        ataque: Math.floor(
            escolhido.ataque * escala
        ),

        defesa: Math.floor(
            escolhido.defesa * escala
        ),

        xp: Math.floor(
            escolhido.xp * escala
        ),

        moedas: Math.floor(
            escolhido.moedas * escala
        )
    };
}

function criarChefe(jogador) {
    const disponiveis =
        CHEFES.filter(
            chefe =>
                chefe.nivelMin <= jogador.nivel
        );

    const base =
        disponiveis[
            Math.max(
                0,
                disponiveis.length - 1
            )
        ] || CHEFES[0];

    const escala =
        1 +
        Math.max(
            0,
            jogador.nivel - base.nivelMin
        ) * 0.12;

    const vida =
        Math.floor(
            base.vida * escala
        );

    return {
        ...base,

        vida,
        vidaMax: vida,

        ataque: Math.floor(
            base.ataque * escala
        ),

        defesa: Math.floor(
            base.defesa * escala
        ),

        xp: Math.floor(
            base.xp * escala
        ),

        moedas: Math.floor(
            base.moedas * escala
        )
    };
}

// ================================================================
// EXPERIÊNCIA E LEVEL UP
// ================================================================

function ganharXP(jogador, quantidade) {
    quantidade =
        Math.max(
            0,
            numero(quantidade)
        );

    jogador.xp += quantidade;

    const subidas = [];

    while (
        jogador.nivel < MAX_LEVEL &&
        jogador.xp >=
        xpNecessario(jogador.nivel)
    ) {
        jogador.xp -=
            xpNecessario(jogador.nivel);

        jogador.nivel++;

        jogador.xpProx =
            xpNecessario(jogador.nivel);

        jogador.vidaMax += 20;

        jogador.vida =
            jogador.vidaMax;

        jogador.ataque += 4;

        jogador.defesa += 2;

        jogador.velocidade += 1;

        if (jogador.nivel % 5 === 0) {
            jogador.sorte++;
        }

        subidas.push(
            jogador.nivel
        );
    }

    return subidas;
}

// ================================================================
// NARRAÇÃO DE BATALHA
// ================================================================

function criarBlocoBatalha({
    rodada,
    jogador,
    monstro,
    acao,
    danoJogador,
    danoMonstro,
    critico,
    esquiva
}) {
    const hpJogador =
        Math.max(
            0,
            jogador.vida
        );

    const hpMonstro =
        Math.max(
            0,
            monstro.vida
        );

    const texto = [];

    texto.push(
        "╔══════════════════════════════╗"
    );

    texto.push(
        `║ ⚔️  TURNO ${rodada}`
    );

    texto.push(
        "╠══════════════════════════════╣"
    );

    texto.push(
        `║ 👤 ${jogador.nome}`
    );

    texto.push(
        `║ ❤️ ${barraVida(
            hpJogador,
            jogador.vidaMax
        )}`
    );

    texto.push(
        `║ ${hpJogador}/${jogador.vidaMax} HP`
    );

    texto.push(
        "║"
    );

    texto.push(
        `║ 👹 ${monstro.nome}`
    );

    texto.push(
        `║ ❤️ ${barraVida(
            hpMonstro,
            monstro.vidaMax
        )}`
    );

    texto.push(
        `║ ${hpMonstro}/${monstro.vidaMax} HP`
    );

    texto.push(
        "╠══════════════════════════════╣"
    );

    texto.push(
        `║ ${acao}`
    );

    if (critico) {
        texto.push(
            "║ 💥 GOLPE CRÍTICO!"
        );
    }

    if (danoJogador > 0) {
        texto.push(
            `║ ⚔️ Você causou ${danoJogador} de dano.`
        );
    }

    if (esquiva) {
        texto.push(
            "║ 💨 Você desviou do ataque!"
        );
    } else if (danoMonstro > 0) {
        texto.push(
            `║ 🛡️ Você recebeu ${danoMonstro} de dano.`
        );
    }

    texto.push(
        "╚══════════════════════════════╝"
    );

    return texto.join("\n");
}

async function batalhaSolo(
    canal,
    jogador,
    monstro
) {
    let rodada = 0;

    const maxRodadas = 30;

    while (
        jogador.vida > 0 &&
        monstro.vida > 0 &&
        rodada < maxRodadas
    ) {
        rodada++;

        const ataque =
            ataqueTotal(jogador);

        const defesa =
            defesaTotal(jogador);

        let danoJogador =
            Math.max(
                1,
                ataque -
                Math.floor(
                    monstro.defesa * 0.5
                )
            );

        const critico =
            chance(10);

        if (critico) {
            danoJogador *= 2;
        }

        danoJogador = Math.floor(
            danoJogador
        );

        monstro.vida =
            Math.max(
                0,
                monstro.vida -
                danoJogador
            );

        let danoMonstro = 0;

        let esquiva = false;

        let acao;

        if (critico) {
            acao =
                "🔥 Seu ataque encontrou uma abertura!";
        } else {
            acao =
                "⚔️ Você avança e desfere um golpe!";
        }

        if (monstro.vida > 0) {
            danoMonstro =
                Math.max(
                    1,
                    monstro.ataque -
                    Math.floor(
                        defesa * 0.5
                    )
                );

            const chanceEsquiva =
                limitar(
                    jogador.velocidade,
                    0,
                    25
                );

            esquiva =
                chance(
                    chanceEsquiva
                );

            if (!esquiva) {
                jogador.vida =
                    Math.max(
                        0,
                        jogador.vida -
                        danoMonstro
                    );
            }
        }

        const bloco =
            criarBlocoBatalha({
                rodada,
                jogador,
                monstro,
                acao,
                danoJogador,
                danoMonstro,
                critico,
                esquiva
            });

        await canal.send(
            bloco
        );
    }

    if (monstro.vida <= 0) {
        return {
            venceu: true,
            rodadas: rodada
        };
    }

    if (jogador.vida <= 0) {
        return {
            venceu: false,
            rodadas: rodada
        };
    }

    return {
        venceu:
            jogador.vida >
            monstro.vida,

        rodadas: rodada
    };
}

// ================================================================
// RECOMPENSAS
// ================================================================

function recompensaBatalha(
    jogador,
    monstro
) {
    const xp =
        numero(monstro.xp);

    const moedas =
        numero(monstro.moedas);

    jogador.moedas +=
        moedas;

    jogador.monstrosDerrotados++;

    jogador.vitorias++;

    const niveis =
        ganharXP(
            jogador,
            xp
        );

    return {
        xp,
        moedas,
        niveis
    };
}

// ================================================================
// DROP
// ================================================================

function sortearArma(jogador) {
    const indice =
        aleatorio(
            0,
            ARMAS.length - 1
        );

    const base =
        ARMAS[indice];

    const bonus =
        Math.floor(
            jogador.nivel / 5
        );

    return {
        ...base,

        ataque:
            base.ataque +
            bonus
    };
}

function tentarDrop(jogador) {
    const chanceDrop =
        limitar(
            10 +
            jogador.sorte * 2,
            10,
            35
        );

    if (!chance(chanceDrop)) {
        return null;
    }

    const arma =
        sortearArma(jogador);

    jogador.armas.push(
        arma
    );

    return arma;
}

// ================================================================
// PERFIL
// ================================================================

async function comandoPerfil(
    msg,
    jogador
) {
    const embed =
        new EmbedBuilder()
            .setTitle(
                `⚔️ Perfil de ${jogador.nome}`
            )
            .setDescription(
                [
                    `🏆 **Nível:** ${jogador.nivel}`,
                    `⭐ **XP:** ${formatarNumero(
                        jogador.xp
                    )}/${formatarNumero(
                        xpNecessario(
                            jogador.nivel
                        )
                    )}`,
                    "",
                    `❤️ **Vida:** ${jogador.vida}/${jogador.vidaMax}`,
                    `⚔️ **Ataque:** ${ataqueTotal(jogador)}`,
                    `🛡️ **Defesa:** ${defesaTotal(jogador)}`,
                    `💨 **Velocidade:** ${jogador.velocidade}`,
                    `🍀 **Sorte:** ${jogador.sorte}`,
                    "",
                    `💰 **Moedas:** ${formatarNumero(
                        jogador.moedas
                    )}`,
                    `🗺️ **Mapa:** ${jogador.mapa}`,
                    "",
                    `⚔️ **Vitórias:** ${jogador.vitorias}`,
                    `💀 **Derrotas:** ${jogador.derrotas}`,
                    `👹 **Monstros derrotados:** ${jogador.monstrosDerrotados}`,
                    "",
                    `🗡️ **Arma:** ${
                        jogador.arma
                            ? `${jogador.arma.nome} (+${jogador.arma.ataque})`
                            : "Nenhuma"
                    }`,
                    `🛡️ **Armadura:** ${
                        jogador.armadura
                            ? `${jogador.armadura.nome} (+${jogador.armadura.defesa})`
                            : "Nenhuma"
                    }`
                ].join("\n")
            )
            .setFooter({
                text:
                    "RPG Mundo Aberto"
            });

    await msg.reply({
        embeds: [embed]
    });
}

// ================================================================
// CAÇAR
// ================================================================

async function comandoCacar(
    msg,
    jogador
) {
    const agora =
        Date.now();

    const intervalo =
        5000;

    if (
        agora -
        jogador.ultimoCacar <
        intervalo
    ) {
        const restante =
            Math.ceil(
                (
                    intervalo -
                    (
                        agora -
                        jogador.ultimoCacar
                    )
                ) / 1000
            );

        return msg.reply(
            `⏳ Espere ${restante}s antes de caçar novamente.`
        );
    }

    jogador.ultimoCacar =
        agora;

    if (jogador.vida <= 0) {
        jogador.vida =
            Math.max(
                1,
                Math.floor(
                    jogador.vidaMax * 0.25
                )
            );
    }

    salvarJogador(
        jogador
    );

    const monstro =
        criarMonstro(
            jogador
        );

    await msg.reply(
        [
            "🌲 **Você entrou na região selvagem...**",
            "",
            `👹 Um **${monstro.nome}** apareceu!`,
            `❤️ Vida: ${monstro.vida}/${monstro.vidaMax}`,
            "",
            "⚔️ **A batalha começou!**"
        ].join("\n")
    );

    const resultado =
        await batalhaSolo(
            msg.channel,
            jogador,
            monstro
        );

    if (!resultado.venceu) {
        jogador.derrotas++;

        jogador.vida =
            Math.max(
                1,
                Math.floor(
                    jogador.vidaMax * 0.20
                )
            );

        salvarJogador(
            jogador
        );

        return msg.channel.send(
            [
                "💀 **Você foi derrotado!**",
                "",
                `👹 ${monstro.nome} sobreviveu.`,
                `❤️ Você ficou com ${jogador.vida}/${jogador.vidaMax} HP.`,
                "",
                "💡 Recupere-se e tente novamente."
            ].join("\n")
        );
    }

    const recompensa =
        recompensaBatalha(
            jogador,
            monstro
        );

    const drop =
        tentarDrop(
            jogador
        );

    salvarJogador(
        jogador
    );

    const linhas = [
        "🏆 **VITÓRIA!**",
        "",
        `👹 ${monstro.nome} foi derrotado.`,
        `⚔️ Rodadas: ${resultado.rodadas}`,
        `⭐ XP: +${formatarNumero(recompensa.xp)}`,
        `💰 Moedas: +${formatarNumero(recompensa.moedas)}`
    ];

    if (recompensa.niveis.length) {
        linhas.push(
            "",
            `🎉 **LEVEL UP!**`,
            `📈 Você chegou ao nível ${jogador.nivel}!`,
            "❤️ Sua vida foi restaurada!"
        );
    }

    if (drop) {
        linhas.push(
            "",
            "🎁 **DROP!**",
            `🗡️ ${drop.nome}`,
            `⚔️ Ataque: +${drop.ataque}`,
            `✨ Raridade: ${drop.raridade}`
        );
    }

    await msg.channel.send(
        linhas.join("\n")
    );
}

// ================================================================
// TREINAMENTO
// ================================================================

async function comandoTreinar(
    msg,
    jogador,
    args
) {
    const atributo =
        String(
            args[0] || ""
        ).toLowerCase();

    const quantidade =
        limitar(
            numero(
                args[1],
                1
            ),
            1,
            10
        );

    const custo =
        quantidade * 20;

    if (
        jogador.moedas <
        custo
    ) {
        return msg.reply(
            `💰 Você precisa de ${custo} moedas.`
        );
    }

    if (
        ![
            "forca",
            "ataque",
            "vida",
            "defesa",
            "velocidade"
        ].includes(atributo)
    ) {
        return msg.reply(
            [
                "🏋️ **Treinamento**",
                "",
                "Use:",
                "`,treinar forca 5`",
                "`,treinar vida 5`",
                "`,treinar defesa 5`",
                "`,treinar velocidade 5`"
            ].join("\n")
        );
    }

    jogador.moedas -=
        custo;

    if (
        atributo === "forca" ||
        atributo === "ataque"
    ) {
        jogador.ataque +=
            quantidade;
    }

    if (
        atributo === "vida"
    ) {
        jogador.vidaMax +=
            quantidade * 5;

        jogador.vida =
            jogador.vidaMax;
    }

    if (
        atributo === "defesa"
    ) {
        jogador.defesa +=
            quantidade;
    }

    if (
        atributo === "velocidade"
    ) {
        jogador.velocidade =
            limitar(
                jogador.velocidade +
                quantidade,
                1,
                25
            );
    }

    salvarJogador(
        jogador
    );

    await msg.reply(
        [
            "🏋️ **TREINAMENTO CONCLUÍDO!**",
            "",
            `📈 Atributo: **${atributo}**`,
            `⬆️ Pontos: **+${quantidade}**`,
            `💰 Custo: **${custo} moedas**`,
            `💰 Saldo: **${jogador.moedas} moedas**`
        ].join("\n")
    );
}

// ================================================================
// VIAJAR
// ================================================================

const MAPAS = [
    {
        nome: "Vila Inicial",
        nivel: 1
    },

    {
        nome: "Floresta Sombria",
        nivel: 5
    },

    {
        nome: "Montanhas de Ferro",
        nivel: 15
    },

    {
        nome: "Vale dos Dragões",
        nivel: 30
    },

    {
        nome: "Terras Demoníacas",
        nivel: 50
    },

    {
        nome: "Reino das Sombras",
        nivel: 80
    }
];

async function comandoViajar(
    msg,
    jogador,
    args
) {
    const procura =
        args.join(" ")
            .toLowerCase();

    if (!procura) {
        const lista =
            MAPAS.map(
                mapa =>
                    `🗺️ **${mapa.nome}** — nível ${mapa.nivel}`
            );

        return msg.reply(
            [
                "🌎 **MAPAS DISPONÍVEIS**",
                "",
                ...lista,
                "",
                "Use:",
                "`,viajar Nome do Mapa`"
            ].join("\n")
        );
    }

    const mapa =
        MAPAS.find(
            item =>
                item.nome.toLowerCase() ===
                procura
        );

    if (!mapa) {
        return msg.reply(
            "❌ Esse mapa não existe."
        );
    }

    if (
        jogador.nivel <
        mapa.nivel
    ) {
        return msg.reply(
            `🔒 Você precisa estar no nível ${mapa.nivel}.`
        );
    }

    jogador.mapa =
        mapa.nome;

    salvarJogador(
        jogador
    );

    await msg.reply(
        [
            "🗺️ **VIAGEM CONCLUÍDA**",
            "",
            `📍 Você chegou em **${mapa.nome}**.`,
            "",
            "⚔️ Novas criaturas podem aparecer nesta região."
        ].join("\n")
    );
}

// ================================================================
// MASMORRAS
// ================================================================

const MASMORRAS = [
    {
        nome: "Caverna dos Goblins",
        nivel: 5,
        salas: 3,
        recompensa: 150
    },

    {
        nome: "Tumba Amaldiçoada",
        nivel: 15,
        salas: 5,
        recompensa: 400
    },

    {
        nome: "Covil do Dragão",
        nivel: 30,
        salas: 7,
        recompensa: 900
    },

    {
        nome: "Abismo Demoníaco",
        nivel: 50,
        salas: 10,
        recompensa: 2000
    }
];

async function comandoDangeou(
    msg,
    jogador,
    args
) {
    const nome =
        args.join(" ")
            .toLowerCase();

    if (!nome) {
        return msg.reply(
            [
                "🏰 **MASMORRAS**",
                "",
                ...MASMORRAS.map(
                    d =>
                        `🏰 **${d.nome}** — nível ${d.nivel} — ${d.salas} salas`
                ),
                "",
                "Use:",
                "`,dangeou Caverna dos Goblins`"
            ].join("\n")
        );
    }

    const masmorra =
        MASMORRAS.find(
            d =>
                d.nome.toLowerCase() ===
                nome
        );

    if (!masmorra) {
        return msg.reply(
            "❌ Essa masmorra não existe."
        );
    }

    if (
        jogador.nivel <
        masmorra.nivel
    ) {
        return msg.reply(
            `🔒 Você precisa do nível ${masmorra.nivel}.`
        );
    }

    if (jogador.vida <= 0) {
        jogador.vida =
            Math.max(
                1,
                Math.floor(
                    jogador.vidaMax * 0.25
                )
            );
    }

    let xpTotal = 0;
    let moedasTotal = 0;

    await msg.reply(
        [
            "🏰 **DANGEOU INICIADA**",
            "",
            `📍 ${masmorra.nome}`,
            `🚪 ${masmorra.salas} salas`,
            "",
            "⚔️ Prepare-se..."
        ].join("\n")
    );

    for (
        let sala = 1;
        sala <= masmorra.salas;
        sala++
    ) {
        if (
            jogador.vida <= 0
        ) {
            break;
        }

        let monstro;

        if (
            sala === masmorra.salas &&
            jogador.nivel >= 50
        ) {
            monstro =
                criarChefe(
                    jogador
                );
        } else {
            monstro =
                criarMonstro(
                    jogador
                );
        }

        await msg.channel.send(
            [
                `🚪 **SALA ${sala}/${masmorra.salas}**`,
                "",
                `👹 ${monstro.nome} apareceu!`
            ].join("\n")
        );

        const resultado =
            await batalhaSolo(
                msg.channel,
                jogador,
                monstro
            );

        if (!resultado.venceu) {
            jogador.derrotas++;

            jogador.vida =
                Math.max(
                    1,
                    Math.floor(
                        jogador.vidaMax * 0.20
                    )
                );

            salvarJogador(
                jogador
            );

            return msg.channel.send(
                [
                    "💀 **DANGEOU FRACASSADA**",
                    "",
                    `Você caiu na sala ${sala}.`,
                    `❤️ Vida restante: ${jogador.vida}/${jogador.vidaMax}`
                ].join("\n")
            );
        }

        const recompensa =
            recompensaBatalha(
                jogador,
                monstro
            );

        xpTotal +=
            recompensa.xp;

        moedasTotal +=
            recompensa.moedas;

        await msg.channel.send(
            [
                `✅ **SALA ${sala} CONCLUÍDA!**`,
                `⭐ +${recompensa.xp} XP`,
                `💰 +${recompensa.moedas} moedas`
            ].join("\n")
        );

        salvarJogador(
            jogador
        );
    }

    jogador.moedas +=
        masmorra.recompensa;

    const drop =
        tentarDrop(
            jogador
        );

    salvarJogador(
        jogador
    );

    const final = [
        "🏆 **DANGEOU CONCLUÍDA!**",
        "",
        `🏰 ${masmorra.nome}`,
        `🚪 Salas: ${masmorra.salas}/${masmorra.salas}`,
        "",
        `⭐ XP total: ${formatarNumero(xpTotal)}`,
        `💰 Moedas das batalhas: ${formatarNumero(moedasTotal)}`,
        `🎁 Recompensa final: ${formatarNumero(masmorra.recompensa)}`
    ];

    if (drop) {
        final.push(
            "",
            "🎁 **DROP ESPECIAL!**",
            `🗡️ ${drop.nome}`,
            `⚔️ Ataque: +${drop.ataque}`,
            `✨ ${drop.raridade}`
        );
    }

    await msg.channel.send(
        final.join("\n")
    );
}

// ================================================================
// INVENTÁRIO
// ================================================================

async function comandoInventario(
    msg,
    jogador
) {
    const linhas = [
        "🎒 **INVENTÁRIO**",
        ""
    ];

    if (
        jogador.armas.length === 0
    ) {
        linhas.push(
            "🗡️ Nenhuma arma encontrada."
        );
    } else {
        linhas.push(
            "🗡️ **ARMAS**"
        );

        jogador.armas
            .slice(0, 20)
            .forEach(
                (arma, index) => {
                    linhas.push(
                        `${index + 1}. ${arma.nome} — +${arma.ataque} ATK — ${arma.raridade}`
                    );
                }
            );
    }

    linhas.push(
        "",
        `💰 Moedas: ${formatarNumero(jogador.moedas)}`
    );

    await msg.reply(
        linhas.join("\n")
    );
}

// ================================================================
// EQUIPAR
// ================================================================

async function comandoEquipar(
    msg,
    jogador,
    args
) {
    const indice =
        numero(
            args[0],
            0
        ) - 1;

    if (
        indice < 0 ||
        indice >=
        jogador.armas.length
    ) {
        return msg.reply(
            "❌ Arma inválida. Use `,inventario`."
        );
    }

    const arma =
        jogador.armas[indice];

    jogador.arma =
        arma;

    salvarJogador(
        jogador
    );

    await msg.reply(
        [
            "⚔️ **ARMA EQUIPADA!**",
            "",
            `🗡️ ${arma.nome}`,
            `⚔️ Ataque: +${arma.ataque}`,
            `✨ ${arma.raridade}`
        ].join("\n")
    );
}

// ================================================================
// AJUDA
// ================================================================

async function comandoAjuda(
    msg
) {
    await msg.reply(
        [
            "⚔️ **RPG MUNDO ABERTO**",
            "",
            "👤 `,perfil`",
            "🌲 `,cacar`",
            "🏋️ `,treinar forca 5`",
            "🗺️ `,viajar`",
            "🏰 `,dangeou`",
            "🎒 `,inventario`",
            "⚔️ `,equipar 1`",
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "",
            "⚔️ **BATALHAS**",
            "",
            "As batalhas são solo e acontecem por turnos.",
            "Cada turno mostra a situação do jogador e do inimigo.",
            "",
            "💥 Críticos podem causar dano dobrado.",
            "💨 Velocidade aumenta sua chance de esquiva.",
            "🛡️ Defesa reduz o dano recebido.",
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "",
            "📈 Derrote monstros para ganhar XP.",
            "💰 Ganhe moedas.",
            "🎁 Encontre equipamentos.",
            "🔥 Suba de nível e fique mais forte."
        ].join("\n")
    );
}

// ================================================================
// COMANDOS
// ================================================================

const comandos = {

    perfil: comandoPerfil,

    cacar: comandoCacar,

    caçar: comandoCacar,

    treinar: comandoTreinar,

    viajar: comandoViajar,

    dangeou: comandoDangeou,

    dungeon: comandoDangeou,

    inventario: comandoInventario,

    inventário: comandoInventario,

    equipar: comandoEquipar,

    rpghelp: comandoAjuda,

    rpg: comandoAjuda,

    ajuda: comandoAjuda
};

// ================================================================
// INICIALIZAÇÃO
// ================================================================

module.exports = function iniciarRpgBatalhas(
    botClient
) {
    if (!botClient) {
        throw new Error(
            "Cliente Discord não foi fornecido."
        );
    }

    client =
        botClient;

    if (inicializado) {
        return client;
    }

    inicializado =
        true;

    client.on(
        "messageCreate",
        async msg => {
            try {
                if (
                    !msg.guild ||
                    msg.author.bot
                ) {
                    return;
                }

                if (
                    !msg.content.startsWith(
                        PREFIX
                    )
                ) {
                    return;
                }

                const conteudo =
                    msg.content
                        .slice(
                            PREFIX.length
                        )
                        .trim();

                if (!conteudo) {
                    return;
                }

                const partes =
                    conteudo.split(
                        /\s+/
                    );

                const nome =
                    partes
                        .shift()
                        .toLowerCase();

                const comando =
                    comandos[nome];

                if (!comando) {
                    return;
                }

                const jogador =
                    obterJogador(
                        msg.author
                    );

                await comando(
                    msg,
                    jogador,
                    partes
                );

                salvarJogador(
                    jogador
                );

            } catch (erro) {
                console.error(
                    "[RPG BATALHAS] ERRO:",
                    erro
                );

                try {
                    await msg.reply(
                        "❌ Ocorreu um erro no sistema do RPG."
                    );
                } catch {}
            }
        }
    );

    console.log(
        "⚔️ RPG Batalhas carregado!"
    );

    console.log(
        "🎬 Sistema de batalha narrada por turnos ativado!"
    );

    return client;
};
