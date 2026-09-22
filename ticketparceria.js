const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType
} = require('discord.js');

// ===============================
// CONFIGURAÇÕES
// ===============================

const CATEGORIA_ID = '1546739373750624308';

const CARGO_1 = '1545916316018286694';
const CARGO_2 = '1546113916097138688';
const SEU_CARGO = '1546122030347198554';

// ===============================
// FUNÇÃO PRINCIPAL
// ===============================

module.exports = function ticketParceria(client) {

    client.on('messageCreate', async (message) => {

        if (message.author.bot) return;

        // Comando para enviar o painel
        if (message.content.toLowerCase() !== ',painelparceria') return;

        // Somente administradores podem enviar o painel
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                content: '❌ Você não tem permissão para usar esse comando.',
                ephemeral: true
            }).catch(() => {});
        }

        const embed = new EmbedBuilder()
            .setTitle('🤝・PARCERIAS')
            .setDescription(
                'Está interessado em fazer uma parceria com nossa comunidade?\n\n' +
                'Clique no botão abaixo para abrir um ticket de parceria.\n\n' +
                '📌 Explique sua proposta de parceria no ticket.\n' +
                '📨 Nossa equipe irá analisar sua proposta.'
            )
            .setColor(0x8A2BE2)
            .setFooter({
                text: 'Sistema de Parcerias'
            });

        const botao = new ButtonBuilder()
            .setCustomId('abrir_ticket_parceria')
            .setLabel('Solicitar Parceria')
            .setEmoji('🤝')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(botao);

        await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        await message.delete().catch(() => {});
    });


    // ===============================
    // BOTÃO DO TICKET
    // ===============================

    client.on('interactionCreate', async (interaction) => {

        if (!interaction.isButton()) return;

        if (interaction.customId !== 'abrir_ticket_parceria') return;

        const guild = interaction.guild;

        if (!guild) return;

        // Verifica se a categoria existe
        const categoria = guild.channels.cache.get(CATEGORIA_ID);

        if (!categoria) {
            return interaction.reply({
                content: '❌ A categoria configurada não foi encontrada.',
                ephemeral: true
            });
        }

        // Verifica se a pessoa já possui um ticket
        const ticketExistente = guild.channels.cache.find(channel =>
            channel.type === ChannelType.GuildText &&
            channel.parentId === CATEGORIA_ID &&
            channel.topic === `parceria-${interaction.user.id}`
        );

        if (ticketExistente) {
            return interaction.reply({
                content: `❌ Você já possui um ticket aberto: ${ticketExistente}`,
                ephemeral: true
            });
        }

        await interaction.deferReply({
            ephemeral: true
        });

        // Nome seguro do usuário
        const nome = interaction.user.username
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '')
            .slice(0, 20);

        const nomeCanal = `🤝・parceria-${nome}`;

        // ===============================
        // PERMISSÕES
        // ===============================

        const overwrites = [

            // Ninguém vê
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

            // CARGO 1
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

            // CARGO 2
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

            // SEU CARGO
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

        // ===============================
        // CRIA O CANAL
        // ===============================

        const canal = await guild.channels.create({
            name: nomeCanal,
            type: ChannelType.GuildText,
            parent: CATEGORIA_ID,
            topic: `parceria-${interaction.user.id}`,
            permissionOverwrites: overwrites
        });

        // ===============================
        // BOTÃO FECHAR
        // ===============================

        const fechar = new ButtonBuilder()
            .setCustomId('fechar_ticket_parceria')
            .setLabel('Fechar Ticket')
            .setEmoji('🔒')
            .setStyle(ButtonStyle.Danger);

        const rowFechar = new ActionRowBuilder()
            .addComponents(fechar);

        // ===============================
        // MENSAGEM DO TICKET
        // ===============================

        const embedTicket = new EmbedBuilder()
            .setTitle('🤝・TICKET DE PARCERIA')
            .setDescription(
                `Olá, **${interaction.user.username}**!\n\n` +
                'Seu ticket de parceria foi criado com sucesso.\n\n' +
                '📋 **Envie sua proposta de parceria abaixo.**\n' +
                'Explique o que você pretende oferecer e quais são os objetivos da parceria.\n\n' +
                '⏳ Aguarde a equipe responsável analisar sua proposta.\n\n' +
                '🔒 Quando terminar, utilize o botão abaixo para fechar o ticket.'
            )
            .setColor(0x8A2BE2)
            .setFooter({
                text: 'Sistema de Parcerias'
            });

        await canal.send({
            content: `<@${interaction.user.id}>`,
            embeds: [embedTicket],
            components: [rowFechar]
        });

        await interaction.editReply({
            content: `✅ Seu ticket de parceria foi criado: ${canal}`
        });
    });


    // ===============================
    // FECHAR TICKET
    // ===============================

    client.on('interactionCreate', async (interaction) => {

        if (!interaction.isButton()) return;

        if (interaction.customId !== 'fechar_ticket_parceria') return;

        const canal = interaction.channel;

        if (!canal) return;

        await interaction.reply({
            content: '🔒 Este ticket será fechado em 5 segundos.'
        });

        setTimeout(async () => {

            await canal.delete().catch(() => {});

        }, 5000);
    });
};
