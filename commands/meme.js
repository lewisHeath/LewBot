const { SlashCommandBuilder } = require('discord.js');

let api = "https://meme-api.com/gimme"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Gets a meme!'),

    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            const response = await fetch(api);
            const data = await response.json();
            console.log(data);
            await interaction.editReply(data.preview[2]);
        } catch (error) {
            console.log(error);
            await interaction.editReply("There was an error getting the meme");
        }
    },
};