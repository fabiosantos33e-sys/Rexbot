'use strict';

/*
 * CRÔNICAS DO CAOS — LOJA DE ARMAS
 *
 * Módulo independente.
 * Não altera index.js.
 * Não salva arquivos automaticamente.
 */

const CATALOGO = {
    espada_enferrujada: {
        id: 'espada_enferrujada',
        nome: 'Espada Enferrujada',
        emoji: '🗡️',
        raridade: 'Comum',
        preco: 0,
        nivel: 1,
        ataque: 3,
        descricao: 'Uma lâmina antiga. Ainda pode derramar sangue.'
    },

    espada_madeira: {
        id: 'espada_madeira',
        nome: 'Espada de Madeira',
        emoji: '🪵',
        raridade: 'Comum',
        preco: 80,
        nivel: 1,
        ataque: 5,
        descricao: 'Simples, leve e melhor que lutar desarmado.'
    },

    espada_ferro: {
        id: 'espada_ferro',
        nome: 'Espada de Ferro',
        emoji: '⚔️',
        raridade: 'Incomum',
        preco: 250,
        nivel: 3,
        ataque: 12,
        descricao: 'Uma arma confiável para os primeiros desafios.'
    },

    espada_aco: {
        id: 'espada_aco',
        nome: 'Espada de Aço',
        emoji: '🗡️',
        raridade: 'Incomum',
        preco: 650,
        nivel: 6,
        ataque: 22,
        descricao: 'Uma lâmina resistente, preparada para guerras longas.'
    },

    lamina_caca: {
        id: 'lamina_caca',
        nome: 'Lâmina de Caça',
        emoji: '🐺',
        raridade: 'Rara',
        preco: 1200,
        nivel: 8,
        ataque: 35,
        descricao: 'Forjada para perseguir criaturas perigosas.'
    },

    katana_fantasma: {
        id: 'katana_fantasma',
        nome: 'Katana Fantasma',
        emoji: '👻',
        raridade: 'Rara',
        preco: 2500,
        nivel: 12,
        ataque: 55,
        descricao: 'Sua lâmina parece atravessar a própria escuridão.'
    },

    lamina_sombria: {
        id: 'lamina_sombria',
        nome: 'Lâmina Sombria',
        emoji: '🌑',
        raridade: 'Épica',
        preco: 5000,
        nivel: 18,
        ataque: 85,
        descricao: 'Uma arma envolta em energia desconhecida.'
    },

    espada_draconica: {
        id: 'espada_draconica',
        nome: 'Espada Dracônica',
        emoji: '🐉',
        raridade: 'Épica',
        preco: 9000,
        nivel: 25,
        ataque: 125,
        descricao: 'Dizem que seu metal nasceu nas chamas de um dragão.'
    },

    espada_sagrada: {
        id: 'espada_sagrada',
        nome: 'Espada Sagrada',
        emoji: '✨',
        raridade: 'Lendária',
        preco: 16000,
        nivel: 35,
        ataque: 180,
        descricao: 'Uma relíquia luminosa que poucos são dignos de empunhar.'
    },

    espada_do_caos: {
        id: 'espada_do_caos',
        nome: 'Espada do Caos',
        emoji: '🔥',
        raridade: 'Lendária',
        preco: 28000,
        nivel: 45,
        ataque: 250,
        descricao: 'Uma força instável pulsa dentro desta arma.'
    },

    katana_sangrenta: {
        id: 'katana_sangrenta',
        nome: 'Katana Sangrenta',
        emoji: '🩸',
        raridade: 'Mítica',
        preco: 45000,
        nivel: 60,
        ataque: 340,
        descricao: 'Uma lâmina temida até mesmo entre os guerreiros lendários.'
    },

    espada_vazia: {
        id: 'espada_vazia',
        nome: 'Espada do Vazio',
        emoji: '🕳️',
        raridade: 'Mítica',
        preco: 75000,
        nivel: 80,
        ataque: 460,
        descricao: 'Uma arma que parece apagar a luz ao seu redor.'
    },

    espada_deus_antigo: {
        id: 'espada_deus_antigo',
        nome: 'Espada do Deus Antigo',
        emoji: '👑',
        raridade: 'Divina',
        preco: 150000,
        nivel: 100,
        ataque: 650,
        descricao: 'Uma relíquia ancestral reservada aos maiores aventureiros.'
    }
};

const RARIDADES = {
    Comum: { emoji: '⚪', ordem: 1 },
    Incomum: { emoji: '🟢', ordem: 2 },
    Rara: { emoji: '🔵', ordem: 3 },
    Épica: { emoji: '🟣', ordem: 4 },
    Lendária: { emoji: '🟠', ordem: 5 },
    Mítica: { emoji: '🔴', ordem: 6 },
    Divina: { emoji: '🌟', ordem: 7 }
};

function numero(valor, padrao = 0) {
    const n = Number(valor);

    return Number.isFinite(n) && n >= 0 ? n : padrao;
}

function obterArma(id) {
    const arma = CATALOGO[String(id || '').toLowerCase()];

    return arma ? { ...arma } : null;
}

function listarArmas() {
    return Object.values(CATALOGO)
        .map((arma) => ({ ...arma }))
        .sort((a, b) => {
            const raridadeA = RARIDADES[a.raridade]?.ordem || 0;
            const raridadeB = RARIDADES[b.raridade]?.ordem || 0;

            return raridadeA - raridadeB || a.preco - b.preco;
        });
}

function listarArmasDisponiveis(jogador) {
    const nivel = numero(jogador?.nivel, 1);

    return listarArmas().filter((arma) => arma.nivel <= nivel);
}

function listarArmasBloqueadas(jogador) {
    const nivel = numero(jogador?.nivel, 1);

    return listarArmas().filter((arma) => arma.nivel > nivel);
}

function obterInventario(jogador) {
    if (!Array.isArray(jogador.inventario)) {
        jogador.inventario = [];
    }

    return jogador.inventario;
}

function possuiArma(jogador, idArma) {
    const inventario = obterInventario(jogador);

    return inventario.some((item) => {
        if (typeof item === 'string') {
            return item === idArma;
        }

        return item?.id === idArma ||
            item?.armaId === idArma;
    });
}

function formatarPreco(preco) {
    return numero(preco).toLocaleString('pt-BR');
}

function formatarArma(arma) {
    if (!arma) {
        return 'Arma não encontrada.';
    }

    const raridade = RARIDADES[arma.raridade] || {
        emoji: '⚪'
    };

    return [
        `${arma.emoji} **${arma.nome}**`,
        `${raridade.emoji} Raridade: **${arma.raridade}**`,
        `⚔️ Ataque: **+${arma.ataque}**`,
        `📈 Nível necessário: **${arma.nivel}**`,
        `💰 Preço: **${formatarPreco(arma.preco)} moedas**`,
        `📜 ${arma.descricao}`,
        `🆔 Código: \`${arma.id}\``
    ].join('\n');
}

function gerarLoja(jogador, filtro = 'todas') {
    const nivel = numero(jogador?.nivel, 1);
    const saldo = numero(jogador?.moedas);
    const armas = listarArmas().filter((arma) => {
        if (filtro !== 'todas' && arma.raridade !== filtro) {
            return false;
        }

        return true;
    });

    if (armas.length === 0) {
        return 'Nenhuma arma encontrada nessa categoria.';
    }

    const linhas = armas.map((arma) => {
        const raridade = RARIDADES[arma.raridade] || {
            emoji: '⚪'
        };

        const temNivel = nivel >= arma.nivel;
        const temDinheiro = saldo >= arma.preco;
        const comprada = possuiArma(jogador, arma.id);

        let estado;

        if (comprada) {
            estado = '✅ Você já possui esta arma';
        } else if (!temNivel) {
            estado = `🔒 Desbloqueia no nível ${arma.nivel}`;
        } else if (!temDinheiro) {
            estado = '💸 Moedas insuficientes';
        } else {
            estado = `🛒 Comprar: \`!rpgcomprar ${arma.id}\``;
        }

        return [
            `${arma.emoji} **${arma.nome}**`,
            `${raridade.emoji} ${arma.raridade} • ⚔️ +${arma.ataque} ataque`,
            `💰 ${formatarPreco(arma.preco)} moedas • 📈 Nível ${arma.nivel}`,
            estado
        ].join('\n');
    });

    return [
        '╔══════════════════════════════╗',
        '       ⚒️ **ARSENAL DO CAOS**',
        '╚══════════════════════════════╝',
        '',
        `📈 Seu nível: **${nivel}**`,
        `💰 Seu saldo: **${formatarPreco(saldo)} moedas**`,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        ...linhas,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '*Toda arma tem uma história. Qual será a sua?*',
        '',
        '⚠️ Os comandos exibidos são sugestões de formato; ainda precisam ser conectados ao sistema de comandos do bot.'
    ].join('\n');
}

function comprarArma(jogador, idArma) {
    if (!jogador || typeof jogador !== 'object') {
        return {
            sucesso: false,
            codigo: 'JOGADOR_INVALIDO',
            mensagem: 'Não foi possível localizar seus dados de aventureiro.'
        };
    }

    const arma = obterArma(idArma);

    if (!arma) {
        return {
            sucesso: false,
            codigo: 'ARMA_INEXISTENTE',
            mensagem: 'Essa arma não existe no arsenal.'
        };
    }

    const nivel = numero(jogador.nivel, 1);
    const moedas = numero(jogador.moedas);

    if (nivel < arma.nivel) {
        return {
            sucesso: false,
            codigo: 'NIVEL_INSUFICIENTE',
            arma,
            mensagem: `Você precisa alcançar o nível ${arma.nivel} para comprar **${arma.nome}**.`
        };
    }

    if (possuiArma(jogador, arma.id)) {
        return {
            sucesso: false,
            codigo: 'ARMA_JA_ADQUIRIDA',
            arma,
            mensagem: `Você já possui **${arma.nome}**.`
        };
    }

    if (moedas < arma.preco) {
        return {
            sucesso: false,
            codigo: 'SALDO_INSUFICIENTE',
            arma,
            falta: arma.preco - moedas,
            mensagem: `Faltam ${formatarPreco(arma.preco - moedas)} moedas para comprar **${arma.nome}**.`
        };
    }

    const inventario = obterInventario(jogador);

    jogador.moedas = moedas - arma.preco;

    inventario.push({
        id: arma.id,
        nome: arma.nome,
        tipo: 'arma',
        raridade: arma.raridade,
        ataque: arma.ataque,
        nivel: arma.nivel
    });

    return {
        sucesso: true,
        codigo: 'COMPRA_REALIZADA',
        arma,
        saldoRestante: jogador.moedas,
        mensagem: [
            '╔══════════════════════════════╗',
            '       🛒 **COMPRA REALIZADA**',
            '╚══════════════════════════════╝',
            '',
            `✨ Você adquiriu **${arma.nome}**!`,
            `⚔️ Ataque da arma: +${arma.ataque}`,
            `💰 Valor pago: ${formatarPreco(arma.preco)} moedas`,
            `🪙 Saldo restante: ${formatarPreco(jogador.moedas)} moedas`,
            '',
            '*Que sua nova lâmina testemunhe grandes vitórias.*'
        ].join('\n')
    };
}

function equiparArma(jogador, idArma) {
    if (!jogador || typeof jogador !== 'object') {
        return {
            sucesso: false,
            codigo: 'JOGADOR_INVALIDO',
            mensagem: 'Não foi possível localizar seus dados.'
        };
    }

    const arma = obterArma(idArma);

    if (!arma) {
        return {
            sucesso: false,
            codigo: 'ARMA_INEXISTENTE',
            mensagem: 'Essa arma não existe no arsenal.'
        };
    }

    if (!possuiArma(jogador, arma.id)) {
        return {
            sucesso: false,
            codigo: 'ARMA_NAO_POSSUIDA',
            arma,
            mensagem: `Você precisa possuir **${arma.nome}** antes de equipá-la.`
        };
    }

    jogador.armaEquipada = arma.id;

    return {
        sucesso: true,
        codigo: 'ARMA_EQUIPADA',
        arma,
        mensagem: `⚔️ Você equipou **${arma.nome}**!`
    };
}

function obterArmaEquipada(jogador) {
    if (!jogador || typeof jogador !== 'object') {
        return null;
    }

    const id = jogador.armaEquipada ||
        jogador.arma ||
        jogador.equipamento?.arma;

    if (typeof id === 'string') {
        return obterArma(id);
    }

    if (id && typeof id === 'object') {
        return obterArma(id.id || id.nome);
    }

    return null;
}

module.exports = {
    CATALOGO,
    RARIDADES,
    obterArma,
    listarArmas,
    listarArmasDisponiveis,
    listarArmasBloqueadas,
    possuiArma,
    formatarArma,
    gerarLoja,
    comprarArma,
    equiparArma,
    obterArmaEquipada
};
