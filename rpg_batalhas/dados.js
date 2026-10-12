// ======================================================
// CRÔNICAS DO CAOS — BANCO DE DADOS
// Node.js / CommonJS
// Compatível com dados_rpg/jogadores.json
// ======================================================

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "dados_rpg");
const PLAYERS_FILE = path.join(DATA_DIR, "jogadores.json");
const BACKUP_FILE = path.join(DATA_DIR, "jogadores.backup.json");
const TEMP_FILE = path.join(DATA_DIR, "jogadores.tmp");

fs.mkdirSync(DATA_DIR, { recursive: true });

let jogadores = {};
let bancoCarregado = false;

function criarJogador(id, nome = "Aventureiro") {
    return {
        id,
        nome,
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

        classe: "Aventureiro",

        armaAtual: null,
        armaduraAtual: null,

        armas: [],
        armaduras: [],
        inventario: [],

        mapaAtual: "Vila Inicial",

        vitorias: 0,
        derrotas: 0,
        monstrosDerrotados: 0,
        chefesDerrotados: 0,
        dungeonsConcluidas: 0,

        conquistas: [],

        ultimoTreino: 0,
        ultimaCaca: 0,
        ultimaDungeon: 0,
        ultimoLogin: Date.now()
    };
}

// ======================================================
// CARREGAR BANCO COM PROTEÇÃO
// ======================================================

function carregarBanco() {
    if (!fs.existsSync(PLAYERS_FILE)) {
        jogadores = {};
        bancoCarregado = true;
        return jogadores;
    }

    try {
        const conteudo = fs.readFileSync(
            PLAYERS_FILE,
            "utf8"
        );

        const dados = JSON.parse(conteudo);

        if (
            !dados ||
            typeof dados !== "object" ||
            Array.isArray(dados)
        ) {
            throw new Error("Formato do banco inválido.");
        }

        jogadores = dados;
        bancoCarregado = true;

        console.log(
            `[RPG] ${Object.keys(jogadores).length} personagens carregados.`
        );

        return jogadores;
    } catch (erro) {
        bancoCarregado = false;

        console.error(
            "[RPG] ERRO AO LER O BANCO:",
            erro.message
        );

        console.error(
            "[RPG] Salvamento bloqueado para proteger os personagens."
        );

        throw new Error(
            "O banco de dados não pôde ser carregado. " +
            "Verifique jogadores.json antes de continuar."
        );
    }
}

// ======================================================
// SALVAR BANCO COM BACKUP
// ======================================================

function salvarBanco() {
    if (!bancoCarregado) {
        throw new Error(
            "Salvamento bloqueado: banco não carregado corretamente."
        );
    }

    const conteudo = JSON.stringify(jogadores, null, 2);

    // Salva primeiro em um arquivo temporário.
    fs.writeFileSync(TEMP_FILE, conteudo, "utf8");

    // Confere se o arquivo temporário é um JSON válido.
    JSON.parse(fs.readFileSync(TEMP_FILE, "utf8"));

    // Faz backup do banco anterior antes de substituí-lo.
    if (fs.existsSync(PLAYERS_FILE)) {
        fs.copyFileSync(PLAYERS_FILE, BACKUP_FILE);
    }

    // Substituição do arquivo principal.
    fs.renameSync(TEMP_FILE, PLAYERS_FILE);
}

// ======================================================
// OBTER OU CRIAR PERSONAGEM
// ======================================================

function getJogador(id, nome = "Aventureiro") {
    if (!bancoCarregado) {
        carregarBanco();
    }

    if (!jogadores[id]) {
        jogadores[id] = criarJogador(id, nome);
    }

    const jogador = jogadores[id];

    // Completa campos ausentes sem apagar os antigos.
    jogador.id ??= id;
    jogador.nome = nome || jogador.nome || "Aventureiro";

    jogador.nivel ??= 1;
    jogador.xp ??= 0;
    jogador.xpProx ??= 100;
    jogador.moedas ??= 100;

    jogador.vidaMax ??= 100;
    jogador.vida ??= jogador.vidaMax;

    jogador.ataque ??= 10;
    jogador.defesa ??= 5;
    jogador.velocidade ??= 5;
    jogador.sorte ??= 1;

    jogador.classe ??= "Aventureiro";

    jogador.armaAtual ??= null;
    jogador.armaduraAtual ??= null;

    jogador.armas ??= [];
    jogador.armaduras ??= [];
    jogador.inventario ??= [];

    jogador.mapaAtual ??= "Vila Inicial";

    jogador.vitorias ??= 0;
    jogador.derrotas ??= 0;
    jogador.monstrosDerrotados ??= 0;
    jogador.chefesDerrotados ??= 0;
    jogador.dungeonsConcluidas ??= 0;

    jogador.conquistas ??= [];

    jogador.ultimoTreino ??= 0;
    jogador.ultimaCaca ??= 0;
    jogador.ultimaDungeon ??= 0;
    jogador.ultimoLogin ??= Date.now();

    return jogador;
}

// ======================================================
// SALVAR PERSONAGEM
// ======================================================

function salvarJogador(jogador) {
    if (!jogador || !jogador.id) {
        throw new Error("Personagem inválido para salvar.");
    }

    jogador.ultimoLogin = Date.now();

    jogadores[jogador.id] = jogador;

    salvarBanco();

    return jogador;
}

// ======================================================
// CONSULTAS
// ======================================================

function listarJogadores() {
    if (!bancoCarregado) {
        carregarBanco();
    }

    return Object.values(jogadores);
}

function jogadorExiste(id) {
    if (!bancoCarregado) {
        carregarBanco();
    }

    return Boolean(jogadores[id]);
}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    carregarBanco,
    salvarBanco,
    criarJogador,
    getJogador,
    salvarJogador,
    listarJogadores,
    jogadorExiste
};
