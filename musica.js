const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const prefix = ",";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();

    if (cmd !== "musica" && cmd !== "play") return;

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("🎧 Entra em um canal de voz primeiro.");

    const busca = args.join(" ");
    if (!busca) return message.reply("Use: `,musica nome ou link`");

    const queue = client.player.nodes.create(message.guild, {
      metadata: message.channel,
      volume: 70,
      leaveOnEmpty: true,
      leaveOnEnd: false,
      leaveOnStop: false,
      selfDeaf: true
    });

    if (!queue.connection) await queue.connect(voiceChannel);

    const result = await client.player.search(busca, {
      requestedBy: message.author
    });

    if (!result.hasTracks()) return message.reply("❌ Não achei essa música.");

    const track = result.tracks[0];
    queue.addTrack(track);

    if (!queue.isPlaying()) await queue.node.play();

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🎶 Painel de Música — Mostrinho")
      .setDescription(`Tocando agora:\n**${track.title}**`)
      .addFields(
        { name: "👤 Pedido por", value: `${message.author}`, inline: true },
        { name: "🔊 Volume", value: `${queue.node.volume}%`, inline: true },
        { name: "🎧 Canal", value: `${voiceChannel.name}`, inline: true }
      )
      .setThumbnail(track.thumbnail)
      .setFooter({ text: "Controle a música pelos botões abaixo" });

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("music_pause").setLabel("Pausar").setEmoji("⏸️").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("music_resume").setLabel("Continuar").setEmoji("▶️").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("music_skip").setLabel("Pular").setEmoji("⏭️").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("music_stop").setLabel("Parar").setEmoji("⏹️").setStyle(ButtonStyle.Danger)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("music_vol_down").setLabel("Volume -").setEmoji("🔉").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("music_vol_up").setLabel("Volume +").setEmoji("🔊").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("music_queue").setLabel("Fila").setEmoji("📜").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("music_now").setLabel("Tocando").setEmoji("🎧").setStyle(ButtonStyle.Secondary)
    );

    message.reply({ embeds: [embed], components: [row1, row2] });
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const queue = client.player.nodes.get(interaction.guild.id);

    if (!queue) {
      return interaction.reply({
        content: "❌ Não tem música tocando agora.",
        ephemeral: true
      });
    }

    if (interaction.customId === "music_pause") {
      queue.node.pause();
      return interaction.reply({ content: "⏸️ Música pausada.", ephemeral: true });
    }

    if (interaction.customId === "music_resume") {
      queue.node.resume();
      return interaction.reply({ content: "▶️ Música continuando.", ephemeral: true });
    }

    if (interaction.customId === "music_skip") {
      queue.node.skip();
      return interaction.reply({ content: "⏭️ Música pulada.", ephemeral: true });
    }

    if (interaction.customId === "music_stop") {
      queue.delete();
      return interaction.reply({ content: "⏹️ Música parada.", ephemeral: true });
    }

    if (interaction.customId === "music_vol_up") {
      const vol = Math.min(queue.node.volume + 10, 100);
      queue.node.setVolume(vol);
      return interaction.reply({ content: `🔊 Volume: **${vol}%**`, ephemeral: true });
    }

    if (interaction.customId === "music_vol_down") {
      const vol = Math.max(queue.node.volume - 10, 10);
      queue.node.setVolume(vol);
      return interaction.reply({ content: `🔉 Volume: **${vol}%**`, ephemeral: true });
    }

    if (interaction.customId === "music_queue") {
      const tracks = queue.tracks.toArray().slice(0, 10);

      if (!tracks.length) {
        return interaction.reply({ content: "📜 A fila está vazia.", ephemeral: true });
      }

      const lista = tracks.map((t, i) => `${i + 1}. ${t.title}`).join("\n");

      return interaction.reply({
        content: `📜 **Fila:**\n${lista}`,
        ephemeral: true
      });
    }

    if (interaction.customId === "music_now") {
      const atual = queue.currentTrack;

      return interaction.reply({
        content: atual ? `🎧 Tocando agora: **${atual.title}**` : "Nada tocando.",
        ephemeral: true
      });
    }
  });
};
