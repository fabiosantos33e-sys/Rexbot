const {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  AttachmentBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

module.exports = function instagram(client) {

  const databaseFolder = path.join(__dirname, "database");
  const databaseFile = path.join(databaseFolder, "instagram.json");

  if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, { recursive: true });
  }

  if (!fs.existsSync(databaseFile)) {
    fs.writeFileSync(databaseFile, JSON.stringify({
      posts: {}
    }, null, 2));
  }

  function carregarBanco() {
    try {
      return JSON.parse(fs.readFileSync(databaseFile, "utf8"));
    } catch {
      return { posts: {} };
    }
  }

  function salvarBanco(db) {
    fs.writeFileSync(
      databaseFile,
      JSON.stringify(db, null, 2)
    );
  }

  // =========================
  // COMANDO /POSTAR
  // =========================

  client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName !== "postar") return;

    const modal = new ModalBuilder()
      .setCustomId("instagram_post_modal")
      .setTitle("📸 Nova publicação");

    const legenda = new TextInputBuilder()
      .setCustomId("legenda")
      .setLabel("Legenda da publicação")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Escreva uma legenda...")
      .setRequired(false)
      .setMaxLength(1000);

    modal.addComponents(
      new ActionRowBuilder().addComponents(legenda)
    );

    await interaction.showModal(modal);
  });


  // =========================
  // MODAL
  // =========================

  client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId !== "instagram_post_modal") return;

    const legenda =
      interaction.fields.getTextInputValue("legenda") ||
      "Sem legenda.";

    await interaction.reply({
      content:
        "📸 **Envie agora a foto que deseja publicar neste canal.**\n\n" +
        "Você tem **60 segundos**.",
      ephemeral: true
    });

    const canal = interaction.channel;

    const filtro = msg =>
      msg.author.id === interaction.user.id &&
      msg.attachments.size > 0;

    try {

      const coletadas = await canal.awaitMessages({
        filter: filtro,
        max: 1,
        time: 60000,
        errors: ["time"]
      });

      const mensagem = coletadas.first();

      const imagem = mensagem.attachments.first();

      if (!imagem.contentType?.startsWith("image/")) {

        await interaction.followUp({
          content: "❌ Esse arquivo não parece ser uma imagem.",
          ephemeral: true
        });

        return;
      }

      const db = carregarBanco();

      const id =
        `${Date.now()}_${interaction.user.id}`;

      // BAIXA A IMAGEM ENVIADA
const respostaImagem = await fetch(imagem.url);

if (!respostaImagem.ok) {
  await interaction.followUp({
    content: "❌ Não consegui carregar essa imagem.",
    ephemeral: true
  });

  return;
}

const bufferImagem =
  Buffer.from(await respostaImagem.arrayBuffer());

let extensao = "png";

if (imagem.contentType === "image/jpeg") {
  extensao = "jpg";
} else if (imagem.contentType === "image/webp") {
  extensao = "webp";
} else if (imagem.contentType === "image/gif") {
  extensao = "gif";
}

const nomeArquivo = `mostrinho-post-${id}.${extensao}`;

const anexo = new AttachmentBuilder(
  bufferImagem,
  {
    name: nomeArquivo
  }
);

db.posts[id] = {
  id,
  guildId: interaction.guild.id,
  channelId: canal.id,
  authorId: interaction.user.id,

  authorName:
    interaction.member?.displayName ||
    interaction.user.username,

  authorAvatar:
    interaction.user.displayAvatarURL({
      size: 256
    }),

  image: `attachment://${nomeArquivo}`,

  legenda,

  likes: [],

  comments: [],

  createdAt: Date.now()
};

      salvarBanco(db);

      const embed = criarEmbed(db.posts[id]);

      const botoes = criarBotoes(db.posts[id]);

      const post = await canal.send({
  files: [anexo],
  embeds: [embed],
  components: [botoes]
});

      db.posts[id].messageId = post.id;

      salvarBanco(db);

      try {
        await mensagem.delete();
      } catch {}

      await interaction.followUp({
        content: "✅ **Sua publicação foi criada!** 📸",
        ephemeral: true
      });

    } catch {

      await interaction.followUp({
        content:
          "⏰ Tempo esgotado. Execute `/postar` novamente.",
        ephemeral: true
      });
    }
  });


  // =========================
  // BOTÕES
  // =========================

  client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isButton()) return;

    if (
      !interaction.customId.startsWith("instagram_")
    ) return;

    const partes =
      interaction.customId.split("_");

    const acao = partes[1];
    const postId = partes.slice(2).join("_");

    const db = carregarBanco();

    const post = db.posts[postId];

    if (!post) {

      return interaction.reply({
        content: "❌ Essa publicação não existe mais.",
        ephemeral: true
      });
    }

    // =========================
    // CURTIR
    // =========================

    if (acao === "like") {

      const index =
        post.likes.indexOf(interaction.user.id);

      if (index === -1) {

        post.likes.push(interaction.user.id);

      } else {

        post.likes.splice(index, 1);
      }

      salvarBanco(db);

      const embed = criarEmbed(post);
      const botoes = criarBotoes(post);

      await interaction.update({
        embeds: [embed],
        components: [botoes]
      });

      return;
    }


    // =========================
    // COMENTAR
    // =========================

    if (acao === "comment") {

      await interaction.deferReply({
        ephemeral: true
      });

      let thread;

      try {

        const canal =
          interaction.guild.channels.cache.get(
            post.channelId
          );

        const mensagem =
          await canal.messages.fetch(
            post.messageId
          );

        thread =
          mensagem.thread ||
          await mensagem.startThread({
            name: `💬 Comentários`,
            autoArchiveDuration: 1440
          });

      } catch (erro) {

        console.log(
          "Erro criando thread:",
          erro
        );

        await interaction.editReply(
          "❌ Não consegui abrir os comentários."
        );

        return;
      }

      await interaction.editReply(
        `💬 **Comentários:** ${thread}\n\n` +
        "Escreva sua mensagem dentro da thread."
      );

      return;
    }


    // =========================
    // APAGAR
    // =========================

    if (acao === "delete") {

      if (
        interaction.user.id !== post.authorId &&
        !interaction.member.permissions.has("ManageMessages")
      ) {

        await interaction.reply({
          content:
            "❌ Você não pode apagar essa publicação.",
          ephemeral: true
        });

        return;
      }

      delete db.posts[postId];

      salvarBanco(db);

      try {

        await interaction.message.delete();

      } catch {}

      await interaction.reply({
        content:
          "🗑️ Publicação apagada com sucesso.",
        ephemeral: true
      });
    }
  });


  // =========================
  // REGISTRAR /POSTAR
  // =========================

  client.once(Events.ClientReady, async () => {

    const command = new SlashCommandBuilder()
      .setName("postar")
      .setDescription(
        "📸 Fazer uma publicação no Instagram do servidor"
      );

    try {

      await client.application.commands.create(
        command
      );

      console.log(
        "📸 Comando /postar registrado!"
      );

    } catch (erro) {

      console.log(
        "❌ Erro registrando /postar:",
        erro
      );
    }
  });


  // =========================
  // FUNÇÕES
  // =========================

  function criarEmbed(post) {

    const embed = new EmbedBuilder()
      .setColor("#8b5cf6")
      .setAuthor({
        name: post.authorName,
        iconURL: post.authorAvatar
      })
      .setImage(post.image)
      .setDescription(
        `**${post.authorName}**\n\n` +
        `${post.legenda}\n\n` +
        `❤️ **${post.likes.length}** curtida(s)  •  ` +
        `💬 **${post.comments.length}** comentário(s)`
      )
      .setFooter({
        text: "Mostrinho • Instagram"
      })
      .setTimestamp(post.createdAt);

    return embed;
  }


  function criarBotoes(post) {

    const curtir =
      new ButtonBuilder()
        .setCustomId(
          `instagram_like_${post.id}`
        )
        .setLabel(
          `❤️ ${post.likes.length}`
        )
        .setStyle(ButtonStyle.Secondary);

    const comentar =
      new ButtonBuilder()
        .setCustomId(
          `instagram_comment_${post.id}`
        )
        .setLabel(
          `💬 ${post.comments.length}`
        )
        .setStyle(ButtonStyle.Secondary);

    const apagar =
      new ButtonBuilder()
        .setCustomId(
          `instagram_delete_${post.id}`
        )
        .setLabel("🗑️")
        .setStyle(ButtonStyle.Danger);

    return new ActionRowBuilder()
      .addComponents(
        curtir,
        comentar,
        apagar
      );
  }


  console.log("📸 Sistema Instagram carregado!");
};
