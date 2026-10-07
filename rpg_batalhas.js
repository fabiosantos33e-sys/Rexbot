// ==============================================================
// BOT RPG MUNDO ABERTO - VERSÃO COMPLETA
// Autor: Dola
// Versão: 3.0.0 | Linhas: ~3500
// Adm ID: 1053803800340746261
// Comandos: ,comando (não barra)
// ================================================================

const Discord = require('discord.js');
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
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

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

// ================================================================
// BANCO DE DADOS SIMPLES (ARQUIVOS JSON)
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
                this.players = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'jogadores.json'), 'utf8'));
            }
            if (fs.existsSync(path.join(DATA_DIR, 'monstros.json'))) {
                this.monsters = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'monstros.json'), 'utf8'));
            }
            if (fs.existsSync(path.join(DATA_DIR, 'masmorras.json'))) {
                this.dungeons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'masmorras.json'), 'utf8'));
            }
        } catch (e) {
            console.log('[DB] Erro ao carregar dados:', e.message);
        }
    }

    saveAll() {
        fs.writeFileSync(path.join(DATA_DIR, 'jogadores.json'), JSON.stringify(this.players, null, 2));
        fs.writeFileSync(path.join(DATA_DIR, 'monstros.json'), JSON.stringify(this.monsters, null, 2));
        fs.writeFileSync(path.join(DATA_DIR, 'masmorras.json'), JSON.stringify(this.dungeons, null, 2));
    }

    getPlayer(id) {
        if (!this.players[id]) this.createPlayer(id);
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
        this.players[id].ultimoLogin = Date.now();
        this.saveAll();
    }
}

const db = new Database();

// ================================================================
// SISTEMA DE RARIDADES
// ================================================================

const RARIDADES = {
    COMUM: { nome: 'Comum', cor: '#95a5a5', chance: 45, multiplicador: 1 },
    INCOMUM: { nome: 'Incomum', cor: '#2ecc71', chance: 25, multiplicador: 1.3 },
    RARO: { nome: 'Raro', cor: '#3498db', chance: 15, multiplicador: 1.7 },
    EPICO: { nome: 'Épico', cor: '#9b59b6', chance: 8, multiplicador: 2.2 },
    LENDARIO: { nome: 'Lendário', cor: '#f39c12', chance: 4, multiplicador: 3 },
    MITICO: { nome: 'Mítico', cor: '#e74c3c', chance: 2, multiplicador: 4.5 },
    DIVINO: { nome: 'Divino', cor: '#ffd700', chance: 1, multiplicador: 6 },
    PERDIDO: { nome: 'Perdido', cor: '#1a1a2e', chance: 0.5, multiplicador: 10 }
};

function getRaridadeAleatoria(sorte = 1) {
    const ajuste = Math.min(sorte * 0.02, 0.3);
    let rand = Math.random() * 100;
    let acumulado = 0;
    for (const [chave, r] of Object.entries(RARIDADES)) {
        let chanceAjustada = r.chance;
        if (chave !== 'COMUM') chanceAjustada += chanceAjustada * ajuste;
        acumulado += chanceAjustada;
        if (rand <= acumulado) return chave;
    }
    return 'COMUM';
}

// ================================================================
// SISTEMA DE ARMAS - NOMES DE ANIME + ORIGINAIS
// ================================================================

const ARMAS = {
    ESPADAS: [
        { id: 'espada_1', nome: 'Lâmina do Sol Crescente', fonte: 'Original', atk: 12, desc: 'Brilha ao amanhecer' },
        { id: 'espada_2', nome: 'Espada Z', fonte: 'Dragon Ball', atk: 18, desc: 'Empunhada por guerreiros lendários' },
        { id: 'espada_3', nome: 'Cortador de Aço', fonte: 'One Piece', atk: 22, desc: 'Resistente a qualquer golpe' },
        { id: 'espada_4', nome: 'Lâmina Negra', fonte: 'Berserk', atk: 35, desc: 'Aniquila a escuridão' },
        { id: 'espada_5', nome: 'Tessaiga', fonte: 'InuYasha', atk: 42, desc: 'Transforma-se em lâmina de demônio' },
        { id: 'espada_6', nome: 'Kusanagi', fonte: 'Naruto', atk: 50, desc: 'A espada lendária das serpentes' },
        { id: 'espada_7', nome: 'Excalibur', fonte: 'Fate', atk: 55, desc: 'A espada sagrada da rainha' },
        { id: 'espada_8', nome: 'Lâmina de Luz', fonte: 'Sword Art Online', atk: 48, desc: 'Brilha intensamente no campo de batalha' },
        { id: 'espada_9', nome: 'Enma', fonte: 'One Piece', atk: 60, desc: 'Drena o poder do portador em troca de força' },
        { id: 'espada_10', nome: 'Gram', fonte: 'Saga dos Volsungos', atk: 65, desc: 'A espada que corta tudo' },
        { id: 'espada_11', nome: 'Durandal', fonte: 'A Lenda de Roland', atk: 58, desc: 'Indestrutível' },
        { id: 'espada_12', nome: 'Ascalon', fonte: 'Dragões e Demônios', atk: 70, desc: 'Espada que abate dragões' },
        { id: 'espada_13', nome: 'Muramasa', fonte: 'Anime/História', atk: 75, desc: 'Espada amaldiçoada que devora almas' },
        { id: 'espada_14', nome: 'Masamune', fonte: 'Anime/História', atk: 72, desc: 'A obra-prima dos ferreiros lendários' },
        { id: 'espada_15', nome: 'Cortadora de Céus', fonte: 'Naruto', atk: 80, desc: 'A lâmina que desafia os deuses' },
        { id: 'espada_16', nome: 'Gurren', fonte: 'Gurren Lagann', atk: 85, desc: 'Perfura o céu e o destino' },
        { id: 'espada_17', nome: 'Lâmina do Vazio', fonte: 'Guilty Crown', atk: 78, desc: 'Extrai a alma do inimigo' },
        { id: 'espada_18', nome: 'Espada do Rei', fonte: 'Fate/Zero', atk: 90, desc: 'A espada que governa todos' },
        { id: 'espada_19', nome: 'Dragão Dourado', fonte: 'Original', atk: 88, desc: 'Forjada nas chamas de um dragão ancião' },
        { id: 'espada_20', nome: 'Fim dos Tempos', fonte: 'Final Fantasy', atk: 95, desc: 'A lâmina que marca o fim da era' },
        { id: 'espada_21', nome: 'Sombra Eterna', fonte: 'Original', atk: 62, desc: 'Não reflete luz nenhuma' },
        { id: 'espada_22', nome: 'Céu e Terra', fonte: 'Samurai X', atk: 74, desc: 'Golpe que une opostos' },
        { id: 'espada_23', nome: 'Blade of Olympus', fonte: 'God of War', atk: 92, desc: 'Poder que destrói deuses' },
        { id: 'espada_24', nome: 'Zangetsu', fonte: 'Bleach', atk: 82, desc: 'A verdadeira forma do portador' },
        { id: 'espada_25', nome: 'Todas as Coisas', fonte: 'Bleach', atk: 100, desc: 'Conhece o céu e a terra' },
        { id: 'espada_26', nome: 'Lâmina do Abismo', fonte: 'Original', atk: 96, desc: 'Vem de onde a luz não chega' },
        { id: 'espada_27', nome: 'Estrela da Manhã', fonte: 'Original', atk: 68, desc: 'Anuncia a vitória' },
        { id: 'espada_28', nome: 'Cortadora de Destino', fonte: 'Shakugan no Shana', atk: 86, desc: 'Altera o fio do destino' },
        { id: 'espada_29', nome: 'Estalagmite Sagrada', fonte: 'Original', atk: 71, desc: 'Forjada em montanha sagrada' },
        { id: 'espada_30', nome: 'Supremo Juízo', fonte: 'Original', atk: 110, desc: 'A espada mais sagrada já criada' }
    ],
    FOICES: [
        { id: 'foice_1', nome: 'Ceifadora de Almas', fonte: 'Original', atk: 14, desc: 'Colhe almas dos caídos' },
        { id: 'foice_2', nome: 'Yoru', fonte: 'One Piece', atk: 45, desc: 'A lâmina negra do maior espadachim' },
        { id: 'foice_3', nome: 'Foice da Morte', fonte: 'Série/Anime', atk: 52, desc: 'A própria morte em forma de arma' },
        { id: 'foice_4', nome: 'Lua Minguante', fonte: 'Original', atk: 38, desc: 'Cresce em poder à noite' },
        { id: 'foice_5', nome: 'Ceifadora de Estrelas', fonte: 'Original', atk: 78, desc: 'Corta a luz das estrelas' },
        { id: 'foice_6', nome: 'Kagura', fonte: 'Gintama', atk: 44, desc: 'Arma de força bruta e agilidade' },
        { id: 'foice_7', nome: 'Crepúsculo Carmim', fonte: 'Original', atk: 65, desc: 'Manchada com sangue de mil inimigos' },
        { id: 'foice_8', nome: 'Chamas do Inferno', fonte: 'Anime Clássico', atk: 72, desc: 'Queima com fogo negro' },
        { id: 'foice_9', nome: 'Fim da Estrada', fonte: 'Original', atk: 85, desc: 'O último golpe que alguém recebe' },
        { id: 'foice_10', nome: 'Véu do Esquecimento', fonte: 'Original', atk: 90, desc: 'Apaga a memória da vitória' },
        { id: 'foice_11', nome: 'Lua Sangrenta', fonte: 'Anime', atk: 88, desc: 'Brilha vermelho em noites de lua cheia' },
        { id: 'foice_12', nome: 'Corta-Céu', fonte: 'Original', atk: 94, desc: 'Alcança além das nuvens' },
        { id: 'foice_13', nome: 'Noite Eterna', fonte: 'Original', atk: 98, desc: 'A escuridão que nunca termina' },
        { id: 'foice_14', nome: 'Colheitadeira de Mundos', fonte: 'Anime/Fantasia', atk: 105, desc: 'Colhe mundos inteiros' },
        { id: 'foice_15', nome: 'Juízo Final', fonte: 'Original', atk: 120, desc: 'O julgamento que ninguém escapa' }
    ],
    MACHADOS: [
        { id: 'machado_1', nome: 'Machado de Batalha', fonte: 'Original', atk: 13, desc: 'Fiel e pesado' },
        { id: 'machado_2', nome: 'Dáinsleif', fonte: 'Mitologia Nórdica', atk: 40, desc: 'Sempre acerta e sempre mata' },
        { id: 'machado_3', nome: 'Gungnir', fonte: 'Mitologia/Anime', atk: 55, desc: 'A lança/machado de Odin' },
        { id: 'machado_4', nome: 'Machado do Trovão', fonte: 'Thor/Anime', atk: 62, desc: 'Carrega o poder do raio' },
        { id: 'machado_5', nome: 'Rompe-Montanhas', fonte: 'Anime Clássico', atk: 70, desc: 'Divide montanhas ao meio' },
        { id: 'machado_6', nome: 'Coração de Vulcão', fonte: 'Original', atk: 75, desc: 'Forjada em lava viva' },
        { id: 'machado_7', nome: 'Fúria do Titã', fonte: 'Shuumatsu no Valkyrie', atk: 82, desc: 'O poder dos que lutaram contra os deuses' },
        { id: 'machado_8', nome: 'Martelo dos Deuses', fonte: 'Anime/Mitologia', atk: 88, desc: 'Só dignos podem levantar' },
        { id: 'machado_9', nome: 'Quebra-Destino', fonte: 'Original', atk: 92, desc: 'Quebra as correntes do destino' },
        { id: 'machado_10', nome: 'Raiva do Gigante', fonte: 'Original', atk: 96, desc: 'A força de um gigante em forma de arma' },
        { id: 'machado_11', nome: 'Esmaga-Céu', fonte: 'Dragon Ball', atk: 100, desc: 'O golpe que abala o universo' },
        { id: 'machado_12', nome: 'Chamas de Muspelheim', fonte: 'Mitologia', atk: 105, desc: 'Fogo que não se apaga' },
        { id: 'machado_13', nome: 'Fim dos Deuses', fonte: 'Shuumatsu no Valkyrie', atk: 115, desc: 'A arma que desafia o divino' },
        { id: 'machado_14', nome: 'Raiz do Mundo', fonte: 'Original', atk: 118, desc: 'O peso de toda a criação' },
        { id: 'machado_15', nome: 'Retribuição Divina', fonte: 'Original', atk: 125, desc: 'O julgamento mais pesado' }
    ]
};

const ARMADURAS = [
    { id: 'arm_1', nome: 'Couro de Aventureiro', def: 5, desc: 'Proteção simples' },
    { id: 'arm_2', nome: 'Armadura de Ferro', def: 12, desc: 'Resistente e pesada' },
    { id: 'arm_3', nome: 'Armadura do Dragão', def: 25, desc: 'Escamada com pele de dragão' },
    { id: 'arm_4', nome: 'Armadura Sagrada', def: 35, desc: 'Bênção dos deuses' },
    { id: 'arm_5', nome: 'Armadura do Vazio', def: 50, desc: 'Absorve dano' },
    { id: 'arm_6', nome: 'Armadura Lendária', def: 65, desc: 'Forjada por ferreiros divinos' },
    { id: 'arm_7', nome: 'Armadura do Fim', def: 80, desc: 'A última proteção' },
    { id: 'arm_8', nome: 'Armadura de Luz', def: 72, desc: 'Brilha contra o mal' },
    { id: 'arm_9', nome: 'Armadura Sombria', def: 78, desc: 'Esconde o portador nas trevas' },
    { id: 'arm_10', nome: 'Armadura Eterna', def: 95, desc: 'Não conhece desgaste' }
];

function criarArmaAleatoria(tipo = null, jogador = null) {
    const tipos = tipo ? [tipo] : Object.keys(ARMAS);
    const tipoEscolhido = tipos[Math.floor(Math.random() * tipos.length)];
    const lista = ARMAS[tipoEscolhido];
    const base = { ...lista[Math.floor(Math.random() * lista.length)] };
    
    const raridade = getRaridadeAleatoria(jogador?.sorte || 1);
    const rConfig = RARIDADES[raridade];
    
    base.atk = Math.floor(base.atk * rConfig.multiplicador * (0.9 + Math.random() * 0.2));
    base.raridade = raridade;
    base.tipo = tipoEscolhido;
    base.uuid = crypto.randomBytes(8).toString('hex');
    base.dataObtencao = Date.now();
    
    return base;
}

// ================================================================
// SISTEMA DE MAPAS E LOCAIS
// ================================================================

const MAPAS = {
    'Floresta Inicial': {
        nivelMin: 1, nivelMax: 20, desc: 'Uma floresta calma, ideal para começar',
        monstros: ['Goblin', 'Lobo Selvagem', 'Aranha Pequena'],
        chefe: 'Lobo Alfa',
        cor: '#27ae60',
        chanceDangeou: 0.12,
        chanceDangeouDupla: 0.02
    },
    'Montanha do Vento': {
        nivelMin: 20, nivelMax: 50, desc: 'Ventos fortes e criaturas rochosas',
        monstros: ['Górgona', 'Águia Gigante', 'Troll de Pedra'],
        chefe: 'Rei dos Picos',
        cor: '#95a5a6',
        chanceDangeou: 0.15,
        chanceDangeouDupla: 0.03
    },
    'Pântano Sombrio': {
        nivelMin: 50, nivelMax: 90, desc: 'Névoa tóxica e criaturas rastejantes',
        monstros: ['Crocodilo Anão', 'Fantasma', 'Cobra Venenosa'],
        chefe: 'Senhor do Pântano',
        cor: '#2c3e50',
        chanceDangeou: 0.18,
        chanceDangeouDupla: 0.04
    },
    'Deserto Ardente': {
        nivelMin: 90, nivelMax: 130, desc: 'Calor intenso e areias traiçoeiras',
        monstros: ['Escorpião Dourado', 'Múmia', 'Serpente de Areia'],
        chefe: 'Faraó Imortal',
        cor: '#f39c12',
        chanceDangeou: 0.20,
        chanceDangeouDupla: 0.05
    },
    'Floresta de Gelo': {
        nivelMin: 130, nivelMax: 170, desc: 'Flores congeladas e frio que corta',
        monstros: ['Urso de Gelo', 'Espírito Nevoa', 'Lobo de Gelo'],
        chefe: 'Rainha do Gelo',
        cor: '#00bcd4',
        chanceDangeou: 0.22,
        chanceDangeouDupla: 0.06
    },
    'Vale dos Dragões': {
        nivelMin: 170, nivelMax: 210, desc: 'Onde os dragões fazem seus ninhos',
        monstros: ['Dragãozinho', 'Besta de Fogo', 'Híbrido Alado'],
        chefe: 'Dragão Ancião',
        cor: '#e74c3c',
        chanceDangeou: 0.25,
        chanceDangeouDupla: 0.08
    },
    'Abismo Profundo': {
        nivelMin: 210, nivelMax: 250, desc: 'A escuridão onde a luz não chega',
        monstros: ['Sombra Viva', 'Olho do Abismo', 'Criatura Sem Forma'],
        chefe: 'Senhor do Abismo',
        cor: '#1a1a2e',
        chanceDangeou: 0.28,
        chanceDangeouDupla: 0.10
    },
    'Céu Celestial': {
        nivelMin: 250, nivelMax: 300, desc: 'Acima das nuvens, onde os deuses caminham',
        monstros: ['Guardião Celeste', 'Anjo Caído', 'Espírito Estelar'],
        chefe: 'O Primeiro Criado',
        cor: '#ffd700',
        chanceDangeou: 0.30,
        chanceDangeouDupla: 0.12
    },
    'Dimensão Perdida': {
        nivelMin: 280, nivelMax: 300, desc: 'Realidade distorcida, fora do tempo',
        monstros: ['Distorção', 'Eco Esquecido', 'Vazio Consumidor'],
        chefe: 'O Fim de Tudo',
        cor: '#8e44ad',
        chanceDangeou: 0.35,
        chanceDangeouDupla: 0.15
    }
};

// ================================================================
// SISTEMA DE MONSTROS E COMBATE
// ================================================================

function criarMonstro(nome, nivelJogador, mapa) {
    const mapaInfo = MAPAS[mapa];
    const nivelBase = Math.max(1, Math.min(nivelJogador + Math.floor(Math.random() * 10) - 5, mapaInfo.nivelMax));
    
    const monstrosDados = {
        'Goblin': { vida: 40, atk: 8, xp: 15, moedas: [5, 15] },
        'Lobo Selvagem': { vida: 55, atk: 12, xp: 22, moedas: [8, 20] },
        'Aranha Pequena': { vida: 35, atk: 10, xp: 12, moedas: [4, 12] },
        'Lobo Alfa': { vida: 200, atk: 25, xp: 150, moedas: [50, 100], chefe: true },
        'Górgona': { vida: 120, atk: 22, xp: 45, moedas: [20, 40] },
        'Águia Gigante': { vida: 110, atk: 25, xp: 50, moedas: [22, 45] },
        'Troll de Pedra': { vida: 180, atk: 18, xp: 55, moedas: [25, 50] },
        'Rei dos Picos': { vida: 450, atk: 40, xp: 300, moedas: [120, 200], chefe: true },
        'Crocodilo Anão': { vida: 160, atk: 28, xp: 65, moedas: [30, 55] },
        'Fantasma': { vida: 100, atk: 35, xp: 70, moedas: [35, 60] },
        'Cobra Venenosa': { vida: 130, atk: 32, xp: 60, moedas: [28, 50] },
        'Senhor do Pântano': { vida: 700, atk: 55, xp: 500, moedas: [200, 350], chefe: true },
        'Escorpião Dourado': { vida: 200, atk: 40, xp: 90, moedas: [45, 75] },
        'Múmia': { vida: 220, atk: 38, xp: 95, moedas: [50, 80] },
        'Serpente de Areia': { vida: 240, atk: 45, xp: 100, moedas: [55, 85] },
        'Faraó Imortal': { vida: 1000, atk: 70, xp: 800, moedas: [350, 500], chefe: true },
        'Urso de Gelo': { vida: 280, atk: 50, xp: 130, moedas: [65, 100] },
        'Espírito Nevoa': { vida: 200, atk: 58, xp: 140, moedas: [70, 110] },
        'Lobo de Gelo': { vida: 260, atk: 55, xp: 135, moedas: [68, 105] },
        'Rainha do Gelo': { vida: 1400, atk: 85, xp: 1200, moedas: [450, 700], chefe: true },
        'Dragãozinho': { vida: 350, atk: 65, xp: 180, moedas: [90, 140] },
        'Besta de Fogo': { vida: 380, atk: 72, xp: 195, moedas: [100, 150] },
        'Híbrido Alado': { vida: 340, atk: 70, xp: 185, moedas: [95, 145] },
        'Dragão Ancião': { vida: 2000, atk: 100, xp: 1800, moedas: [700, 1000], chefe: true },
        'Sombra Viva': { vida: 400, atk: 80, xp: 230, moedas: [120, 180] },
        'Olho do Abismo': { vida: 450, atk: 85, xp: 250, moedas: [130, 190] },
        'Criatura Sem Forma': { vida: 420, atk: 82, xp: 240, moedas: [125, 185] },
        'Senhor do Abismo': { vida: 2800, atk: 120, xp: 2500, moedas: [900, 1300], chefe: true },
        'Guardião Celeste': { vida: 500, atk: 95, xp: 300, moedas: [150, 220] },
        'Anjo Caído': { vida: 550, atk: 105, xp: 330, moedas: [170, 250] },
        'Espírito Estelar': { vida: 480, atk: 98, xp: 310, moedas: [160, 230] },
        'O Primeiro Criado': { vida: 3500, atk: 140, xp: 3500, moedas: [1200, 1800], chefe: true },
        'Distorção': { vida: 600, atk: 110, xp: 360, moedas: [180, 270] },
        'Eco Esquecido': { vida: 580, atk: 115, xp: 370, moedas: [190, 280] },
        'Vazio Consumidor': { vida: 650, atk: 120, xp: 390, moedas: [200, 300] },
        'O Fim de Tudo': { vida: 5000, atk: 160, xp: 5000, moedas: [1800, 2500], chefe: true }
    };

    const base = monstrosDados[nome] || { vida: 50, atk: 10, xp: 10, moedas: [5, 10] };
    const escala = 1 + (nivelBase - 1) * 0.08;

    return {
        nome,
        nivel: nivelBase,
        vida: Math.floor(base.vida * escala),
        vidaMax: Math.floor(base.vida * escala),
        ataque: Math.floor(base.atk * escala),
        xpRecompensa: Math.floor(base.xp * escala),
        moedasRecompensa: [Math.floor(base.moedas[0] * escala), Math.floor(base.moedas[1] * escala)],
        chefe: base.chefe || false
    };
}

function calcularDano(atacante, defensor) {
    const atkTotal = atacante.ataque + (atacante.armaAtual?.atk || 0);
    const defTotal = defensor.defesa + (defensor.armaduraAtual?.def || 0);
    const danoBase = Math.max(1, atkTotal - defTotal * 0.5);
    const variacao = danoBase * (0.85 + Math.random() * 0.3);
    return Math.floor(variacao);
}

// ================================================================
// SISTEMA DE DANGEOS / MASMORRAS
// ================================================================

function gerarDangeou(jogador, tipo = 'normal') {
    const mapa = MAPAS[jogador.mapaAtual];
    const ehDupla = tipo === 'dupla';
    const ehSecreto = tipo === 'secreto';
    
    const dificuldade = ehDupla ? 1.8 : (ehSecreto ? 2.5 : 1);
    const recompensas = ehDupla ? 2 : (ehSecreto ? 3 : 1);
    
    const monstrosDangeou = [];
    const qtdMonstros = ehDupla ? 2 : (ehSecreto ? 3 : 1 + Math.floor(Math.random() * 2));
    
    for (let i = 0; i < qtdMonstros; i++) {
        const nome = mapa.monstros[Math.floor(Math.random() * mapa.monstros.length)];
        let m = criarMonstro(nome, jogador.nivel, jogador.mapaAtual);
        m.vida = Math.floor(m.vida * dificuldade);
        m.vidaMax = m.vida;
        m.ataque = Math.floor(m.ataque * dificuldade);
        m.xpRecompensa = Math.floor(m.xpRecompensa * recompensas);
        m.moedasRecompensa = m.moedasRecompensa.map(v => Math.floor(v * recompensas));
        monstrosDangeou.push(m);
    }

    // Chance de arma única
    let recompensaArma = null;
    let chanceArma = ehSecreto ? 0.4 : (ehDupla ? 0.25 : 0.08);
    if (Math.random() < chanceArma) {
        recompensaArma = criarArmaAleatoria(null, jogador);
    }

    return {
        tipo,
        monstros: monstrosDangeou,
        recompensaArma,
        recompensasMultiplicador: recompensas,
        inicio: Date.now(),
        expiraEm: Date.now() + 5 * 60 * 1000 // 5 minutos
    };
}

// ================================================================
// SISTEMA DE NIVELAMENTO E EXPIRAÇÃO
// ================================================================

function calcularXpProxNivel(nivel) {
    return Math.floor(100 * Math.pow(1.15, nivel - 1));
}

function ganharXp(jogador, quantidade) {
    jogador.xp += quantidade;
    let subiu = [];
    
    while (jogador.xp >= jogador.xpProx && jogador.nivel < MAX_LEVEL) {
        jogador.xp -= jogador.xpProx;
        jogador.nivel++;
        jogador.xpProx = calcularXpProxNivel(jogador.nivel);
        jogador.vidaMax += 10;
        jogador.vida = jogador.vidaMax;
        jogador.ataque += 2;
        jogador.defesa += 1;
        jogador.velocidade += 0.5;
        if (jogador.nivel % 5 === 0) jogador.sorte += 0.5;
        subiu.push(jogador.nivel);
    }
    
    // Expiração baseada no nível
    if (jogador.nivel >= 200 && !jogador.expiracaoConta) {
        jogador.expiracaoConta = Date.now() + 90 * 24 * 60 * 60 * 1000; // 90 dias
    } else if (jogador.nivel >= 100 && !jogador.expiracaoConta) {
        jogador.expiracaoConta = Date.now() + 180 * 24 * 60 * 60 * 1000; // 180 dias
    }
    
    return subiu;
}

function verificarExpiracao(jogador) {
    if (!jogador.expiracaoConta) return { expirado: false };
    const diasRestantes = Math.ceil((jogador.expiracaoConta - Date.now()) / (24 * 60 * 60 * 1000));
    return {
        expirado: diasRestantes <= 0,
        diasRestantes
    };
}

// ================================================================
// FUNÇÕES DE FORMATAÇÃO
// ================================================================

function formatarTempo(ms) {
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${d}d ${h}h ${m}m`;
}

function formatarArma(arma) {
    if (!arma) return 'Nenhuma';
    const r = RARIDADES[arma.raridade];
    return `**${arma.nome}** [${r.nome}]\n⚔️ ATK: ${arma.atk} | Fonte: ${arma.fonte}\n*${arma.desc}*\nCor: ${r.cor}`;
}

function criarEmbedPerfil(usuario, jogador) {
    const mapa = MAPAS[jogador.mapaAtual];
    const exp = verificarExpiracao(jogador);
    
    const embed = new EmbedBuilder()
        .setColor(mapa?.cor || '#3498db')
        .setTitle(`⚔️ Perfil de ${jogador.nome || usuario.username}`)
        .setThumbnail(usuario.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
            { name: '📊 Nível', value: `${jogador.nivel} / ${MAX_LEVEL}\n\`${jogador.xp} / ${jogador.xpProx} XP\``, inline: true },
            { name: '💰 Moedas', value: `${jogador.moedas}`, inline: true },
            { name: '❤️ Vida', value: `${jogador.vida} / ${jogador.vidaMax}`, inline: true },
            { name: '🗺️ Localização', value: `${jogador.mapaAtual}\nFaixa: ${mapa?.nivelMin}-${mapa?.nivelMax}`, inline: true },
            { name: '⚔️ Ataque', value: `${jogador.ataque + (jogador.armaAtual?.atk || 0)}`, inline: true },
            { name: '🛡️ Defesa', value: `${jogador.defesa + (jogador.armaduraAtual?.def || 0)}`, inline: true },
            { name: '🎯 Sorte', value: jogador.sorte.toFixed(2), inline: true },
            { name: '🗡️ Arma Atual', value: formatarArma(jogador.armaAtual), inline: false },
            { name: '🛡️ Armadura Atual', value: jogador.armaduraAtual ? `**${jogador.armaduraAtual.nome}**\n🛡️ DEF: ${jogador.armaduraAtual.def}` : 'Nenhuma', inline: false }
        )
        .setFooter({ text: `ID: ${jogador.id} | Tempo jogado: ${formatarTempo(jogador.tempoJogado || 0)}` });
    
    if (exp.diasRestantes && exp.diasRestantes <= 30) {
        embed.addFields({ name: '⚠️ Aviso', value: `Conta expira em ${exp.diasRestantes} dias! Jogue para renovar!`, inline: false });
    }
    
    return embed;
}

// ================================================================
// SESSÕES DE COMBATE
// ================================================================

const sessoesCombate = new Map();

async function processarCombate(channel, jogador, sessao) {
    let mensagem = await channel.send('⚔️ **Iniciando combate...**');
    
    while (sessao.monstros.length > 0 && jogador.vida > 0) {
        const alvo = sessao.monstros[0];
        
        // Jogador ataca
        const danoJogador = calcularDano(jogador, alvo);
        alvo.vida -= danoJogador;
        
        await mensagem.edit({ content: `⚔️ Você ataca **${alvo.nome}** causando **${danoJogador}** de dano!\n❤️ ${alvo.nome}: ${Math.max(0, alvo.vida)}/${alvo.vidaMax}` });
        await new Promise(r => setTimeout(r, 800));
        
        if (alvo.vida <= 0) {
            sessao.monstros.shift();
            const ganhoMoedas = Math.floor(alvo.moedasRecompensa[0] + Math.random() * (alvo.moedasRecompensa[1] - alvo.moedasRecompensa[0]));
            jogador.moedas += ganhoMoedas;
            const subiu = ganharXp(jogador, alvo.xpRecompensa);
            
            let msgSubiu = subiu.length > 0 ? `\n🎉 Subiu para o nível **${subiu.join(', ')}**!` : '';
            await mensagem.edit({ content: `✅ Derrotou **${alvo.nome}**!\n💰 +${ganhoMoedas} moedas | ⭐ +${alvo.xpRecompensa} XP${msgSubiu}` });
            await new Promise(r => setTimeout(r, 1000));
            continue;
        }
        
        // Monstro ataca
        const danoMonstro = Math.max(1, alvo.ataque - jogador.defesa * 0.4 + Math.floor(Math.random() * 5));
        jogador.vida = Math.max(0, jogador.vida - danoMonstro);
        
        await mensagem.edit({ content: `💥 **${alvo.nome}** ataca você causando **${danoMonstro}** de dano!\n❤️ Sua vida: ${jogador.vida}/${jogador.vidaMax}` });
        await new Promise(r => setTimeout(r, 800));
    }
    
    if (jogador.vida <= 0) {
        await mensagem.edit({ content: '💀 Você foi derrotado... Voltou para a Floresta Inicial com metade das moedas perdidas.' });
        jogador.moedas = Math.floor(jogador.moedas / 2);
        jogador.vida = Math.floor(jogador.vidaMax / 2);
        jogador.mapaAtual = 'Floresta Inicial';
    } else {
        let recompensaArmaMsg = '';
        if (sessao.recompensaArma) {
            jogador.armas.push(sessao.recompensaArma);
            recompensaArmaMsg = `\n🎁 **Obteve arma única:**\n${formatarArma(sessao.recompensaArma)}`;
        }
        
        const tipoMsg = sessao.tipo === 'dupla' ? '🔥 DANGEU DUPLA CONCLUÍDO!' : 
                        sessao.tipo === 'secreto' ? '✨ DANGEU SECRETO DESCOBERTO!' : 
                        '🏆 Combate concluído!';
        
        await mensagem.edit({ content: `${tipoMsg}\nDerrotou todos os inimigos!${recompensaArmaMsg}` });
    }
    
    db.savePlayer(jogador.id);
    sessoesCombate.delete(jogador.id);
}

// ================================================================
// COMANDOS PRINCIPAIS
// ================================================================

const comandos = {
    perfil: async (msg, args) => {
        const usuario = msg.mentions.users.first() || msg.author;
        const jogador = db.getPlayer(usuario.id);
        if (!jogador.nome && usuario.id === msg.author.id) {
            jogador.nome = msg.author.username;
        }
        db.savePlayer(usuario.id);
        const embed = criarEmbedPerfil(usuario, jogador);
        await msg.reply({ embeds: [embed] });
    },

    caçar: async (msg, args) => {
        const jogador = db.getPlayer(msg.author.id);
        const agora = Date.now();
        const COOLDOWN = 15 * 1000;
        
        if (agora - jogador.ultimaCaca < COOLDOWN) {
            const restante = Math.ceil((COOLDOWN - (agora - jogador.ultimaCaca)) / 1000);
            return msg.reply(`⏳ Aguarde **${restante}s** para caçar novamente!`);
        }
        
        if (sessoesCombate.has(msg.author.id)) {
            return msg.reply('⚠️ Você já está em combate!');
        }
        
        jogador.ultimaCaca = agora;
        const mapa = MAPAS[jogador.mapaAtual];
        
        // Chance de dangeou aleatório
        let tipoDangeou = 'normal';
        const rand = Math.random();
        if (rand < mapa.chanceDangeouDupla) {
            tipoDangeou = 'dupla';
        } else if (rand < mapa.chanceDangeou) {
            tipoDangeou = 'dangeou';
        }
        
        if (tipoDangeou !== 'normal') {
            const sessao = gerarDangeou(jogador, tipoDangeou);
            sessoesCombate.set(msg.author.id, sessao);
            await msg.reply(`⚠️ **${tipoDangeou === 'dupla' ? '🔥 DANGEU DUPLA APARECEU!' : '⚡ DANGEOU ENCONTRADO!'}**\nMonstros mais fortes apareceram!`);
            return processarCombate(msg.channel, jogador, sessao);
        }
        
        // Caça normal
        const nomeMonstro = mapa.monstros[Math.floor(Math.random() * mapa.monstros.length)];
        const monstro = criarMonstro(nomeMonstro, jogador.nivel, jogador.mapaAtual);
        
        await msg.reply(`🔍 Você caça em **${jogador.mapaAtual}** e encontra um **${monstro.nome}** (Nv.${monstro.nivel})!`);
        
        const sessao = { monstros: [monstro], tipo: 'normal' };
        sessoesCombate.set(msg.author.id, sessao);
        await processarCombate(msg.channel, jogador, sessao);
    },

    treinar: async (msg, args) => {
        const jogador = db.getPlayer(msg.author.id);
        const agora = Date.now();
        const quant = parseInt(args[0]) || 10;
        
        if (![10, 30, 60].includes(quant)) {
            return msg.reply('⚠️ Use: `,treinar10` | `,treinar30` | `,treinar60`');
        }
        
        const tempoMs = quant * 60 * 1000;
        const COOLDOWN = tempoMs;
        
        if (agora - jogador.ultimoTreino < COOLDOWN) {
            const restante = Math.ceil((COOLDOWN - (agora - jogador.ultimoTreino)) / 60000);
            return msg.reply(`⏳ Treino em andamento! Termina em **${restante}min**`);
        }
        
        jogador.ultimoTreino = agora;
        const ganhoXp = quant * 5 * (1 + jogador.sorte * 0.1);
       
// CONTINUAÇÃO DO CÓDIGO — TREINAMENTO E DEMAIS COMANDOS
        const ganhoMoedas = Math.floor(quant * 2.5 * (1 + jogador.sorte * 0.05));
        const subiu = ganharXp(jogador, ganhoXp);
        jogador.moedas += ganhoMoedas;

        let msgSubiu = subiu.length > 0 ? `\n🎉 **Subiu de nível:** ${subiu.join(', ')}!` : '';
        await msg.reply(`💪 Treinamento de **${quant} minutos** concluído!\n⭐ +${ganhoXp.toFixed(0)} XP\n💰 +${ganhoMoedas} moedas${msgSubiu}`);
        
        db.savePlayer(jogador.id);
    },

    viajar: async (msg, args) => {
        const jogador = db.getPlayer(msg.author.id);
        const destino = args.join(' ');
        
        if (!destino) {
            const listaMapas = Object.entries(MAPAS).map(([nome, info]) => 
                `• **${nome}** (Nv.${info.nivelMin}–${info.nivelMax})`
            ).join('\n');
            return msg.reply(`🗺️ **Mapas disponíveis:**\n${listaMapas}\n\nUse: \`,viajar Nome do Mapa\``);
        }
        
        if (!MAPAS[destino]) {
            return msg.reply(`❌ Mapa **"${destino}"** não existe! Veja a lista com \`,viajar\``);
        }
        
        const mapaInfo = MAPAS[destino];
        if (jogador.nivel < mapaInfo.nivelMin) {
            return msg.reply(`🚫 Precisa de nível **${mapaInfo.nivelMin}** para entrar! Você é nível ${jogador.nivel}`);
        }
        
        jogador.mapaAtual = destino;
        jogador.vida = jogador.vidaMax;
        db.savePlayer(jogador.id);
        
        await msg.reply({
            embeds: [new EmbedBuilder()
                .setColor(mapaInfo.cor)
                .setTitle(`🌍 ${destino}`)
                .setDescription(mapaInfo.desc)
                .addFields(
                    { name: 'Faixa de Nível', value: `${mapaInfo.nivelMin} a ${mapaInfo.nivelMax}`, inline: true },
                    { name: 'Monstros', value: mapaInfo.monstros.join(', '), inline: true },
                    { name: 'Chefe', value: mapaInfo.chefe, inline: true },
                    { name: 'Chance Dangeou', value: `${(mapaInfo.chanceDangeou*100).toFixed(0)}%`, inline: true },
                    { name: 'Chance Dangeou Dupla', value: `${(mapaInfo.chanceDangeouDupla*100).toFixed(0)}%`, inline: true }
                )
                .setFooter({ text: 'Vida restaurada ao entrar no novo mapa!' })
            ]
        });
    },

    dangeou: async (msg, args) => {
        const jogador = db.getPlayer(msg.author.id);
        
        if (sessoesCombate.has(msg.author.id)) {
            return msg.reply('⚠️ Você já está em combate!');
        }
        
        const tipo = args[0] === 'secreto' ? 'secreto' : 'normal';
        const mapa = MAPAS[jogador.mapaAtual];
        
        if (tipo === 'secreto' && jogador.nivel < 100) {
            return msg.reply('🔒 Dangeou Secreto liberado apenas a partir do nível **100**!');
        }
        
        const sessao = gerarDangeou(jogador, tipo);
        sessoesCombate.set(msg.author.id, sessao);
        
        const tipoNome = tipo === 'secreto' ? '✨ **DANGEOU SECRETO**' : '⚔️ **DANGEOU**';
        await msg.reply(`${tipoNome} iniciado em **${jogador.mapaAtual}**!\nInimigos: ${sessao.monstros.map(m => m.nome).join(', ')}\nTempo limite: 5 minutos`);
        
        await processarCombate(msg.channel, jogador, sessao);
    },

    armas: async (msg, args) => {
        const jogador = db.getPlayer(msg.author.id);
        
        if (!jogador.armas.length) {
            return msg.reply('🗡️ Você não possui armas! Caçe e derrote inimigos para conseguir.');
        }
        
        const armasLista = jogador.armas.map((arma, idx) => {
            const r = RARIDADES[arma.raridade];
            const ehAtual = jogador.armaAtual?.uuid === arma.uuid;
            return `${ehAtual ? '➡️' : '•'} **${idx+1}. ${arma.nome}** [${r.nome}]\n⚔️ ATK: ${arma.atk} | Fonte: ${arma.fonte}\nCor: ${r.cor}${ehAtual ? ' **(Equipada)**' : ''}`;
        }).join('\n\n');
        
        const embed = new EmbedBuilder()
            .setColor('#f39c12')
            .setTitle('🗡️ Suas Armas')
            .setDescription(armasLista)
            .setFooter({ text: `Total: ${jogador.armas.length} | Use ,equipar Nº para usar uma` });
        
        await msg.reply({ embeds: [embed] });
    },

    equipar: async (msg, args) => {
        const jogador = db.getPlayer(msg.author.id);
        const num = parseInt(args[0]) - 1;
        
        if (isNaN(num) || num < 0 || num >= jogador.armas.length) {
            return msg.reply('❌ Número inválido! Veja suas armas com `,armas`');
        }
        
        jogador.armaAtual = jogador.armas[num];
        db.savePlayer(jogador.id);
        await msg.reply(`🗡️ Equipou: **${jogador.armaAtual.nome}**!`);
    },

    mochila: async (msg, args) => {
        const jogador = db.getPlayer(msg.author.id);
        const itens = jogador.inventario.length ? jogador.inventario.map(i => `• ${i.nome} x${i.quantidade}`).join('\n') : 'Vazia';
        await msg.reply(`🎒 **Mochila:**\n${itens}`);
    },

    // ===== COMANDOS DE ADMINISTRAÇÃO =====
    darNivel: async (msg, args) => {
        if (msg.author.id !== ADM_ID) return msg.reply('🚫 Sem permissão!');
        const alvo = msg.mentions.users.first();
        const nivel = parseInt(args[1]);
        if (!alvo || isNaN(nivel) || nivel < 1 || nivel > MAX_LEVEL) {
            return msg.reply(`Uso: \`,darnivel @usuário 1~${MAX_LEVEL}\``);
        }
        const jogador = db.getPlayer(alvo.id);
        jogador.nivel = nivel;
        jogador.xp = 0;
        jogador.xpProx = calcularXpProxNivel(nivel);
        jogador.vidaMax = 100 + (nivel - 1) * 10;
        jogador.vida = jogador.vidaMax;
        jogador.ataque = 10 + (nivel - 1) * 2;
        jogador.defesa = 5 + (nivel - 1);
        db.savePlayer(alvo.id);
        await msg.reply(`✅ ${alvo.username} definido para nível **${nivel}**!`);
    },

    darMoeda: async (msg, args) => {
        if (msg.author.id !== ADM_ID) return msg.reply('🚫 Sem permissão!');
        const alvo = msg.mentions.users.first();
        const quant = parseInt(args[1]);
        if (!alvo || isNaN(quant)) return msg.reply('Uso: `,darmoeda @usuário valor`');
        const jogador = db.getPlayer(alvo.id);
        jogador.moedas += quant;
        db.savePlayer(alvo.id);
        await msg.reply(`✅ +${quant} moedas para ${alvo.username}!`);
    },

    darXp: async (msg, args) => {
        if (msg.author.id !== ADM_ID) return msg.reply('🚫 Sem permissão!');
        const alvo = msg.mentions.users.first();
        const quant = parseInt(args[1]);
        if (!alvo || isNaN(quant)) return msg.reply('Uso: `,darxp @usuário valor`');
        const jogador = db.getPlayer(alvo.id);
        const subiu = ganharXp(jogador, quant);
        db.savePlayer(alvo.id);
        await msg.reply(`✅ +${quant} XP para ${alvo.username}!${subiu.length ? ` Subiu: ${subiu.join(', ')}` : ''}`);
    },

    darArma: async (msg, args) => {
        if (msg.author.id !== ADM_ID) return msg.reply('🚫 Sem permissão!');
        const alvo = msg.mentions.users.first();
        const tipo = args[1]?.toUpperCase();
        if (!alvo || !['ESPADAS','FOICES','MACHADOS'].includes(tipo)) {
            return msg.reply('Uso: `,dararma @usuário ESPADAS|FOICES|MACHADOS`');
        }
        const jogador = db.getPlayer(alvo.id);
        const arma = criarArmaAleatoria(tipo, jogador);
        jogador.armas.push(arma);
        db.savePlayer(alvo.id);
        await msg.reply(`✅ Deu para ${alvo.username}:\n${formatarArma(arma)}`);
    },

    darArmaEspecifica: async (msg, args) => {
        if (msg.author.id !== ADM_ID) return msg.reply('🚫 Sem permissão!');
        const alvo = msg.mentions.users.first();
        const nome = args.slice(1).join(' ');
        if (!alvo || !nome) return msg.reply('Uso: `,dararma_nome @usuário Nome da Arma`');
        
        let armaEncontrada = null;
        for (const lista of Object.values(ARMAS)) {
            armaEncontrada = lista.find(a => a.nome.toLowerCase() === nome.toLowerCase());
            if (armaEncontrada) break;
        }
        if (!armaEncontrada) return msg.reply(`❌ Arma **"${nome}"** não encontrada!`);
        
        const jogador = db.getPlayer(alvo.id);
        const armaCompleta = { ...armaEncontrada };
        armaCompleta.raridade = 'DIVINO';
        armaCompleta.atk = Math.floor(armaCompleta.atk * RARIDADES.DIVINO.multiplicador);
        armaCompleta.uuid = crypto.randomBytes(8).toString('hex');
        armaCompleta.dataObtencao = Date.now();
        jogador.armas.push(armaCompleta);
        db.savePlayer(alvo.id);
        await msg.reply(`✅ Deu para ${alvo.username}:\n${formatarArma(armaCompleta)}`);
    },

    renomear: async (msg, args) => {
        const jogador = db.getPlayer(msg.author.id);
        const nome = args.join(' ');
        if (!nome || nome.length < 2 || nome.length > 20) {
            return msg.reply('❌ Nome precisa ter 2 a 20 caracteres!');
        }
        jogador.nome = nome;
        db.savePlayer(msg.author.id);
        await msg.reply(`✅ Nome alterado para **${nome}**!`);
    },

    renovar: async (msg, args) => {
        if (msg.author.id !== ADM_ID) return msg.reply('🚫 Sem permissão!');
        const alvo = msg.mentions.users.first() || msg.author;
        const jogador = db.getPlayer(alvo.id);
        jogador.expiracaoConta = null;
        db.savePlayer(alvo.id);
        await msg.reply(`✅ Conta de ${alvo.username} renovada permanentemente!`);
    },

    verificar: async (msg) => {
        const jogador = db.getPlayer(msg.author.id);
        const exp = verificarExpiracao(jogador);
        if (exp.expirado) {
            await msg.reply('⚠️ Sua conta expirou! Jogue regularmente ou peça a um ADM para renovar.');
        } else if (exp.diasRestantes) {
            await msg.reply(`📅 Faltam **${exp.diasRestantes} dias** para expirar. Continue jogando!`);
        } else {
            await msg.reply('✅ Sem expiração! Continue evoluindo.');
        }
    },

    ajuda: async (msg) => {
        await msg.reply(`
📖 **Comandos do RPG:**
\`,perfil\` — Ver seu perfil
\`,renomear Nome\` — Mudar nome
\`,caçar\` — Caçar monstros (pode aparecer dangeou!)
\`,treinar10\` — Treinar 10min → ganha XP e moedas
\`,treinar30\` — Treinar 30min
\`,treinar60\` — Treinar 60min
\`,viajar\` — Ver mapas disponíveis
\`,viajar Nome\` — Ir para outro mapa
\`,dangeou\` — Entrar em masmorra
\`,dangeou secreto\` — Masmorra secreta (Nv.100+)
\`,armas\` — Suas armas
\`,equipar Nº\` — Equipar arma
\`,mochila\` — Ver itens
\`,verificar\` — Ver expiração da conta

👑 **Comandos de ADM:**
\`,darnivel @alvo NÍVEL\`
\`,darmoeda @alvo VALOR\`
\`,darxp @alvo VALOR\`
\`,dararma @alvo ESPADAS|FOICES|MACHADOS\`
\`,dararma_nome @alvo Nome da Arma\`
\`,renovar @alvo\` — Renova conta
        `);
    }
};

// ================================================================
// PROCESSADOR DE MENSAGENS
// ================================================================

client.on('messageCreate', async msg => {
    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
    
    const [comando, ...args] = msg.content.slice(PREFIX.length).trim().split(/\s+/);
    const cmd = comandos[comando.toLowerCase()];
    
    if (!cmd) return;
    
    try {
        await cmd(msg, args);
    } catch (e) {
        console.error(`Erro no comando ${comando}:`, e);
        await msg.reply(`❌ Erro: ${e.message}`);
    }
});

// ================================================================
// EVENTOS DO BOT
// ================================================================

client.on('ready', () => {
    console.log('='.repeat(60));
    console.log(`✅ BOT RPG ONLINE — Logado como ${client.user.tag}`);
    console.log(`🔰 Prefixo: ${PREFIX}`);
    console.log(`👑 ADM: ${ADM_ID}`);
    console.log(`📂 Máximo Nível: ${MAX_LEVEL}`);
    console.log(`🗄️ Dados em: ${DATA_DIR}`);
    console.log('='.repeat(60));
});

client.on('error', console.error);

// ================================================================
// INICIALIZAÇÃO
// ================================================================

module.exports = {
    name: 'RPG Mundo Aberto',
    descricao: 'Sistema completo de RPG com mapas, armas de animes, chefes e masmorras',
    async init(cliente, token) {
        await cliente.login(token);
    }
};

// ================================================================
// INSTRUÇÕES DE USO
// ================================================================
/*
ESTRUTURA DO SEU PROJETO:
seu-bot/
├── index.js          ← Seu arquivo principal
├── rpg/              ← Cole o código aqui como index.js
│   └── index.js
└── package.json

NO SEU index.js PRINCIPAL (na raiz):
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const rpg = require('./rpg/index.js');
const TOKEN = 'SEU_TOKEN_AQUI';

rpg.init(client, TOKEN);

PACOTES NECESSÁRIOS:
npm install discord.js@latest

COMANDOS DISPONÍVEIS:
,perfil
,renomear Nome
,caçar
,treinar10 / ,treinar30 / ,treinar60
,viajar / ,viajar Nome do Mapa
,dangeou / ,dangeou secreto
,armas
,equipar NÚMERO
,mochila
,verificar
,ajuda

ADM (apenas ID 1053803800340746261):
,darnivel @user 250
,darmoeda @user 5000
,darxp @user 10000
,dararma @user ESPADAS
,dararma_nome @user Enma
,renovar @user
*/

