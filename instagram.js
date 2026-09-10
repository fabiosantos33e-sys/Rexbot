const {
  EmbedBuilder,
  SlashCommandBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const database = path.join(__dirname, "database");
const arquivo = path.join(database, "instagram.json");

if (!fs.existsSync(database)) {
  fs.mkdirSync(database, { recursive: true });
}

if (!fs.existsSync(arquivo)) {
  fs.writeFileSync(
    arquivo,
    JSON.stringify({ posts: [] }, null, 2)
  );
}

function carregar() {
  try {
    return JSON.parse(
      fs.readFileSync(arquivo, "utf8")
    );
  } catch {
    return { posts: [] };
  }
}

function salvar(data) {
  fs.writeFileSync(
    arquivo,
    JSON.stringify(data, null, 2)
  );
}

module.exports = (client) => {

  const comando = new SlashCommandBuilder()
    .setName("postar")
    .setDescription("Faça uma publicação no Instagram");

  client.once(Events.ClientReady, async () => {
    try {
      const comandos =
        await client.application.commands.fetch();

      const existente = comandos.find(
        cmd => cmd.name === "postar"
      );

      if (existente) {
        await client.application.commands.edit(
          existente.id,
          comando.toJSON()
        );
      } else {
        await client.application.commands.create(
          comando.toJSON()
        );
      }

      console.log("📸 /postar registrado!");
    } catch (erro) {
      console.error(
        "❌ Erro ao registrar /postar:",
        erro
      );
    }
  });

  client.on(
    Events.InteractionCreate,
    async (interaction) => {

      try {

        // ==============================
        // /POSTAR
        // ==============================

        if (
          interaction.isChatInputCommand() &&
          interaction.commandName === "postar"
        ) {

          const modal = new ModalBuilder()
            .setCustomId("instagram_post")
            .setTitle("📸 Nova publicação");

          const legenda = new TextInputBuilder()
            .setCustomId("legenda")
            .setLabel("Legenda")
            .setPlaceholder(
              "Escreva algo sobre sua foto..."
            )
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(1000);

          modal.addComponents(
            new ActionRowBuilder().addComponents(
              legenda
            )
          );

          await interaction.showModal(modal);
          return;
        }

        // ==============================
        // MODAL DA PUBLICAÇÃO
        // ==============================

        if (
          interaction.isModalSubmit() &&
          interaction.customId === "instagram_post"
        ) {

          const legenda =
            interaction.fields.getTextInputValue(
              "legenda"
            ) || "Sem legenda.";

          await interaction.reply({
            content:
              "📸 **Envie sua foto neste canal!**\n" +
              "Você tem **60 segundos**.",
            ephemeral: true
          });

          try {

            const mensagens =
              await interaction.channel.awaitMessages({
                filter: msg =>
                  msg.author.id ===
                    interaction.user.id &&
                  [...msg.attachments.values()]
                    .some(a =>
                      (a.contentType || "")
                        .startsWith("image/")
                    ),
                max: 1,
                time: 60000
              });

            if (!mensagens.size) {

              await interaction.editReply({
                content:
                  "⏰ Tempo esgotado! Use `/postar` novamente."
              });

              return;
            }

            const mensagem =
              mensagens.first();

            const imagem =
              [...mensagem.attachments.values()]
                .find(a =>
                  (a.contentType || "")
                    .startsWith("image/")
                );

            if (!imagem) {
              return;
            }

            await interaction.editReply({
              content:
                "⏳ **Publicando sua foto...**"
            });

            // ==============================
            // BAIXAR IMAGEM
            // ==============================

            const resposta =
              await fetch(imagem.url);

            if (!resposta.ok) {
              throw new Error(
                "Não consegui baixar a imagem."
              );
            }

            const buffer =
              Buffer.from(
                await resposta.arrayBuffer()
              );

            // ==============================
            // EXTENSÃO
            // ==============================

            let extensao = "png";

            if (
              imagem.contentType?.includes("jpeg") ||
              imagem.contentType?.includes("jpg")
            ) {
              extensao = "jpg";
            } else if (
              imagem.contentType?.includes("webp")
            ) {
              extensao = "webp";
            } else if (
              imagem.contentType?.includes("gif")
            ) {
              extensao = "gif";
            }

            const nome =
              `foto_${Date.now()}.${extensao}`;

            const anexo =
              new AttachmentBuilder(
                buffer,
                { name: nome }
              );

            // ==============================
            // CRIAR POST
            // ==============================

            const id =
              `${Date.now()}_${interaction.user.id}`;

            const banco = carregar();

            banco.posts.push({
              id: id,

              autorId:
                interaction.user.id,

              autor:
                interaction.member?.displayName ||
                interaction.user.username,

              legenda: legenda,

              curtidas: [],

              comentarios: [],

              imagem:
                `attachment://${nome}`,

              data: Date.now()
            });

            salvar(banco);

            // ==============================
            // EMBED
            // ==============================

            const embed =
              new EmbedBuilder()
                .setColor(0xff0066)

                .setAuthor({
                  name:
                    interaction.member?.displayName ||
                    interaction.user.username,

                  iconURL:
                    interaction.user.displayAvatarURL({
                      dynamic: true
                    })
                })

                .setDescription(legenda)

                .setImage(
                  `attachment://${nome}`
                )

                .setFooter({
                  text:
                    "📸 Instagram • Mostrinho"
                })

                .setTimestamp();

            // ==============================
            // BOTÕES
            // ==============================

            const botoes =
              new ActionRowBuilder()
                .addComponents(

                  new ButtonBuilder()
                    .setCustomId(
                      `insta_like_${id}`
                    )
                    .setLabel("0")
                    .setEmoji("❤️")
                    .setStyle(
                      ButtonStyle.Secondary
                    ),

                  new ButtonBuilder()
                    .setCustomId(
                      `insta_comment_${id}`
                    )
                    .setLabel("Comentar")
                    .setEmoji("💬")
                    .setStyle(
                      ButtonStyle.Secondary
                    ),

                  new ButtonBuilder()
                    .setCustomId(
                      `insta_comments_${id}`
                    )
                    .setLabel("Comentários")
                    .setEmoji("👀")
                    .setStyle(
                      ButtonStyle.Secondary
                    ),

                  new ButtonBuilder()
                    .setCustomId(
                      `insta_delete_${id}`
                    )
                    .setEmoji("🗑️")
                    .setStyle(
                      ButtonStyle.Danger
                    )
                );

            // ==============================
            // ENVIAR PUBLICAÇÃO
            // ==============================

            await interaction.channel.send({
              embeds: [embed],
              files: [anexo],
              components: [botoes]
            });

            // Apagar imagem original
            await mensagem.delete()
              .catch(() => {});

            await interaction.editReply({
              content:
                "✅ **Foto publicada com sucesso!** 📸"
            });

          } catch (erro) {

            console.error(
              "❌ Erro Instagram:",
              erro
            );

            await interaction.editReply({
              content:
                "❌ Deu erro ao publicar a foto."
            }).catch(() => {});
          }

          return;
        }


 // ==============================
// CURTIR + VER QUEM CURTIU
// ==============================

if (
  interaction.isButton() &&
  interaction.customId.startsWith("insta_like_")
) {

  const id = interaction.customId.replace(
    "insta_like_",
    ""
  );

  const banco = carregar();

  const post = banco.posts.find(
    p => p.id === id
  );

  if (!post) {
    await interaction.reply({
      content: "❌ Publicação não encontrada.",
      ephemeral: true
    });

    return;
  }

  if (!post.curtidas) {
    post.curtidas = [];
  }

  // ==============================
  // CLICOU NA CURTIDA
  // ==============================

  const index = post.curtidas.indexOf(
    interaction.user.id
  );

  if (index === -1) {

    // Adiciona curtida
    post.curtidas.push(
      interaction.user.id
    );

  } else {

    // Remove curtida
    post.curtidas.splice(
      index,
      1
    );
  }

  salvar(banco);

  // ==============================
  // ATUALIZAR BOTÃO
  // ==============================

  const botoes =
    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(
            `insta_like_${id}`
          )
          .setLabel(
            `${post.curtidas.length}`
          )
          .setEmoji("❤️")
          .setStyle(
            ButtonStyle.Secondary
          ),

        new ButtonBuilder()
          .setCustomId(
            `insta_comment_${id}`
          )
          .setLabel("Comentar")
          .setEmoji("💬")
          .setStyle(
            ButtonStyle.Secondary
          ),

        new ButtonBuilder()
          .setCustomId(
            `insta_comments_${id}`
          )
          .setLabel("Comentários")
          .setEmoji("👀")
          .setStyle(
            ButtonStyle.Secondary
          ),

        new ButtonBuilder()
          .setCustomId(
            `insta_delete_${id}`
          )
          .setEmoji("🗑️")
          .setStyle(
            ButtonStyle.Danger
          )
      );

  await interaction.message.edit({
    components: [botoes]
  });

  // ==============================
  // MOSTRAR QUEM CURTIU
  // ==============================

  if (post.curtidas.length === 0) {

    await interaction.reply({
      content:
        "💔 Ninguém curtiu essa publicação ainda.",
      ephemeral: true
    });

    return;
  }

  let lista = "";

  for (
    const usuarioId of post.curtidas
  ) {

    try {

      const usuario =
        await interaction.client.users.fetch(
          usuarioId
        );

      lista +=
        `❤️ ${usuario.username}\n`;

    } catch {

      lista +=
        `❤️ Usuário desconhecido\n`;
    }
  }

  const embed =
    new EmbedBuilder()
      .setColor(0xff0066)
      .setTitle("❤️ Quem curtiu")
      .setDescription(lista)
      .setFooter({
        text:
          `${post.curtidas.length} curtida(s)`
      });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true
  });

  return;
}

         // ==============================
        // COMENTAR
        // ==============================

        if (
          interaction.isButton() &&
          interaction.customId.startsWith(
            "insta_comment_"
          )
        ) {

          const id =
            interaction.customId.replace(
              "insta_comment_",
              ""
            );

          const banco = carregar();

          const post =
            banco.posts.find(
              p => p.id === id
            );

          if (!post) {
            await interaction.reply({
              content:
                "❌ Publicação não encontrada.",
              ephemeral: true
            });
            return;
          }

          const modal =
            new ModalBuilder()
              .setCustomId(
                `insta_comment_modal_${id}`
              )
              .setTitle(
                "💬 Comentar"
              );

          const comentario =
            new TextInputBuilder()
              .setCustomId(
                "comentario"
              )
              .setLabel(
                "Seu comentário"
              )
              .setPlaceholder(
                "Escreva seu comentário..."
              )
              .setStyle(
                TextInputStyle.Paragraph
              )
              .setRequired(true)
              .setMaxLength(500);

          modal.addComponents(
            new ActionRowBuilder()
              .addComponents(
                comentario
              )
          );

          await interaction.showModal(
            modal
          );

          return;
        }

        // ==============================
        // SALVAR COMENTÁRIO
        // ==============================

        if (
          interaction.isModalSubmit() &&
          interaction.customId.startsWith(
            "insta_comment_modal_"
          )
        ) {

          const id =
            interaction.customId.replace(
              "insta_comment_modal_",
              ""
            );

          const texto =
            interaction.fields.getTextInputValue(
              "comentario"
            );

          const banco = carregar();

          const post =
            banco.posts.find(
              p => p.id === id
            );

          if (!post) {
            await interaction.reply({
              content:
                "❌ Publicação não encontrada.",
              ephemeral: true
            });
            return;
          }

          if (!post.comentarios) {
            post.comentarios = [];
          }

          post.comentarios.push({
            autor:
              interaction.member?.displayName ||
              interaction.user.username,

            autorId:
              interaction.user.id,

            texto:
              texto,

            data:
              Date.now()
          });

          salvar(banco);

          await interaction.reply({
            content:
              "💬 **Comentário publicado!**",
            ephemeral: true
          });

          return;
        }

        // ==============================
        // VER COMENTÁRIOS
        // ==============================

        if (
          interaction.isButton() &&
          interaction.customId.startsWith(
            "insta_comments_"
          )
        ) {

          const id =
            interaction.customId.replace(
              "insta_comments_",
              ""
            );

          const banco = carregar();

          const post =
            banco.posts.find(
              p => p.id === id
            );

          if (!post) {
            await interaction.reply({
              content:
                "❌ Publicação não encontrada.",
              ephemeral: true
            });
            return;
          }

          const comentarios =
            post.comentarios || [];

          if (!comentarios.length) {

            await interaction.reply({
              content:
                "💬 Essa publicação ainda não possui comentários.",
              ephemeral: true
            });

            return;
          }

          const ultimos =
            comentarios.slice(-15);

          let texto = "";

          for (
            const comentario of ultimos
          ) {
            texto +=
              `**${comentario.autor}**\n` +
              `${comentario.texto}\n\n`;
          }

          const embed =
            new EmbedBuilder()
              .setColor(0xff0066)
              .setTitle(
                "💬 Comentários"
              )
              .setDescription(
                texto
              )
              .setFooter({
                text:
                  `${comentarios.length} comentário(s)`
              });

          await interaction.reply({
            embeds: [embed],
            ephemeral: true
          });

          return;
        }

        // ==============================
        // APAGAR
        // ==============================

        if (
          interaction.isButton() &&
          interaction.customId.startsWith(
            "insta_delete_"
          )
        ) {

          const id =
            interaction.customId.replace(
              "insta_delete_",
              ""
            );

          const banco = carregar();

          const post =
            banco.posts.find(
              p => p.id === id
            );

          if (!post) {
            await interaction.reply({
              content:
                "❌ Publicação não encontrada.",
              ephemeral: true
            });
            return;
          }

          const administrador =
            interaction.member.permissions.has(
              "ManageMessages"
            );

          const dono =
            post.autorId ===
            interaction.user.id;

          if (!dono && !administrador) {
            await interaction.reply({
              content:
                "❌ Você não pode apagar essa publicação.",
              ephemeral: true
            });
            return;
          }

          banco.posts =
            banco.posts.filter(
              p => p.id !== id
            );

          salvar(banco);

          await interaction.message
            .delete()
            .catch(() => {});

          return;
        }

      } catch (erro) {

        console.error(
          "❌ Erro no Instagram:",
          erro
        );

        if (
          !interaction.replied &&
          !interaction.deferred
        ) {
          await interaction.reply({
            content:
              "❌ Ocorreu um erro no sistema.",
            ephemeral: true
          }).catch(() => {});
        }
      }
    }
  );

  console.log(
    "📸 Sistema Instagram carregado!"
  );
};
