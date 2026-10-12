
const dados = require("./dados");
const armas = require("./armas");
const monstros = require("./monstros");
const mapas = require("./mapas");
const dungeons = require("./dungeons");
const recompensas = require("./recompensas");
const combate = require("./combate");
const perfil = require("./perfil");
const ranking = require("./ranking");
const conquistas = require("./conquistas");
const loja = require("./loja");
const missoes = require("./missoes");
const eventos = require("./eventos");
const chefes = require("./chefes");
const eventosEspeciais = require("./eventos_especiais");
const progresso = require("./progresso");

const PREFIXO = ",";

function numero(valor, padrao = 0) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : padrao;
}

function nomeItem(item) {
    if (typeof item === "string") return item;
    return item?.nome || item?.id || "Item";
}

function dividirTexto(texto, limite = 1850) {
    const partes = [];
    let atual = "";

    for (const linha of String(texto).split("\n")) {
        if ((atual + "\n" + linha).length > limite && atual) {
            partes.push(atual);
            atual = linha;
        } else {
            atual += (atual ? "\n" : "") + linha;
        }
    }

    if (atual) partes.push(atual);
    return partes;
}

async function responder(message, valor) {
    if (valor == null) {
        return message.reply("Não há informações disponíveis.");
    }

    if (typeof valor === "string") {
        return message.reply({
            content: valor.slice(0, 1950)
        });
    }

    if (Array.isArray(valor)) {
        const texto = valor.map(nomeItem).join("\n");
        return message.reply(texto.slice(0, 1950) || "Lista vazia.");
    }

    if (typeof valor === "object") {
        if (valor.embeds || valor.content || valor.components) {
            return message.reply(valor);
        }

        if (valor.title || valor.description || valor.fields) {
            return message.reply({ embeds: [valor] });
        }

        return message.reply(
            "```json\n" +
            JSON.stringify(valor, null, 2).slice(0, 1800) +
            "\n```"
        );
    }

    return message.reply(String(valor));
}

function prepararJogador(jogador) {
    jogador.nivel = Math.max(1, numero(jogador.nivel, 1));
    jogador.xp = Math.max(0, numero(jogador.xp));
    jogador.moedas = Math.max(0, numero(jogador.moedas, 100));

    jogador.vidaMax = Math.max(1, numero(jogador.vidaMax, 100));
    jogador.vida = Math.max(
        0,
        Math.min(jogador.vidaMax, numero(jogador.vida, jogador.vidaMax))
    );

    // Compatibilidade com os campos usados pelo combate.
    jogador.vidaMaxima = jogador.vidaMax;
    jogador.vidaAtual = jogador.vida;

    if (jogador.armaAtual) {
        jogador.armaEquipada = jogador.armaAtual;
    }

    return jogador;
}

function calcularXPProximo(jogador) {
    try {
        if (typeof recompensas.experienciaNecessaria === "function") {
            return Math.max(
                1,
                numero(
                    recompensas.experienciaNecessaria(jogador.nivel),
                    100 + jogador.nivel * 50
                )
            );
        }
    } catch (erro) {
        console.error("[Crônicas do Caos] Cálculo de XP:", erro.message);
    }

    return 100 + jogador.nivel * 50;
}

function subirNivel(jogador) {
    const mensagens = [];

    jogador.xpProx = calcularXPProximo(jogador);

    while (jogador.nivel < 400 && jogador.xp >= jogador.xpProx) {
        jogador.xp -= jogador.xpProx;
        jogador.nivel++;

        jogador.vidaMax += 10;
        jogador.ataque += 2;
        jogador.defesa += 1;
        jogador.vida = jogador.vidaMax;

        jogador.xpProx = calcularXPProximo(jogador);

        mensagens.push(
            `🌟 Você alcançou o **nível ${jogador.nivel}**!\n` +
            "❤️ +10 de vida máxima | ⚔️ +2 de ataque | 🛡️ +1 de defesa"
        );
    }

    if (jogador.nivel >= 400) {
        jogador.nivel = 400;
    }

    return mensagens;
}

function salvar(jogador) {
    // Mantém os campos sincronizados antes de persistir.
    jogador.vida = Math.max(
        0,
        Math.min(jogador.vidaMax, numero(jogador.vidaAtual, jogador.vida))
    );

    jogador.vidaMaxima = jogador.vidaMax;
    dados.salvarJogador(jogador);
}

async function executarCaca(message, jogador) {
    if (jogador.vida <= 0) {
        jogador.vida = jogador.vidaMax;
    }

    const monstro = combate.obterMonstroParaBatalha(jogador.nivel);

    if (!monstro) {
        return message.reply("Não foi possível encontrar um monstro.");
    }

    const introducao =
        `🌑 **ENCONTRO: ${monstro.nome}**\n` +
        `${monstro.narracao || "Uma criatura aparece diante de você!"}\n` +
        `📍 Região: **${monstro.mapa || jogador.mapaAtual}**`;

    // O combate usa vidaMaxima/vidaAtual; sincronizamos com vidaMax/vida.
    jogador.vidaMaxima = jogador.vidaMax;
    jogador.vidaAtual = jogador.vida;
    jogador.armaEquipada = jogador.armaAtual || jogador.armaEquipada;

    const resultado = combate.simularCombate(jogador, monstro);

    jogador.vida = jogador.vidaAtual;
    jogador.vidaMaxima = jogador.vidaMax;

    let recompensaTexto = "";

    if (resultado.venceu) {
        const xpGanho = Math.max(0, numero(monstro.xp, 20));
        const moedasGanhas = Math.max(0, numero(monstro.moedas, 10));

        jogador.xp += xpGanho;
        jogador.moedas += moedasGanhas;
        jogador.vitorias = numero(jogador.vitorias) + 1;
        jogador.monstrosDerrotados =
            numero(jogador.monstrosDerrotados) + 1;

        recompensaTexto =
            `\n\n🎁 **RECOMPENSAS**\n` +
            `✨ +${xpGanho} XP\n` +
            `🪙 +${moedasGanhas} moedas`;

        if (Math.random() < numero(monstro.chanceItem, 0)) {
            recompensaTexto +=
                "\n🎲 A criatura deixou uma oportunidade de saque, " +
                "mas nenhum item automático foi configurado para este monstro.";
        }

        try {
            if (typeof missoes.registrarVitoria === "function") {
                missoes.registrarVitoria(jogador);
            }

            if (typeof missoes.registrarMonstroDerrotado === "function") {
                missoes.registrarMonstroDerrotado(jogador, monstro);
            }

            if (typeof conquistas.verificarConquistas === "function") {
                const novas = conquistas.verificarConquistas(jogador);
                if (Array.isArray(novas) && novas.length) {
                    recompensaTexto +=
                        "\n\n🏅 **Novas conquistas**\n" +
                        novas.map(nomeItem).join("\n");
                }
            }
        } catch (erro) {
            console.error("[Crônicas do Caos] Progresso:", erro.message);
        }

        const niveis = subirNivel(jogador);

        if (niveis.length) {
            recompensaTexto += "\n\n" + niveis.join("\n\n");
        }
    } else {
        jogador.derrotas = numero(jogador.derrotas) + 1;
    }

    // A vida é recuperada após a batalha, seja vitória ou derrota.
    jogador.vida = jogador.vidaMax;
    jogador.vidaAtual = jogador.vidaMax;
    jogador.vidaMaxima = jogador.vidaMax;

    recompensaTexto +=
        `\n\n❤️ **Recuperação pós-batalha**\n` +
        `Sua vida foi restaurada para **${jogador.vida}/${jogador.vidaMax}**.`;

    salvar(jogador);

    const textoFinal =
        introducao + "\n\n" +
        (resultado.mensagem || "A batalha terminou.") +
        recompensaTexto;

    for (const parte of dividirTexto(textoFinal)) {
        await message.channel.send(parte);
    }
}

module.exports = function (client) {
    dados.carregarBanco();

    client.on("messageCreate", async message => {
        if (message.author.bot || !message.guild) return;
        if (!message.content.startsWith(PREFIXO)) return;

        const args = message.content
            .slice(PREFIXO.length)
            .trim()
            .split(/\s+/);

        const comando = (args.shift() || "").toLowerCase();

        const comandos = [
            "cacar", "caçar", "perfil", "progresso", "armas",
            "mapas", "chefes", "dungeons", "loja", "missoes",
            "missões", "conquistas", "ranking", "eventos",
            "eventosglobal"
        ];

        if (!comandos.includes(comando)) return;

        try {
            const jogador = prepararJogador(
                dados.getJogador(message.author.id, message.author.username)
            );

            switch (comando) {
                case "cacar":
                case "caçar":
                    return await executarCaca(message, jogador);

                case "perfil":
                    return await responder(message, perfil.gerarPerfil(jogador));

                case "progresso":
                    return await responder(
                        message,
                        progresso.formatarProgresso(jogador)
                    );

                case "armas":
                    return await responder(message, armas.listarArmas());

                case "mapas":
                    return await responder(message, mapas.listarMapas());

                case "chefes":
                    return await responder(message, chefes.listarChefes());

                case "dungeons":
                    return await responder(message, dungeons.listarDungeons());

                case "loja":
                    return await responder(message, loja.gerarLoja(jogador));

                case "missoes":
                case "missões":
                    return await responder(
                        message,
                        missoes.formatarMissoes(jogador)
                    );

                case "conquistas":
                    return await responder(
                        message,
                        conquistas.gerarPainel(jogador)
                    );

                case "ranking":
                    return await responder(message, ranking.gerarRanking());

                case "eventos":
                    return await responder(
                        message,
                        eventos.listarEventosDisponiveis(jogador)
                    );

                case "eventosglobal":
                    return await responder(
                        message,
                        eventosEspeciais.formatarListaEventos()
                    );
            }
        } catch (erro) {
            console.error(
                `[Crônicas do Caos] Erro no comando ${comando}:`,
                erro.stack || erro
            );

            return message.reply(
                "❌ O comando encontrou um erro. Confira os logs do Render."
            ).catch(() => {});
        }
    });

    console.log("[Crônicas do Caos] Sistema de RPG conectado.");
};

