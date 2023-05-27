const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { colours } = require("../colours.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes a song from the queue")
        .addIntegerOption((option) =>
            option
                .setName("songnumber")
                .setDescription("The number of the song you want to remove")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply()

        const queue = await client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs in the queue")

        let songNumber = interaction.options.getInteger("songnumber");

        // The song is twice in the queue, so we need to remove it twice
        queue.remove(songNumber - 1)

        // get random colour
        const randomColour = colours[Math.floor(Math.random() * colours.length)];

        const embed = new EmbedBuilder()
            .setTitle("Song removed")
            .setColor(randomColour)
            .setDescription(`Removed song number ${songNumber} from the queue`)
            .setTimestamp()

        await interaction.editReply({ embeds: [embed] })
    },
}