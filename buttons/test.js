module.exports = {
    data: {
        name: "test"
    },
    async execute(interaction) {
        await interaction.reply({ content: "this is a test from the other file" })
    }
}