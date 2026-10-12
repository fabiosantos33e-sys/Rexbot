'use strict';

/*
 * CRÔNICAS DO CAOS — SISTEMA DE CONQUISTAS
 *
 * Módulo independente.
 * Não altera index.js.
 * Não salva nem modifica automaticamente o banco.
 *
 * Inclui:
 * - Conquistas de nível
 * - Vitórias e monstros derrotados
 * - Chefes derrotados
 * - Masmorras concluídas
 * - Riqueza acumulada
 * - Recompensas únicas
 * - Histórico de conquistas
 */

const CONQUISTAS = {
    primeiro_passo: {
        id: 'primeiro_passo',
        nome: 'O Despertar',
        emoji: '🌑',
        descricao: 'Dê o primeiro passo em sua jornada.',
        categoria: 'jornada',
        requisito: 'iniciar',
        meta: 1,
        recompensa: { moedas: 50, experiencia: 25 }
    },

    nivel_5: {
        id: 'nivel_5',
        nome: 'Aprendiz da Guerra',
        emoji: '⚔️',
        descricao: 'Alcance o nível 5.',
        categoria: 'nivel',
        requisito: 'nivel',
        meta: 5,
        recompensa: { moedas: 100, experiencia: 50 }
    },

    nivel_10: {
        id: 'nivel_10',
        nome: 'Guerreiro Reconhecido',
        emoji: '🛡️',
        descricao: 'Alcance o nível 10.',
        categoria: 'nivel',
        requisito: 'nivel',
        meta: 10,
        recompensa: { moedas: 250, experiencia: 100 }
    },

    nivel_25: {
        id: 'nivel_25',
        nome: 'Lenda Emergente',
        emoji: '🔥',
        descricao: 'Alcance o nível 25.',
        categoria: 'nivel',
        requisito: 'nivel',
        meta: 25,
        recompensa: { moedas: 600, experiencia: 250 }
    },

    nivel_50: {
        id: 'nivel_50',
        nome: 'Desafiante do Caos',
        emoji: '👑',
        descricao: 'Alcance o nível 50.',
        categoria: 'nivel',
        requisito: 'nivel',
        meta: 50,
        recompensa: { moedas: 1500, experiencia: 500 }
    },

    primeira_vitoria: {
        id: 'primeira_vitoria',
        nome: 'Sangue de Aventureiro',
        emoji: '🗡️',
        descricao: 'Conquiste sua primeira vitória.',
        categoria: 'combate',
        requisito: 'vitorias',
        meta: 1,
        recompensa: { moedas: 75, experiencia: 35 }
    },

    dez_vitorias: {
        id: 'dez_vitorias',
        nome: 'Veterano de Batalha',
        emoji: '⚔️',
        descricao: 'Vença 10 batalhas.',
        categoria: 'combate',
        requisito: 'vitorias',
        meta: 10,
        recompensa: { moedas: 250, experiencia: 100 }
    },

    cinquenta_vitorias: {
        id: 'cinquenta_vitorias',
        nome: 'Lâmina Implacável',
        emoji: '💀',
        descricao: 'Vença 50 batalhas.',
        categoria: 'combate',
        requisito: 'vitorias',
        meta: 50,
        recompensa: { moedas: 750, experiencia: 300 }
    },

    cem_vitorias: {
        id: 'cem_vitorias',
        nome: 'Lenda do Campo de Batalha',
        emoji: '🏆',
        descricao: 'Vença 100 batalhas.',
        categoria: 'combate',
        requisito: 'vitorias',
        meta: 100,
        recompensa: { moedas: 2000, experiencia: 750 }
    },

    primeiro_monstro: {
        id: 'primeiro_monstro',
        nome: 'Caçador Iniciante',
        emoji: '🐺',
        descricao: 'Derrote seu primeiro monstro.',
        categoria: 'caca',
        requisito: 'monstrosDerrotados',
        meta: 1,
        recompensa: { moedas: 50, experiencia: 25 }
    },

    cem_monstros: {
        id: 'cem_monstros',
        nome: 'Exterminador',
        emoji: '☠️',
        descricao: 'Derrote 100 monstros.',
        categoria: 'caca',
        requisito: 'monstrosDerrotados',
        meta: 100,
        recompensa: { moedas: 500, experiencia: 200 }
    },

    primeiro_chefe: {
        id: 'primeiro_chefe',
        nome: 'Matador de Gigantes',
        emoji: '👹',
        descricao: 'Derrote seu primeiro chefe.',
        categoria: 'chefes',
        requisito: 'chefesDerrotados',
        meta: 1,
        recompensa: { moedas: 300, experiencia: 150 }
    },

    cinco_chefes: {
        id: 'cinco_chefes',
        nome: 'Pesadelo dos Titãs',
        emoji: '🐉',
        descricao: 'Derrote cinco chefes.',
        categoria: 'chefes',
        requisito: 'chefesDerrotados',
        meta: 5,
        recompensa: { moedas: 1000, experiencia: 400 }
    },

    primeira_dungeon: {
        id: 'primeira_dungeon',
        nome: 'Além do Portão',
        emoji: '🏰',
        descricao: 'Conclua sua primeira masmorra.',
        categoria: 'dungeons',
        requisito: 'dungeonsConcluidas',
        meta: 1,
        recompensa: { moedas: 250, experiencia: 125 }
    },

    dez_dungeons: {
        id: 'dez_dungeons',
        nome: 'Explorador das Profundezas',
        emoji: '🗝️',
        descricao: 'Conclua 10 masmorras.',
        categoria: 'dungeons',
        requisito: 'dungeonsConcluidas',
        meta: 10,
        recompensa: { moedas: 1000, experiencia: 400 }
    },

    mil_moedas: {
        id: 'mil_moedas',
        nome: 'Bolsa Recheada',
        emoji: '💰',
        descricao: 'Acumule 1.000 moedas.',
        categoria: 'riqueza',
        requisito: 'moedas',
        meta: 1000,
        recompensa: { moedas: 150, experiencia: 50 }
    },

    dez_mil_moedas: {
        id: 'dez_mil_moedas',
        nome: 'Senhor do Ouro',
        emoji: '💎',
        descricao: 'Acumule 10.000 moedas.',
        categoria: 'riqueza',
        requisito: 'moedas',
        meta: 10000,
        recompensa: { moedas: 1000, experiencia: 250 }
    }
};

const CATEGORIAS = {
    jornada: '🌌 Jornada',
    nivel: '📈 Níveis',
    combate: '⚔️ Combate',
    caca: '🐺 Caçada',
    chefes: '👹 Chefes',
    dungeons: '🏰 Masmorras',
    riqueza: '💰 Riqueza'
};

function numero(valor) {
    const n = Number(valor);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function obterEstatisticas(jogador) {
    if (!jogador || typeof jogador !== 'object') {
        return {};
    }

    return jogador.estatisticas &&
        typeof jogador.estatisticas === 'object'
        ? jogador.estatisticas
        : {};
}

function obterValor(jogador, nomes) {
    const estatisticas = obterEstatisticas(jogador);

    for (const nome of nomes) {
        if (jogador[nome] !== undefined && jogador[nome] !== null) {
            return numero(jogador[nome]);
        }

        if (
            estatisticas[nome] !== undefined &&
            estatisticas[nome] !== null
        ) {
            return numero(estatisticas[nome]);
        }
    }

    return 0;
}

function obterProgresso(jogador, requisito) {
    switch (requisito) {
        case 'iniciar':
            return 1;

        case 'nivel':
            return obterValor(jogador, ['nivel', 'level']);

        case 'vitorias':
            return obterValor(jogador, [
                'vitorias',
                'batalhasVencidas',
                'combatesVencidos'
            ]);

        case 'monstrosDerrotados':
            return obterValor(jogador, [
                'monstrosDerrotados',
                'inimigosDerrotados'
            ]);

        case 'chefesDerrotados':
            return obterValor(jogador, [
                'chefesDerrotados',
                'bossesDerrotados',
                'chefesVencidos'
            ]);

        case 'dungeonsConcluidas':
            return obterValor(jogador, [
                'dungeonsConcluidas',
                'masmorrasConcluidas',
                'dungeonsCompletadas'
            ]);

        case 'moedas':
            return obterValor(jogador, ['moedas', 'ouro', 'dinheiro']);

        default:
            return 0;
    }
}

function obterConquistasDesbloqueadas(jogador) {
    const conquistas = jogador?.conquistas;

    if (Array.isArray(conquistas)) {
        return conquistas.filter(
            (id) => typeof id === 'string'
        );
    }

    if (conquistas && typeof conquistas === 'object') {
        return Object.keys(conquistas).filter(
            (id) => conquistas[id] === true
        );
    }

    return [];
}

function verificarConquistas(jogador) {
    if (!jogador || typeof jogador !== 'object') {
        return [];
    }

    const desbloqueadas = new Set(
        obterConquistasDesbloqueadas(jogador)
    );

    const novas = [];

    for (const conquista of Object.values(CONQUISTAS)) {
        if (desbloqueadas.has(conquista.id)) {
            continue;
        }

        const progresso = obterProgresso(
            jogador,
            conquista.requisito
        );

        if (progresso >= conquista.meta) {
            novas.push({
                ...conquista,
                progresso,
                desbloqueada: true
            });
        }
    }

    return novas;
}

function registrarConquistas(jogador, conquistas) {
    if (!jogador || typeof jogador !== 'object') {
        return [];
    }

    if (!Array.isArray(jogador.conquistas)) {
        jogador.conquistas = obterConquistasDesbloqueadas(jogador);
    }

    const novas = [];
    const existentes = new Set(jogador.conquistas);

    for (const conquista of conquistas || []) {
        const id = typeof conquista === 'string'
            ? conquista
            : conquista?.id;

        if (!id || !CONQUISTAS[id] || existentes.has(id)) {
            continue;
        }

        jogador.conquistas.push(id);
        existentes.add(id);
        novas.push(CONQUISTAS[id]);
    }

    return novas;
}

function obterConquista(id) {
    const conquista = CONQUISTAS[id];

    return conquista ? { ...conquista } : null;
}

function listarConquistas(categoria = null) {
    return Object.values(CONQUISTAS)
        .filter((conquista) => {
            return !categoria || conquista.categoria === categoria;
        })
        .map((conquista) => ({ ...conquista }));
}

function obterResumo(jogador) {
    const desbloqueadas = new Set(
        obterConquistasDesbloqueadas(jogador)
    );

    const total = Object.keys(CONQUISTAS).length;
    const quantidade = Object.keys(CONQUISTAS).filter(
        (id) => desbloqueadas.has(id)
    ).length;

    return {
        total,
        desbloqueadas: quantidade,
        restantes: total - quantidade,
        percentual: total === 0
            ? 0
            : Math.floor((quantidade / total) * 100)
    };
}

function formatarConquista(conquista) {
    if (!conquista) {
        return 'Conquista não encontrada.';
    }

    const moedas = numero(conquista.recompensa?.moedas);
    const experiencia = numero(conquista.recompensa?.experiencia);

    return [
        `${conquista.emoji} **${conquista.nome}**`,
        `_${conquista.descricao}_`,
        '',
        `🏷️ Categoria: ${CATEGORIAS[conquista.categoria] || conquista.categoria}`,
        `🎁 Recompensa: ${moedas.toLocaleString('pt-BR')} moedas e ${experiencia.toLocaleString('pt-BR')} XP`
    ].join('\n');
}

function formatarNovasConquistas(conquistas) {
    if (!Array.isArray(conquistas) || conquistas.length === 0) {
        return '';
    }

    const linhas = conquistas.map((conquista) => {
        const moedas = numero(conquista.recompensa?.moedas);
        const xp = numero(conquista.recompensa?.experiencia);

        return [
            `${conquista.emoji} **${conquista.nome}**`,
            `└ ${conquista.descricao}`,
            `└ 🎁 +${moedas.toLocaleString('pt-BR')} moedas • +${xp.toLocaleString('pt-BR')} XP`
        ].join('\n');
    });

    return [
        '╔══════════════════════════╗',
        '     🏆 **NOVA CONQUISTA!**',
        '╚══════════════════════════╝',
        '',
        ...linhas,
        '',
        '📜 *Seu nome começa a ser lembrado pelas crônicas...*'
    ].join('\n');
}

function gerarPainel(jogador) {
    const resumo = obterResumo(jogador);
    const desbloqueadas = new Set(
        obterConquistasDesbloqueadas(jogador)
    );

    const linhas = Object.values(CONQUISTAS).map((conquista) => {
        const concluida = desbloqueadas.has(conquista.id);
        const progresso = Math.min(
            obterProgresso(jogador, conquista.requisito),
            conquista.meta
        );

        const atual = concluida
            ? '✅'
            : '🔒';

        return [
            `${atual} ${conquista.emoji} **${conquista.nome}**`,
            `└ ${conquista.descricao}`,
            `└ Progresso: ${progresso.toLocaleString('pt-BR')}/${conquista.meta.toLocaleString('pt-BR')}`
        ].join('\n');
    });

    return [
        '╔══════════════════════════╗',
        '     📜 **CRÔNICAS DO CAOS**',
        '        **CONQUISTAS**',
        '╚══════════════════════════╝',
        '',
        `🏆 Desbloqueadas: **${resumo.desbloqueadas}/${resumo.total}**`,
        `📊 Progresso geral: **${resumo.percentual}%**`,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        ...linhas,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '*Cada feito deixa uma marca na história.*'
    ].join('\n');
}

module.exports = {
    CONQUISTAS,
    CATEGORIAS,
    obterProgresso,
    obterConquistasDesbloqueadas,
    verificarConquistas,
    registrarConquistas,
    obterConquista,
    listarConquistas,
    obterResumo,
    formatarConquista,
    formatarNovasConquistas,
    gerarPainel
};
