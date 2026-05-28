onst { EmbedBuilder } = require("discord.js");

module.exports = (client) => {

client.on("guildMemberAdd", async (member) => {

const canal = member.guild.channels.cache.find(
c => c.name === "geral"
);

if (!canal) return;

const embed = new EmbedBuilder()
.setColor("#2b2d31")
.setTitle("🌙 Tum tum... Mostrinho apareceu!")
.setDescription(
`💜 Olá ${member}!\n\nSeja muito bem-vindo(a) ao servidor!\nEsperamos que você se divirta bastante com a gente 😎🔥\n\n🎉 @here vem dar boas-vindas pro novo membro!`
)
.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
.setTimestamp();

canal.send({
content: `${member}`,
embeds: [embed]
});

});

};
