const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

module.exports = (client) => {

    // =====================================================
    // CONFIGURAÇÕES
    // =====================================================

    // IDs mantidos do seu código original
    const CATEGORIA_TICKETS = "1546739373750624308";
    const CARGO_ATENDIMENTO = "1546716678891634740";

    // Imagem do painel
    const IMAGEM_PAINEL = "https://cdn.discordapp.com/attachments/1546694251658612778/1546719610819321896/8f77bab3-af35-4443-adfd-3804348bcde5.png?ex=6aa0ce63&is=6a9f7ce3&hm=016b56641a5bda51821b41defcd5df6dcbaad0611a7a380c91a9d9fb5625a24d&.png";

    // Comando para enviar o painel
    const COMANDO = "!ticketmembro";

    // Cor branca
    const COR = "#FFFFFF";

    // =====================================================
    // TIPOS DE TICKET
    // =====================================================

    const TIPOS = {

        recrutamento: {
            nome: "Recrutamento",
            emoji: "🛡️",
            descricao: "Entre em contato com a equipe para assuntos relacionados ao recrutamento.",
            canal: "recrutamento"
        },

        membro: {
            nome: "Atendimento ao Membro",
            emoji: "👤",
            descricao: "Precisa de ajuda com alguma questão dentro do clã? Abra seu atendimento.",
            canal: "membro"
        },

        suporte: {
            nome: "Suporte",
            emoji: "🔧",
            descricao: "Problemas, dúvidas ou dificuldades relacionadas ao servidor.",
            canal: "suporte"
        },

        denuncia: {
            nome: "Denúncias",
            emoji: "🚨",
            descricao: "Envie uma denúncia para a equipe responsável analisar.",
            canal: "denuncia"
        }

    };

    // =====================================================
    // FUNÇÕES AUXILIARES
    // =====================================================

    function limparNome(nome) {

        return nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
            .substring(0, 18) || "usuario";

    }

    function encontrarTicket(guild, userId) {

        return guild.channels.cache.find((canal) => {

            return (
                canal.type === ChannelType.GuildText &&
                typeof canal.topic === "string" &&
                canal.topic.startsWith(`ticket-${userId}-`)
            );

        });

    }

    // =====================================================
    // PAINEL PRINCIPAL
    // =====================================================

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        if (message.content !== COMANDO) return;

        if (!message.member.permissions.has(
            PermissionFlagsBits.Administrator
        )) {

            return message.reply({
                content: "❌ Você não possui permissão para enviar o painel.",
                allowedMentions: {
                    repliedUser: false
                }
            });

        }

        const embed = new EmbedBuilder()

            .setTitle("🎫・CENTRAL DE ATENDIMENTO")

            .setDescription(

                "## 👋 Bem-vindo à Central de Atendimento\n\n" +

                "Escolha abaixo o motivo do seu atendimento e abra um ticket com a equipe responsável.\n\n" +

                "### 📂 Opções disponíveis\n" +

                "🛡️ **Recrutamento** — assuntos relacionados à entrada no clã.\n" +

                "👤 **Atendimento ao Membro** — ajuda e atendimento aos membros.\n" +

                "🔧 **Suporte** — problemas, dúvidas ou dificuldades.\n" +

                "🚨 **Denúncias** — denúncias para análise da equipe.\n\n" +

                "━━━━━━━━━━━━━━━━━━━━\n\n" +

                "📌 **Como funciona?**\n" +

                "1. Selecione uma opção no menu abaixo.\n" +
                "2. O ticket será criado automaticamente.\n" +
                "3. Explique sua situação no canal privado.\n" +
                "4. Aguarde um responsável pelo atendimento.\n\n" +

                "🔒 **Seu ticket será privado e visível apenas para você e a equipe responsável.**"

            )

            .setColor(COR)

            .setImage(IMAGEM_PAINEL)

            .setFooter({
                text: "Central de Atendimento • Sistema de Tickets"
            });


        // =====================================================
        // MENU DE SELEÇÃO
        // =====================================================

        const menu = new StringSelectMenuBuilder()

            .setCustomId("selecionar_tipo_ticket")

            .setPlaceholder("🎫 Selecione o tipo de atendimento")

            .addOptions(

                {
                    label: "Recrutamento",
                    description: "Assuntos relacionados ao recrutamento.",
                    value: "recrutamento",
                    emoji: "🛡️"
                },

                {
                    label: "Atendimento ao Membro",
                    description: "Ajuda e atendimento aos membros.",
                    value: "membro",
                    emoji: "👤"
                },

                {
                    label: "Suporte",
                    description: "Problemas, dúvidas ou dificuldades.",
                    value: "suporte",
                    emoji: "🔧"
                },

                {
                    label: "Denúncias",
                    description: "Enviar uma denúncia para análise.",
                    value: "denuncia",
                    emoji: "🚨"
                }

            );


        const row = new ActionRowBuilder()
            .addComponents(menu);


        await message.channel.send({

            embeds: [embed],

            components: [row]

        });

    });


    // =====================================================
    // INTERAÇÕES
    // =====================================================

    client.on("interactionCreate", async (interaction) => {


        // =================================================
        // MENU DE TIPO DE TICKET
        // =================================================

        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "selecionar_tipo_ticket"
        ) {

            const tipo = interaction.values[0];

            const dados = TIPOS[tipo];


            if (!dados) {

                return interaction.reply({

                    content: "❌ Tipo de ticket inválido.",

                    ephemeral: true

                });

            }


            const guild = interaction.guild;

            const usuario = interaction.user;

            const nick = interaction.member.displayName;


            // Verifica se já possui ticket

            const ticketExistente =
                encontrarTicket(guild, usuario.id);


            if (ticketExistente) {

                return interaction.reply({

                    content:

                        "❌ Você já possui um ticket aberto.\n\n" +

                        `🎫 ${ticketExistente}\n\n` +

                        "Feche o ticket atual antes de abrir outro.",

                    ephemeral: true

                });

            }


            await interaction.deferReply({
                ephemeral: true
            });


            try {

                // =================================================
                // DATA E HORÁRIO
                // =================================================

                const agora = new Date();


                const data = agora.toLocaleDateString(
                    "pt-BR",
                    {
                        timeZone: "America/Sao_Paulo"
                    }
                );


                const horario = agora.toLocaleTimeString(
                    "pt-BR",
                    {
                        timeZone: "America/Sao_Paulo",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


                // =================================================
                // NOME DO CANAL
                // =================================================

                const nomeUsuario =
                    limparNome(usuario.username);


                const nomeCanal =
                    `🎫・${dados.canal}-${nomeUsuario}`;


                // =================================================
                // CRIAR CANAL
                // =================================================

                const canal = await guild.channels.create({

                    name: nomeCanal,

                    type: ChannelType.GuildText,

                    parent: CATEGORIA_TICKETS,

                    topic:
                        `ticket-${usuario.id}-${tipo}`,

                    permissionOverwrites: [

                        // Ninguém além dos autorizados

                        {
                            id: guild.roles.everyone.id,

                            deny: [
                                PermissionFlagsBits.ViewChannel
                            ]
                        },


                        // Membro

                        {
                            id: usuario.id,

                            allow: [

                                PermissionFlagsBits.ViewChannel,

                                PermissionFlagsBits.SendMessages,

                                PermissionFlagsBits.ReadMessageHistory,

                                PermissionFlagsBits.AttachFiles

                            ]
                        },


                        // Equipe

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

                    .setTitle(
                        `${dados.emoji}・${dados.nome.toUpperCase()}`
                    )

                    .setDescription(

                        `Olá ${usuario}! 👋\n\n` +

                        `Seu ticket de **${dados.nome}** foi criado com sucesso.\n\n` +

                        `📩 **Explique abaixo o motivo do atendimento.**\n` +

                        `Um responsável da equipe irá analisar e responder assim que possível.\n\n` +

                        "━━━━━━━━━━━━━━━━━━━━\n\n" +

                        `👤 **Aberto por:**\n${nick}\n\n` +

                        `📂 **Categoria:**\n${dados.nome}\n\n` +

                        `📅 **Data:**\n${data}\n\n` +

                        `🕐 **Horário:**\n${horario}\n\n` +

                        "━━━━━━━━━━━━━━━━━━━━\n\n" +

                        "🔒 Este canal é privado.\n" +

                        "🚫 Evite marcar a equipe repetidamente.\n" +

                        "💬 Envie todas as informações necessárias para facilitar o atendimento."

                    )

                    .setColor(COR)

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

                const botoes =
                    new ActionRowBuilder().addComponents(

                        new ButtonBuilder()

                            .setCustomId("fechar_ticket")

                            .setLabel("Fechar Ticket")

                            .setEmoji("🔒")

                            .setStyle(ButtonStyle.Danger)

                    );


                // =================================================
                // MENSAGEM DO TICKET
                // =================================================

                await canal.send({

                    content:

                        `${usuario}\n\n` +

                        `${dados.emoji} **${dados.nome}**\n` +

                        `<@&${CARGO_ATENDIMENTO}>\n\n` +

                        "📩 Um responsável da equipe foi notificado.",


                    embeds: [embedTicket],

                    components: [botoes]

                });


                // =================================================
                // RESPOSTA
                // =================================================

                await interaction.editReply({

                    content:

                        `✅ Seu ticket de **${dados.nome}** foi criado com sucesso!\n\n` +

                        `🎫 ${canal}\n\n` +

                        "💬 Explique sua situação no ticket e aguarde o atendimento."

                });


            } catch (erro) {

                console.error(
                    "❌ Erro ao criar ticket:",
                    erro
                );


                await interaction.editReply({

                    content:

                        "❌ Não foi possível criar o ticket.\n\n" +

                        "Verifique se o bot possui permissão para criar canais e gerenciar a categoria."

                });

            }

            return;

        }


        // =================================================
        // FECHAR TICKET
        // =================================================

        if (
            interaction.isButton() &&
            interaction.customId === "fechar_ticket"
        ) {

            const membro = interaction.member;


            const podeFechar =

                membro.roles.cache.has(
                    CARGO_ATENDIMENTO
                ) ||

                membro.permissions.has(
                    PermissionFlagsBits.Administrator
                );


            if (!podeFechar) {

                return interaction.reply({

                    content:
                        "❌ Apenas a equipe de atendimento ou administradores podem fechar este ticket.",

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

                    console.error(
                        "❌ Erro ao excluir ticket:",
                        erro
                    );

                }

            }, 5000);

        }

    });


    console.log(
        "🎫 Sistema de Tickets reformulado carregado!"
    );

};
