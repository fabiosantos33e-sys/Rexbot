// ==========================================================
// CRÔNICAS DO CAOS — PERFIL DO AVENTUREIRO
// Exibição de atributos, equipamentos, estatísticas e jornada
// ==========================================================

const armas = require("./armas");
const mapas = require("./mapas");
const recompensas = require("./recompensas");

function numero(valor, padrao = 0) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : padrao;
}

function formatar(valor) {
    return Math.floor(numero(valor)).toLocaleString("pt-BR");
}

function obterNivel(jogador) {
    return Math.max(
        1,
        Math.min(400, Math.floor(numero(jogador.nivel, 1)))
    );
}

function obterVidaMaxima(jogador) {
    return Math.max(
        1,
        numero(
            jogador.vidaMaxima ??
            jogador.vida_maxima ??
            jogador.hpMax ??
            jogador.hp_maximo ??
            jogador.vida,
            100
        )
    );
}

function obterVidaAtual(jogador) {
    const maximo = obterVidaMaxima(jogador);

    return Math.max(
        0,
        Math.min(
            maximo,
            numero(
                jogador.vidaAtual ??
                jogador.vida_atual ??
                jogador.hp,
                maximo
            )
        )
    );
}

function obterArma(jogador) {
    const id =
        jogador.armaEquipada ||
        jogador.arma ||
        jogador.equipamento?.arma ||
        "espada_enferrujada";

    if (typeof armas.obterArma === "function") {
        return armas.obterArma(id) || {
            id,
            nome: id
        };
    }

    return {
        id,
        nome: id
    };
}

function obterMapaAtual(jogador) {
    const id =
        jogador.mapaAtual ||
        jogador.mapa ||
        "vila_inicial";

    if (typeof mapas.obterMapa === "function") {
        const mapa = mapas.obterMapa(id);

        if (mapa) {
            return {
                id,
                ...mapa
            };
        }
    }

    return {
        id,
        nome: String(id)
    };
}

function obterEstatisticas(jogador) {
    const estatisticas = jogador.estatisticas || {};

    return {
        vitorias: numero(
            jogador.vitorias ?? estatisticas.vitorias
        ),
        derrotas: numero(
            jogador.derrotas ?? estatisticas.derrotas
        ),
        monstrosDerrotados: numero(
            jogador.monstrosDerrotados ??
            estatisticas.monstrosDerrotados
        ),
        chefesDerrotados: numero(
            jogador.chefesDerrotados ??
            estatisticas.chefesDerrotados
        ),
        dungeonsConcluidas: numero(
            jogador.dungeonsConcluidas ??
            estatisticas.dungeonsConcluidas
        ),
        danoTotal: numero(
            jogador.danoTotal ?? estatisticas.danoTotal
        )
    };
}

function obterAtributos(jogador) {
    return {
        forca: numero(jogador.forca ?? jogador.ataque, 10),
        defesa: numero(jogador.defesa, 0),
        agilidade: numero(jogador.agilidade, 0),
        sorte: numero(jogador.sorte, 0)
    };
}

function barraProgresso(atual, maximo, tamanho = 12) {
    maximo = Math.max(1, numero(maximo, 1));
    atual = Math.max(0, Math.min(maximo, numero(atual)));

    const preenchido = Math.round(
        (atual / maximo) * tamanho
    );

    return (
        "█".repeat(preenchido) +
        "░".repeat(tamanho - preenchido)
    );
}

function calcularProgressoXP(jogador) {
    const nivel = obterNivel(jogador);
    const xpAtual = Math.max(
        0,
        numero(jogador.experiencia)
    );

    if (nivel >= 400) {
        return {
            atual: 0,
            necessario: 0,
            percentual: 100,
            maximo: true
        };
    }

    const necessario =
        recompensas.experienciaNecessaria(nivel);

    return {
        atual: xpAtual,
        necessario,
        percentual: Math.min(
            100,
            Math.floor((xpAtual / necessario) * 100)
        ),
        maximo: false
    };
}

function gerarPerfil(jogador, usuario = null) {
    if (!jogador || typeof jogador !== "object") {
        throw new Error("Dados do aventureiro inválidos.");
    }

    const nivel = obterNivel(jogador);
    const vida = obterVidaAtual(jogador);
    const vidaMaxima = obterVidaMaxima(jogador);
    const xp = calcularProgressoXP(jogador);
    const arma = obterArma(jogador);
    const mapa = obterMapaAtual(jogador);
    const atributos = obterAtributos(jogador);
    const estatisticas = obterEstatisticas(jogador);

    const nome =
        jogador.nome ||
        usuario?.globalName ||
        usuario?.username ||
        "Aventureiro sem nome";

    const moedas = Math.max(
        0,
        numero(jogador.moedas)
    );

    const inventario = Array.isArray(jogador.inventario)
        ? jogador.inventario
        : [];

    const titulos = Array.isArray(jogador.titulos)
        ? jogador.titulos
        : [];

    const tituloAtivo =
        jogador.tituloAtivo ||
        jogador.titulo ||
        "Sem título";

    const linhas = [
        "╔══════════════════════════════╗",
        "       🌑 CRÔNICAS DO CAOS",
        "       📜 PERFIL DO AVENTUREIRO",
        "╚══════════════════════════════╝",
        "",
        `👤 **Nome:** ${nome}`,
        `🏷️ **Título:** ${tituloAtivo}`,
        `⭐ **Nível:** ${formatar(nivel)}/400`,
        "",
        "❤️ **VITALIDADE**",
        `${barraProgresso(vida, vidaMaxima)} ${Math.floor(
            (vida / vidaMaxima) * 100
        )}%`,
        `❤️ Vida: ${formatar(vida)}/${formatar(vidaMaxima)}`,
        "",
        "✨ **EXPERIÊNCIA**",
        xp.maximo
            ? "🌟 Nível máximo alcançado!"
            : `${barraProgresso(xp.atual, xp.necessario)} ` +
              `${formatar(xp.atual)}/${formatar(xp.necessario)} XP`,
        "",
        "⚔️ **EQUIPAMENTO**",
        `🗡️ Arma: ${arma.nome || arma.id || "Nenhuma"}`,
        `🎒 Itens no inventário: ${inventario.length}`,
        "",
        "📊 **ATRIBUTOS**",
        `💪 Força: ${formatar(atributos.forca)}`,
        `🛡️ Defesa: ${formatar(atributos.defesa)}`,
        `💨 Agilidade: ${formatar(atributos.agilidade)}`,
        `🍀 Sorte: ${formatar(atributos.sorte)}`,
        "",
        "🗺️ **JORNADA**",
        `📍 Região atual: ${mapa.nome}`,
        `💰 Moedas: ${formatar(moedas)}`,
        "",
        "🏆 **ESTATÍSTICAS DE COMBATE**",
        `✅ Vitórias: ${formatar(estatisticas.vitorias)}`,
        `❌ Derrotas: ${formatar(estatisticas.derrotas)}`,
        `☠️ Monstros derrotados: ${formatar(
            estatisticas.monstrosDerrotados
        )}`,
        `👑 Chefes derrotados: ${formatar(
            estatisticas.chefesDerrotados
        )}`,
        `🏰 Masmorras concluídas: ${formatar(
            estatisticas.dungeonsConcluidas
        )}`,
        `💥 Dano total: ${formatar(estatisticas.danoTotal)}`,
        "",
        `🎖️ Títulos conquistados: ${titulos.length}`,
        "",
        "_Sua lenda ainda está sendo escrita..._"
    ];

    return {
        nome,
        nivel,
        vida,
        vidaMaxima,
        experiencia: xp,
        arma,
        mapa,
        atributos,
        estatisticas,
        moedas,
        inventario,
        titulos,
        linhas,
        texto: linhas.join("\n")
    };
}

function gerarResumo(jogador, usuario = null) {
    const perfil = gerarPerfil(jogador, usuario);

    return [
        `**${perfil.nome}** — Nível ${perfil.nivel}`,
        `❤️ ${formatar(perfil.vida)}/${formatar(perfil.vidaMaxima)}`,
        `🗡️ ${perfil.arma.nome || perfil.arma.id}`,
        `🗺️ ${perfil.mapa.nome}`,
        `💰 ${formatar(perfil.moedas)} moedas`,
        `🏆 ${formatar(perfil.estatisticas.vitorias)} vitórias`
    ].join("\n");
}

module.exports = {
    gerarPerfil,
    gerarResumo,
    obterNivel,
    obterVidaAtual,
    obterVidaMaxima,
    obterEstatisticas,
    obterAtributos,
    calcularProgressoXP,
    barraProgresso
};
