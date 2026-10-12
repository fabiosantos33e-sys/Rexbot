
const { EmbedBuilder } = require("discord.js");

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
const ROXO = 0x6425A8;
const VERMELHO = 0xB51F35;
const DOURADO = 0xE6B84B;
const VERDE = 0x259B62;

function numero(valor, padrao = 0) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : padrao;
}

function nomeItem(item) {
    if (typeof item === "string") return item;
    if (item == null) return "Item";
    if (typeof item === "object") {
        return item.nome || item.name || item.id ||
            item.descricao || JSON.stringify(item);
    }
    return String(item);
}

function barra(atual, maximo, tamanho = 12) {
    maximo = Math.max(1, numero(maximo, 1));
    atual = Math.max(0, Math.min(maximo, numero(atual)));
    const preenchido = Math.round((atual / maximo) * tamanho);
    return "█".repeat(preenchido) +
        "░".repeat(tamanho - preenchido);
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

    jogador.vidaMaxima = jogador.vidaMax;
    jogador.vidaAtual = jogador.vida;
    jogador.experiencia = jogador.xp;

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
        console.error("[Crônicas do Caos] XP:", erro.message);
    }

    return 100 + jogador.nivel * 50;
}

function salvar(jogador) {
    jogador.vida = Math.max(
        0,
        Math.min(jogador.vidaMax, numero(jogador.vidaAtual, jogador.vida))
    );

    jogador.vidaMaxima = jogador.vidaMax;
    jogador.experiencia = jogador.xp;
    dados.salvarJogador(jogador);
}

function embedBase(titulo, cor = ROXO) {
    return new EmbedBuilder()
        .setColor(cor)
        .setTitle(titulo)
        .setFooter({ text: "CRÔNICAS DO CAOS • RPG" })
        .setTimestamp();
}

function dividirTexto(texto, limite = 1000) {
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

    if (valor instanceof EmbedBuilder) {
        return message.reply({ embeds: [valor] });
    }

    if (typeof valor === "string") {
        return message.reply({ content: valor.slice(0, 1950) });
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

function criarPerfilEmbed(jogador, usuario) {
    const xpProximo = calcularXPProximo(jogador);
    const arma = jogador.armaAtual
        ? nomeItem(jogador.armaAtual)
        : "Nenhuma arma equipada";

    const xpAtual = numero(jogador.xp);
    const xpExibido = Math.min(xpAtual, xpProximo);

    const embed = embedBase("⚔️・FICHA DO AVENTUREIRO")
        .setThumbnail(usuario.displayAvatarURL({ size: 256 }))
        .setDescription(
            `> *As crônicas de **${usuario.username}** continuam...*\n\n` +
            `**Classe:** ${jogador.classe || "Aventureiro"}\n` +
            `**Nível:** ${jogador.nivel}/400\n` +
            `**Região:** ${jogador.mapaAtual || "Vila Inicial"}`
        )
        .addFields(
            {
                name: "❤️ VIDA",
                value:
                    `\`${barra(jogador.vida, jogador.vidaMax)}\`\n` +
                    `**${jogador.vida} / ${jogador.vidaMax} HP**`,
                inline: false
            },
            {
                name: "✨ EXPERIÊNCIA",
                value:
                    `\`${barra(xpExibido, xpProximo)}\`\n` +
                    `**${xpAtual} / ${xpProximo} XP**`,
                inline: false
            },
            {
                name: "⚔️ ATAQUE",
                value: `**${numero(jogador.ataque)}**`,
                inline: true
            },
            {
                name: "🛡️ DEFESA",
                value: `**${numero(jogador.defesa)}**`,
                inline: true
            },
            {
                name: "🍀 SORTE",
                value: `**${numero(jogador.sorte, 1)}**`,
                inline: true
            },
            {
                name: "🗡️ ARMA EQUIPADA",
                value: arma.slice(0, 1024),
                inline: false
            },
            {
                name: "🪙 TESOURO",
                value: `**${numero(jogador.moedas)} moedas**`,
                inline: true
            },
            {
                name: "🏆 VITÓRIAS",
                value: `**${numero(jogador.vitorias)}**`,
                inline: true
            },
            {
                name: "💀 DERROTAS",
                value: `**${numero(jogador.derrotas)}**`,
                inline: true
            },
            {
                name: "📜 JORNADA",
                value:
                    `Monstros derrotados: **${numero(jogador.monstrosDerrotados)}**\n` +
                    `Chefes derrotados: **${numero(jogador.chefesDerrotados)}**\n` +
                    `Masmorras concluídas: **${numero(jogador.dungeonsConcluidas)}**`,
                inline: false
            }
        );

    return embed;
}

function formatarRegistro(registro) {
    if (typeof registro === "string") return registro;

    if (typeof registro === "number") return String(registro);

    if (registro && typeof registro === "object") {
        const texto =
            registro.mensagem ||
            registro.texto ||
            registro.narracao ||
            registro.descricao ||
            registro.description;

        if (texto) return String(texto);

        const ator = registro.atacante || registro.nome || registro.ator;
        const acao = registro.acao || registro.ataque || registro.acaoNome;
        const dano = registro.dano;

        if (ator || acao || dano != null) {
            return [
                ator,
                acao,
                dano != null ? `💥 ${dano} de dano` : ""
            ].filter(Boolean).join(" — ");
        }

        return "";
    }

    return "";
}

function criarBatalhaEmbed(jogador, monstro, resultado) {
    const venceu = Boolean(resultado.venceu);
    const cor = venceu ? VERDE : VERMELHO;

    const vidaMonstroMax = numero(
        resultado.vidaMonstroInicial,
        monstro.vida || 1
    );

    const vidaMonstroFinal = numero(resultado.vidaMonstroFinal);
    const vidaInicial = numero(resultado.vidaInicial, jogador.vidaMax);
    const vidaFinal = numero(resultado.vidaFinal);

    const embed = embedBase(
        venceu
            ? "🏆・VITÓRIA NA BATALHA"
            : "☠️・DERROTA NA BATALHA",
        cor
    )
        .setDescription(
            `*${monstro.narracao || "Uma criatura surge das sombras..."}*\n\n` +
            `## ${monstro.nome || "Criatura desconhecida"}\n` +
            `📍 **Região:** ${monstro.mapa || jogador.mapaAtual}\n` +
            `⚔️ **Nível do inimigo:** ${numero(monstro.nivel, 1)}`
        )
        .addFields(
            {
                name: "🩸 VIDA DO INIMIGO",
                value:
                    `\`${barra(vidaMonstroFinal, vidaMonstroMax)}\`\n` +
                    `**${Math.max(0, vidaMonstroFinal)} / ${vidaMonstroMax} HP**`,
                inline: false
            },
            {
                name: "❤️ SUA VIDA DURANTE A BATALHA",
                value:
                    `**${Math.max(0, vidaFinal)} / ${jogador.vidaMax} HP**`,
                inline: true
            },
            {
                name: "💥 DANO CAUSADO",
                value: `**${numero(resultado.danoCausado)}**`,
                inline: true
            },
            {
                name: "🛡️ DANO RECEBIDO",
                value: `**${numero(resultado.danoRecebido)}**`,
                inline: true
            }
        );

    const registros = Array.isArray(resultado.registros)
        ? resultado.registros.map(formatarRegistro).filter(Boolean)
        : [];

    if (registros.length) {
        const linhas = registros.slice(-8);
        const texto = dividirTexto(linhas.join("\n"), 1000);

        embed.addFields({
            name: "📖・RELATO DO COMBATE",
            value: texto[0] || "O confronto terminou.",
            inline: false
        });

        if (texto.length > 1) {
            embed.addFields({
                name: "📖・CONTINUAÇÃO",
                value: texto.slice(1).join("\n").slice(0, 1000),
                inline: false
            });
        }
    } else if (resultado.mensagem) {
        embed.addFields({
            name: "📖・RELATO DO COMBATE",
            value: String(resultado.mensagem).slice(0, 1000),
            inline: false
        });
    }

    return embed;
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
            `🌟 **NÍVEL ${jogador.nivel} ALCANÇADO!**\n` +
            "❤️ +10 vida máxima • ⚔️ +2 ataque • 🛡️ +1 defesa"
        );
    }

    if (jogador.nivel >= 400) jogador.nivel = 400;
    return mensagens;
}

async function executarCaca(message, jogador) {
    if (jogador.vida <= 0) jogador.vida = jogador.vidaMax;

    const monstro = combate.obterMonstroParaBatalha(jogador.nivel);

    if (!monstro) {
        return message.reply("❌ Nenhum monstro foi encontrado.");
    }

    jogador.vidaMaxima = jogador.vidaMax;
    jogador.vidaAtual = jogador.vida;
    jogador.armaEquipada = jogador.armaAtual || jogador.armaEquipada;

    const resultado = combate.simularCombate(jogador, monstro);

    jogador.vida = numero(jogador.vidaAtual, jogador.vida);
    jogador.xp = numero(jogador.xp);
    jogador.experiencia = jogador.xp;

    let recompensaTexto = "";
    let niveis = [];

    if (resultado.venceu) {
        const xpGanho = Math.max(0, numero(monstro.xp, 20));
        const moedasGanhas = Math.max(0, numero(monstro.moedas, 10));

        jogador.xp += xpGanho;
        jogador.moedas += moedasGanhas;
        jogador.vitorias = numero(jogador.vitorias) + 1;
        jogador.monstrosDerrotados =
            numero(jogador.monstrosDerrotados) + 1;

        recompensaTexto =
            `✨ **+${xpGanho} XP**\n` +
            `🪙 **+${moedasGanhas} moedas**`;

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
                        "\n\n🏅 **CONQUISTAS DESBLOQUEADAS**\n" +
                        novas.map(nomeItem).join("\n");
                }
            }
        } catch (erro) {
            console.error("[Crônicas do Caos] Progresso:", erro.message);
        }

        niveis = subirNivel(jogador);
    } else {
        jogador.derrotas = numero(jogador.derrotas) + 1;
    }

    const batalhaEmbed = criarBatalhaEmbed(jogador, monstro, resultado);

    // A vida é restaurada após a batalha, tanto na vitória quanto na derrota.
    jogador.vida = jogador.vidaMax;
    jogador.vidaAtual = jogador.vidaMax;
    jogador.vidaMaxima = jogador.vidaMax;
    jogador.experiencia = jogador.xp;

    salvar(jogador);

    await message.channel.send({ embeds: [batalhaEmbed] });

    if (recompensaTexto || niveis.length) {
        const recompensaEmbed = embedBase(
            "🎁・RESULTADO DA JORNADA",
            DOURADO
        ).setDescription(
            (recompensaTexto || "Nenhuma recompensa recebida.") +
            (niveis.length ? "\n\n" + niveis.join("\n\n") : "") +
            `\n\n❤️ **Vida restaurada:** ${jogador.vida}/${jogador.vidaMax} HP`
        );

        await message.channel.send({ embeds: [recompensaEmbed] });
    } else {
        const recuperacaoEmbed = embedBase(
            "❤️・RECUPERAÇÃO PÓS-BATALHA",
            ROXO
        ).setDescription(
            `Você recuperou suas forças.\n\n` +
            `\`${barra(jogador.vida, jogador.vidaMax)}\`\n` +
            `**${jogador.vida}/${jogador.vidaMax} HP restaurados.**`
        );

        await message.channel.send({ embeds: [recuperacaoEmbed] });
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
                dados.getJogador(
                    message.author.id,
                    message.author.username
                )
            );

            switch (comando) {
                case "cacar":
                case "caçar":
                    return await executarCaca(message, jogador);

                case "perfil":
                    return await message.reply({
                        embeds: [criarPerfilEmbed(jogador, message.author)]
                    });

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
                `[Crônicas do Caos] Erro em ${comando}:`,
                erro.stack || erro
            );

            return message.reply(
                "❌ Ocorreu um erro neste comando. Confira os logs do Render."
            ).catch(() => {});
        }
    });

    console.log("[Crônicas do Caos] RPG conectado com embeds.");
};

