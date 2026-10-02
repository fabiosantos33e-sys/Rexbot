const fs = require("fs");
const path = require("path");

const {
    SlashCommandBuilder,
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

// ===============================
// CONFIGURAÇÕES
// ===============================

const DATA_DIR = path.join(__dirname, "database");
const DATA_FILE = path.join(DATA_DIR, "users.json");

const ZUNO_IMAGE = path.join(
    __dirname,
    "assets",
    "zuno-profile.png"
);

// Cria as pastas/arquivo automaticamente
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "{}", "utf8");
}

// ===============================
// BANCO DE DADOS
// ===============================

function carregarUsuarios() {
    try {
        const dados = fs.readFileSync(DATA_FILE, "utf8");

        if (!dados.trim()) {
            return {};
        }

        return JSON.parse(dados);
    } catch (erro) {
        console.error("❌ Erro ao carregar users.json:", erro);
        return {};
    }
}

function salvarUsuarios(usuarios) {
    try {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(usuarios, null, 2),
            "utf8"
        );
    } catch (erro) {
        console.error("❌ Erro ao salvar users.json:", erro);
    }
}

// ===============================
// CRIAR PERFIL
// ===============================

function criarPerfil(user) {
    const usuarios = carregarUsuarios();

    if (!usuarios[user.id]) {
        usuarios[user.id] = {
            id: user.id,
            nome: user.username,

            nivel: 1,
            xp: 0,

            interacoes: 0,
            conquistas: 0,

            relacao: "Desconhecido",

            criadoEm: new Date().toISOString()
        };

        salvarUsuarios(usuarios);
    }

    return usuarios[user.id];
}

// ===============================
// XP
// ===============================

function adicionarXP(user, quantidade) {
    const usuarios = carregarUsuarios();

    if (!usuarios[user.id]) {
        criarPerfil(user);
    }

    const perfil = usuarios[user.id];

    perfil.xp += quantidade;
    perfil.interacoes += 1;

    // 100 XP por nível
    const novoNivel = Math.floor(perfil.xp / 100) + 1;

    if (novoNivel > perfil.nivel) {
        perfil.nivel = novoNivel;
    }

    // Relação básica
    if (perfil.interacoes >= 100) {
        perfil.relacao = "Melhor amigo";
    } else if (perfil.interacoes >= 50) {
        perfil.relacao = "Amigo";
    } else if (perfil.interacoes >= 20) {
        perfil.relacao = "Conhecido";
    } else if (perfil.interacoes >= 5) {
        perfil.relacao = "Já vi você por aqui";
    } else {
        perfil.relacao = "Desconhecido";
    }

    salvarUsuarios(usuarios);

    return perfil;
}

// ===============================
// COMANDO /PROFILE
// ===============================

module.exports = (client) => {

    // Registra o comando sem apagar os outros comandos
    client.once("ready", async () => {

        try {
            const comandos = await client.application.commands.fetch();

            const existente = comandos.find(
                comando => comando.name === "profile"
            );

            const comandoData = new SlashCommandBuilder()
                .setName("profile")
                .setDescription("Veja seu perfil social com o Zuno.")
                .addUserOption(option =>
                    option
                        .setName("membro")
                        .setDescription("Veja o perfil de outro membro.")
                        .setRequired(false)
                );

            if (!existente) {

                await client.application.commands.create(
                    comandoData.toJSON()
                );

                console.log("✅ Comando /profile registrado.");

            } else {

                await client.application.commands.edit(
                    existente.id,
                    comandoData.toJSON()
                );

                console.log("🔄 Comando /profile atualizado.");
            }

        } catch (erro) {
            console.error(
                "❌ Erro ao registrar /profile:",
                erro
            );
        }
    });

    // ===============================
    // INTERAÇÃO
    // ===============================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        if (interaction.commandName !== "profile") {
            return;
        }

        const membro =
            interaction.options.getUser("membro") ||
            interaction.user;

        // Cria o perfil se ainda não existir
        const perfil = criarPerfil(membro);

        // Se a pessoa estiver vendo o próprio perfil,
        // recebe uma pequena quantidade de XP.
        if (membro.id === interaction.user.id) {
            adicionarXP(interaction.user, 5);
        }

        // Recarrega para pegar os dados atualizados
        const perfilAtualizado = criarPerfil(membro);

        // ===============================
        // FRASES DO ZUNO
        // ===============================

        let frase;

        if (perfilAtualizado.relacao === "Melhor amigo") {

            frase =
                "Esse aqui já faz parte da minha história. ❤️";

        } else if (perfilAtualizado.relacao === "Amigo") {

            frase =
                "Olha quem apareceu! Já considero da casa. 😎";

        } else if (perfilAtualizado.relacao === "Conhecido") {

            frase =
                "Hmm... já vi você algumas vezes por aqui. 👀";

        } else if (
            perfilAtualizado.relacao === "Já vi você por aqui"
        ) {

            frase =
                "Acho que finalmente estamos começando a nos conhecer.";

        } else {

            frase =
                "Ainda estamos nos conhecendo... 👀";
        }

        // ===============================
        // DATA DE ENTRADA NO SISTEMA
        // ===============================

        const data = new Date(
            perfilAtualizado.criadoEm
        );

        const dataFormatada =
            data.toLocaleDateString("pt-BR");

        // ===============================
        // EMBED
        // ===============================

        const embed = new EmbedBuilder()
            .setTitle("🏛️ ZUNO • PROFILE")
            .setDescription(
                `## 👤 ${membro.username}\n` +
                `> ${frase}`
            )
            .setThumbnail(membro.displayAvatarURL({
                size: 256,
                extension: "png"
            }))
            .addFields(
                {
                    name: "⭐ Nível",
                    value: `\`${perfilAtualizado.nivel}\``,
                    inline: true
                },
                {
                    name: "💬 Interações",
                    value: `\`${perfilAtualizado.interacoes}\``,
                    inline: true
                },
                {
                    name: "✨ XP",
                    value: `\`${perfilAtualizado.xp}/${
                        perfilAtualizado.nivel * 100
                    }\``,
                    inline: true
                },
                {
                    name: "❤️ Relação com Zuno",
                    value: `\`${perfilAtualizado.relacao}\``,
                    inline: true
                },
                {
                    name: "🏆 Conquistas",
                    value: `\`${perfilAtualizado.conquistas}\``,
                    inline: true
                },
                {
                    name: "📅 Primeiro registro",
                    value: `\`${dataFormatada}\``,
                    inline: true
                }
            )
            .setFooter({
                text: "Zuno • Seu servidor, sua história."
            })
            .setTimestamp();

        // ===============================
        // IMAGEM DO ZUNO
        // ===============================

        const arquivos = [];

        if (fs.existsSync(ZUNO_IMAGE)) {

            const arquivo = new AttachmentBuilder(
                ZUNO_IMAGE,
                {
                    name: "zuno-profile.png"
                }
            );

            arquivos.push(arquivo);

            embed.setImage(
                "attachment://zuno-profile.png"
            );
        }

        await interaction.reply({
            embeds: [embed],
            files: arquivos
        });
    });
};
