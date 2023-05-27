const { SlashCommandBuilder } = require('discord.js');

const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('personality')
        .setDescription('Sets the personality of LewBot')
        .addStringOption(option =>
            option
                .setName('personality')
                .setDescription('The personality to set')
                .setRequired(true)),

    async execute(interaction, client) {
        await interaction.deferReply();

        // change the content inside of ../personality.txt to the new personality
        let personality = interaction.options.getString('personality');
        console.log(personality);

        // overwrite the file
        fs.writeFileSync(path.join(__dirname, '../personality.txt'), personality);

        await interaction.editReply("Personality changed!");
    },
};