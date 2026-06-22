const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource
} = require("@discordjs/voice");

const play = require("play-dl");

let player;

module.exports = {
  async execute(interaction) {

    const sub = interaction.options.getSubcommand();

    if (sub === "tocar") {

      const nome = interaction.options.getString("nome");

      const canal = interaction.member.voice.channel;
      console.log("Canal de voz:", canal?.name);
console.log("Member:", interaction.member?.user?.tag);
      if (!canal) {
        return interaction.reply({
          content: "Entre em um canal de voz primeiro.",
          ephemeral: true
        });
      }

      await interaction.deferReply();

      try {

        let musica;

if (
  nome.includes("youtube.com") ||
  nome.includes("youtu.be")
) {

  musica = {
    url: nome,
    title: "Música do YouTube"
  };

} else {

  return interaction.editReply(
    "❌ A busca por nome está indisponível no momento. Use um link do YouTube."
  );

}

        const stream = await play.stream(
          musica.url
        );

        const conexao = joinVoiceChannel({
          channelId: canal.id,
          guildId: canal.guild.id,
          adapterCreator:
            canal.guild.voiceAdapterCreator
        });

        player = createAudioPlayer();

        const resource =
          createAudioResource(
            stream.stream,
            {
              inputType: stream.type
            }
          );

        player.play(resource);

        conexao.subscribe(player);

        return interaction.editReply(
          `🎵 Tocando: ${musica.title}`
        );

      } catch (err) {

        console.error(err);

        return interaction.editReply(
          "Erro ao tocar música."
        );
      }
    }

    if (sub === "parar") {

      if (player) {
        player.stop();
      }

      return interaction.reply(
        "⏹️ Música parada."
      );
    }

  }
};
