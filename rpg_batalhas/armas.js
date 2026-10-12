// ==========================================================
// CRÔNICAS DO CAOS — ARSENAL DEFINITIVO
// Armas, técnicas automáticas e Absoluto Crítico
// Node.js / CommonJS
// ==========================================================

const ARMAS = {
    espada_enferrujada: {
        nome: "Espada Enferrujada",
        raridade: "Comum",
        tipo: "Espada",
        dano: 8,
        preco: 0,
        tecnicas: [
            {
                nome: "Corte Simples",
                multiplicador: 1.1,
                descricao: "Um corte direto, simples e preciso."
            },
            {
                nome: "Golpe Descendente",
                multiplicador: 1.3,
                descricao: "A lâmina desce com toda a força do guerreiro."
            }
        ],
        absoluto: {
            nome: "Último Corte",
            multiplicador: 3.5,
            chance: 0.005,
            vidaMaxima: 10,
            descricao: "Quando a derrota parece inevitável, o guerreiro encontra forças para um último golpe."
        }
    },

    espada_madeira: {
        nome: "Espada de Madeira",
        raridade: "Comum",
        tipo: "Espada",
        dano: 5,
        preco: 50,
        tecnicas: [
            {
                nome: "Estocada Improvisada",
                multiplicador: 1.1,
                descricao: "Uma estocada simples contra o adversário."
            },
            {
                nome: "Impacto de Madeira",
                multiplicador: 1.25,
                descricao: "Um golpe pesado que surpreende pela força."
            }
        ],
        absoluto: {
            nome: "Instinto de Sobrevivência",
            multiplicador: 3,
            chance: 0.003,
            vidaMaxima: 8,
            descricao: "O instinto assume o controle e transforma um golpe simples em uma surpresa."
        }
    },

    espada_ferro: {
        nome: "Espada de Ferro",
        raridade: "Incomum",
        tipo: "Espada",
        dano: 15,
        preco: 350,
        tecnicas: [
            {
                nome: "Corte Cruzado",
                multiplicador: 1.2,
                descricao: "Dois movimentos rápidos desenham uma cruz diante do inimigo."
            },
            {
                nome: "Investida de Ferro",
                multiplicador: 1.4,
                descricao: "O guerreiro avança e concentra sua força no impacto."
            },
            {
                nome: "Quebra-Guarda",
                multiplicador: 1.6,
                descricao: "Um golpe pesado procura romper a defesa adversária."
            }
        ],
        absoluto: {
            nome: "Execução de Ferro",
            multiplicador: 4,
            chance: 0.007,
            vidaMaxima: 8,
            descricao: "O guerreiro reúne suas últimas forças e desfere um golpe devastador."
        }
    },

    espada_aco: {
        nome: "Espada de Aço",
        raridade: "Incomum",
        tipo: "Espada",
        dano: 20,
        preco: 650,
        tecnicas: [
            {
                nome: "Talho Preciso",
                multiplicador: 1.2,
                descricao: "Um corte calculado atinge o ponto vulnerável."
            },
            {
                nome: "Avanço do Cavaleiro",
                multiplicador: 1.45,
                descricao: "Um avanço firme acompanhado de um golpe poderoso."
            },
            {
                nome: "Impacto Cortante",
                multiplicador: 1.7,
                descricao: "A lâmina desce com força suficiente para abalar o inimigo."
            }
        ],
        absoluto: {
            nome: "Sentença de Aço",
            multiplicador: 4.2,
            chance: 0.008,
            vidaMaxima: 8,
            descricao: "O aço brilha uma última vez antes de liberar toda sua força."
        }
    },

    lamina_caca: {
        nome: "Lâmina do Caçador",
        raridade: "Rara",
        tipo: "Espada",
        dano: 28,
        preco: 1400,
        tecnicas: [
            {
                nome: "Marca da Presa",
                multiplicador: 1.3,
                descricao: "Um corte veloz encontra uma abertura na defesa."
            },
            {
                nome: "Caçada Implacável",
                multiplicador: 1.5,
                descricao: "Uma sequência de movimentos pressiona o adversário."
            },
            {
                nome: "Corte Predatório",
                multiplicador: 1.8,
                descricao: "O guerreiro ataca como um caçador diante da presa."
            },
            {
                nome: "Ruptura Selvagem",
                multiplicador: 2.1,
                descricao: "Um golpe feroz transforma a pressão em pura destruição."
            }
        ],
        absoluto: {
            nome: "Predador Absoluto",
            multiplicador: 5,
            chance: 0.012,
            vidaMaxima: 10,
            descricao: "O instinto do caçador desperta quando tudo parece perdido."
        }
    },

    katana_fantasma: {
        nome: "Katana Fantasma",
        raridade: "Épica",
        tipo: "Katana",
        dano: 38,
        preco: 3200,
        tecnicas: [
            {
                nome: "Saque Espectral",
                multiplicador: 1.35,
                descricao: "A katana deixa a bainha em um movimento quase invisível."
            },
            {
                nome: "Passo Fantasma",
                multiplicador: 1.55,
                descricao: "O guerreiro parece desaparecer antes de reaparecer atacando."
            },
            {
                nome: "Lua Partida",
                multiplicador: 1.85,
                descricao: "Um arco de energia corta o ar diante do inimigo."
            },
            {
                nome: "Corte do Além",
                multiplicador: 2.2,
                descricao: "A lâmina libera uma força espectral concentrada."
            }
        ],
        absoluto: {
            nome: "Silêncio Eterno",
            multiplicador: 5.5,
            chance: 0.012,
            vidaMaxima: 9,
            descricao: "O campo de batalha silencia quando a técnica proibida desperta."
        }
    },

    lamina_sombria: {
        nome: "Lâmina Sombria",
        raridade: "Rara",
        tipo: "Espada",
        dano: 32,
        preco: 1800,
        tecnicas: [
            {
                nome: "Corte das Sombras",
                multiplicador: 1.3,
                descricao: "A lâmina atravessa a escuridão e encontra o adversário."
            },
            {
                nome: "Dança Sombria",
                multiplicador: 1.55,
                descricao: "Movimentos velozes formam uma sequência difícil de acompanhar."
            },
            {
                nome: "Ruptura Noturna",
                multiplicador: 1.85,
                descricao: "Energia sombria percorre o fio da espada."
            },
            {
                nome: "Véu da Morte",
                multiplicador: 2.15,
                descricao: "Uma onda escura envolve a lâmina antes do impacto."
            }
        ],
        absoluto: {
            nome: "Abismo Absoluto",
            multiplicador: 5.2,
            chance: 0.012,
            vidaMaxima: 10,
            descricao: "A escuridão desperta por completo e envolve o golpe em energia proibida."
        }
    },

    espada_draconica: {
        nome: "Espada Dracônica",
        raridade: "Épica",
        tipo: "Espada",
        dano: 42,
        preco: 4200,
        tecnicas: [
            {
                nome: "Garra do Dragão",
                multiplicador: 1.4,
                descricao: "Um golpe curvo lembra as garras de uma criatura ancestral."
            },
            {
                nome: "Sopro Flamejante",
                multiplicador: 1.65,
                descricao: "Chamas envolvem a lâmina durante o ataque."
            },
            {
                nome: "Asas da Ruína",
                multiplicador: 1.95,
                descricao: "Uma onda de energia explode ao redor do inimigo."
            },
            {
                nome: "Fúria Dracônica",
                multiplicador: 2.3,
                descricao: "A espada libera a força de um dragão adormecido."
            }
        ],
        absoluto: {
            nome: "Cataclismo Dracônico",
            multiplicador: 6,
            chance: 0.014,
            vidaMaxima: 9,
            descricao: "O espírito do dragão desperta e concentra sua fúria em um golpe lendário."
        }
    },

    espada_sagrada: {
        nome: "Espada Sagrada",
        raridade: "Lendária",
        tipo: "Espada",
        dano: 55,
        preco: 8000,
        tecnicas: [
            {
                nome: "Luz da Aurora",
                multiplicador: 1.45,
                descricao: "Um clarão dourado acompanha o corte."
            },
            {
                nome: "Julgamento Celestial",
                multiplicador: 1.75,
                descricao: "Energia sagrada desce sobre o adversário."
            },
            {
                nome: "Lança do Firmamento",
                multiplicador: 2.05,
                descricao: "Um feixe luminoso acompanha a estocada."
            },
            {
                nome: "Veredito Divino",
                multiplicador: 2.4,
                descricao: "Toda a energia da espada se concentra em um único impacto."
            }
        ],
        absoluto: {
            nome: "Apocalipse Celestial",
            multiplicador: 6.5,
            chance: 0.015,
            vidaMaxima: 8,
            descricao: "Uma luz ancestral responde ao guerreiro que se recusa a cair."
        }
    },

    espada_do_caos: {
        nome: "Espada do Caos",
        raridade: "Lendária",
        tipo: "Espada",
        dano: 65,
        preco: 12000,
        tecnicas: [
            {
                nome: "Fenda Caótica",
                multiplicador: 1.5,
                descricao: "Um corte distorce o espaço diante do inimigo."
            },
            {
                nome: "Tempestade Rubra",
                multiplicador: 1.8,
                descricao: "Uma sequência de golpes é alimentada pela energia do caos."
            },
            {
                nome: "Ruptura Dimensional",
                multiplicador: 2.1,
                descricao: "A lâmina parece rasgar a própria realidade."
            },
            {
                nome: "Julgamento do Caos",
                multiplicador: 2.5,
                descricao: "Toda a força da espada é concentrada em um golpe devastador."
            }
        ],
        absoluto: {
            nome: "Extinção Absoluta",
            multiplicador: 7,
            chance: 0.015,
            vidaMaxima: 8,
            descricao: "O selo da espada se rompe e o caos explode em um golpe extraordinário."
        }
    },

    katana_sangrenta: {
        nome: "Katana Sangrenta",
        raridade: "Lendária",
        tipo: "Katana",
        dano: 62,
        preco: 11500,
        tecnicas: [
            {
                nome: "Rastro Carmesim",
                multiplicador: 1.45,
                descricao: "Um arco vermelho acompanha o movimento da lâmina."
            },
            {
                nome: "Dança Escarlate",
                multiplicador: 1.8,
                descricao: "Uma sequência rápida cria rastros rubros no ar."
            },
            {
                nome: "Lua Carmesim",
                multiplicador: 2.1,
                descricao: "Um corte amplo libera uma onda de energia vermelha."
            },
            {
                nome: "Corte da Linhagem",
                multiplicador: 2.45,
                descricao: "A força de antigos guerreiros parece guiar a katana."
            }
        ],
        absoluto: {
            nome: "Eclipse Carmesim",
            multiplicador: 6.8,
            chance: 0.014,
            vidaMaxima: 9,
            descricao: "A lâmina brilha em vermelho enquanto sua técnica suprema desperta."
        }
    },

    espada_vazia: {
        nome: "Espada do Vazio",
        raridade: "Mítica",
        tipo: "Espada",
        dano: 78,
        preco: 22000,
        tecnicas: [
            {
                nome: "Corte do Nada",
                multiplicador: 1.55,
                descricao: "Um corte silencioso parece apagar tudo em seu caminho."
            },
            {
                nome: "Fenda do Vazio",
                multiplicador: 1.9,
                descricao: "Uma rachadura escura surge no ponto atingido."
            },
            {
                nome: "Colapso Espacial",
                multiplicador: 2.25,
                descricao: "O espaço se comprime ao redor do impacto."
            },
            {
                nome: "Devorador de Mundos",
                multiplicador: 2.7,
                descricao: "Uma força desconhecida envolve o inimigo e explode."
            }
        ],
        absoluto: {
            nome: "Zero Absoluto",
            multiplicador: 8,
            chance: 0.018,
            vidaMaxima: 7,
            descricao: "O vazio responde ao guerreiro no limite e libera uma força quase impossível de controlar."
        }
    },

    espada_deus_antigo: {
        nome: "Lâmina do Deus Antigo",
        raridade: "Mítica",
        tipo: "Espada",
        dano: 95,
        preco: 35000,
        tecnicas: [
            {
                nome: "Mandamento Ancestral",
                multiplicador: 1.6,
                descricao: "Uma ordem antiga acompanha o movimento da espada."
            },
            {
                nome: "Ruptura dos Céus",
                multiplicador: 2,
                descricao: "A lâmina libera energia capaz de estremecer o campo de batalha."
            },
            {
                nome: "Trono da Ruína",
                multiplicador: 2.4,
                descricao: "Uma onda de poder ancestral atinge o adversário."
            },
            {
                nome: "Fim da Era",
                multiplicador: 2.9,
                descricao: "A força acumulada de uma era esquecida explode em um golpe."
            }
        ],
        absoluto: {
            nome: "Decreto do Fim",
            multiplicador: 9,
            chance: 0.02,
            vidaMaxima: 5,
            descricao: "O poder do deus antigo desperta por um instante e ameaça mudar o destino da batalha."
        }
    }
};

// ==========================================================
// CONSULTAS DO ARSENAL
// ==========================================================

function obterArma(id) {
    return ARMAS[id] || null;
}

function listarArmas() {
    return Object.entries(ARMAS).map(([id, arma]) => ({
        id,
        ...arma
    }));
}

function obterTecnicas(id) {
    const arma = obterArma(id);
    return arma ? arma.tecnicas : [];
}

function obterAbsoluto(id) {
    const arma = obterArma(id);
    return arma ? arma.absoluto : null;
}

// ==========================================================
// ATAQUES AUTOMÁTICOS
// ==========================================================

function selecionarTecnica(id) {
    const tecnicas = obterTecnicas(id);

    if (!tecnicas.length) {
        return {
            nome: "Ataque Básico",
            multiplicador: 1,
            descricao: "O guerreiro desfere um ataque direto."
        };
    }

    return tecnicas[
        Math.floor(Math.random() * tecnicas.length)
    ];
}

// ==========================================================
// ABSOLUTO CRÍTICO
// Só pode acontecer quando a vida estiver na faixa definida.
// A chance é verificada uma vez por chamada.
// ==========================================================

function tentarAbsoluto(id, vidaAtual, vidaMaxima) {
    const absoluto = obterAbsoluto(id);

    if (!absoluto || vidaMaxima <= 0 || vidaAtual <= 0) {
        return null;
    }

    const percentualVida = (vidaAtual / vidaMaxima) * 100;

    if (percentualVida > absoluto.vidaMaxima) {
        return null;
    }

    if (Math.random() >= absoluto.chance) {
        return null;
    }

    return absoluto;
}

// ==========================================================
// EXPORTAÇÕES
// ==========================================================

module.exports = {
    ARMAS,
    obterArma,
    listarArmas,
    obterTecnicas,
    obterAbsoluto,
    selecionarTecnica,
    tentarAbsoluto
};
