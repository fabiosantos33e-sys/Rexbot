// ==========================================================
// CRÔNICAS DO CAOS — MUNDO E MAPAS
// 10 regiões, progressão, desbloqueios e exploração
// Node.js / CommonJS
// ==========================================================

const MAPAS = {
    vila_inicial: {
        nome: "Vila Inicial",
        nivelMinimo: 1,
        nivelMaximo: 5,
        dificuldade: 1,
        tipo: "Seguro",
        secreto: false,
        custoViagem: 0,
        descricao:
            "Uma pequena vila cercada por campos e florestas. " +
            "É aqui que as jornadas dos aventureiros começam.",
        inimigos: [
            "lobo_sombrio",
            "goblin_ladrao"
        ],
        requisito: null,
        recompensaExploracao: 20
    },

    ruinas_antigas: {
        nome: "Ruínas Antigas",
        nivelMinimo: 3,
        nivelMaximo: 10,
        dificuldade: 2,
        tipo: "Ruínas",
        secreto: false,
        custoViagem: 50,
        descricao:
            "Restos de uma civilização esquecida escondem criaturas " +
            "e tesouros sob pedras cobertas de símbolos antigos.",
        inimigos: [
            "esqueleto_guerreiro",
            "golem_pedra"
        ],
        requisito: {
            tipo: "nivel",
            valor: 3
        },
        recompensaExploracao: 50
    },

    floresta_sombria: {
        nome: "Floresta Sombria",
        nivelMinimo: 5,
        nivelMaximo: 15,
        dificuldade: 3,
        tipo: "Floresta",
        secreto: false,
        custoViagem: 100,
        descricao:
            "Árvores gigantes bloqueiam a luz. Criaturas silenciosas " +
            "observam cada passo dado entre as raízes.",
        inimigos: [
            "aranha_venenosa",
            "lobo_fantasma"
        ],
        requisito: {
            tipo: "nivel",
            valor: 5
        },
        recompensaExploracao: 85
    },

    caverna_sombria: {
        nome: "Caverna Sombria",
        nivelMinimo: 7,
        nivelMaximo: 18,
        dificuldade: 4,
        tipo: "Subterrâneo",
        secreto: false,
        custoViagem: 150,
        descricao:
            "Uma rede de túneis onde cristais escuros brilham nas paredes. " +
            "Algo se move nas profundezas.",
        inimigos: [
            "morcego_abissal",
            "goblin_ladrao"
        ],
        requisito: {
            tipo: "nivel",
            valor: 7
        },
        recompensaExploracao: 120
    },

    estrada_exilados: {
        nome: "Estrada dos Exilados",
        nivelMinimo: 8,
        nivelMaximo: 20,
        dificuldade: 5,
        tipo: "Estrada",
        secreto: false,
        custoViagem: 200,
        descricao:
            "Uma antiga estrada comercial dominada por mercenários, " +
            "saqueadores e guerreiros sem reino.",
        inimigos: [
            "bandido_exilado",
            "cavaleiro_caido"
        ],
        requisito: {
            tipo: "nivel",
            valor: 8
        },
        recompensaExploracao: 160
    },

    cemiterio_real: {
        nome: "Cemitério Real",
        nivelMinimo: 10,
        nivelMaximo: 25,
        dificuldade: 6,
        tipo: "Maldito",
        secreto: false,
        custoViagem: 300,
        descricao:
            "Túmulos de reis esquecidos se estendem até o horizonte. " +
            "À noite, armaduras vazias caminham entre as lápides.",
        inimigos: [
            "esqueleto_guerreiro",
            "cavaleiro_caido",
            "lobo_fantasma"
        ],
        requisito: {
            tipo: "nivel",
            valor: 10
        },
        chefe: "rei_esqueleto",
        recompensaExploracao: 250
    },

    montanhas_cristalinas: {
        nome: "Montanhas Cristalinas",
        nivelMinimo: 15,
        nivelMaximo: 35,
        dificuldade: 7,
        tipo: "Montanha",
        secreto: false,
        custoViagem: 450,
        descricao:
            "Picos cobertos de cristais mágicos guardam passagens estreitas. " +
            "O rugido de uma criatura ancestral ecoa nas alturas.",
        inimigos: [
            "serpente_cristalina",
            "ogro_montanha",
            "guardiao_runico"
        ],
        requisito: {
            tipo: "nivel",
            valor: 15
        },
        chefe: "dragao_ancestral",
        recompensaExploracao: 400
    },

    templo_caos: {
        nome: "Templo do Caos",
        nivelMinimo: 20,
        nivelMaximo: 45,
        dificuldade: 8,
        tipo: "Templo",
        secreto: false,
        custoViagem: 700,
        descricao:
            "Um templo erguido para forças proibidas. Seus corredores " +
            "estão cobertos por inscrições que parecem mudar sozinhas.",
        inimigos: [
            "cultista_caos",
            "guardiao_runico",
            "espectro_guerreiro"
        ],
        requisito: {
            tipo: "nivel",
            valor: 20
        },
        chefe: "deus_decaido",
        recompensaExploracao: 650
    },

    abismo_infernal: {
        nome: "Abismo Infernal",
        nivelMinimo: 30,
        nivelMaximo: 60,
        dificuldade: 9,
        tipo: "Infernal",
        secreto: true,
        custoViagem: 1200,
        descricao:
            "Uma fenda entre mundos revela terras deformadas por energia " +
            "infernal. Poucos aventureiros retornam dessas profundezas.",
        inimigos: [
            "demonio_errante",
            "cultista_caos"
        ],
        requisito: {
            tipo: "nivel",
            valor: 30
        },
        chefe: "senhor_do_abismo",
        recompensaExploracao: 1200
    },

    trono_caos: {
        nome: "Trono do Caos",
        nivelMinimo: 50,
        nivelMaximo: 400,
        dificuldade: 10,
        tipo: "Lendário",
        secreto: true,
        custoViagem: 3000,
        descricao:
            "No limite da realidade, um trono ancestral aguarda seu próximo " +
            "desafiante. A própria existência parece tremer diante dele.",
        inimigos: [
            "demonio_errante",
            "cultista_caos"
        ],
        requisito: {
            tipo: "nivel",
            valor: 50
        },
        chefe: "soberano_do_caos",
        recompensaExploracao: 3000
    }
};

// ==========================================================
// CONSULTAR MAPAS
// ==========================================================

function obterMapa(id) {
    return MAPAS[id] || null;
}

function listarMapas() {
    return Object.entries(MAPAS).map(([id, mapa]) => ({
        id,
        ...mapa
    }));
}

function listarMapasDisponiveis(nivel) {
    return listarMapas().filter(
        mapa => nivel >= mapa.nivelMinimo
    );
}

// ==========================================================
// VERIFICAR ACESSO
// ==========================================================

function podeEntrar(id, jogador) {
    const mapa = obterMapa(id);

    if (!mapa) {
        return {
            permitido: false,
            motivo: "Esse mapa não existe."
        };
    }

    const nivel = Number(jogador.nivel || 1);

    if (nivel < mapa.nivelMinimo) {
        return {
            permitido: false,
            motivo:
                `Você precisa alcançar o nível ${mapa.nivelMinimo} ` +
                `para entrar em ${mapa.nome}.`
        };
    }

    if (mapa.requisito) {
        if (
            mapa.requisito.tipo === "nivel" &&
            nivel < mapa.requisito.valor
        ) {
            return {
                permitido: false,
                motivo:
                    `Requisito não cumprido: nível ${mapa.requisito.valor}.`
            };
        }
    }

    const moedas = Number(jogador.moedas || 0);

    if (moedas < mapa.custoViagem) {
        return {
            permitido: false,
            motivo:
                `Você precisa de ${mapa.custoViagem} moedas ` +
                `para viajar até ${mapa.nome}.`
        };
    }

    return {
        permitido: true,
        motivo: "Acesso permitido.",
        mapa
    };
}

// ==========================================================
// EXPORTAÇÕES
// ==========================================================

module.exports = {
    MAPAS,
    obterMapa,
    listarMapas,
    listarMapasDisponiveis,
    podeEntrar
};
