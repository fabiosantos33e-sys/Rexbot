const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction, usuarioMarcado) => {

    const embed = new EmbedBuilder()
        .setColor("#00ff88")
        .setTitle("📢 Você foi mencionado!")
        .setDescription(`
👤 **Marcado por:** ${interaction.user}

💚 Olá ${usuarioMarcado}!

✨ Você foi marcado no servidor.
🚀 Confira a mensagem enviada pela equipe.
`)
        .setImage("https://cdn.discordapp.com/attachments/1513675524013166753/1517943859529650206/Death_Note_GIF.gif?ex=6a381ee2&is=6a36cd62&hm=cfab480c6122bba6e5ae97cf119bf050671bca230ff6887ba3c963b7002d17bf&");

    await interaction.reply({
        content: `${usuarioMarcado}`,
        embeds: [embed]
    });

    try {

        const dmEmbed = new EmbedBuilder()
            .setColor("#00ff88")
            .setTitle("📩 Você recebeu uma marcação!")
            .setDescription(`
👤 **Quem marcou você:** ${interaction.user.tag}

🏠 **Servidor:** ${interaction.guild.name}

💚 Você foi mencionado em uma mensagem.

🚀 Entre no servidor para conferir!
`)
            .setImage("https://cdn.discordapp.com/attachments/1513675524013166753/1517943859529650206/Death_Note_GIF.gif?ex=6a381ee2&is=6a36cd62&hm=cfab480c6122bba6e5ae97cf119bf050671bca230ff6887ba3c963b7002d17bf&");

        await usuarioMarcado.send({
            embeds: [dmEmbed]
        });

    } catch (err) {
        console.log("Não foi possível enviar DM.");
    }

};
