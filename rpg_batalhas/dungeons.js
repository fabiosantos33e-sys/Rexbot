// ==========================================================
// CRÔNICAS DO CAOS — MASMORRAS
// Salas, inimigos, chefes por fases e recompensas
// ==========================================================

const DUNGEONS = {
    ruinas_esquecidas: {
        id: "ruinas_esquecidas",
        nome: "Ruínas Esquecidas",
        nivelMinimo: 5,
        dificuldade: 2,
        descricao:
            "Sob pedras antigas, um poder esquecido desperta. " +
            "Cada sala revela uma parte de uma história proibida.",
        salas: [
            {
                nome: "Entrada das Ruínas",
                descricao:
                    "A porta de pedra fecha atrás de você. " +
                    "Pegadas recentes desaparecem na escuridão.",
                tipo: "combate",
                inimigos: ["esqueleto_guerreiro"],
                quantidade: 2
            },
            {
                nome: "Galeria dos Ecos",
                descricao:
                    "Vozes distantes repetem seu nome. Algo se move " +
                    "entre as colunas quebradas.",
                tipo: "combate",
                inimigos: ["goblin_ladrao", "esqueleto_guerreiro"],
                quantidade: 3
            },
            {
                nome: "Câmara do Guardião",
                descricao:
                    "Um antigo guardião desperta e ergue sua arma. " +
                    "Você terá de vencê-lo para seguir adiante.",
                tipo: "chefe",
                chefe: {
                    id: "guardiao_das_ruinas",
                    nome: "Guardião das Ruínas",
                    vidaMultiplicador: 2.5,
                    fases: [
                        {
                            vidaRestante: 100,
                            nome: "Sentinela de Pedra",
                            descricao:
                                "O guardião avança com golpes pesados."
                        },
                        {
                            vidaRestante: 50,
                            nome: "Despertar Ancestral",
                            descricao:
                                "Runas acendem pelo corpo do guardião. " +
                                "Sua força aumenta."
                        },
                        {
                            vidaRestante: 20,
                            nome: "Último Juramento",
                            descricao:
                                "A criatura concentra toda a energia " +
                                "restante em seus ataques."
                        }
                    ]
                }
            }
        ],
        recompensa: {
            moedas: 300,
            experiencia: 180,
            chanceItem: 0.25,
            itens: ["espada_ferro", "lamina_caca"]
        }
    },

    caverna_abissal: {
        id: "caverna_abissal",
        nome: "Caverna Abissal",
        nivelMinimo: 12,
        dificuldade: 4,
        descricao:
            "Uma passagem subterrânea conduz a um abismo repleto " +
            "de cristais negros e criaturas corrompidas.",
        salas: [
            {
                nome: "Túnel dos Perdidos",
                descricao:
                    "O chão treme enquanto criaturas cercam a passagem.",
                tipo: "combate",
                inimigos: ["morcego_abissal", "aranha_venenosa"],
                quantidade: 3
            },
            {
                nome: "Lago de Cristal Negro",
                descricao:
                    "A água escura reflete uma silhueta que não está atrás " +
                    "de você.",
                tipo: "combate",
                inimigos: ["serpente_cristalina", "golem_pedra"],
                quantidade: 3
            },
            {
                nome: "Ninho da Profundeza",
                descricao:
                    "O verdadeiro dono da caverna surge entre as rochas.",
                tipo: "chefe",
                chefe: {
                    id: "devorador_abissal",
                    nome: "Devorador Abissal",
                    vidaMultiplicador: 3,
                    fases: [
                        {
                            vidaRestante: 100,
                            nome: "Caçador das Profundezas",
                            descricao:
                                "A criatura testa suas defesas com ataques rápidos."
                        },
                        {
                            vidaRestante: 60,
                            nome: "Fome Desperta",
                            descricao:
                                "O monstro libera uma energia sombria e avança."
                        },
                        {
                            vidaRestante: 25,
                            nome: "Fúria Abissal",
                            descricao:
                                "Ferido, o chefe abandona qualquer cautela."
                        }
                    ]
                }
            }
        ],
        recompensa: {
            moedas: 850,
            experiencia: 550,
            chanceItem: 0.35,
            itens: ["katana_fantasma", "lamina_sombria"]
        }
    },

    templo_proibido: {
        id: "templo_proibido",
        nome: "Templo Proibido",
        nivelMinimo: 25,
        dificuldade: 7,
        descricao:
            "Um templo selado por gerações. Seu interior guarda " +
            "rituais capazes de alterar o destino de um guerreiro.",
        salas: [
            {
                nome: "Portão dos Juramentos",
                descricao:
                    "Estátuas antigas despertam para impedir sua entrada.",
                tipo: "combate",
                inimigos: ["guardiao_runico", "cavaleiro_caido"],
                quantidade: 3
            },
            {
                nome: "Salão das Máscaras",
                descricao:
                    "Máscaras flutuam no ar e cada uma revela uma presença hostil.",
                tipo: "combate",
                inimigos: ["cultista_caos", "espectro_guerreiro"],
                quantidade: 4
            },
            {
                nome: "Altar da Ruína",
                descricao:
                    "Uma presença colossal se levanta diante do altar.",
                tipo: "chefe",
                chefe: {
                    id: "sacerdote_do_caos",
                    nome: "Sumo Sacerdote do Caos",
                    vidaMultiplicador: 4,
                    fases: [
                        {
                            vidaRestante: 100,
                            nome: "Sacerdote Selado",
                            descricao:
                                "O sacerdote invoca energia proibida."
                        },
                        {
                            vidaRestante: 70,
                            nome: "Ritual Desperto",
                            descricao:
                                "O altar responde ao ritual e fortalece o chefe."
                        },
                        {
                            vidaRestante: 40,
                            nome: "Avatar da Ruína",
                            descricao:
                                "A energia do caos envolve completamente o sacerdote."
                        },
                        {
                            vidaRestante: 15,
                            nome: "Última Profecia",
                            descricao:
                                "O sacerdote arrisca tudo em seu ataque final."
                        }
                    ]
                }
            }
        ],
        recompensa: {
            moedas: 2200,
            experiencia: 1400,
            chanceItem: 0.45,
            itens: ["espada_draconica", "espada_sagrada"]
        }
    },

    abismo_final: {
        id: "abismo_final",
        nome: "Abismo Final",
        nivelMinimo: 50,
        dificuldade: 10,
        descricao:
            "A última fronteira antes do Trono do Caos. " +
            "A realidade se desfaz a cada passo.",
        salas: [
            {
                nome: "Ponte dos Condenados",
                descricao:
                    "Uma ponte suspensa sobre o vazio. Guardiões bloqueiam o caminho.",
                tipo: "combate",
                inimigos: ["demonio_errante", "cavaleiro_caido"],
                quantidade: 4
            },
            {
                nome: "Câmara da Destruição",
                descricao:
                    "O espaço se distorce. A energia do caos transforma " +
                    "cada sombra em uma ameaça.",
                tipo: "combate",
                inimigos: ["cultista_caos", "guardiao_runico"],
                quantidade: 5
            },
            {
                nome: "Trono do Soberano",
                descricao:
                    "O soberano se ergue de seu trono. A batalha final começa.",
                tipo: "chefe",
                chefe: {
                    id: "soberano_do_caos",
                    nome: "Soberano do Caos",
                    vidaMultiplicador: 6,
                    fases: [
                        {
                            vidaRestante: 100,
                            nome: "Rei Adormecido",
                            descricao:
                                "O soberano ataca sem revelar todo o seu poder."
                        },
                        {
                            vidaRestante: 75,
                            nome: "Coroa Desperta",
                            descricao:
                                "A coroa brilha e uma onda de energia atravessa a arena."
                        },
                        {
                            vidaRestante: 50,
                            nome: "Ruptura da Realidade",
                            descricao:
                                "O cenário se fragmenta enquanto o chefe intensifica os ataques."
                        },
                        {
                            vidaRestante: 25,
                            nome: "Caos Absoluto",
                            descricao:
                                "O soberano libera seu poder mais perigoso."
                        },
                        {
                            vidaRestante: 10,
                            nome: "Último Instante",
                            descricao:
                                "A batalha chega ao limite. Cada golpe pode decidir o destino."
                        }
                    ]
                }
            }
        ],
        recompensa: {
            moedas: 10000,
            experiencia: 8000,
            chanceItem: 0.60,
            itens: ["espada_do_caos", "espada_vazia", "espada_deus_antigo"]
        }
    }
};

// ==========================================================
// FUNÇÕES DE CONSULTA
// ==========================================================

function obterDungeon(id) {
    return DUNGEONS[id] || null;
}

function listarDungeons() {
    return Object.values(DUNGEONS);
}

function listarDungeonsDisponiveis(nivel) {
    return listarDungeons().filter(
        dungeon => Number(nivel) >= dungeon.nivelMinimo
    );
}

function verificarAcesso(id, jogador) {
    const dungeon = obterDungeon(id);

    if (!dungeon) {
        return {
            permitido: false,
            motivo: "Essa masmorra não existe."
        };
    }

    const nivel = Number(jogador.nivel || 1);

    if (nivel < dungeon.nivelMinimo) {
        return {
            permitido: false,
            motivo:
                `Você precisa alcançar o nível ${dungeon.nivelMinimo} ` +
                `para entrar em ${dungeon.nome}.`
        };
    }

    return {
        permitido: true,
        motivo: "Masmorra liberada.",
        dungeon
    };
}

function obterSala(id, indice) {
    const dungeon = obterDungeon(id);

    if (!dungeon) return null;

    return dungeon.salas[indice] || null;
}

function obterFaseChefe(id, indiceSala, vidaPercentual) {
    const sala = obterSala(id, indiceSala);

    if (!sala || !sala.chefe || !Array.isArray(sala.chefe.fases)) {
        return null;
    }

    const percentual = Math.max(
        0,
        Math.min(100, Number(vidaPercentual))
    );

    const fases = sala.chefe.fases;

    for (let i = fases.length - 1; i >= 0; i--) {
        if (percentual <= fases[i].vidaRestante) {
            return {
                ...fases[i],
                indice: i
            };
        }
    }

    return {
        ...fases[0],
        indice: 0
    };
}

function sortearRecompensa(id, aleatorio = Math.random) {
    const dungeon = obterDungeon(id);

    if (!dungeon) return null;

    const recompensa = dungeon.recompensa;
    const resultado = {
        moedas: recompensa.moedas,
        experiencia: recompensa.experiencia,
        item: null
    };

    if (
        recompensa.itens.length > 0 &&
        aleatorio() < recompensa.chanceItem
    ) {
        const indice = Math.floor(
            aleatorio() * recompensa.itens.length
        );

        resultado.item = recompensa.itens[
            Math.min(indice, recompensa.itens.length - 1)
        ];
    }

    return resultado;
}

// ==========================================================
// EXPORTAÇÕES
// ==========================================================

module.exports = {
    DUNGEONS,
    obterDungeon,
    listarDungeons,
    listarDungeonsDisponiveis,
    verificarAcesso,
    obterSala,
    obterFaseChefe,
    sortearRecompensa
};
