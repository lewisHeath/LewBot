const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { colours } = require("../colours.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays info about the currently playing song"),
    async execute (interaction, client) {
        await interaction.deferReply()
        
        const queue = await client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs in the queue")

        let bar = queue.createProgressBar({
            queue: false,
            length: 19,
        })

        const song = queue.current

        if(!song) {
            await interaction.editReply("There is no song currently playing")
            return;
        }

        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(colours[Math.floor(Math.random() * colours.length)])
                .setTitle("Now Playing")
                .setThumbnail(song.thumbnail)
                .setDescription(`[${song.title}](${song.url})\n\n` + bar)
                .addFields(
                    { name: 'Length', value: song.duration, inline: true },
                    { name: 'Requested by', value: song.requestedBy.username, inline: true }
                )
            ],
        })
    },
}