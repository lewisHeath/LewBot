const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { colours } = require("../colours.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
    async execute(interaction, client) {
        await interaction.deferReply()
        const queue = await client.player.getQueue(interaction.guildId)
        if(!queue) return await interaction.editReply("There are no songs in the queue")

        const song = queue.current
        if(!song) return await interaction.editReply("There is no song currently playing")

        console.log(song)

        await queue.skipTo(0)

        console.log(queue.current)

        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(colours[Math.floor(Math.random() * colours.length)])
                .setTitle("Skipped")
                .setDescription(`[${song.title}](${song.url})`)
            ],
        })
    },
}