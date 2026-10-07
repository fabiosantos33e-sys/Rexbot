// ================================================================
// BOT RPG MUNDO ABERTO - VERSÃO COMPLETA CORRIGIDA
// Autor: Dola
// Versão: 3.1.0 CORRIGIDA
// Adm ID: 1053803800340746261
// Comandos: ,comando (não barra)
// ================================================================

const Discord = require('discord.js');
const {
    Client,
    GatewayIntentBits,
    Collection,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionsBitField
} = require('discord.js');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ================================================================
// CONFIGURAÇÕES GERAIS
// ================================================================

const ADM_ID = '1053803800340746261';
const PREFIX = ',';
const MAX_LEVEL = 300;
const DATA_DIR = path.join(__dirname, 'dados_rpg');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

let client = null;
let inicializado = false;
const sessoesCombate = new Map();

// ================================================================
// BANCO DE DADOS SIMPLES
// ================================================================

class Database {
    constructor() {
        this.players = {};
        this.monsters = {};
        this.dungeons = {};
        this.loadAll();
    }

    loadAll() {
        try {
            if (fs.existsSync(path.join(DATA_DIR, 'jogadores.json'))) {
                this.players = JSON.parse(
                    fs.readFileSync(
                        path.join(DATA_DIR, 'jogadores.json'),
                        'utf8'
                    )
                );
            }

            if (fs.existsSync(path.join(DATA_DIR, 'monstros.json'))) {
                this.monsters = JSON.parse(
                    fs.readFileSync(
                        path.join(DATA_DIR, 'monstros.json'),
                        'utf8'
                    )
                );
            }

            if (fs.existsSync(path.join(DATA_DIR, 'masmorras.json'))) {
                this.dungeons = JSON.parse(
                    fs.readFileSync(
                        path.join(DATA_DIR, 'masmorras.json'),
                        'utf8'
                    )
                );
            }
        } catch (e) {
            console.log('[DB] Erro ao carregar dados:', e.message);
        }
    }

    saveAll() {
        fs.writeFileSync(
            path.join(DATA_DIR, 'jogadores.json'),
            JSON.stringify(this.players, null, 2)
        );

        fs.writeFileSync(
            path.join(DATA_DIR, 'monstros.json'),
            JSON.stringify(this.monsters, null, 2)
        );

        fs.writeFileSync(
            path.join(DATA_DIR, 'masmorras.json'),
            JSON.stringify(this.dungeons, null, 2)
        );
    }

    getPlayer(id) {
        if (!this.players[id]) {
            this.createPlayer(id);
        }

        return this.players[id];
    }

    createPlayer(id) {
        this.players[id] = {
            id: id,
            nome: '',
            nivel: 1,
            xp: 0,
            xpProx: 100,
            moedas: 100,
            vida: 100,
            vidaMax: 100,
            ataque: 10,
            defesa: 5,
            velocidade: 5,
            sorte: 1,
            classe: 'Aventureiro',
            armaAtual: null,
            armaduraAtual: null,
            inventario: [],
            armas: [],
            armaduras: [],
            missoes: [],
            conquistas: [],
            ultimoTreino: 0,
            ultimaCaca: 0,
            ultimaExploracao: 0,
            mapaAtual: 'Floresta Inicial',
            tempoJogado: 0,
            expiracaoConta: null,
            ultimoLogin: Date.now()
        };

        return this.players[id];
    }

    savePlayer(id) {
        if (this.players[id]) {
            this.players[id].ultimoLogin = Date.now();
            this.saveAll();
        }
    }
}

const db = new Database();

// ================================================================
// SISTEMA DE RARIDADES
// ================================================================

const RARIDADES = {
    COMUM: {
        nome: 'Comum',
        cor: '#95a5a5',
        chance: 45,
        multiplicador: 1
    },

    INCOMUM: {
        nome: 'Incomum',
        cor: '#2ecc71',
        chance: 25,
        multiplicador: 1.3
    },

    RARO: {
        nome: 'Raro',
        cor: '#3498db',
        chance: 15,
        multiplicador: 1.7
    },

    EPICO: {
        nome: 'Épico',
        cor: '#9b59b6',
        chance: 8,
        multiplicador: 2.2
    },

    LENDARIO: {
        nome: 'Lendário',
        cor: '#f39c12',
        chance: 4,
        multiplicador: 3
    },

    MITICO: {
        nome: 'Mítico',
        cor: '#e74c3c',
        chance: 2,
        multiplicador: 4.5
    },

    DIVINO: {
        nome: 'Divino',
        cor: '#ffd700',
        chance: 1,
        multiplicador: 6
    },

    PERDIDO: {
        nome: 'Perdido',
        cor: '#1a1a2e',
        chance: 0.5,
        multiplicador: 10
    }
};

function getRaridadeAleatoria(sorte = 1) {
    const ajuste = Math.min(sorte * 0.02, 0.3);

    const rand = Math.random() * 100;
    let acumulado = 0;

    for (const [chave, r] of Object.entries(RARIDADES)) {
        let chanceAjustada = r.chance;

        if (chave !== 'COMUM') {
            chanceAjustada += chanceAjustada * ajuste;
        }

        acumulado += chanceAjustada;

        if (rand <= acumulado) {
            return chave;
        }
    }

    return 'COMUM';
}

// ================================================================
// SISTEMA DE ARMAS
// ================================================================

const ARMAS = {
    ESPADAS: [
        {
            id: 'espada_1',
            nome: 'Lâmina do Sol Crescente',
            fonte: 'Original',
            atk: 12,
            desc: 'Brilha ao amanhecer'
        },
        {
            id: 'espada_2',
            nome: 'Espada Z',
            fonte: 'Dragon Ball',
            atk: 18,
            desc: 'Empunhada por guerreiros lendários'
        },
        {
            id: 'espada_3',
            nome: 'Cortador de Aço',
            fonte: 'One Piece',
            atk: 22,
            desc: 'Resistente a qualquer golpe'
        },
        {
            id: 'espada_4',
            nome: 'Lâmina Negra',
            fonte: 'Berserk',
            atk: 35,
            desc: 'Aniquila a escuridão'
        },
        {
            id: 'espada_5',
            nome: 'Tessaiga',
            fonte: 'InuYasha',
            atk: 42,
            desc: 'Transforma-se em lâmina de demônio'
        },
        {
            id: 'espada_6',
            nome: 'Kusanagi',
            fonte: 'Naruto',
            atk: 50,
            desc: 'A espada lendária das serpentes'
        },
        {
            id: 'espada_7',
            nome: 'Excalibur',
            fonte: 'Fate',
            atk: 55,
            desc: 'A espada sagrada da rainha'
        },
        {
            id: 'espada_8',
            nome: 'Lâmina de Luz',
            fonte: 'Sword Art Online',
            atk: 48,
            desc: 'Brilha intensamente no campo de batalha'
        },
        {
            id: 'espada_9',
            nome: 'Enma',
            fonte: 'One Piece',
            atk: 60,
            desc: 'Drena o poder do portador em troca de força'
        },
        {
            id: 'espada_10',
            nome: 'Gram',
            fonte: 'Saga dos Volsungos',
            atk: 65,
            desc: 'A espada que corta tudo'
        },
        {
            id: 'espada_11',
            nome: 'Durandal',
            fonte: 'A Lenda de Roland',
            atk: 58,
            desc: 'Indestrutível'
        },
        {
            id: 'espada_12',
            nome: 'Ascalon',
            fonte: 'Dragões e Demônios',
            atk: 70,
            desc: 'Espada que abate dragões'
        },
        {
            id: 'espada_13',
            nome: 'Muramasa',
            fonte: 'Anime/História',
            atk: 75,
            desc: 'Espada amaldiçoada que devora almas'
        },
        {
            id: 'espada_14',
            nome: 'Masamune',
            fonte: 'Anime/História',
            atk: 72,
            desc: 'A obra-prima dos ferreiros lendários'
        },
        {
            id: 'espada_15',
            nome: 'Cortadora de Céus',
            fonte: 'Naruto',
            atk: 80,
            desc: 'A lâmina que desafia os deuses'
        },
        {
            id: 'espada_16',
            nome: 'Gurren',
            fonte: 'Gurren Lagann',
            atk: 85,
            desc: 'Perfura o céu e o destino'
        },
        {
            id: 'espada_17',
            nome: 'Lâmina do Vazio',
            fonte: 'Guilty Crown',
            atk: 78,
            desc: 'Extrai a alma do inimigo'
        },
        {
            id: 'espada_18',
            nome: 'Espada do Rei',
            fonte: 'Fate/Zero',
            atk: 90,
            desc: 'A espada que governa todos'
        },
        {
            id: 'espada_19',
            nome: 'Dragão Dourado',
            fonte: 'Original',
            atk: 88,
            desc: 'Forjada nas chamas de um dragão ancião'
        },
        {
            id: 'espada_20',
            nome: 'Fim dos Tempos',
            fonte: 'Final Fantasy',
            atk: 95,
            desc: 'A lâmina que marca o fim da era'
        },
        {
            id: 'espada_21',
            nome: 'Sombra Eterna',
            fonte: 'Original',
            atk: 62,
            desc: 'Não reflete luz nenhuma'
        },
        {
            id: 'espada_22',
            nome: 'Céu e Terra',
            fonte: 'Samurai X',
            atk: 74,
            desc: 'Golpe que une opostos'
        },
        {
            id: 'espada_23',
            nome: 'Blade of Olympus',
            fonte: 'God of War',
            atk: 92,
            desc: 'Poder que destrói deuses'
        },
        {
            id: 'espada_24',
            nome: 'Zangetsu',
            fonte: 'Bleach',
            atk: 82,
            desc: 'A verdadeira forma do portador'
        },
        {
            id: 'espada_25',
            nome: 'Todas as Coisas',
            fonte: 'Bleach',
            atk: 100,
            desc: 'Conhece o céu e a terra'
        },
        {
            id: 'espada_26',
            nome: 'Lâmina do Abismo',
            fonte: 'Original',
            atk: 96,
            desc: 'Vem de onde a luz não chega'
        },
        {
            id: 'espada_27',
            nome: 'Estrela da Manhã',
            fonte: 'Original',
            atk: 68,
            desc: 'Anuncia a vitória'
        },
        {
            id: 'espada_28',
            nome: 'Cortadora de Destino',
            fonte: 'Shakugan no Shana',
            atk: 86,
            desc: 'Altera o fio do destino'
        },
        {
            id: 'espada_29',
            nome: 'Estalagmite Sagrada',
            fonte: 'Original',
            atk: 71,
            desc: 'Forjada em montanha sagrada'
        },
        {
            id: 'espada_30',
            nome: 'Supremo Juízo',
            fonte: 'Original',
            atk: 110,
            desc: 'A espada mais sagrada já criada'
        }
    ],

    FOICES: [
        {
            id: 'foice_1',
            nome: 'Ceifadora de Almas',
            fonte: 'Original',
            atk: 14,
            desc: 'Colhe almas dos caídos'
        },
        {
            id: 'foice_2',
            nome: 'Yoru',
            fonte: 'One Piece',
            atk: 45,
            desc: 'A lâmina negra do maior espadachim'
        },
        {
            id: 'foice_3',
            nome: 'Foice da Morte',
            fonte: 'Série/Anime',
            atk: 52,
            desc: 'A própria morte em forma de arma'
        },
        {
            id: 'foice_4',
            nome: 'Lua Minguante',
            fonte: 'Original',
            atk: 38,
            desc: 'Cresce em poder à noite'
        },
        {
            id: 'foice_5',
            nome: 'Ceifadora de Estrelas',
            fonte: 'Original',
            atk: 78,
            desc: 'Corta a luz das estrelas'
        },
        {
            id: 'foice_6',
            nome: 'Kagura',
            fonte: 'Gintama',
            atk: 44,
            desc: 'Arma de força bruta e agilidade'
        },
        {
            id: 'foice_7',
            nome: 'Crepúsculo Carmim',
            fonte: 'Original',
            atk: 65,
            desc: 'Manchada com sangue de mil inimigos'
        },
        {
            id: 'foice_8',
            nome: 'Chamas do Inferno',
            fonte: 'Anime Clássico',
            atk: 72,
            desc: 'Queima com fogo negro'
        },
        {
            id: 'foice_9',
            nome: 'Fim da Estrada',
            fonte: 'Original',
            atk: 85,
            desc: 'O último golpe que alguém recebe'
        },
        {
            id: 'foice_10',
            nome: 'Véu do Esquecimento',
            fonte: 'Original',
            atk: 90,
            desc: 'Apaga a memória da vitória'
        },
        {
            id: 'foice_11',
            nome: 'Lua Sangrenta',
            fonte: 'Anime',
            atk: 88,
            desc: 'Brilha vermelho em noites de lua cheia'
        }
    ],

    MACHADOS: [
        {
            id: 'machado_1',
            nome: 'Machado do Aventureiro',
            fonte: 'Original',
            atk: 16,
            desc: 'Um machado simples e confiável'
        },
        {
            id: 'machado_2',
            nome: 'Machado do Trovão',
            fonte: 'Original',
            atk: 30,
            desc: 'Carregado com energia elétrica'
        },
        {
            id: 'machado_3',
            nome: 'Machado do Gigante',
            fonte: 'Mitologia',
            atk: 48,
            desc: 'Pesado e extremamente poderoso'
        },
        {
            id: 'machado_4',
            nome: 'Leviatã',
            fonte: 'God of War',
            atk: 70,
            desc: 'Um machado capaz de congelar inimigos'
        },
        {
            id: 'machado_5',
            nome: 'Machado Infernal',
            fonte: 'Original',
            atk: 85,
            desc: 'Forjado nas profundezas'
        },
        {
            id: 'machado_6',
            nome: 'Destruidor',
            fonte: 'Original',
            atk: 100,
            desc: 'Criado para destruir tudo em seu caminho'
        }
    ]
};

// ================================================================
// MONSTROS
// ================================================================

const MONSTROS = [
    {
        nome: 'Slime Verde',
        nivelMin: 1,
        nivelMax: 10,
        vida: 50,
        ataque: 8,
        defesa: 2,
        xp: 30,
        moedas: 15,
        emoji: '🟢'
    },
    {
        nome: 'Goblin',
        nivelMin: 2,
        nivelMax: 15,
        vida: 80,
        ataque: 12,
        defesa: 4,
        xp: 45,
        moedas: 25,
        emoji: '👺'
    },
    {
        nome: 'Lobo Sombrio',
        nivelMin: 5,
        nivelMax: 20,
        vida: 120,
        ataque: 18,
        defesa: 6,
        xp: 70,
        moedas: 35,
        emoji: '🐺'
    },
    {
        nome: 'Orc Guerreiro',
        nivelMin: 10,
        nivelMax: 30,
        vida: 200,
        ataque: 25,
        defesa: 10,
        xp: 120,
        moedas: 60,
        emoji: '👹'
    },
    {
        nome: 'Esqueleto',
        nivelMin: 15,
        nivelMax: 40,
        vida: 250,
        ataque: 30,
        defesa: 12,
        xp: 150,
        moedas: 75,
        emoji: '💀'
    },
    {
        nome: 'Aranha Gigante',
        nivelMin: 20,
        nivelMax: 50,
        vida: 350,
        ataque: 38,
        defesa: 15,
        xp: 200,
        moedas: 100,
        emoji: '🕷️'
    },
    {
        nome: 'Cavaleiro Negro',
        nivelMin: 30,
        nivelMax: 70,
        vida: 600,
        ataque: 55,
        defesa: 25,
        xp: 350,
        moedas: 180,
        emoji: '🖤'
    },
    {
        nome: 'Dragão Jovem',
        nivelMin: 50,
        nivelMax: 100,
        vida: 1200,
        ataque: 100,
        defesa: 45,
        xp: 800,
        moedas: 400,
        emoji: '🐉'
    },
    {
        nome: 'Demônio Superior',
        nivelMin: 80,
        nivelMax: 150,
        vida: 2500,
        ataque: 180,
        defesa: 80,
        xp: 1500,
        moedas: 800,
        emoji: '😈'
    },
    {
        nome: 'Titã Ancestral',
        nivelMin: 120,
        nivelMax: 200,
        vida: 5000,
        ataque: 300,
        defesa: 150,
        xp: 3000,
        moedas: 1500,
        emoji: '🗿'
    },
    {
        nome: 'Deus Caído',
        nivelMin: 180,
        nivelMax: 300,
        vida: 10000,
        ataque: 500,
        defesa: 250,
        xp: 8000,
        moedas: 5000,
        emoji: '⚡'
    }
];

// ================================================================
// MAPAS
// ================================================================

const MAPAS = {
    'Floresta Inicial': {
        nivelMin: 1,
        nivelMax: 20,
        desc: 'Uma floresta tranquila para novos aventureiros.',
        cor: '#2ecc71',
        monstros: ['Slime Verde', 'Goblin'],
        chefe: 'Nenhum',
        chanceDangeou: 0.1,
        chanceDangeouDupla: 0.02
    },

    'Planície dos Lobos': {
        nivelMin: 5,
        nivelMax: 30,
        desc: 'Uma vasta planície dominada por lobos.',
        cor: '#f39c12',
        monstros: ['Lobo Sombrio', 'Goblin'],
        chefe: 'Lobo Alfa',
        chanceDangeou: 0.12,
        chanceDangeouDupla: 0.03
    },

    'Caverna Sombria': {
        nivelMin: 15,
        nivelMax: 50,
        desc: 'Uma caverna escura cheia de criaturas perigosas.',
        cor: '#34495e',
        monstros: ['Esqueleto', 'Aranha Gigante'],
        chefe: 'Guardião das Trevas',
        chanceDangeou: 0.15,
        chanceDangeouDupla: 0.04
    },

    'Ruínas Antigas': {
        nivelMin: 30,
        nivelMax: 80,
        desc: 'Ruínas de uma civilização esquecida.',
        cor: '#9b59b6',
        monstros: ['Cavaleiro Negro', 'Esqueleto'],
        chefe: 'Rei Esquecido',
        chanceDangeou: 0.18,
        chanceDangeouDupla: 0.05
    },

    'Vale dos Dragões': {
        nivelMin: 50,
        nivelMax: 120,
        desc: 'Território onde dragões vivem.',
        cor: '#e74c3c',
        monstros: ['Dragão Jovem', 'Orc Guerreiro'],
        chefe: 'Dragão Ancião',
        chanceDangeou: 0.2,
        chanceDangeouDupla: 0.08
    },

    'Abismo Negro': {
        nivelMin: 100,
        nivelMax: 200,
        desc: 'Um lugar onde poucos sobrevivem.',
        cor: '#1a1a2e',
        monstros: ['Demônio Superior', 'Titã Ancestral'],
        chefe: 'Senhor do Abismo',
        chanceDangeou: 0.25,
        chanceDangeouDupla: 0.1
    },

    'Reino Divino': {
        nivelMin: 200,
        nivelMax: 300,
        desc: 'O território dos seres divinos.',
        cor: '#ffd700',
        monstros: ['Deus Caído', 'Titã Ancestral'],
        chefe: 'Criador',
        chanceDangeou: 0.3,
        chanceDangeouDupla: 0.15
    }
};

// ================================================================
// CHEFES
// ================================================================

const CHEFES = [
    {
        nome: 'Rei Goblin',
        nivel: 25,
        vida: 5000,
        ataque: 120,
        defesa: 60,
        xp: 2500,
        moedas: 1500,
        emoji: '👑'
    },
    {
        nome: 'Dragão Ancião',
        nivel: 50,
        vida: 15000,
        ataque: 300,
        defesa: 150,
        xp: 10000,
        moedas: 5000,
        emoji: '🐲'
    },
    {
        nome: 'Demônio Supremo',
        nivel: 100,
        vida: 40000,
        ataque: 600,
        defesa: 300,
        xp: 30000,
        moedas: 15000,
        emoji: '👿'
    },
    {
        nome: 'Titã Supremo',
        nivel: 150,
        vida: 80000,
        ataque: 1000,
        defesa: 500,
        xp: 60000,
        moedas: 30000,
        emoji: '⚔️'
    },
    {
        nome: 'Deus do Abismo',
        nivel: 200,
        vida: 150000,
        ataque: 1800,
        defesa: 900,
        xp: 120000,
        moedas: 60000,
        emoji: '🌑'
    },
    {
        nome: 'Criador',
        nivel: 300,
        vida: 500000,
        ataque: 5000,
        defesa: 2500,
        xp: 500000,
        moedas: 250000,
        emoji: '✨'
    }
];

// ================================================================
// MASMORRAS
// ================================================================

const MASMORRAS = [
    {
        id: 'floresta',
        nome: 'Masmorra da Floresta',
        nivelMin: 5,
        salas: 5,
        recompensa: 500
    },
    {
        id: 'caverna',
        nome: 'Masmorra da Caverna',
        nivelMin: 20,
        salas: 8,
        recompensa: 1500
    },
    {
        id: 'ruinas',
        nome: 'Masmorra das Ruínas',
        nivelMin: 50,
        salas: 10,
        recompensa: 5000
    },
    {
        id: 'abismo',
        nome: 'Masmorra do Abismo',
        nivelMin: 100,
        salas: 15,
        recompensa: 15000
    },
    {
        id: 'divina',
        nome: 'Masmorra Divina',
        nivelMin: 200,
        salas: 20,
        recompensa: 50000
    }
];

// ================================================================
// FUNÇÕES AUXILIARES
// ================================================================

function calcularXpProxNivel(nivel) {
    return Math.floor(100 * Math.pow(1.35, nivel - 1));
}

function calcularAtaqueTotal(jogador) {
    let total = jogador.ataque || 0;

    if (jogador.armaAtual) {
        total += jogador.armaAtual.atk || 0;
    }

    return total;
}

function calcularDefesaTotal(jogador) {
    let total = jogador.defesa || 0;

    if (jogador.armaduraAtual) {
        total += jogador.armaduraAtual.def || 0;
    }

    return total;
}

function ganharXp(jogador, quantidade) {
    const subiu = [];

    jogador.xp += quantidade;

    while (
        jogador.xp >= jogador.xpProx &&
        jogador.nivel < MAX_LEVEL
    ) {
        jogador.xp -= jogador.xpProx;
        jogador.nivel++;

        jogador.xpProx = calcularXpProxNivel(jogador.nivel);

        jogador.vidaMax += 10;
        jogador.vida = jogador.vidaMax;
        jogador.ataque += 2;
        jogador.defesa += 1;

        subiu.push(jogador.nivel);
    }

    if (jogador.nivel >= MAX_LEVEL) {
        jogador.nivel = MAX_LEVEL;
        jogador.xp = 0;
        jogador.xpProx = calcularXpProxNivel(MAX_LEVEL);
    }

    return subiu;
}

function formatarArma(arma) {
    const raridade =
        RARIDADES[arma.raridade] || RARIDADES.COMUM;

    return [
        `🗡️ **${arma.nome}**`,
        `⭐ Raridade: **${raridade.nome}**`,
        `⚔️ Ataque: **${arma.atk}**`,
        `📖 ${arma.desc || 'Sem descrição.'}`,
        `🎬 Fonte: **${arma.fonte || 'Original'}**`
    ].join('\n');
}

function criarArmaAleatoria(tipo, jogador) {
    const lista = ARMAS[tipo];

    if (!lista || !lista.length) {
        return null;
    }

    const base =
        lista[Math.floor(Math.random() * lista.length)];

    const raridade =
        getRaridadeAleatoria(jogador.sorte || 1);

    const info = RARIDADES[raridade];

    return {
        ...base,
        raridade,
        atk: Math.max(
            1,
            Math.floor(base.atk * info.multiplicador)
        ),
        uuid: crypto.randomBytes(8).toString('hex'),
        dataObtencao: Date.now()
    };
}

function escolherMonstro(nivel) {
    const disponiveis = MONSTROS.filter(
        m =>
            nivel >= m.nivelMin &&
            nivel <= m.nivelMax + 20
    );

    if (!disponiveis.length) {
        return MONSTROS[0];
    }

    return disponiveis[
        Math.floor(Math.random() * disponiveis.length)
    ];
}

function verificarExpiracao(jogador) {
    if (!jogador.expiracaoConta) {
        return {
            expirado: false,
            diasRestantes: null
        };
    }

    const restante =
        jogador.expiracaoConta - Date.now();

    if (restante <= 0) {
        return {
            expirado: true,
            diasRestantes: 0
        };
    }

    return {
        expirado: false,
        diasRestantes: Math.ceil(
            restante / (1000 * 60 * 60 * 24)
        )
    };
}

function formatarTempo(ms) {
    const segundos = Math.floor(ms / 1000);
    const horas = Math.floor(segundos / 3600);
    const minutos =
        Math.floor((segundos % 3600) / 60);

    return `${horas}h ${minutos}min`;
}

function cooldownRestante(ultimo, tempo) {
    const restante =
        tempo - (Date.now() - ultimo);

    return restante <= 0
        ? 0
        : Math.ceil(restante / 1000);
}

function barraProgresso(
    atual,
    max,
    tamanho = 10
) {
    if (max <= 0) {
        return '░'.repeat(tamanho);
    }

    const porcentagem =
        Math.max(0, Math.min(1, atual / max));

    const cheios =
        Math.round(porcentagem * tamanho);

    return (
        '█'.repeat(cheios) +
        '░'.repeat(tamanho - cheios)
    );
}

function gerarDangeou(jogador, tipo) {
    const masmorra =
        tipo === 'secreto'
            ? {
                id: 'secreta',
                nome: 'Masmorra Secreta',
                nivelMin: 100,
                salas: 20,
                recompensa: 50000
            }
            : MASMORRAS
                .filter(
                    m =>
                        jogador.nivel >= m.nivelMin
                )
                .sort(
                    (a, b) =>
                        b.nivelMin - a.nivelMin
                )[0] || MASMORRAS[0];

    const monstrosSala = [];

    for (
        let i = 0;
        i < Math.min(3, Math.ceil(masmorra.salas / 5));
        i++
    ) {
        monstrosSala.push(
            escolherMonstro(
                Math.min(
                    MAX_LEVEL,
                    jogador.nivel +
                    Math.floor(Math.random() * 10)
                )
            )
        );
    }

    return {
        masmorra,
        salasConcluidas: 0,
        salasTotal: masmorra.salas,
        monstros: monstrosSala,
        xpTotal: 0,
        moedasTotal: 0,
        iniciadoEm: Date.now()
    };
}

async function processarCombate(
    canal,
    jogador,
    sessao
) {
    for (
        let sala = 0;
        sala < sessao.salasTotal;
        sala++
    ) {
        if (
            Date.now() - sessao.iniciadoEm >
            5 * 60 * 1000
        ) {
            sessoesCombate.delete(jogador.id);

            return canal.send(
                '⏳ Tempo esgotado! Dangeou cancelada.'
            );
        }

        const monstro =
            escolherMonstro(
                Math.min(
                    MAX_LEVEL,
                    jogador.nivel +
                    Math.floor(Math.random() * 10)
                )
            );

        const resultado =
            processarCombateIndividual(
                jogador,
                monstro
            );

        if (!resultado.venceu) {
            jogador.vida =
                Math.max(
                    1,
                    Math.floor(
                        jogador.vidaMax * 0.15
                    )
                );

            db.savePlayer(jogador.id);
            sessoesCombate.delete(jogador.id);

            return canal.send(
                `💀 Derrotado na sala **${sala + 1}/${sessao.salasTotal}**!\n` +
                `❤️ Vida: ${jogador.vida}/${jogador.vidaMax}`
            );
        }

        sessao.salasConcluidas++;
        sessao.xpTotal += monstro.xp;
        sessao.moedasTotal += monstro.moedas;
    }

    jogador.moedas +=
        sessao.moedasTotal +
        sessao.masmorra.recompensa;

    const subiu =
        ganharXp(jogador, sessao.xpTotal);

    let drop = null;

    if (Math.random() < 0.4) {
        const tipos = [
            'ESPADAS',
            'FOICES',
            'MACHADOS'
        ];

        drop = criarArmaAleatoria(
            tipos[
                Math.floor(
                    Math.random() * tipos.length
                )
            ],
            jogador
        );

        if (drop) {
            jogador.armas.push(drop);
        }
    }

    db.savePlayer(jogador.id);
    sessoesCombate.delete(jogador.id);

    let resposta =
        `🏰 **MASMORRA CONCLUÍDA!**\n\n` +
        `📍 ${sessao.masmorra.nome}\n` +
        `🚪 Salas: ${sessao.salasConcluidas}/${sessao.salasTotal}\n` +
        `⭐ XP: +${sessao.xpTotal}\n` +
        `💰 Moedas: +${sessao.moedasTotal + sessao.masmorra.recompensa}`;

    if (subiu.length) {
        resposta +=
            `\n🎉 Nível: ${jogador.nivel}`;
    }

    if (drop) {
        resposta +=
            `\n\n🎁 **DROP!**\n${formatarArma(drop)}`;
    }

    await canal.send(resposta);
}

function processarCombateIndividual(
    jogador,
    inimigo
) {
    const resultado = [];

    let vidaJogador = jogador.vida;
    let vidaInimigo = inimigo.vida;

    const ataqueJogador =
        calcularAtaqueTotal(jogador);

    const defesaJogador =
        calcularDefesaTotal(jogador);

    let rodada = 0;

    while (
        vidaJogador > 0 &&
        vidaInimigo > 0 &&
        rodada < 30
    ) {
        rodada++;

        let danoJogador =
            ataqueJogador -
            Math.floor(
                inimigo.defesa * 0.5
            );

        danoJogador =
            Math.max(1, danoJogador);

        const critico =
            Math.random() < 0.1;

        if (critico) {
            danoJogador *= 2;
        }

        vidaInimigo -= danoJogador;

        resultado.push(
            `⚔️ Causou ${danoJogador} de dano` +
            `${critico ? ' 💥 CRÍTICO!' : ''}`
        );

        if (vidaInimigo <= 0) {
            break;
        }

        let danoInimigo =
            inimigo.ataque -
            Math.floor(
                defesaJogador * 0.5
            );

        danoInimigo =
            Math.max(1, danoInimigo);

        const esquiva =
            Math.random() <
            Math.min(
                0.25,
                (jogador.velocidade || 5) / 100
            );

        if (esquiva) {
            resultado.push(
                '💨 Desviou do ataque!'
            );
        } else {
            vidaJogador -= danoInimigo;

            resultado.push(
                `💔 Recebeu ${danoInimigo} de dano`
            );
        }
    }

    jogador.vida =
        Math.max(1, vidaJogador);

    return {
        venceu: vidaInimigo <= 0,
        vidaJogador:
            Math.max(0, vidaJogador),
        vidaInimigo:
            Math.max(0, vidaInimigo),
        rodadas: rodada,
        log: resultado
    };
}

// ================================================================
// MISSÕES
// ================================================================

const MISSOES = [
    {
        id: 'primeira_caca',
        nome: 'Primeira Caçada',
        descricao: 'Derrote 3 monstros.',
        objetivo: 3,
        recompensaXp: 200,
        recompensaMoedas: 300
    },
    {
        id: 'cacador',
        nome: 'Caçador',
        descricao: 'Derrote 10 monstros.',
        objetivo: 10,
        recompensaXp: 800,
        recompensaMoedas: 1000
    },
    {
        id: 'explorador',
        nome: 'Grande Explorador',
        descricao: 'Explore o mundo 10 vezes.',
        objetivo: 10,
        recompensaXp: 1000,
        recompensaMoedas: 1500
    },
    {
        id: 'guerreiro',
        nome: 'Guerreiro',
        descricao: 'Alcance o nível 20.',
        objetivo: 20,
        recompensaXp: 2000,
        recompensaMoedas: 3000
    }
];

function garantirMissoes(jogador) {
    if (!Array.isArray(jogador.missoes)) {
        jogador.missoes = [];
    }

    for (const missao of MISSOES) {
        const existe =
            jogador.missoes.find(
                m => m.id === missao.id
            );

        if (!existe) {
            jogador.missoes.push({
                id: missao.id,
                progresso: 0,
                concluida: false,
                resgatada: false
            });
        }
    }
}

function atualizarMissao(
    jogador,
    id,
    quantidade = 1
) {
    garantirMissoes(jogador);

    const progresso =
        jogador.missoes.find(
            m => m.id === id
        );

    const definicao =
        MISSOES.find(
            m => m.id === id
        );

    if (
        !progresso ||
        !definicao ||
        progresso.resgatada
    ) {
        return;
    }

    progresso.progresso += quantidade;

    if (
        progresso.progresso >=
        definicao.objetivo
    ) {
        progresso.progresso =
            definicao.objetivo;

        progresso.concluida = true;
    }
}

// ================================================================
// CONQUISTAS
// ================================================================

const CONQUISTAS = [
    {
        id: 'primeiro_nivel',
        nome: 'Primeiro Passo',
        descricao: 'Alcance o nível 5.',
        verificar: j => j.nivel >= 5
    },
    {
        id: 'nivel_50',
        nome: 'Veterano',
        descricao: 'Alcance o nível 50.',
        verificar: j => j.nivel >= 50
    },
    {
        id: 'nivel_100',
        nome: 'Lenda',
        descricao: 'Alcance o nível 100.',
        verificar: j => j.nivel >= 100
    },
    {
        id: 'nivel_200',
        nome: 'Divindade',
        descricao: 'Alcance o nível 200.',
        verificar: j => j.nivel >= 200
    },
    {
        id: 'nivel_300',
        nome: 'Supremo',
        descricao: 'Alcance o nível máximo.',
        verificar: j => j.nivel >= 300
    }
];

function verificarConquistas(jogador) {
    if (!Array.isArray(jogador.conquistas)) {
        jogador.conquistas = [];
    }

    const novas = [];

    for (const c of CONQUISTAS) {
        if (jogador.conquistas.includes(c.id)) {
            continue;
        }

        if (c.verificar(jogador)) {
            jogador.conquistas.push(c.id);
            novas.push(c);
        }
    }

    return novas;
}

// ================================================================
// COMANDOS
// ================================================================

const comandos = {
    perfil: async msg => {
        const jogador =
            db.getPlayer(msg.author.id);

        const embed =
            new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle(
                    `⚔️ Perfil de ${msg.author.username}`
                )
                .setThumbnail(
                    msg.author.displayAvatarURL()
                )
                .addFields(
                    {
                        name: '👤 Nome',
                        value:
                            jogador.nome ||
                            msg.author.username,
                        inline: true
                    },
                    {
                        name: '⭐ Nível',
                        value:
                            `${jogador.nivel}`,
                        inline: true
                    },
                    {
                        name: '💰 Moedas',
                        value:
                            `${jogador.moedas}`,
                        inline: true
                    },
                    {
                        name: '❤️ Vida',
                        value:
                            `${jogador.vida}/${jogador.vidaMax}`,
                        inline: true
                    },
                    {
                        name: '⚔️ Ataque',
                        value:
                            `${calcularAtaqueTotal(jogador)}`,
                        inline: true
                    },
                    {
                        name: '🛡️ Defesa',
                        value:
                            `${calcularDefesaTotal(jogador)}`,
                        inline: true
                    },
                    {
                        name: '🏃 Velocidade',
                        value:
                            `${jogador.velocidade}`,
                        inline: true
                    },
                    {
                        name: '🍀 Sorte',
                        value:
                            `${jogador.sorte}`,
                        inline: true
                    },
                    {
                        name: '🗺️ Mapa',
                        value:
                            jogador.mapaAtual,
                        inline: true
                    }
                )
                .setDescription(
                    `XP: **${jogador.xp}/${jogador.xpProx}**\n` +
                    `${barraProgresso(
                        jogador.xp,
                        jogador.xpProx
                    )}`
                )
                .setFooter({
                    text: 'RPG Mundo Aberto'
                });

        await msg.reply({
            embeds: [embed]
        });
    },

    cacar: async msg => {
        const jogador =
            db.getPlayer(msg.author.id);

        const cooldown =
            cooldownRestante(
                jogador.ultimaCaca,
                30000
            );

        if (cooldown > 0) {
            return msg.reply(
                `⏳ Aguarde **${cooldown}s** antes de caçar novamente.`
            );
        }

        const expiracao =
            verificarExpiracao(jogador);

        if (expiracao.expirado) {
            return msg.reply(
                '⚠️ Sua conta expirou! Peça a um ADM para renovar.'
            );
        }

        jogador.ultimaCaca = Date.now();

        const mapa =
            MAPAS[jogador.mapaAtual] ||
            MAPAS['Floresta Inicial'];

        const monstroBase =
            escolherMonstro(jogador.nivel);

        const multiplicador =
            1 +
            (mapa.perigo || 1 - 1) *
            0.2;

        const monstro = {
            ...monstroBase,
            vida: Math.floor(
                monstroBase.vida *
                multiplicador
            ),
            ataque: Math.floor(
                monstroBase.ataque *
                multiplicador
            ),
            defesa: Math.floor(
                monstroBase.defesa *
                multiplicador
            ),
            xp: Math.floor(
                monstroBase.xp *
                multiplicador
            ),
            moedas: Math.floor(
                monstroBase.moedas *
                multiplicador
            )
        };

        const resultado =
            processarCombateIndividual(
                jogador,
                monstro
            );

        atualizarMissao(
            jogador,
            'primeira_caca'
        );

        atualizarMissao(
            jogador,
            'cacador'
        );

        if (resultado.venceu) {
            jogador.moedas +=
                monstro.moedas;

            const subiu =
                ganharXp(
                    jogador,
                    monstro.xp
                );

            let armaDrop = null;

            if (Math.random() < 0.15) {
                const tipos = [
                    'ESPADAS',
                    'FOICES',
                    'MACHADOS'
                ];

                armaDrop =
                    criarArmaAleatoria(
                        tipos[
                            Math.floor(
                                Math.random() * 3
                            )
                        ],
                        jogador
                    );

                if (armaDrop) {
                    jogador.armas.push(
                        armaDrop
                    );
                }
            }

            db.savePlayer(
                msg.author.id
            );

            const embed =
                new EmbedBuilder()
                    .setColor('#2ecc71')
                    .setTitle(
                        `${monstro.emoji} Vitória!`
                    )
                    .setDescription(
                        `Derrotou **${monstro.nome}**!`
                    )
                    .addFields(
                        {
                            name: '⭐ XP',
                            value:
                                `+${monstro.xp}`,
                            inline: true
                        },
                        {
                            name: '💰 Moedas',
                            value:
                                `+${monstro.moedas}`,
                            inline: true
                        },
                        {
                            name: '❤️ Vida',
                            value:
                                `${jogador.vida}/${jogador.vidaMax}`,
                            inline: true
                        }
                    );

            if (subiu.length) {
                embed.addFields({
                    name: '🎉 Level Up!',
                    value:
                        `Alcançou o nível **${jogador.nivel}**!`,
                    inline: false
                });
            }

            if (armaDrop) {
                embed.addFields({
                    name: '🎁 Drop!',
                    value:
                        formatarArma(
                            armaDrop
                        ),
                    inline: false
                });
            }

            await msg.reply({
                embeds: [embed]
            });
        } else {
            jogador.vida =
                Math.max(
                    1,
                    Math.floor(
                        jogador.vidaMax *
                        0.1
                    )
                );

            db.savePlayer(
                msg.author.id
            );

            await msg.reply(
                `${monstro.emoji} **${monstro.nome}** venceu!\n` +
                `❤️ Ficou com **${jogador.vida}/${jogador.vidaMax} HP**.\n` +
                `🏃 Recupere-se e tente novamente.`
            );
        }
    },

    treinar: async (msg, args) => {
        const jogador =
            db.getPlayer(msg.author.id);

        const minutos =
            parseInt(args[0], 10) || 10;

        if (![10, 30, 60].includes(minutos)) {
            return msg.reply(
                '❌ Escolha: **10, 30 ou 60** minutos. Exemplo: `,treinar10`'
            );
        }

        const cooldown =
            cooldownRestante(
                jogador.ultimoTreino,
                minutos * 60000
            );

        if (cooldown > 0) {
            return msg.reply(
                `⏳ Aguarde **${formatarTempo(cooldown * 1000)}** para treinar novamente.`
            );
        }

        const xp =
            minutos * 10;

        const moedas =
            minutos * 2;

        jogador.ultimoTreino =
            Date.now();

        const subiu =
            ganharXp(
                jogador,
                xp
            );

        jogador.moedas += moedas;

        db.savePlayer(
            msg.author.id
        );

        let resposta =
            `🏋️ Treinou por **${minutos} minutos**!\n\n` +
            `⭐ XP: **+${xp}**\n` +
            `💰 Moedas: **+${moedas}**`;

        if (subiu.length) {
            resposta +=
                `\n🎉 Subiu para o nível **${jogador.nivel}**!`;
        }

        await msg.reply(resposta);
    },

    viajar: async (msg, args) => {
        const jogador =
            db.getPlayer(msg.author.id);

        if (!args.length) {
            const lista =
                Object.entries(MAPAS)
                    .map(
                        ([nome, mapa]) => {
                            const liberado =
                                jogador.nivel >=
                                mapa.nivelMin
                                    ? '🟢'
                                    : '🔒';

                            return (
                                `${liberado} **${nome}** — Nível ${mapa.nivelMin}-${mapa.nivelMax}\n` +
                                `${mapa.desc}`
                            );
                        }
                    )
                    .join('\n\n');

            return msg.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#3498db')
                        .setTitle(
                            '🌍 Mapas disponíveis'
                        )
                        .setDescription(
                            lista
                        )
                        .setFooter({
                            text:
                                'Use ,viajar "Nome do Mapa" para viajar'
                        })
                ]
            });
        }

        const destino =
            args.join(' ');

        const mapaInfo =
            MAPAS[destino];

        if (!mapaInfo) {
            return msg.reply(
                '❌ Mapa não encontrado! Use `,viajar` para ver a lista.'
            );
        }

        if (
            jogador.nivel <
            mapaInfo.nivelMin
        ) {
            return msg.reply(
                `🚫 Precisa de nível **${mapaInfo.nivelMin}**! Você é nível ${jogador.nivel}.`
            );
        }

        jogador.mapaAtual =
            destino;

        jogador.vida =
            jogador.vidaMax;

        db.savePlayer(
            jogador.id
        );

        await msg.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(
                        mapaInfo.cor
                    )
                    .setTitle(
                        `🌍 ${destino}`
                    )
                    .setDescription(
                        mapaInfo.desc
                    )
                    .addFields(
                        {
                            name:
                                '📊 Faixa de Nível',
                            value:
                                `${mapaInfo.nivelMin} a ${mapaInfo.nivelMax}`,
                            inline: true
                        },
                        {
                            name:
                                '👹 Monstros',
                            value:
                                mapaInfo.monstros.join(
                                    ', '
                                ),
                            inline: true
                        },
                        {
                            name:
                                '👑 Chefe',
                            value:
                                mapaInfo.chefe,
                            inline: true
                        },
                        {
                            name:
                                '⚔️ Chance Dangeou',
                            value:
                                `${(
                                    mapaInfo.chanceDangeou *
                                    100
                                ).toFixed(0)}%`,
                            inline: true
                        },
                        {
                            name:
                                '⚔️ Chance Dupla',
                            value:
                                `${(
                                    mapaInfo.chanceDangeouDupla *
                                    100
                                ).toFixed(0)}%`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text:
                            '❤️ Vida restaurada ao entrar!'
                    })
            ]
        });
    },

    dangeou: async (msg, args) => {
        const jogador =
            db.getPlayer(msg.author.id);

        if (
            sessoesCombate.has(
                msg.author.id
            )
        ) {
            return msg.reply(
                '⚠️ Já está em andamento!'
            );
        }

        const tipo =
            args[0]?.toLowerCase() ===
            'secreto'
                ? 'secreto'
                : 'normal';

        if (
            tipo === 'secreto' &&
            jogador.nivel < 100
        ) {
            return msg.reply(
                '🔒 Dangeou Secreto exige nível **100+**!'
            );
        }

        const sessao =
            gerarDangeou(
                jogador,
                tipo
            );

        sessoesCombate.set(
            msg.author.id,
            sessao
        );

        const tipoNome =
            tipo === 'secreto'
                ? '✨ **DANGEOU SECRETO**'
                : '⚔️ **DANGEOU**';

        await msg.reply(
            `${tipoNome} iniciado em **${jogador.mapaAtual}**!\n` +
            `Salas: ${sessao.salasTotal} | Tempo: 5 minutos`
        );

        await processarCombate(
            msg.channel,
            jogador,
            sessao
        );
    }
};

// ================================================================
// EXPORTAÇÃO
// ================================================================

module.exports = comandos;
