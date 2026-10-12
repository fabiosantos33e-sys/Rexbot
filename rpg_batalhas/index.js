
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

module.exports = function (client) {
    dados.carregarBanco();

    client.on("messageCreate", async (message) => {
        if (message.author.bot || !message.guild) return;
        if (!message.content.startsWith(PREFIXO)) return;

        const args = message.content.slice(PREFIXO.length).trim().split(/\s+/);
        const comando = (args.shift() || "").toLowerCase();

        try {
            const jogador = dados.getJogador(
                message.author.id,
                message.author.username
            );

            if (comando === "rpghelp" || comando === "rpgajuda") {
                return message.reply({
                    embeds: [{
                        color: 0x5427A8,
                        title: "⚔️ CRÔNICAS DO CAOS — GUIA DO AVENTUREIRO",
                        description:
                            "Explore mapas, enfrente monstros, conquiste armas e evolua até o nível 400.\n\n" +
                            "**👤 Personagem**\n" +
                            "`,perfil` — mostra seu personagem.\n" +
                            "`,progresso` — mostra nível e experiência.\n" +
                            "`,ranking` — consulta o ranking.\n\n" +
                            "**⚔️ Combate**\n" +
                            "`,caçar` — tenta encontrar um inimigo.\n" +
                            "`,mapas` — consulta os mapas.\n" +
                            "`,chefes` — consulta os chefes.\n" +
                            "`,dungeons` — consulta as dungeons.\n\n" +
                            "**🎒 Equipamentos**\n" +
                            "`,armas` — lista as armas disponíveis.\n" +
                            "`,loja` — abre a loja de armas.\n" +
                            "`,missoes` — consulta as missões.\n" +
                            "`,conquistas` — consulta conquistas.\n\n" +
                            "**🌌 Outros sistemas**\n" +
                            "`,eventos` — consulta eventos aleatórios.\n" +
                            "`,eventosglobal` — consulta eventos especiais.\n\n" +
                            "⚠️ A lista mostra os comandos planejados para este painel; alguns sistemas ainda precisam de suas ações de jogo."
                    }]
                });
            }

            if (comando === "perfil") {
                const embed = perfil.gerarPerfil(jogador);
                return message.reply({ embeds: [embed] });
            }

            if (comando === "progresso") {
                return message.reply(progresso.formatarProgresso(jogador));
            }

            if (comando === "mapas") {
                const lista = mapas.listarMapas();
                return message.reply(
                    `🗺️ **Mapas disponíveis**\n${lista.map(m => `• ${m.nome || m.id || m}`).join("\n")}`
                );
            }

            if (comando === "chefes") {
                const lista = chefes.listarChefes();
                return message.reply(
                    `👹 **Chefes**\n${lista.map(c => `• ${c.nome || c.id}`).join("\n")}`
                );
            }

            if (comando === "dungeons") {
                const lista = dungeons.listarDungeons();
                return message.reply(
                    `🏰 **Dungeons**\n${lista.map(d => `• ${d.nome || d.id}`).join("\n")}`
                );
            }

            if (comando === "armas") {
                const lista = armas.listarArmas();
                return message.reply(
                    `⚔️ **Armas**\n${lista.map(a => `• ${a.nome || a.id}`).join("\n")}`
                );
            }

            if (comando === "loja") {
                const lista = loja.gerarLoja(jogador);
                return message.reply(typeof lista === "string" ? lista : {
                    embeds: [lista]
                });
            }

            if (comando === "missoes") {
                const lista = missoes.formatarMissoes(jogador);
                return message.reply(lista);
            }

            if (comando === "conquistas") {
                const lista = conquistas.gerarPainel(jogador);
                return message.reply(typeof lista === "string" ? lista : {
                    embeds: [lista]
                });
            }

            if (comando === "eventos") {
                const lista = eventos.listarEventosDisponiveis(jogador);
                return message.reply(
                    `🎲 **Eventos aleatórios**\n${lista.map(e => `• ${e.nome || e.id}`).join("\n")}`
                );
            }

            if (comando === "eventosglobal") {
                const lista = eventosEspeciais.formatarListaEventos();
                return message.reply(lista);
            }

            if (comando === "ranking") {
                const lista = ranking.gerarRanking();
                return message.reply(typeof lista === "string" ? lista : {
                    embeds: [lista]
                });
            }

            return;
        } catch (erro) {
            console.error(`[Crônicas do Caos] Erro no comando ${comando}:`, erro);
            return message.reply(
                "❌ Ocorreu um erro ao executar esse comando. A equipe precisa verificar o console."
            ).catch(() => {});
        }
    });

    console.log("[Crônicas do Caos] Módulos carregados.");
};

