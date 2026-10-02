const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType
} = require("discord.js");

// =====================================================
// CONFIGURAÇÕES
// =====================================================

// Categoria onde os tickets serão criados
const CATEGORIA_ID = "1546739373750624308";

// Cargos responsáveis pela parceria
// Esses IDs ficam somente no código
const CARGO_1 = "1545916316018286694";
const CARGO_2 = "1546113916097138688";
const SEU_CARGO = "1546122030347198554";

// Cor branca
const COR = 0xFFFFFF;

// =====================================================
// SISTEMA DE PARCERIA
// =====================================================

module.exports = function ticketParceria(client) {

    // =================================================
    // PAINEL DE PARCERIA
    // =================================================

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        // Comando do painel
        if (
            message.content.toLowerCase() !== ",painelparceria"
        ) return;


        // Somente administradores podem enviar o painel
        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {

            return message.reply({
                content:
                    "❌ Você não possui permissão para enviar o painel."
            }).catch(() => {});

        }


        // =================================================
        // EMBED DO PAINEL
        // =================================================

        const embed = new EmbedBuilder()

            .setTitle("🤝・CENTRAL DE PARCERIAS")

            .setDescription(

                "## 🤝 Seja nosso parceiro!\n\n" +

                "Tem interesse em realizar uma parceria com nossa comunidade?\n\n" +

                "Clique no botão abaixo para abrir uma solicitação de parceria.\n\n" +

                "━━━━━━━━━━━━━━━━━━━━\n\n" +

                "📋 **Antes de abrir o ticket**\n\n" +

                "• Tenha sua proposta preparada.\n" +
                "• Explique claramente o objetivo da parceria.\n" +
                "• Informe o servidor ou projeto envolvido.\n" +
                "• Aguarde a análise da equipe responsável.\n\n" +

                "━━━━━━━━━━━━━━━━━━━━\n\n" +

                "🤝 **Solicitação de Parceria**\n\n" +

                "Nossa equipe irá analisar sua proposta e entrar em contato pelo ticket.\n\n" +

                "🔒 O atendimento será privado."

            )

            .setColor(COR)

            .setFooter({
                text: "Sistema de Parcerias"
            });


        // =================================================
        // BOTÃO
        // =================================================

        const botao = new ButtonBuilder()

            .setCustomId("abrir_ticket_parceria")

            .setLabel("Solicitar Parceria")

            .setEmoji("🤝")

            .setStyle(ButtonStyle.Primary);


        const row = new ActionRowBuilder()
            .addComponents(botao);


        // =================================================
        // ENVIAR PAINEL
        // =================================================

        await message.channel.send({

            embeds: [embed],

            components: [row]

        });


        // Apaga o comando usado
        await message.delete().catch(() => {});

    });


    // =====================================================
    // ABRIR TICKET
    // =====================================================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;

        if (
            interaction.customId !== "abrir_ticket_parceria"
        ) return;


        const guild = interaction.guild;

        if (!guild) return;


        // =================================================
        // VERIFICAR CATEGORIA
        // =================================================

        const categoria =
            guild.channels.cache.get(CATEGORIA_ID);


        if (!categoria) {

            return interaction.reply({

                content:
                    "❌ A categoria de parceria não foi encontrada.",

                ephemeral: true

            });

        }


        // =================================================
        // VERIFICAR TICKET EXISTENTE
        // =================================================

        const ticketExistente =
            guild.channels.cache.find(channel =>

                channel.type === ChannelType.GuildText &&

                channel.parentId === CATEGORIA_ID &&

                channel.topic ===
                    `parceria-${interaction.user.id}`

            );


        if (ticketExistente) {

            return interaction.reply({

                content:

                    "❌ Você já possui uma solicitação de parceria aberta.\n\n" +

                    `🤝 ${ticketExistente}`,

                ephemeral: true

            });

        }


        await interaction.deferReply({
            ephemeral: true
        });


        try {

            // =================================================
            // NOME DO USUÁRIO
            // =================================================

            const nome =
                interaction.user.username
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9-_]/g, "")
                    .slice(0, 20);


            const nomeCanal =
                `🤝・parceria-${nome}`;


            // =================================================
            // PERMISSÕES
            // =================================================

            const overwrites = [

                // Ninguém além dos autorizados vê o ticket

                {
                    id: guild.roles.everyone.id,

                    deny: [
                        PermissionsBitField.Flags.ViewChannel
                    ]
                },


                // Pessoa que abriu

                {
                    id: interaction.user.id,

                    allow: [

                        PermissionsBitField.Flags.ViewChannel,

                        PermissionsBitField.Flags.SendMessages,

                        PermissionsBitField.Flags.ReadMessageHistory,

                        PermissionsBitField.Flags.AttachFiles,

                        PermissionsBitField.Flags.EmbedLinks

                    ]
                },


                // Responsável 1

                {
                    id: CARGO_1,

                    allow: [

                        PermissionsBitField.Flags.ViewChannel,

                        PermissionsBitField.Flags.SendMessages,

                        PermissionsBitField.Flags.ReadMessageHistory,

                        PermissionsBitField.Flags.AttachFiles,

                        PermissionsBitField.Flags.EmbedLinks

                    ]
                },


                // Responsável 2

                {
                    id: CARGO_2,

                    allow: [

                        PermissionsBitField.Flags.ViewChannel,

                        PermissionsBitField.Flags.SendMessages,

                        PermissionsBitField.Flags.ReadMessageHistory,

                        PermissionsBitField.Flags.AttachFiles,

                        PermissionsBitField.Flags.EmbedLinks

                    ]
                },


                // Seu cargo

                {
                    id: SEU_CARGO,

                    allow: [

                        PermissionsBitField.Flags.ViewChannel,

                        PermissionsBitField.Flags.SendMessages,

                        PermissionsBitField.Flags.ReadMessageHistory,

                        PermissionsBitField.Flags.AttachFiles,

                        PermissionsBitField.Flags.EmbedLinks

                    ]
                }

            ];


            // =================================================
            // CRIAR CANAL
            // =================================================

            const canal = await guild.channels.create({

                name: nomeCanal,

                type: ChannelType.GuildText,

                parent: CATEGORIA_ID,

                topic:
                    `parceria-${interaction.user.id}`,

                permissionOverwrites: overwrites

            });


            // =================================================
            // BOTÃO FECHAR
            // =================================================

            const fechar =
                new ButtonBuilder()

                    .setCustomId(
                        "fechar_ticket_parceria"
                    )

                    .setLabel("Fechar Ticket")

                    .setEmoji("🔒")

                    .setStyle(ButtonStyle.Danger);


            const rowFechar =
                new ActionRowBuilder()
                    .addComponents(fechar);


            // =================================================
            // EMBED DO TICKET
            // =================================================

            const embedTicket =
                new EmbedBuilder()

                    .setTitle(
                        "🤝・SOLICITAÇÃO DE PARCERIA"
                    )

                    .setDescription(

                        `Olá, **${interaction.user.username}**! 👋\n\n` +

                        "Sua solicitação de parceria foi criada com sucesso.\n\n" +

                        "━━━━━━━━━━━━━━━━━━━━\n\n" +

                        "📋 **Agora envie sua proposta.**\n\n" +

                        "Informe:\n" +

                        "• Nome do servidor ou projeto\n" +
                        "• Objetivo da parceria\n" +
                        "• O que sua comunidade oferece\n" +
                        "• Link do servidor/projeto, se necessário\n\n" +

                        "━━━━━━━━━━━━━━━━━━━━\n\n" +

                        "⏳ Aguarde a equipe responsável analisar sua proposta.\n\n" +

                        "🔒 Este atendimento é privado.\n\n" +

                        "Quando o atendimento terminar, utilize o botão abaixo para fechar o ticket."

                    )

                    .setColor(COR)

                    .setThumbnail(
                        interaction.user.displayAvatarURL({
                            dynamic: true,
                            size: 256
                        })
                    )

                    .setFooter({
                        text: "Sistema de Parcerias"
                    })

                    .setTimestamp();


            // =================================================
            // MENSAGEM DO TICKET
            // =================================================

            await canal.send({

                content:
                    `<@${interaction.user.id}>`,

                embeds: [embedTicket],

                components: [rowFechar]

            });


            // =================================================
            // RESPOSTA AO USUÁRIO
            // =================================================

            await interaction.editReply({

                content:

                    "✅ Sua solicitação de parceria foi criada!\n\n" +

                    `🤝 ${canal}\n\n` +

                    "📋 Envie sua proposta no ticket e aguarde a equipe."

            });


        } catch (erro) {

            console.error(
                "❌ Erro ao criar ticket de parceria:",
                erro
            );


            await interaction.editReply({

                content:

                    "❌ Não foi possível criar seu ticket.\n\n" +

                    "Verifique se o bot possui permissão para criar canais e gerenciar a categoria."

            });

        }

    });


    // =====================================================
    // FECHAR TICKET
    // =====================================================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;

        if (
            interaction.customId !==
            "fechar_ticket_parceria"
        ) return;


        const canal = interaction.channel;

        if (!canal) return;


        // =================================================
        // VERIFICAR RESPONSÁVEL
        // =================================================

        const membro = interaction.member;


        const podeFechar =

            membro.permissions.has(
                PermissionsBitField.Flags.Administrator
            ) ||

            membro.roles.cache.has(CARGO_1) ||

            membro.roles.cache.has(CARGO_2) ||

            membro.roles.cache.has(SEU_CARGO);


        if (!podeFechar) {

            return interaction.reply({

                content:
                    "❌ Apenas a equipe responsável pode fechar este ticket.",

                ephemeral: true

            });

        }


        await interaction.reply({

            content:
                "🔒 Este ticket será fechado em **5 segundos**."

        });


        setTimeout(async () => {

            try {

                await canal.delete();

            } catch (erro) {

                console.error(
                    "❌ Erro ao excluir ticket de parceria:",
                    erro
                );

            }

        }, 5000);

    });


    console.log(
        "🤝 Sistema de Parcerias carregado!"
    );

};
