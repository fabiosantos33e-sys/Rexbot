const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const DATA_DIR = path.join(__dirname, "database");
const DATA_FILE = path.join(DATA_DIR, "users.json");

// ===============================
// BANCO DE DADOS
// ===============================

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "{}", "utf8");
}

function carregarUsuarios() {
    try {
        return JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch (erro) {
        console.error("❌ Erro ao carregar usuários:", erro);
        return {};
    }
}

function salvarUsuarios(usuarios) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(usuarios, null, 2),
        "utf8"
    );
}

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

function adicionarXP(user, quantidade) {
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
    }

    const perfil = usuarios[user.id];

    perfil.xp += quantidade;
    perfil.interacoes += 1;

    perfil.nivel =
        Math.floor(perfil.xp / 100) + 1;

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
// COMANDO
// ===============================

function comandoProfile() {
    return new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Veja seu perfil social com o Zuno.")
        .addUserOption(option =>
            option
                .setName("membro")
                .setDescription("Veja o perfil de outro membro.")
                .setRequired(false)
        );
}

// ===============================
// EXECUTAR /PROFILE
// ===============================

async function executarProfile(interaction) {

    const membro =
        interaction.options.getUser("membro") ||
        interaction.user;

    criarPerfil(membro);

    // Ganha interação somente ao abrir o próprio perfil
    if (membro.id === interaction.user.id) {
        adicionarXP(interaction.user, 5);
    }

    const usuarios = carregarUsuarios();
    const perfil = usuarios[membro.id];

    let frase;

    switch (perfil.relacao) {

        case "Melhor amigo":
            frase =
                "Esse aqui já faz parte da minha história. ❤️";
            break;

        case "Amigo":
            frase =
                "Olha quem apareceu! Já considero da casa. 😎";
            break;

        case "Conhecido":
            frase =
                "Hmm... já vi você algumas vezes por aqui. 👀";
            break;

        case "Já vi você por aqui":
            frase =
                "Acho que finalmente estamos começando a nos conhecer.";
            break;

        default:
            frase =
                "Ainda estamos nos conhecendo... 👀";
    }

    const data = new Date(perfil.criadoEm);

    const dataFormatada =
        data.toLocaleDateString("pt-BR");

    const embed = new EmbedBuilder()
        .setTitle("🏛️ PROFILE")
        .setDescription(
            `## 👤 ${membro.username}\n` +
            `> ${frase}`
        )
        .setThumbnail(
            membro.displayAvatarURL({
                size: 256,
                extension: "png"
            })
        )
        .addFields(
            {
                name: "⭐ Nível",
                value: `\`${perfil.nivel}\``,
                inline: true
            },
            {
                name: "✨ XP",
                value: `\`${perfil.xp}\``,
                inline: true
            },
            {
                name: "💬 Interações",
                value: `\`${perfil.interacoes}\``,
                inline: true
            },
            {
                name: "❤️ Relação",
                value: `\`${perfil.relacao}\``,
                inline: true
            },
            {
                name: "🏆 Conquistas",
                value: `\`${perfil.conquistas}\``,
                inline: true
            },
            {
                name: "📅 Registro",
                value: `\`${dataFormatada}\``,
                inline: true
            }
        )
        .setFooter({
            text: "Zuno • Seu servidor, sua história."
        })
        .setTimestamp();

    await interaction.reply({
        embeds: [embed]
    });
}

// ===============================
// EXPORTAÇÃO
// ===============================

module.exports = {
    comandoProfile,
    executarProfile
};
