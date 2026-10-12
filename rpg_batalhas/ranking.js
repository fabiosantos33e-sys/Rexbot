'use strict';

/*
 * CRÔNICAS DO CAOS — SISTEMA DE RANKING
 *
 * Rankings:
 * - Geral
 * - Nível
 * - Vitórias
 * - Chefes derrotados
 * - Masmorras concluídas
 * - Moedas
 *
 * Módulo independente.
 * Não altera index.js nem modifica os dados dos jogadores.
 */

const TIPOS_RANKING = {
    geral: {
        nome: 'Ranking Geral',
        emoji: '🏆'
    },
    nivel: {
        nome: 'Ranking de Nível',
        emoji: '⚔️'
    },
    vitorias: {
        nome: 'Ranking de Vitórias',
        emoji: '🛡️'
    },
    chefes: {
        nome: 'Caçadores de Chefes',
        emoji: '👹'
    },
    dungeons: {
        nome: 'Mestres das Masmorras',
        emoji: '🏰'
    },
    moedas: {
        nome: 'Ranking de Riqueza',
        emoji: '💰'
    }
};

function numero(valor, padrao = 0) {
    const convertido = Number(valor);

    if (!Number.isFinite(convertido)) {
        return padrao;
    }

    return Math.max(0, convertido);
}

function texto(valor, padrao = '') {
    if (typeof valor !== 'string') {
        return padrao;
    }

    return valor.trim() || padrao;
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

function obterValor(jogador, nomes, padrao = 0) {
    const estatisticas = obterEstatisticas(jogador);

    for (const nome of nomes) {
        if (jogador[nome] !== undefined && jogador[nome] !== null) {
            return numero(jogador[nome], padrao);
        }

        if (
            estatisticas[nome] !== undefined &&
            estatisticas[nome] !== null
        ) {
            return numero(estatisticas[nome], padrao);
        }
    }

    return padrao;
}

function normalizarJogadores(jogadores) {
    if (Array.isArray(jogadores)) {
        return jogadores.map((jogador, indice) => ({
            jogador,
            chave: String(
                jogador?.id ??
                jogador?.userId ??
                jogador?.usuarioId ??
                jogador?.discordId ??
                indice
            )
        }));
    }

    if (jogadores && typeof jogadores === 'object') {
        return Object.entries(jogadores).map(([chave, jogador]) => ({
            jogador,
            chave: String(chave)
        }));
    }

    return [];
}

function obterNome(jogador, id) {
    return texto(
        jogador?.nome ??
        jogador?.username ??
        jogador?.nomePersonagem ??
        jogador?.personagem ??
        jogador?.apelido,
        `Aventureiro ${id}`
    );
}

function obterNivel(jogador) {
    return obterValor(jogador, ['nivel', 'level'], 1);
}

function obterVitorias(jogador) {
    return obterValor(
        jogador,
        ['vitorias', 'batalhasVencidas', 'combatesVencidos'],
        0
    );
}

function obterChefesDerrotados(jogador) {
    return obterValor(
        jogador,
        ['chefesDerrotados', 'bossesDerrotados', 'chefesVencidos'],
        0
    );
}

function obterDungeonsConcluidas(jogador) {
    return obterValor(
        jogador,
        ['dungeonsConcluidas', 'masmorrasConcluidas', 'dungeonsCompletadas'],
        0
    );
}

function obterMoedas(jogador) {
    return obterValor(jogador, ['moedas', 'ouro', 'dinheiro'], 0);
}

function obterExperiencia(jogador) {
    return obterValor(jogador, ['experiencia', 'xp', 'exp'], 0);
}

function obterMonstrosDerrotados(jogador) {
    return obterValor(
        jogador,
        ['monstrosDerrotados', 'inimigosDerrotados'],
        0
    );
}

function obterPontuacao(jogador, tipo = 'geral') {
    const nivel = obterNivel(jogador);
    const experiencia = obterExperiencia(jogador);
    const vitorias = obterVitorias(jogador);
    const chefes = obterChefesDerrotados(jogador);
    const dungeons = obterDungeonsConcluidas(jogador);
    const moedas = obterMoedas(jogador);
    const monstros = obterMonstrosDerrotados(jogador);

    switch (tipo) {
        case 'nivel':
            return nivel;

        case 'vitorias':
            return vitorias;

        case 'chefes':
            return chefes;

        case 'dungeons':
            return dungeons;

        case 'moedas':
            return moedas;

        case 'geral':
        default:
            return (
                nivel * 1000 +
                experiencia +
                vitorias * 150 +
                chefes * 500 +
                dungeons * 350 +
                monstros * 10
            );
    }
}

function gerarRanking(jogadores, tipo = 'geral', limite = 10) {
    if (!TIPOS_RANKING[tipo]) {
        tipo = 'geral';
    }

    limite = Math.max(1, Math.min(100, Math.floor(numero(limite, 10))));

    return normalizarJogadores(jogadores)
        .filter(({ jogador }) => jogador && typeof jogador === 'object')
        .map(({ jogador, chave }) => {
            const id = String(
                jogador.id ??
                jogador.userId ??
                jogador.usuarioId ??
                jogador.discordId ??
                chave
            );

            return {
                id,
                nome: obterNome(jogador, id),
                nivel: obterNivel(jogador),
                experiencia: obterExperiencia(jogador),
                vitorias: obterVitorias(jogador),
                chefesDerrotados: obterChefesDerrotados(jogador),
                dungeonsConcluidas: obterDungeonsConcluidas(jogador),
                monstrosDerrotados: obterMonstrosDerrotados(jogador),
                moedas: obterMoedas(jogador),
                pontuacao: obterPontuacao(jogador, tipo),
                tipo
            };
        })
        .sort((a, b) => {
            if (b.pontuacao !== a.pontuacao) {
                return b.pontuacao - a.pontuacao;
            }

            if (b.nivel !== a.nivel) {
                return b.nivel - a.nivel;
            }

            return a.nome.localeCompare(b.nome, 'pt-BR');
        })
        .slice(0, limite)
        .map((jogador, indice) => ({
            ...jogador,
            posicao: indice + 1
        }));
}

function formatarNumero(valor) {
    return numero(valor).toLocaleString('pt-BR');
}

function obterMedalha(posicao) {
    switch (posicao) {
        case 1:
            return '🥇';

        case 2:
            return '🥈';

        case 3:
            return '🥉';

        default:
            return `**${posicao}º**`;
    }
}

function formatarRanking(ranking, tipo = 'geral') {
    const configuracao = TIPOS_RANKING[tipo] || TIPOS_RANKING.geral;

    if (!Array.isArray(ranking) || ranking.length === 0) {
        return [
            `${configuracao.emoji} **${configuracao.nome}**`,
            '',
            'Ainda não existem aventureiros neste ranking.',
            '',
            '⚔️ Entre em uma batalha para começar sua jornada!'
        ].join('\n');
    }

    const linhas = ranking.map((jogador) => {
        const medalha = obterMedalha(jogador.posicao);

        let detalhe;

        switch (tipo) {
            case 'nivel':
                detalhe = `Nível ${formatarNumero(jogador.nivel)}`;
                break;

            case 'vitorias':
                detalhe = `${formatarNumero(jogador.vitorias)} vitórias`;
                break;

            case 'chefes':
                detalhe = `${formatarNumero(jogador.chefesDerrotados)} chefes derrotados`;
                break;

            case 'dungeons':
                detalhe = `${formatarNumero(jogador.dungeonsConcluidas)} masmorras concluídas`;
                break;

            case 'moedas':
                detalhe = `${formatarNumero(jogador.moedas)} moedas`;
                break;

            default:
                detalhe = `${formatarNumero(jogador.pontuacao)} pontos`;
                break;
        }

        return [
            `${medalha} **${jogador.nome}**`,
            `└ ⚔️ Nível ${formatarNumero(jogador.nivel)} • ${detalhe}`
        ].join('\n');
    });

    return [
        `${configuracao.emoji} **${configuracao.nome}**`,
        '━━━━━━━━━━━━━━━━━━━━',
        '',
        ...linhas,
        '',
        '━━━━━━━━━━━━━━━━━━━━',
        '📜 *Sua próxima vitória pode mudar sua posição.*'
    ].join('\n');
}

function gerarResumoPessoal(jogadores, idJogador) {
    const lista = gerarRanking(jogadores, 'geral', 100);
    const procurado = String(idJogador);

    const posicao = lista.find(
        (jogador) => jogador.id === procurado
    );

    if (!posicao) {
        return {
            encontrado: false,
            mensagem: 'Você ainda não aparece no ranking do Crônicas do Caos.'
        };
    }

    return {
        encontrado: true,
        jogador: posicao,
        mensagem: [
            `📜 **Registro de ${posicao.nome}**`,
            '',
            `🏆 Posição: ${posicao.posicao}º`,
            `⚔️ Nível: ${formatarNumero(posicao.nivel)}`,
            `✨ Experiência: ${formatarNumero(posicao.experiencia)}`,
            `🛡️ Vitórias: ${formatarNumero(posicao.vitorias)}`,
            `👹 Chefes derrotados: ${formatarNumero(posicao.chefesDerrotados)}`,
            `🏰 Masmorras concluídas: ${formatarNumero(posicao.dungeonsConcluidas)}`,
            `💰 Moedas: ${formatarNumero(posicao.moedas)}`,
            `📊 Pontuação geral: ${formatarNumero(posicao.pontuacao)}`
        ].join('\n')
    };
}

function obterTiposRanking() {
    return Object.entries(TIPOS_RANKING).map(([id, dados]) => ({
        id,
        nome: dados.nome,
        emoji: dados.emoji
    }));
}

module.exports = {
    TIPOS_RANKING,
    obterEstatisticas,
    obterNivel,
    obterVitorias,
    obterChefesDerrotados,
    obterDungeonsConcluidas,
    obterMoedas,
    obterExperiencia,
    obterMonstrosDerrotados,
    obterPontuacao,
    gerarRanking,
    formatarRanking,
    gerarResumoPessoal,
    obterTiposRanking
};
