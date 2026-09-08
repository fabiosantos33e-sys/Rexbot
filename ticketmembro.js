```js
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

    const CATEGORIA_TICKETS = "1545925935008579605";

    // Cargo de atendimento
    const CARGO_ATENDIMENTO = "1546716678891634740";

    // =====================================================
    // IMAGEM DO PAINEL
    // =====================================================
    // Coloque a URL da imagem entre as aspas.
    // Exemplo:
    // const IMAGEM_PAINEL = "https://site.com/imagem.png";

    const IMAGEM_PAINEL = "https://cdn.discordapp.com/attachments/1546694251658612778/1546719610819321896/8f77bab3-af35-4443-adfd-3804348bcde5.png?ex=6aa0ce63&is=6a9f7ce3&hm=016b56641a5bda51821b41defcd5df6dcbaad0611a7a380c91a9d9fb5625a24d&.png";

    // Comando para enviar o painel
    const COMANDO = "!ticketmembro";


    // =====================================================
    // PAINEL DE MEMBRO
    // =====================================================

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        if (message.content !== COMANDO) return;

        if (!message.member.permissions.has(
            PermissionFlagsBits.Administrator
        )) {
            return message.reply({
                content: "❌ Você não possui permissão para enviar o painel."
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("🎫・CENTRAL DE ATENDIMENTO")
            .setDescription(
                "## 👤 Atendimento ao Membro\n\n" +
                "Precisa de ajuda com alguma coisa?\n\n" +
                "Clique no botão abaixo para abrir um **ticket de atendimento**.\n\n" +

                "### 📌 Antes de abrir\n" +
                "• Explique seu problema com clareza\n" +
                "• Aguarde um responsável responder\n" +
                "• Evite marcar a equipe repetidamente\n\n" +

                "━━━━━━━━━━━━━━━━━━━━\n\n" +

                "🎧 **Atendimento para membros**\n" +
                "Nossa equipe irá atender você assim que possível.\n\n" +

                "🔒 Seu ticket será privado."
            )
            .setColor("#5865F2")
            .setFooter({
                text: "Sistema de Atendimento • Membros"
            });

        // =================================================
        // IMAGEM
        // =================================================

        if (IMAGEM_PAINEL !== "") {
            embed.setImage(IMAGEM_PAINEL);
        }


        // =================================================
        // BOTÃO
        // =================================================

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("abrir_ticket_membro")
                .setLabel("Abrir Ticket")
                .setEmoji("🎫")
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

        if (interaction.customId === "abrir_ticket_membro") {

            const guild = interaction.guild;
            const usuario = interaction.user;


            // Verifica se já possui ticket
            const ticketExistente = guild.channels.cache.find(
                (canal) => {
                    return canal.topic === "ticket-membro-" + usuario.id;
                }
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

            const nomeCanal = "🎫・membro-" + nome;


            // =================================================
            // CRIAR CANAL
            // =================================================

            const canal = await guild.channels.create({

                name: nomeCanal,

                type: ChannelType.GuildText,

                parent: CATEGORIA_TICKETS,

                topic: "ticket-membro-" + usuario.id,

                permissionOverwrites: [

                    // Ninguém além dos autorizados
                    {
                        id: guild.roles.everyone.id,

                        deny: [
                            PermissionFlagsBits.ViewChannel
                        ]
                    },


                    // Membro que abriu
                    {
                        id: usuario.id,

                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles
                        ]
                    },


                    // Cargo de atendimento
                    {
                        id: CARGO_ATENDIMENTO,

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
            // EMBED DO TICKET
            // =================================================

            const embedTicket = new EmbedBuilder()

                .setTitle("🎧・ATENDIMENTO AO MEMBRO")

                .setDescription(
                    "Olá " + usuario + "! 👋\n\n" +

                    "Seu ticket foi criado com sucesso.\n\n" +

                    "🎧 **A equipe de atendimento já pode visualizar este ticket.**\n" +
                    "Aguarde até um responsável responder.\n\n" +

                    "━━━━━━━━━━━━━━━━━━━━\n\n" +

                    "👤 **Aberto por:**\n" +
                    usuario + "\n\n" +

                    "📅 **Data:**\n" +
                    data + "\n\n" +

                    "🕐 **Horário:**\n" +
                    horario + "\n\n" +

                    "📌 **Tipo:**\n" +
                    "Atendimento ao Membro\n\n" +

                    "━━━━━━━━━━━━━━━━━━━━\n\n" +

                    "💬 Explique abaixo o que você precisa.\n" +
                    "Um responsável irá atender você assim que possível."
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
            // BOTÃO FECHAR
            // =================================================

            const botoes = new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setCustomId("fechar_ticket_membro")
                    .setLabel("Fechar Ticket")
                    .setEmoji("🔒")
                    .setStyle(ButtonStyle.Danger)

            );


            // =================================================
            // MENSAGEM DO TICKET
            // =================================================

            await canal.send({

                content:
                    usuario + "\n\n" +
                    "🎧 **Atendimento:**\n" +
                    "<@&" + CARGO_ATENDIMENTO + ">\n\n" +
                    "📩 Um responsável foi notificado.",

                embeds: [embedTicket],

                components: [botoes]

            });


            // =================================================
            // RESPOSTA PARA O MEMBRO
            // =================================================

            await interaction.reply({

                content:
                    "✅ Seu ticket foi criado com sucesso!\n\n" +
                    "🎫 " + canal + "\n\n" +
                    "🎧 Aguarde o atendimento.",

                ephemeral: true

            });

        }


        // =================================================
        // FECHAR TICKET
        // =================================================

        if (interaction.customId === "fechar_ticket_membro") {

            const membro = interaction.member;


            const podeFechar =
                membro.roles.cache.has(CARGO_ATENDIMENTO) ||
                membro.permissions.has(
                    PermissionFlagsBits.Administrator
                );


            if (!podeFechar) {

                return interaction.reply({

                    content:
                        "❌ Apenas a equipe de atendimento pode fechar este ticket.",

                    ephemeral: true

                });

            }


            await interaction.reply({
                content:
                    "🔒 Ticket será fechado em **5 segundos**..."
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


    console.log("🎫 Sistema de Ticket MEMBRO carregado!");

};
```

