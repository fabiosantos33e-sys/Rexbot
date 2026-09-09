const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuBuilder
} = require("discord.js");

const COOLDOWN = 60 * 1000; // 1 minuto
const cooldowns = new Map();

module.exports = (client) => {

    // ==========================================
    // ENVIAR O PAINEL
    // ==========================================

    // Use o comando !painelcarta para criar o painel
    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        if (message.content.toLowerCase() !== "!painelcarta") return;

        const embed = new EmbedBuilder()
            .setTitle("💌 Carta Anônima")
            .setDescription(
                "Quer dizer algo para alguém sem revelar sua identidade?\n\n" +
                "Clique no botão abaixo para escrever sua carta.\n\n" +
                "🔒 **Sua identidade não será mostrada ao destinatário.**\n" +
                "💌 Você poderá escolher quem receberá a carta."
            )
            .setColor(0x5865F2)
            .setFooter({
                text: "Sistema de Cartas Anônimas"
            });

        const botao = new ButtonBuilder()
            .setCustomId("carta_escrever")
            .setLabel("Escrever Carta")
            .setEmoji("💌")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(botao);

        await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        // Apaga o comando do administrador
        try {
            await message.delete();
        } catch {}
    });


    // ==========================================
    // BOTÃO "ESCREVER CARTA"
    // ==========================================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;

        if (interaction.customId !== "carta_escrever") return;

        const agora = Date.now();
        const ultimoEnvio = cooldowns.get(interaction.user.id);

        if (ultimoEnvio && agora - ultimoEnvio < COOLDOWN) {

            const restante = Math.ceil(
                (COOLDOWN - (agora - ultimoEnvio)) / 1000
            );

            return interaction.reply({
                content: `⏳ Você precisa esperar **${restante}s** antes de enviar outra carta.`,
                ephemeral: true
            });
        }

        // Seleção do destinatário
        const select = new UserSelectMenuBuilder()
            .setCustomId("carta_destinatario")
            .setPlaceholder("👤 Escolha quem receberá a carta")
            .setMinValues(1)
            .setMaxValues(1);

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
            content: "💌 **Escolha quem receberá sua carta:**",
            components: [row],
            ephemeral: true
        });
    });


    // ==========================================
    // ESCOLHER DESTINATÁRIO
    // ==========================================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isUserSelectMenu()) return;

        if (interaction.customId !== "carta_destinatario") return;

        const destinatario = interaction.users.first();

        if (!destinatario) {
            return interaction.update({
                content: "❌ Não foi possível encontrar o destinatário.",
                components: []
            });
        }

        // Não permite enviar para si mesmo
        if (destinatario.id === interaction.user.id) {
            return interaction.update({
                content: "❌ Você não pode enviar uma carta para você mesmo.",
                components: []
            });
        }

        // Guarda o destinatário temporariamente
        const modal = new ModalBuilder()
            .setCustomId(`carta_modal_${destinatario.id}`)
            .setTitle("💌 Escrever Carta Anônima");

        const mensagem = new TextInputBuilder()
            .setCustomId("carta_texto")
            .setLabel("Escreva sua carta")
            .setPlaceholder("Digite aqui o que você gostaria de dizer...")
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(1000)
            .setRequired(true);

        const row = new ActionRowBuilder()
            .addComponents(mensagem);

        modal.addComponents(row);

        await interaction.showModal(modal);
    });


    // ==========================================
    // RECEBER A CARTA
    // ==========================================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isModalSubmit()) return;

        if (!interaction.customId.startsWith("carta_modal_")) return;

        const destinatarioId =
            interaction.customId.replace("carta_modal_", "");

        const texto =
            interaction.fields.getTextInputValue("carta_texto");

        // Verifica cooldown novamente
        const agora = Date.now();
        const ultimoEnvio = cooldowns.get(interaction.user.id);

        if (ultimoEnvio && agora - ultimoEnvio < COOLDOWN) {

            const restante = Math.ceil(
                (COOLDOWN - (agora - ultimoEnvio)) / 1000
            );

            return interaction.reply({
                content: `⏳ Espere **${restante}s** antes de enviar outra carta.`,
                ephemeral: true
            });
        }

        let destinatario;

        try {
            destinatario = await client.users.fetch(destinatarioId);
        } catch {
            return interaction.reply({
                content: "❌ Não consegui encontrar esse usuário.",
                ephemeral: true
            });
        }

        // ==========================================
        // EMBED DA CARTA
        // ==========================================

        const carta = new EmbedBuilder()
            .setTitle("💌 Você recebeu uma Carta Anônima")
            .setDescription(
                `> ${texto.replace(/\n/g, "\n> ")}`
            )
            .setColor(0x5865F2)
            .addFields({
                name: "🔒 Remetente",
                value: "Anônimo",
                inline: true
            })
            .setFooter({
                text: "Carta Anônima • Sua identidade não foi revelada"
            })
            .setTimestamp();

        // ==========================================
        // ENVIA NA DM
        // ==========================================

        try {

            await destinatario.send({
                embeds: [carta]
            });

        } catch {

            return interaction.reply({
                content:
                    "❌ Não consegui entregar a carta. " +
                    "O destinatário provavelmente está com as mensagens privadas bloqueadas.",
                ephemeral: true
            });
        }

        // Salva cooldown
        cooldowns.set(interaction.user.id, agora);

        // ==========================================
        // CONFIRMAÇÃO
        // ==========================================

        await interaction.reply({
            content:
                "💌 **Carta enviada com sucesso!**\n\n" +
                "🔒 Sua identidade não foi mostrada ao destinatário.",
            ephemeral: true
        });

    });

};
