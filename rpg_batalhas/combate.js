// ==========================================================
// CRÔNICAS DO CAOS — SISTEMA DE COMBATE AUTOMÁTICO
// Técnicas, críticos, Absoluto Crítico e narração dinâmica
// ==========================================================

const armas = require("./armas");
const monstros = require("./monstros");

const CONFIG = {
    nivelMaximo: 400,
    chanceCritico: 0.12,
    multiplicadorCritico: 1.75,
    recuperacaoVitoria: 1,
    recuperacaoDerrota: 1,
    limiteTurnos: 40
};

function inteiro(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escolher(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
        return null;
    }

    return lista[inteiro(0, lista.length - 1)];
}

function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, valor));
}

function formatarNumero(valor) {
    return Math.max(0, Math.floor(valor)).toLocaleString("pt-BR");
}

function percentual(vida, vidaMaxima) {
    if (vidaMaxima <= 0) return 0;
    return limitar((vida / vidaMaxima) * 100, 0, 100);
}

function narrarVida(vida, vidaMaxima) {
    const porcentagem = percentual(vida, vidaMaxima);

    if (porcentagem <= 10) {
        return "à beira da derrota";
    }

    if (porcentagem <= 25) {
        return "gravemente ferido";
    }

    if (porcentagem <= 50) {
        return "ferido";
    }

    if (porcentagem <= 75) {
        return "sentindo o peso da batalha";
    }

    return "pronto para continuar";
}

function obterArmaDoJogador(jogador) {
    const id =
        jogador.armaEquipada ||
        jogador.arma ||
        jogador.equipamento?.arma ||
        "espada_enferrujada";

    return armas.obterArma(id) || armas.obterArma("espada_enferrujada");
}

function obterNomeArma(arma) {
    return arma?.nome || "Arma desconhecida";
}

function obterNomeMonstro(monstro) {
    return monstro?.nome || "Criatura desconhecida";
}

function obterNivel(jogador) {
    return limitar(
        Math.floor(Number(jogador.nivel) || 1),
        1,
        CONFIG.nivelMaximo
    );
}

function obterVidaMaxima(jogador) {
    const valor =
        jogador.vidaMaxima ??
        jogador.vida_maxima ??
        jogador.hpMax ??
        jogador.hp_maximo ??
        jogador.vida ??
        100;

    return Math.max(1, Number(valor) || 100);
}

function obterVidaAtual(jogador, vidaMaxima) {
    const valor =
        jogador.vidaAtual ??
        jogador.vida_atual ??
        jogador.hp ??
        vidaMaxima;

    return limitar(Number(valor) || 0, 0, vidaMaxima);
}

function gravarVida(jogador, vida) {
    const vidaMaxima = obterVidaMaxima(jogador);
    const valor = limitar(Math.floor(vida), 0, vidaMaxima);

    if ("vidaAtual" in jogador || !("vida_atual" in jogador)) {
        jogador.vidaAtual = valor;
    }

    if ("vida_atual" in jogador) {
        jogador.vida_atual = valor;
    }

    if ("hp" in jogador) {
        jogador.hp = valor;
    }
}

function obterAtributo(jogador, nomes, padrao = 0) {
    for (const nome of nomes) {
        const valor = Number(jogador[nome]);

        if (Number.isFinite(valor)) {
            return Math.max(0, valor);
        }
    }

    return padrao;
}

function obterAtaque(jogador, arma) {
    const base = obterAtributo(
        jogador,
        ["ataque", "forca", "força", "dano"],
        10
    );

    const bonus =
        Number(arma?.ataque) ||
        Number(arma?.dano) ||
        Number(arma?.bonusAtaque) ||
        0;

    return Math.max(1, base + bonus);
}

function obterDefesa(jogador) {
    return obterAtributo(
        jogador,
        ["defesa", "def", "armadura"],
        0
    );
}

function obterMonstroParaBatalha(nivel) {
    if (typeof monstros.sortearMonstro === "function") {
        const sorteado = monstros.sortearMonstro(nivel);

        if (sorteado) return sorteado;
    }

    if (typeof monstros.listarMonstros === "function") {
        const lista = monstros.listarMonstros();

        if (Array.isArray(lista) && lista.length > 0) {
            const elegiveis = lista.filter(monstro => {
                const minimo = Number(monstro.nivelMinimo) || 1;
                return minimo <= nivel;
            });

            return escolher(elegiveis.length ? elegiveis : lista);
        }
    }

    if (monstros.MONSTROS) {
        const lista = Object.values(monstros.MONSTROS);

        if (lista.length > 0) {
            return escolher(lista);
        }
    }

    throw new Error(
        "Não foi possível encontrar monstros no módulo monstros.js."
    );
}

function obterTecnica(arma) {
    const id = arma?.id || arma?.nome;

    if (typeof armas.selecionarTecnica === "function") {
        const tecnica = armas.selecionarTecnica(id);

        if (tecnica) return tecnica;
    }

    if (typeof armas.obterTecnicas === "function") {
        const tecnicas = armas.obterTecnicas(id);

        if (Array.isArray(tecnicas) && tecnicas.length > 0) {
            return escolher(tecnicas);
        }
    }

    if (Array.isArray(arma?.tecnicas) && arma.tecnicas.length > 0) {
        return escolher(arma.tecnicas);
    }

    return {
        nome: "Golpe de Combate",
        dano: 1,
        descricao: "Um ataque direto contra o adversário."
    };
}

function obterMultiplicadorTecnica(tecnica) {
    const valor =
        Number(tecnica?.multiplicador) ||
        Number(tecnica?.danoMultiplicador) ||
        Number(tecnica?.dano) ||
        1;

    return limitar(valor, 0.5, 5);
}

function obterAtaqueMonstro(monstro) {
    return Math.max(
        1,
        Number(monstro.ataque) ||
        Number(monstro.dano) ||
        Number(monstro.forca) ||
        8
    );
}

function obterDefesaMonstro(monstro) {
    return Math.max(
        0,
        Number(monstro.defesa) ||
        Number(monstro.armadura) ||
        0
    );
}

function obterVidaMonstro(monstro, nivelJogador) {
    const nivelMonstro = Math.max(
        1,
        Number(monstro.nivel) ||
        Number(monstro.nivelMinimo) ||
        nivelJogador
    );

    const vidaBase = Math.max(
        1,
        Number(monstro.vida) ||
        Number(monstro.hp) ||
        Number(monstro.vidaMaxima) ||
        60
    );

    return {
        nivel: nivelMonstro,
        vidaMaxima: Math.floor(
            vidaBase * (1 + Math.max(0, nivelJogador - nivelMonstro) * 0.035)
        )
    };
}

function tentarAbsoluto(arma, jogador, vidaAtual, vidaMaxima) {
    if (typeof armas.tentarAbsoluto !== "function") {
        return false;
    }

    const id = arma?.id || arma?.nome;

    try {
        return Boolean(
            armas.tentarAbsoluto(
                id,
                vidaAtual,
                vidaMaxima
            )
        );
    } catch {
        return false;
    }
}

function descreverAbsoluto(arma) {
    if (typeof armas.obterAbsoluto !== "function") {
        return "O poder absoluto da arma desperta!";
    }

    const id = arma?.id || arma?.nome;

    try {
        const absoluto = armas.obterAbsoluto(id);

        if (typeof absoluto === "string") {
            return absoluto;
        }

        return (
            absoluto?.nome ||
            absoluto?.descricao ||
            "O poder absoluto da arma desperta!"
        );
    } catch {
        return "O poder absoluto da arma desperta!";
    }
}

function calcularDano(atacante, defensor, multiplicador = 1) {
    const ataque = Math.max(1, Number(atacante) || 1);
    const defesa = Math.max(0, Number(defensor) || 0);

    return Math.max(
        1,
        Math.floor(ataque * multiplicador - defesa * 0.45)
    );
}

function criarResultado() {
    return {
        venceu: false,
        derrotado: false,
        turnos: 0,
        danoCausado: 0,
        danoRecebido: 0,
        vidaInicial: 0,
        vidaFinal: 0,
        vidaMonstroInicial: 0,
        vidaMonstroFinal: 0,
        monstro: null,
        arma: null,
        recompensa: null,
        registros: [],
        mensagem: ""
    };
}

function registrar(resultado, texto) {
    resultado.registros.push(texto);
}

function atacarJogador(jogador, monstro, arma, estado, resultado) {
    const tecnica = obterTecnica(arma);
    const multiplicador = obterMultiplicadorTecnica(tecnica);
    const ataque = obterAtaque(jogador, arma);

    let dano = calcularDano(
        ataque,
        obterDefesaMonstro(monstro),
        multiplicador
    );

    const vidaJogador = obterVidaAtual(jogador, estado.vidaMaxima);
    const absoluto = tentarAbsoluto(
        arma,
        jogador,
        vidaJogador,
        estado.vidaMaxima
    );

    if (absoluto) {
        dano = Math.max(dano, estado.vidaMonstro);

        registrar(
            resultado,
            `🌌 **ABSOLUTO CRÍTICO!**\n` +
            `${descreverAbsoluto(arma)}\n` +
            `💥 O golpe atravessa a defesa e encerra a batalha!`
        );
    } else {
        const critico = Math.random() < CONFIG.chanceCritico;

        if (critico) {
            dano = Math.floor(dano * CONFIG.multiplicadorCritico);

            registrar(
                resultado,
                `✨ **GOLPE CRÍTICO!** ${tecnica.nome || "Ataque especial"}!`
            );
        } else {
            registrar(
                resultado,
                `⚔️ **${tecnica.nome || "Golpe de Combate"}**\n` +
                `${tecnica.descricao || "Você ataca com sua arma."}`
            );
        }
    }

    dano = Math.min(dano, estado.vidaMonstro);

    estado.vidaMonstro -= dano;
    resultado.danoCausado += dano;

    registrar(
        resultado,
        `🩸 ${obterNomeMonstro(monstro)} recebeu ` +
        `**${formatarNumero(dano)} de dano**.\n` +
        `❤️ Vida do inimigo: ${formatarNumero(estado.vidaMonstro)}/` +
        `${formatarNumero(estado.vidaMonstroMaxima)}.`
    );
}

function atacarMonstro(jogador, monstro, estado, resultado) {
    const ataque = obterAtaqueMonstro(monstro);
    const defesa = obterDefesa(jogador);

    const dano = Math.min(
        estado.vidaJogador,
        calcularDano(ataque, defesa, 1)
    );

    estado.vidaJogador = Math.max(0, estado.vidaJogador - dano);
    resultado.danoRecebido += dano;

    registrar(
        resultado,
        `💢 ${obterNomeMonstro(monstro)} contra-ataca!\n` +
        `🩸 Você recebeu **${formatarNumero(dano)} de dano**.\n` +
        `❤️ Sua vida: ${formatarNumero(estado.vidaJogador)}/` +
        `${formatarNumero(estado.vidaMaxima)}.`
    );

    registrar(
        resultado,
        `📖 Você está ${narrarVida(
            estado.vidaJogador,
            estado.vidaMaxima
        )}.`
    );
}

function recuperarVida(jogador, resultado, venceu) {
    const vidaMaxima = obterVidaMaxima(jogador);

    const antes = obterVidaAtual(jogador, vidaMaxima);

    // Recuperação total ao fim de qualquer batalha.
    const depois = vidaMaxima;

    gravarVida(jogador, depois);

    registrar(
        resultado,
        `❤️ **RECUPERAÇÃO PÓS-BATALHA**\n` +
        `Sua vida foi restaurada: ${formatarNumero(antes)} → ` +
        `${formatarNumero(depois)}/${formatarNumero(vidaMaxima)}.\n` +
        `📜 Resultado: ${venceu ? "vitória" : "derrota"}.`
    );
}

function simularCombate(jogador, monstroOpcional = null) {
    if (!jogador || typeof jogador !== "object") {
        throw new Error("Jogador inválido.");
    }

    const resultado = criarResultado();
    const nivel = obterNivel(jogador);
    const arma = obterArmaDoJogador(jogador);
    const monstro = monstroOpcional || obterMonstroParaBatalha(nivel);

    const vidaMaxima = obterVidaMaxima(jogador);
    const vidaInicial = obterVidaAtual(jogador, vidaMaxima);
    const dadosMonstro = obterVidaMonstro(monstro, nivel);

    const estado = {
        vidaMaxima,
        vidaJogador: vidaInicial,
        vidaMonstroMaxima: dadosMonstro.vidaMaxima,
        vidaMonstro: dadosMonstro.vidaMaxima
    };

    resultado.vidaInicial = vidaInicial;
    resultado.vidaMonstroInicial = estado.vidaMonstroMaxima;
    resultado.monstro = monstro;
    resultado.arma = arma;

    registrar(
        resultado,
        `╔══════════════════════════╗\n` +
        `      ⚔️ **CRÔNICAS DO CAOS**\n` +
        `╚══════════════════════════╝\n\n` +
        `🌑 A atmosfera pesa quando ${obterNomeMonstro(monstro)} ` +
        `surge diante de você.\n` +
        `🗡️ Arma equipada: **${obterNomeArma(arma)}**.\n` +
        `❤️ Sua vida: ${formatarNumero(estado.vidaJogador)}/` +
        `${formatarNumero(vidaMaxima)}.\n` +
        `☠️ Vida inimiga: ${formatarNumero(estado.vidaMonstro)}/` +
        `${formatarNumero(estado.vidaMonstroMaxima)}.`
    );

    for (
        let turno = 1;
        turno <= CONFIG.limiteTurnos;
        turno++
    ) {
        resultado.turnos = turno;

        if (estado.vidaJogador <= 0 || estado.vidaMonstro <= 0) {
            break;
        }

        registrar(
            resultado,
            `\n━━━━━━━━ **TURNO ${turno}** ━━━━━━━━`
        );

        atacarJogador(
            jogador,
            monstro,
            arma,
            estado,
            resultado
        );

        if (estado.vidaMonstro <= 0) {
            break;
        }

        atacarMonstro(
            jogador,
            monstro,
            estado,
            resultado
        );

        if (estado.vidaJogador <= 0) {
            break;
        }
    }

    resultado.venceu = estado.vidaMonstro <= 0;
    resultado.derrotado = !resultado.venceu;

    if (
        estado.vidaJogador > 0 &&
        estado.vidaMonstro > 0 &&
        resultado.turnos >= CONFIG.limiteTurnos
    ) {
        resultado.venceu =
            estado.vidaJogador > estado.vidaMonstro;

        resultado.derrotado = !resultado.venceu;

        registrar(
            resultado,
            "⏳ A batalha atingiu o limite de turnos. " +
            "O resultado foi decidido pelo estado final do combate."
        );
    }

    gravarVida(jogador, estado.vidaJogador);

    resultado.vidaFinal = estado.vidaJogador;
    resultado.vidaMonstroFinal = estado.vidaMonstro;

    if (resultado.venceu) {
        registrar(
            resultado,
            `\n🏆 **VITÓRIA!**\n` +
            `${obterNomeMonstro(monstro)} foi derrotado. ` +
            `O caminho continua aberto para você.`
        );
    } else {
        registrar(
            resultado,
            `\n🌑 **DERROTA...**\n` +
            `Você não conseguiu superar ${obterNomeMonstro(monstro)}. ` +
            `Sua jornada ainda não terminou.`
        );
    }

    recuperarVida(jogador, resultado, resultado.venceu);

    resultado.mensagem = resultado.registros.join("\n\n");

    return resultado;
}

// ==========================================================
// EXPORTAÇÕES
// ==========================================================

module.exports = {
    CONFIG,
    simularCombate,
    obterMonstroParaBatalha,
    calcularDano,
    experienciaNecessaria: nivel => {
        const recompensas = require("./recompensas");
        return recompensas.experienciaNecessaria(nivel);
    }
};
