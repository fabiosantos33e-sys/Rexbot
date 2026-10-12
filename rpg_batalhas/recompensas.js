// ==========================================================
// CRÔNICAS DO CAOS — SISTEMA DE RECOMPENSAS
// Experiência, moedas, itens, raridade e recompensas de chefes
// ==========================================================

const RARIDADES = {
    comum: {
        nome: "Comum",
        emoji: "⚪",
        multiplicador: 1
    },
    incomum: {
        nome: "Incomum",
        emoji: "🟢",
        multiplicador: 1.2
    },
    raro: {
        nome: "Raro",
        emoji: "🔵",
        multiplicador: 1.6
    },
    epico: {
        nome: "Épico",
        emoji: "🟣",
        multiplicador: 2.2
    },
    lendario: {
        nome: "Lendário",
        emoji: "🟠",
        multiplicador: 3
    },
    mitico: {
        nome: "Mítico",
        emoji: "🔴",
        multiplicador: 4.5
    },
    divino: {
        nome: "Divino",
        emoji: "✨",
        multiplicador: 7
    }
};

const TABELA_RECOMPENSAS = {
    facil: {
        moedasMin: 10,
        moedasMax: 35,
        xpMin: 8,
        xpMax: 20,
        chanceItem: 0.08
    },
    normal: {
        moedasMin: 25,
        moedasMax: 75,
        xpMin: 18,
        xpMax: 45,
        chanceItem: 0.15
    },
    dificil: {
        moedasMin: 60,
        moedasMax: 160,
        xpMin: 40,
        xpMax: 90,
        chanceItem: 0.25
    },
    elite: {
        moedasMin: 120,
        moedasMax: 300,
        xpMin: 80,
        xpMax: 180,
        chanceItem: 0.35
    },
    chefe: {
        moedasMin: 250,
        moedasMax: 700,
        xpMin: 180,
        xpMax: 450,
        chanceItem: 0.5
    },
    lendario: {
        moedasMin: 600,
        moedasMax: 1800,
        xpMin: 400,
        xpMax: 1000,
        chanceItem: 0.65
    }
};

const RECOMPENSAS_ESPECIAIS = {
    primeiroChefe: {
        moedas: 500,
        xp: 300,
        titulo: "Caçador de Chefes"
    },
    primeiraDungeon: {
        moedas: 750,
        xp: 500,
        titulo: "Explorador das Profundezas"
    },
    chefeFinal: {
        moedas: 5000,
        xp: 3000,
        titulo: "Desafiante do Caos"
    }
};

// ==========================================================
// FUNÇÕES AUXILIARES
// ==========================================================

function numeroAleatorio(min, max, aleatorio = Math.random) {
    return Math.floor(aleatorio() * (max - min + 1)) + min;
}

function escolher(lista, aleatorio = Math.random) {
    if (!Array.isArray(lista) || lista.length === 0) {
        return null;
    }

    const indice = Math.floor(aleatorio() * lista.length);

    return lista[
        Math.min(indice, lista.length - 1)
    ];
}

function obterRaridade(nome) {
    return RARIDADES[nome] || RARIDADES.comum;
}

// ==========================================================
// GERAR RECOMPENSA DE COMBATE
// ==========================================================

function gerarRecompensa(tipo = "normal", opcoes = {}) {
    const tabela = TABELA_RECOMPENSAS[tipo];

    if (!tabela) {
        throw new Error(
            `Tipo de recompensa inválido: ${tipo}`
        );
    }

    const aleatorio = opcoes.aleatorio || Math.random;
    const nivel = Math.max(1, Number(opcoes.nivel) || 1);
    const multiplicador = Math.max(
        0,
        Number(opcoes.multiplicador) || 1
    );

    const moedasBase = numeroAleatorio(
        tabela.moedasMin,
        tabela.moedasMax,
        aleatorio
    );

    const xpBase = numeroAleatorio(
        tabela.xpMin,
        tabela.xpMax,
        aleatorio
    );

    const moedas = Math.floor(
        moedasBase * (1 + (nivel - 1) * 0.025) * multiplicador
    );

    const experiencia = Math.floor(
        xpBase * (1 + (nivel - 1) * 0.04) * multiplicador
    );

    const encontrouItem = aleatorio() < tabela.chanceItem;

    let item = null;

    if (encontrouItem && Array.isArray(opcoes.itens)) {
        item = escolher(opcoes.itens, aleatorio);
    }

    return {
        tipo,
        moedas,
        experiencia,
        item,
        mensagem:
            `💰 Você recebeu ${moedas} moedas!\n` +
            `⭐ Você recebeu ${experiencia} de experiência!` +
            (
                item
                    ? `\n🎁 Item encontrado: ${item}!`
                    : "\n📦 Nenhum item especial foi encontrado desta vez."
            )
    };
}

// ==========================================================
// GERAR RECOMPENSA DE MASMORRA
// ==========================================================

function gerarRecompensaDungeon(dungeon, opcoes = {}) {
    if (!dungeon || !dungeon.recompensa) {
        throw new Error(
            "Masmorra inválida ou sem recompensas configuradas."
        );
    }

    const aleatorio = opcoes.aleatorio || Math.random;
    const base = dungeon.recompensa;

    const moedas = Math.max(
        0,
        Math.floor(Number(base.moedas) || 0)
    );

    const experiencia = Math.max(
        0,
        Math.floor(Number(base.experiencia) || 0)
    );

    const itens = Array.isArray(base.itens)
        ? base.itens
        : [];

    const chanceItem = Math.max(
        0,
        Math.min(1, Number(base.chanceItem) || 0)
    );

    let item = null;

    if (itens.length > 0 && aleatorio() < chanceItem) {
        item = escolher(itens, aleatorio);
    }

    return {
        moedas,
        experiencia,
        item,
        mensagem:
            `🏆 MASMORRA CONCLUÍDA: ${dungeon.nome}\n\n` +
            `💰 Moedas: +${moedas}\n` +
            `⭐ Experiência: +${experiencia}` +
            (
                item
                    ? `\n🎁 Tesouro encontrado: ${item}!`
                    : "\n📦 Nenhum item adicional encontrado."
            )
    };
}

// ==========================================================
// RECOMPENSAS ESPECIAIS
// ==========================================================

function obterRecompensaEspecial(tipo) {
    const recompensa = RECOMPENSAS_ESPECIAIS[tipo];

    if (!recompensa) {
        return null;
    }

    return {
        ...recompensa
    };
}

// ==========================================================
// PROGRESSÃO DE NÍVEL
// ==========================================================

function experienciaNecessaria(nivel) {
    nivel = Math.max(1, Math.floor(Number(nivel) || 1));

    return Math.floor(
        100 + (nivel - 1) * 45 + Math.pow(nivel - 1, 1.65) * 12
    );
}

function calcularSubidaNivel(jogador) {
    const resultado = {
        subiuNivel: false,
        niveisGanhos: 0,
        nivelAnterior: Math.max(
            1,
            Math.floor(Number(jogador.nivel) || 1)
        ),
        nivelAtual: Math.max(
            1,
            Math.floor(Number(jogador.nivel) || 1)
        ),
        mensagens: []
    };

    if (!Number.isFinite(Number(jogador.experiencia))) {
        jogador.experiencia = 0;
    }

    while (
        jogador.nivel < 400 &&
        jogador.experiencia >= experienciaNecessaria(jogador.nivel)
    ) {
        const xpNecessaria = experienciaNecessaria(jogador.nivel);

        jogador.experiencia -= xpNecessaria;
        jogador.nivel++;
        resultado.niveisGanhos++;

        resultado.mensagens.push(
            `✨ Você alcançou o nível ${jogador.nivel}!`
        );
    }

    resultado.nivelAtual = jogador.nivel;
    resultado.subiuNivel = resultado.niveisGanhos > 0;

    if (resultado.subiuNivel) {
        resultado.mensagens.unshift(
            "🌟 SUA JORNADA EVOLUI!"
        );
    }

    if (jogador.nivel >= 400) {
        jogador.nivel = 400;
        jogador.experiencia = 0;
    }

    return resultado;
}

// ==========================================================
// ADICIONAR RECOMPENSA AO JOGADOR
// ==========================================================

function entregarRecompensa(jogador, recompensa) {
    if (!jogador || !recompensa) {
        throw new Error(
            "Jogador ou recompensa inválidos."
        );
    }

    jogador.moedas = Math.max(
        0,
        Number(jogador.moedas) || 0
    );

    jogador.experiencia = Math.max(
        0,
        Number(jogador.experiencia) || 0
    );

    const moedas = Math.max(
        0,
        Math.floor(Number(recompensa.moedas) || 0)
    );

    const experiencia = Math.max(
        0,
        Math.floor(Number(recompensa.experiencia) || 0)
    );

    jogador.moedas += moedas;
    jogador.experiencia += experiencia;

    const mensagens = [
        `💰 +${moedas} moedas`,
        `⭐ +${experiencia} de experiência`
    ];

    if (recompensa.item) {
        if (!Array.isArray(jogador.inventario)) {
            jogador.inventario = [];
        }

        jogador.inventario.push(recompensa.item);

        mensagens.push(
            `🎁 Item recebido: ${recompensa.item}`
        );
    }

    const progressao = calcularSubidaNivel(jogador);

    mensagens.push(...progressao.mensagens);

    return {
        moedasRecebidas: moedas,
        experienciaRecebida: experiencia,
        itemRecebido: recompensa.item || null,
        progressao,
        mensagens
    };
}

// ==========================================================
// EXPORTAÇÕES
// ==========================================================

module.exports = {
    RARIDADES,
    TABELA_RECOMPENSAS,
    RECOMPENSAS_ESPECIAIS,
    obterRaridade,
    gerarRecompensa,
    gerarRecompensaDungeon,
    obterRecompensaEspecial,
    experienciaNecessaria,
    calcularSubidaNivel,
    entregarRecompensa
};
