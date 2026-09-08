const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

module.exports = (client) => {

    // =====================================================
    // CONFIGURAÇÕES
    // =====================================================

    // Categoria onde os tickets serão criados
    const CATEGORIA_TICKETS = "1545925935008579605";

    // 2 CARGOS DE LÍDER
    const LIDER_1 = "1546113916097138688";
    const LIDER_2 = "1545916316018286694";

    // Seu cargo de Developer
    const DEVELOPER = "1546122030347198554";

    // Link da imagem do painel
    // Você pode colocar depois
    const IMAGEM_PAINEL = "https://cdn.discordapp.com/attachments/1546694251658612778/1546704127642304512/627da6ef-2a83-4728-a337-a9e53c19bcda.png?ex=6aa0bff8&is=6a9f6e78&hm=6a6cad69816b47d8b91987196c375a8093d61217e84d90e58d4a3767dfb5fbd9&.png";

    // Comando para enviar o painel
    const COMANDO = "!ticket";


    // =====================================================
    // PAINEL DE TICKET
    // =====================================================

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        if (message.content !== COMANDO) return;

        // Somente administradores podem enviar o painel
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({
                content: "❌ Você não possui permissão para enviar o painel."
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("🎫・CENTRAL DE ATENDIMENTO")
            .setDescription(
                "## 🛡️ Recrutamento STAFF\n\n" +
                "Deseja fazer parte da nossa equipe?\n\n" +
                "Clique no botão abaixo para abrir um **ticket de STAFF** e iniciar seu atendimento.\n\n" +

                "### 📌 Antes de abrir\n" +
                "• Tenha disponibilidade para responder\n" +
                "• Seja sincero durante o atendimento\n" +
                "• Aguarde um responsável da equipe\n\n" +

                "━━━━━━━━━━━━━━━━━━━━\n\n" +

                "🛡️ **Atendimento exclusivo para STAFF**\n" +
                "👑 Um líder irá atender você assim que possível."
            )
            .setColor("#5865F2")
            .setFooter({
                text: "Sistema de Atendimento • STAFF"
            })

        // =================================================
        // IMAGEM
        // =================================================

        // Quando você tiver uma imagem, coloque o link em
        // IMAGEM_PAINEL lá em cima.
        if (IMAGEM_PAINEL !== "") {
            embed.setImage(IMAGEM_PAINEL);
        }


        // =================================================
        // BOTÃO
        // =================================================

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("abrir_ticket_staff")
                .setLabel("Abrir Ticket STAFF")
                .setEmoji("🛡️")
                .setStyle(ButtonStyle.Primary)

        );


        await message.channel.send({
            embeds: [embed],
            components: [row]
        });

    });


    // =====================================================
    // INTERAÇÕES
    // =====================================================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;


        // =================================================
        // ABRIR TICKET
        // =================================================

        if (interaction.customId === "abrir_ticket_staff") {

            const guild = interaction.guild;
            const usuario = interaction.user;


            // Verifica se a pessoa já possui ticket
            const ticketExistente = guild.channels.cache.find(
    canal =>
        canal.topic === "ticket-staff-" + usuario.id
);


            if (ticketExistente) {

                return interaction.reply({
                    content:
    "❌ Você já possui um ticket aberto!\n\n" +
    "🎫 " + ticketExistente,
                    ephemeral: true
                });

            }


            // =================================================
            // DATA E HORÁRIO
            // =================================================

            const agora = new Date();

            const data = agora.toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo"
            });

            const horario = agora.toLocaleTimeString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                minute: "2-digit"
            });


            // =================================================
            // NOME DO CANAL
            // =================================================

            let nome = usuario.username
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .substring(0, 20);

            const nomeCanal = `🎫・staff-${nome}`;


            // =================================================
            // CRIAR CANAL
            // =================================================

            const canal = await guild.channels.create({

                name: nomeCanal,

                type: ChannelType.GuildText,

                parent: CATEGORIA_TICKETS,

                topic: `ticket-staff-${usuario.id}`,

                permissionOverwrites: [

                    // Ninguém além das pessoas autorizadas
                    {
                        id: guild.roles.everyone.id,

                        deny: [
                            PermissionFlagsBits.ViewChannel
                        ]
                    },


                    // Pessoa que abriu
                    {
                        id: usuario.id,

                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles
                        ]
                    },


                    // LÍDER 1
                    {
                        id: LIDER_1,

                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.ManageMessages
                        ]
                    },


                    // LÍDER 2
                    {
                        id: LIDER_2,

                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.ManageMessages
                        ]
                    },


                    // DEVELOPER
                    {
                        id: DEVELOPER,

                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.ManageMessages
                        ]
                    }

                ]

            });


            // =================================================
            // MENSAGEM DO TICKET
            // =================================================

            const embed = new EmbedBuilder()

                .setTitle("🛡️・ATENDIMENTO STAFF")

                .setDescription(
                    `Olá ${usuario}! 👋\n\n` +

                    `Seu ticket foi criado com sucesso.\n\n` +

                    `👑 **Aguarde até um dos líderes vir atender você.**\n` +
                    `Não é necessário marcar os responsáveis, eles já foram notificados.\n\n` +

                    `━━━━━━━━━━━━━━━━━━━━\n\n` +

                    `👤 **Aberto por:**\n` +
                    `${usuario}\n\n` +

                    `📅 **Data:**\n` +
                    `${data}\n\n` +

                    `🕐 **Horário:**\n` +
                    `${horario}\n\n` +

                    `📌 **Motivo:**\n` +
                    `Recrutamento / Atendimento STAFF\n\n` +

                    `━━━━━━━━━━━━━━━━━━━━\n\n` +

                    `💬 Explique o motivo do seu atendimento abaixo.\n` +
                    `Um responsável responderá assim que possível.`
                )

                .setColor("#5865F2")

                .setThumbnail(
                    usuario.displayAvatarURL({
                        dynamic: true,
                        size: 256
                    })
                )

                .setTimestamp();


            // =================================================
            // BOTÕES DO TICKET
            // =================================================

            const botoes = new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setCustomId("fechar_ticket_staff")
                    .setLabel("Fechar Ticket")
                    .setEmoji("🔒")
                    .setStyle(ButtonStyle.Danger)

            );


            // =================================================
            // MENSAGEM PARA OS RESPONSÁVEIS
            // =================================================

            await canal.send({

                content:
                    `${usuario}\n\n` +
                    `👑 **Líderes disponíveis para atendimento:**\n` +
                    `<@&${LIDER_1}> <@&${LIDER_2}>\n\n` +
                    `🛠️ <@&${DEVELOPER}>`,

                embeds: [embed],

                components: [botoes]

            });


            // =================================================
            // RESPOSTA PARA QUEM ABRIU
            // =================================================

            await interaction.reply({

                content:
                    `✅ Seu ticket foi criado com sucesso!\n\n` +
                    `🎫 ${canal}\n\n` +
                    `👑 Aguarde até um líder vir atender você.`,

                ephemeral: true

            });

        }


        // =================================================
        // FECHAR TICKET
        // =================================================

        if (interaction.customId === "fechar_ticket_staff") {

            const membro = interaction.member;


            // Só líder ou developer pode fechar
            const podeFechar =
                membro.roles.cache.has(LIDER_1) ||
                membro.roles.cache.has(LIDER_2) ||
                membro.roles.cache.has(DEVELOPER) ||
                membro.permissions.has(PermissionFlagsBits.Administrator);


            if (!podeFechar) {

                return interaction.reply({

                    content:
                        "❌ Apenas os líderes ou o Developer podem fechar este ticket.",

                    ephemeral: true

                });

            }


            await interaction.reply({
                content: "🔒 Ticket será fechado em **5 segundos**..."
            });


            setTimeout(async () => {

                try {

                    await interaction.channel.delete();

                } catch (erro) {

                    console.log(
                        "❌ Erro ao excluir ticket:",
                        erro
                    );

                }

            }, 5000);

        }

    });


    console.log("🎫 Sistema de Ticket STAFF carregado!");
};

