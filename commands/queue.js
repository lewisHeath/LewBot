const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { colours } = require("../colours.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays the current queue")
        .addNumberOption((option) => {
            option
                .setName("page")
                .setDescription("The page you want to view")
                .setMinValue(1)

            return option
        }),
    async execute(interaction, client) {
        await interaction.deferReply()

        const queue = await client.player.getQueue(interaction.guildId)

        if(!queue) return await interaction.editReply("There are no songs in the queue")

        const totalPages = Math.ceil(queue.tracks.length / 20)
        const page = (interaction.options.getNumber("page") || 1) - 1

        if(page > totalPages) return await interaction.editReply(`There are only ${totalPages} pages in the queue`)

        let tracks = queue.tracks.slice(page * 20, (page + 1) * 20)
        // remove every other track
        tracks = tracks.filter((track, i) => i % 2 === 0)

        const description = tracks.map((track, i) => `${i + 1 + page * 10}. [${track.title}](${track.url})`).join("\n")

        const embed = new EmbedBuilder()
            .setColor(colours[Math.floor(Math.random() * colours.length)])
            .setTitle("Queue")
            .setDescription(description)
        
        if(queue.tracks.length > 10) embed.setFooter({
            text: `Page ${page + 1} of ${totalPages}`
        })

        await interaction.editReply({ embeds: [embed] })
    },
}