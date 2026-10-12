// ==========================================================
// CRÔNICAS DO CAOS — BESTIÁRIO
// 15 monstros + 5 elites + 5 chefes
// Node.js / CommonJS
// ==========================================================

const MONSTROS = {
    lobo_sombrio: {
        nome: "Lobo Sombrio",
        tipo: "Comum",
        nivel: 1,
        vida: 55,
        ataque: 9,
        defesa: 2,
        xp: 20,
        moedas: 12,
        chanceItem: 0.15,
        narracao: "Do meio da névoa, dois olhos brilhantes observam você. O Lobo Sombrio rosna e avança sem hesitar.",
        derrota: "O lobo solta um último rosnado antes de desaparecer entre as sombras.",
        mapa: "Vila Inicial"
    },

    goblin_ladrao: {
        nome: "Goblin Ladrão",
        tipo: "Comum",
        nivel: 2,
        vida: 70,
        ataque: 11,
        defesa: 3,
        xp: 25,
        moedas: 18,
        chanceItem: 0.2,
        narracao: "Um goblin salta de trás de uma pedra, segurando uma lâmina torta e um sorriso malicioso.",
        derrota: "O goblin deixa cair algumas moedas e foge assustado.",
        mapa: "Vila Inicial"
    },

    esqueleto_guerreiro: {
        nome: "Esqueleto Guerreiro",
        tipo: "Comum",
        nivel: 3,
        vida: 90,
        ataque: 13,
        defesa: 5,
        xp: 32,
        moedas: 22,
        chanceItem: 0.18,
        narracao: "O som de ossos se chocando ecoa nas ruínas. Um guerreiro esquecido ergue sua espada enferrujada.",
        derrota: "Seus ossos se espalham pelo chão, finalmente livres de sua antiga maldição.",
        mapa: "Ruínas Antigas"
    },

    morcego_abissal: {
        nome: "Morcego Abissal",
        tipo: "Comum",
        nivel: 4,
        vida: 85,
        ataque: 16,
        defesa: 4,
        xp: 35,
        moedas: 24,
        chanceItem: 0.2,
        narracao: "Uma criatura alada desce do teto da caverna, emitindo um grito agudo que ecoa pelas paredes.",
        derrota: "O morcego cai e suas asas sombrias se desfazem na escuridão.",
        mapa: "Caverna Sombria"
    },

    aranha_venenosa: {
        nome: "Aranha Venenosa",
        tipo: "Comum",
        nivel: 5,
        vida: 110,
        ataque: 18,
        defesa: 6,
        xp: 42,
        moedas: 28,
        chanceItem: 0.25,
        narracao: "Fios de teia cobrem a passagem. Uma enorme aranha surge, preparando suas presas.",
        derrota: "A criatura recua e suas teias começam a se desfazer.",
        mapa: "Floresta Sombria"
    },

    bandido_exilado: {
        nome: "Bandido Exilado",
        tipo: "Comum",
        nivel: 6,
        vida: 125,
        ataque: 20,
        defesa: 8,
        xp: 48,
        moedas: 35,
        chanceItem: 0.22,
        narracao: "Um exilado bloqueia seu caminho. Sua armadura está danificada, mas seu olhar continua perigoso.",
        derrota: "O bandido abandona sua posição, deixando para trás parte de seu saque.",
        mapa: "Estrada dos Exilados"
    },

    cavaleiro_caido: {
        nome: "Cavaleiro Caído",
        tipo: "Comum",
        nivel: 8,
        vida: 170,
        ataque: 25,
        defesa: 12,
        xp: 60,
        moedas: 42,
        chanceItem: 0.25,
        narracao: "Uma armadura negra se ergue entre túmulos antigos. O cavaleiro não reconhece mais aliados ou inimigos.",
        derrota: "O cavaleiro ajoelha-se, e sua armadura cai vazia sobre as pedras.",
        mapa: "Cemitério Real"
    },

    lobo_fantasma: {
        nome: "Lobo Fantasma",
        tipo: "Comum",
        nivel: 9,
        vida: 160,
        ataque: 29,
        defesa: 10,
        xp: 68,
        moedas: 48,
        chanceItem: 0.25,
        narracao: "Uma silhueta translúcida atravessa as árvores. O uivo que ela solta faz a floresta inteira estremecer.",
        derrota: "O espírito se desfaz em partículas azuladas que desaparecem no vento.",
        mapa: "Floresta Sombria"
    },

    golem_pedra: {
        nome: "Golem de Pedra",
        tipo: "Comum",
        nivel: 10,
        vida: 260,
        ataque: 28,
        defesa: 22,
        xp: 75,
        moedas: 55,
        chanceItem: 0.3,
        narracao: "O chão treme quando um colosso de pedra desperta. Runas antigas brilham em seu peito.",
        derrota: "O gigante desmorona, revelando fragmentos minerais entre as pedras.",
        mapa: "Ruínas Antigas"
    },

    cultista_caos: {
        nome: "Cultista do Caos",
        tipo: "Comum",
        nivel: 12,
        vida: 220,
        ataque: 38,
        defesa: 15,
        xp: 90,
        moedas: 70,
        chanceItem: 0.3,
        narracao: "Um símbolo vermelho ilumina o chão. O cultista ergue as mãos e invoca uma energia instável.",
        derrota: "O símbolo perde o brilho e o cultista cai, deixando sua relíquia para trás.",
        mapa: "Templo do Caos"
    },

    serpente_cristalina: {
        nome: "Serpente Cristalina",
        tipo: "Comum",
        nivel: 14,
        vida: 280,
        ataque: 42,
        defesa: 18,
        xp: 105,
        moedas: 82,
        chanceItem: 0.32,
        narracao: "Escamas cristalinas refletem a luz. A serpente se enrola e prepara um ataque veloz.",
        derrota: "Seus cristais se quebram em fragmentos luminosos espalhados pelo chão.",
        mapa: "Montanhas Cristalinas"
    },

    espectro_guerreiro: {
        nome: "Espectro Guerreiro",
        tipo: "Comum",
        nivel: 16,
        vida: 300,
        ataque: 48,
        defesa: 20,
        xp: 120,
        moedas: 95,
        chanceItem: 0.3,
        narracao: "Uma antiga figura de armadura espectral surge carregando uma espada envolta em névoa.",
        derrota: "A armadura desaparece lentamente, deixando apenas o eco de uma batalha esquecida.",
        mapa: "Cemitério Real"
    },

    ogro_montanha: {
        nome: "Ogro da Montanha",
        tipo: "Comum",
        nivel: 18,
        vida: 420,
        ataque: 55,
        defesa: 25,
        xp: 140,
        moedas: 110,
        chanceItem: 0.35,
        narracao: "Um rugido atravessa a montanha. O ogro ergue seu enorme martelo e parte para o ataque.",
        derrota: "O ogro cai pesadamente, fazendo pedras rolarem pela encosta.",
        mapa: "Montanhas Cristalinas"
    },

    guardiao_runico: {
        nome: "Guardião Rúnico",
        tipo: "Comum",
        nivel: 20,
        vida: 480,
        ataque: 62,
        defesa: 32,
        xp: 165,
        moedas: 130,
        chanceItem: 0.38,
        narracao: "Runas antigas despertam nas paredes. O guardião abre os olhos e ergue sua arma ancestral.",
        derrota: "As runas se apagam uma a uma, encerrando a vigília do guardião.",
        mapa: "Templo do Caos"
    },

    demonio_errante: {
        nome: "Demônio Errante",
        tipo: "Comum",
        nivel: 22,
        vida: 540,
        ataque: 75,
        defesa: 35,
        xp: 190,
        moedas: 155,
        chanceItem: 0.4,
        narracao: "O ar fica pesado e uma presença infernal emerge de uma fenda escura.",
        derrota: "A criatura é envolvida por fumaça e retorna ao lugar de onde veio.",
        mapa: "Abismo Infernal"
    }
};

// ==========================================================
// ELITES
// Inimigos mais raros, resistentes e recompensadores.
// ==========================================================

const ELITES = {
    executor_negro: {
        nome: "Executor Negro",
        tipo: "Elite",
        nivel: 10,
        vida: 650,
        ataque: 65,
        defesa: 30,
        xp: 260,
        moedas: 180,
        chanceItem: 0.55,
        narracao: "Uma figura de manto negro surge carregando uma lâmina gigantesca. Sua presença silencia o ambiente.",
        derrota: "O Executor Negro cai de joelhos. Sua arma escura bate no chão e perde o brilho.",
        mapa: "Cemitério Real"
    },

    bruxa_sangue: {
        nome: "Bruxa do Sangue",
        tipo: "Elite",
        nivel: 15,
        vida: 800,
        ataque: 85,
        defesa: 28,
        xp: 340,
        moedas: 240,
        chanceItem: 0.6,
        narracao: "Velas vermelhas se acendem sozinhas. A bruxa sorri enquanto círculos mágicos surgem sob seus pés.",
        derrota: "O círculo mágico se desfaz e a bruxa desaparece em uma nuvem carmesim.",
        mapa: "Templo do Caos"
    },

    cavaleiro_apocalipse: {
        nome: "Cavaleiro do Apocalipse",
        tipo: "Elite",
        nivel: 20,
        vida: 1200,
        ataque: 105,
        defesa: 48,
        xp: 480,
        moedas: 350,
        chanceItem: 0.65,
        narracao: "Um cavaleiro montado em uma criatura espectral atravessa a névoa. Sua armadura anuncia uma antiga profecia.",
        derrota: "A montaria desaparece e o cavaleiro cai, encerrando sua marcha silenciosa.",
        mapa: "Abismo Infernal"
    },

    quimera_ancestral: {
        nome: "Quimera Ancestral",
        tipo: "Elite",
        nivel: 25,
        vida: 1600,
        ataque: 135,
        defesa: 55,
        xp: 650,
        moedas: 470,
        chanceItem: 0.7,
        narracao: "Três rugidos diferentes ecoam na arena. Uma quimera colossal avança, exibindo suas presas e garras.",
        derrota: "A quimera desaba e sua energia ancestral se dispersa pelo campo.",
        mapa: "Montanhas Cristalinas"
    },

    arauto_do_vazio: {
        nome: "Arauto do Vazio",
        tipo: "Elite",
        nivel: 30,
        vida: 2200,
        ataque: 175,
        defesa: 70,
        xp: 900,
        moedas: 650,
        chanceItem: 0.75,
        narracao: "Uma rachadura surge no ar. O Arauto atravessa a fenda, e as sombras ao redor parecem se curvar diante dele.",
        derrota: "A fenda se fecha e o Arauto é arrastado de volta ao vazio.",
        mapa: "Abismo Infernal"
    }
};

// ==========================================================
// CHEFES
// Encontros especiais com recompensas maiores.
// ==========================================================

const CHEFES = {
    rei_esqueleto: {
        nome: "Rei Esqueleto",
        tipo: "Chefe",
        nivel: 10,
        vida: 2500,
        ataque: 100,
        defesa: 45,
        xp: 1000,
        moedas: 800,
        chanceItem: 0.8,
        narracao: "As portas do mausoléu se abrem. Em um trono de ossos, o Rei Esqueleto ergue sua coroa e ordena que os vivos se ajoelhem.",
        derrota: "A coroa rola pelo chão enquanto o reino dos mortos perde seu soberano.",
        mapa: "Cemitério Real"
    },

    dragao_ancestral: {
        nome: "Dragão Ancestral",
        tipo: "Chefe",
        nivel: 20,
        vida: 5000,
        ataque: 180,
        defesa: 75,
        xp: 2200,
        moedas: 1600,
        chanceItem: 0.85,
        narracao: "Um rugido colossal sacode as montanhas. O Dragão Ancestral abre suas asas, cobrindo o céu com sua sombra.",
        derrota: "O dragão abaixa a cabeça e sua chama ancestral se apaga lentamente.",
        mapa: "Montanhas Cristalinas"
    },

    senhor_do_abismo: {
        nome: "Senhor do Abismo",
        tipo: "Chefe",
        nivel: 30,
        vida: 9000,
        ataque: 260,
        defesa: 110,
        xp: 4500,
        moedas: 3200,
        chanceItem: 0.9,
        narracao: "O abismo inteiro parece despertar. Uma figura colossal emerge das profundezas, carregando o peso de incontáveis eras.",
        derrota: "As correntes do abismo se fecham, aprisionando novamente o Senhor das Profundezas.",
        mapa: "Abismo Infernal"
    },

    deus_decaido: {
        nome: "Deus Decaído",
        tipo: "Chefe",
        nivel: 40,
        vida: 15000,
        ataque: 380,
        defesa: 145,
        xp: 8000,
        moedas: 6000,
        chanceItem: 0.95,
        narracao: "O céu escurece. Uma divindade esquecida desce entre raios de energia, e sua presença faz as ruínas estremecerem.",
        derrota: "A luz divina desaparece do campo de batalha. Pela primeira vez em eras, o silêncio retorna.",
        mapa: "Templo do Caos"
    },

    soberano_do_caos: {
        nome: "Soberano do Caos",
        tipo: "Chefe",
        nivel: 50,
        vida: 30000,
        ataque: 550,
        defesa: 200,
        xp: 15000,
        moedas: 12000,
        chanceItem: 1,
        narracao: "O mundo perde suas cores quando o Soberano do Caos desperta. Diante dele, até as sombras parecem recuar.",
        derrota: "A tempestade se dissipa. O Soberano desaparece, deixando uma única certeza: o caos nunca é destruído para sempre.",
        mapa: "Trono do Caos"
    }
};

// ==========================================================
// FUNÇÕES DO BESTIÁRIO
// ==========================================================

function obterMonstro(id) {
    return (
        MONSTROS[id] ||
        ELITES[id] ||
        CHEFES[id] ||
        null
    );
}

function listarMonstros(tipo = null) {
    const todos = [
        ...Object.entries(MONSTROS).map(([id, monstro]) => ({
            id,
            ...monstro
        })),
        ...Object.entries(ELITES).map(([id, monstro]) => ({
            id,
            ...monstro
        })),
        ...Object.entries(CHEFES).map(([id, monstro]) => ({
            id,
            ...monstro
        }))
    ];

    if (!tipo) return todos;

    return todos.filter(
        monstro =>
            monstro.tipo.toLowerCase() === tipo.toLowerCase()
    );
}

function sortearMonstro(nivel = 1) {
    const disponiveis = Object.entries(MONSTROS)
        .filter(([, monstro]) => monstro.nivel <= nivel + 3);

    const lista = disponiveis.length
        ? disponiveis
        : Object.entries(MONSTROS).slice(0, 3);

    const [id, monstro] =
        lista[Math.floor(Math.random() * lista.length)];

    return { id, ...monstro };
}

function sortearElite(nivel = 1) {
    const disponiveis = Object.entries(ELITES)
        .filter(([, monstro]) => monstro.nivel <= nivel + 5);

    if (!disponiveis.length) return null;

    const [id, monstro] =
        disponiveis[Math.floor(Math.random() * disponiveis.length)];

    return { id, ...monstro };
}

function sortearChefe(nivel = 1) {
    const disponiveis = Object.entries(CHEFES)
        .filter(([, chefe]) => chefe.nivel <= nivel + 5);

    if (!disponiveis.length) return null;

    const [id, chefe] =
        disponiveis[Math.floor(Math.random() * disponiveis.length)];

    return { id, ...chefe };
}

// ==========================================================
// EXPORTAÇÕES
// ==========================================================

module.exports = {
    MONSTROS,
    ELITES,
    CHEFES,
    obterMonstro,
    listarMonstros,
    sortearMonstro,
    sortearElite,
    sortearChefe
};
