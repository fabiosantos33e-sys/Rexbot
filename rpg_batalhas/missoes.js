'use strict';

/*
 * CRÔNICAS DO CAOS — SISTEMA DE MISSÕES
 *
 * Inclui:
 * - Missões diárias
 * - Caça a monstros
 * - Vitórias em batalhas
 * - Derrotar chefes
 * - Concluir masmorras
 * - Progresso automático por eventos
 * - Recompensas em moedas e experiência
 * - Resgate individual de recompensas
 *
 * Módulo independente.
 * Não altera index.js nem salva arquivos automaticamente.
 */

const MISSOES = {
    caca_iniciante: {
        id: 'caca_iniciante',
        nome: 'Primeira Caçada',
        descricao: 'Derrote 3 monstros.',
        emoji: '🐺',
        tipo: 'monstros',
        meta: 3,
        recompensa: { moedas: 100, experiencia: 50 }
    },

    caca_experiente: {
        id: 'caca_experiente',
        nome: 'Predador das Sombras',
        descricao: 'Derrote 10 monstros.',
        emoji: '🌑',
        tipo: 'monstros',
        meta: 10,
        recompensa: { moedas: 250, experiencia: 125 }
    },

    batalha_diaria: {
        id: 'batalha_diaria',
        nome: 'Prova de Combate',
        descricao: 'Vença 2 batalhas.',
        emoji: '⚔️',
        tipo: 'vitorias',
        meta: 2,
        recompensa: { moedas: 150, experiencia: 75 }
    },

    sobrevivente: {
        id: 'sobrevivente',
        nome: 'Espírito Indomável',
        descricao: 'Vença 5 batalhas.',
        emoji: '🛡️',
        tipo: 'vitorias',
        meta: 5,
        recompensa: { moedas: 350, experiencia: 175 }
    },

    cacador_chefe: {
        id: 'cacador_chefe',
        nome: 'Cabeça de Gigante',
        descricao: 'Derrote 1 chefe.',
        emoji: '👹',
        tipo: 'chefes',
        meta: 1,
        recompensa: { moedas: 400, experiencia: 200 }
    },

    exterminador_chefe: {
        id: 'exterminador_chefe',
        nome: 'Terror dos Titãs',
        descricao: 'Derrote 2 chefes.',
        emoji: '🐉',
        tipo: 'chefes',
        meta: 2,
        recompensa: { moedas: 700, experiencia: 350 }
    },

    explorador: {
        id: 'explorador',
        nome: 'Exploração Perigosa',
        descricao: 'Conclua 1 masmorra.',
        emoji: '🏰',
        tipo: 'dungeons',
        meta: 1,
        recompensa: { moedas: 300, experiencia: 150 }
    },

    mestre_dungeons: {
        id: 'mestre_dungeons',
        nome: 'Senhor das Profundezas',
        descricao: 'Conclua 2 masmorras.',
        emoji: '🗝️',
        tipo: 'dungeons',
        meta: 2,
        recompensa: { moedas: 650, experiencia: 325 }
    }
};

const QUANTIDADE_MISSOES_DIARIAS = 3;

function numero(valor, padrao = 0) {
    const n = Number(valor);

    if (!Number.isFinite(n)) {
        return padrao;
    }

    return Math.max(0, n);
}

function dataLocal() {
    const agora = new Date();

    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

function garantirEstrutura(jogador) {
    if (!jogador || typeof jogador !== 'object') {
        throw new TypeError('Jogador inválido.');
    }

    if (
        !jogador.missoes ||
        typeof jogador.missoes !== 'object' ||
        Array.isArray(jogador.missoes)
    ) {
        jogador.missoes = {};
    }

    return jogador.missoes;
}

function calcularIndiceDiario(data) {
    let hash = 0;

    for (let i = 0; i < data.length; i++) {
        hash = (hash * 31 + data.charCodeAt(i)) >>> 0;
    }

    return hash;
}

function selecionarMissoesDiarias(data = dataLocal()) {
    const todas = Object.values(MISSOES);
    const inicio = calcularIndiceDiario(data);
    const selecionadas = [];

    for (
        let i = 0;
        i < Math.min(QUANTIDADE_MISSOES_DIARIAS, todas.length);
        i++
    ) {
        selecionadas.push(
            todas[(inicio + i) % todas.length]
        );
    }

    return selecionadas.map((missao) => missao.id);
}

function garantirMissoesDiarias(jogador) {
    const dados = garantirEstrutura(jogador);
    const hoje = dataLocal();

    if (dados.dataDiaria !== hoje) {
        const antigas = dados.diarias || {};

        dados.dataDiaria = hoje;
        dados.diarias = {};

        for (const id of selecionarMissoesDiarias(hoje)) {
            dados.diarias[id] = {
                progresso: 0,
                concluida: false,
                resgatada: false
            };
        }

        dados.historicoDiario = Array.isArray(dados.historicoDiario)
            ? dados.historicoDiario
            : [];

        dados.historicoDiario.push({
            data: hoje,
            resgatadas: Object.values(antigas).filter(
                (missao) => missao?.resgatada
            ).length
        });

        if (dados.historicoDiario.length > 30) {
            dados.historicoDiario =
                dados.historicoDiario.slice(-30);
        }
    }

    return dados.diarias;
}

function obterMissao(id) {
    const missao = MISSOES[id];

    return missao ? { ...missao, recompensa: { ...missao.recompensa } } : null;
}

function listarMissoesDiarias(jogador) {
    const diarias = garantirMissoesDiarias(jogador);

    return Object.entries(diarias).map(([id, estado]) => {
        const missao = MISSOES[id];

        if (!missao) {
            return null;
        }

        return {
            ...obterMissao(id),
            progresso: numero(estado.progresso),
            concluida: Boolean(estado.concluida),
            resgatada: Boolean(estado.resgatada),
            restante: Math.max(
                0,
                missao.meta - numero(estado.progresso)
            )
        };
    }).filter(Boolean);
}

function registrarProgresso(jogador, tipo, quantidade = 1) {
    if (!jogador || typeof jogador !== 'object') {
        return [];
    }

    const diarias = garantirMissoesDiarias(jogador);
    const incremento = numero(quantidade);

    if (incremento <= 0) {
        return [];
    }

    const concluidasAgora = [];

    for (const [id, estado] of Object.entries(diarias)) {
        const missao = MISSOES[id];

        if (!missao || missao.tipo !== tipo || estado.concluida) {
            continue;
        }

        const antes = numero(estado.progresso);

        estado.progresso = Math.min(
            missao.meta,
            antes + incremento
        );

        if (estado.progresso >= missao.meta) {
            estado.concluida = true;

            concluidasAgora.push({
                ...obterMissao(id),
                progresso: estado.progresso,
                concluida: true,
                resgatada: Boolean(estado.resgatada)
            });
        }
    }

    return concluidasAgora;
}

function registrarVitoria(jogador, quantidade = 1) {
    return registrarProgresso(jogador, 'vitorias', quantidade);
}

function registrarMonstroDerrotado(jogador, quantidade = 1) {
    return registrarProgresso(jogador, 'monstros', quantidade);
}

function registrarChefeDerrotado(jogador, quantidade = 1) {
    return registrarProgresso(jogador, 'chefes', quantidade);
}

function registrarDungeonConcluida(jogador, quantidade = 1) {
    return registrarProgresso(jogador, 'dungeons', quantidade);
}

function resgatarRecompensa(jogador, idMissao) {
    if (!jogador || typeof jogador !== 'object') {
        return {
            sucesso: false,
            codigo: 'JOGADOR_INVALIDO',
            mensagem: 'Não foi possível localizar seu personagem.'
        };
    }

    const diarias = garantirMissoesDiarias(jogador);
    const missao = MISSOES[idMissao];
    const estado = diarias[idMissao];

    if (!missao || !estado) {
        return {
            sucesso: false,
            codigo: 'MISSAO_INEXISTENTE',
            mensagem: 'Essa missão não faz parte das suas missões diárias.'
        };
    }

    if (!estado.concluida) {
        return {
            sucesso: false,
            codigo: 'MISSAO_INCOMPLETA',
            mensagem: `Você ainda precisa concluir: **${missao.nome}**.`
        };
    }

    if (estado.resgatada) {
        return {
            sucesso: false,
            codigo: 'RECOMPENSA_JA_RESGATADA',
            mensagem: 'Você já resgatou a recompensa desta missão.'
        };
    }

    const moedas = numero(jogador.moedas);
    const experiencia = numero(jogador.experiencia);

    jogador.moedas = moedas + numero(missao.recompensa.moedas);
    jogador.experiencia =
        experiencia + numero(missao.recompensa.experiencia);

    estado.resgatada = true;

    return {
        sucesso: true,
        codigo: 'RECOMPENSA_RESGATADA',
        missao: obterMissao(idMissao),
        moedasRecebidas: numero(missao.recompensa.moedas),
        experienciaRecebida: numero(missao.recompensa.experiencia),
        mensagem: [
            '╔══════════════════════════════╗',
            '       🎁 **RECOMPENSA OBTIDA**',
            '╚══════════════════════════════╝',
            '',
            `${missao.emoji} **${missao.nome}**`,
            `💰 +${numero(missao.recompensa.moedas).toLocaleString('pt-BR')} moedas`,
            `✨ +${numero(missao.recompensa.experiencia).toLocaleString('pt-BR')} XP`,
            '',
            '*O esforço de um aventureiro nunca deve passar despercebido.*'
        ].join('\n')
    };
}

function obterResumoMissoes(jogador) {
    const missoes = listarMissoesDiarias(jogador);

    const concluidas = missoes.filter(
        (missao) => missao.concluida
    ).length;

    const resgatadas = missoes.filter(
        (missao) => missao.resgatada
    ).length;

    const pendentes = missoes.filter(
        (missao) => !missao.concluida
    ).length;

    return {
        total: missoes.length,
        concluidas,
        resgatadas,
        pendentes,
        data: dataLocal()
    };
}

function formatarMissoes(jogador) {
    const missoes = listarMissoesDiarias(jogador);
    const resumo = obterResumoMissoes(jogador);

    if (missoes.length === 0) {
        return 'Nenhuma missão diária disponível no momento.';
    }

    const linhas = missoes.map((missao) => {
        let estado;

        if (missao.resgatada) {
            estado = '🎁 Recompensa resgatada';
        } else if (missao.concluida) {
            estado = `✅ Concluída — use \`!rpgmissao resgatar ${missao.id}\``;
        } else {
            estado = `🔄 Progresso: ${missao.progresso}/${missao.meta}`;
        }

        return [
            `${missao.emoji} **${missao.nome}**`,
            `└ ${missao.descricao}`,
            `└ ${estado}`,
            `└ 🎁 ${numero(missao.recompensa.moedas).toLocaleString('pt-BR')} moedas • ${numero(missao.recompensa.experiencia).toLocaleString('pt-BR')} XP`
        ].join('\n');
    });

    return [
        '╔══════════════════════════════╗',
        '      📜 **CONTRATOS DIÁRIOS**',
        '╚══════════════════════════════╝',
        '',
        `📅 Data: **${resumo.data}**`,
        `✅ Concluídas: **${resumo.concluidas}/${resumo.total}**`,
        `🎁 Recompensas resgatadas: **${resumo.resgatadas}**`,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        ...linhas,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '*Os contratos são renovados diariamente.*'
    ].join('\n');
}

module.exports = {
    MISSOES,
    obterMissao,
    selecionarMissoesDiarias,
    garantirMissoesDiarias,
    listarMissoesDiarias,
    registrarProgresso,
    registrarVitoria,
    registrarMonstroDerrotado,
    registrarChefeDerrotado,
    registrarDungeonConcluida,
    resgatarRecompensa,
    obterResumoMissoes,
    formatarMissoes
};
