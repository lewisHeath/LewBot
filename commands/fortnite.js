const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fortnite')
        .setDescription('CH4S1 Progress!'),

    async execute(interaction, client) {
        await interaction.deferReply();

        let currentDate = new Date();

        let startDate = new Date("December 3, 2022 00:00:00");
        let endDate = new Date("March 10, 2023 00:00:00");

        let totalTime = endDate - startDate;
        let elapsedTime = currentDate - startDate;

        let percentElapsed = (elapsedTime / totalTime) * 100;
        // round to 2 decimal places
        percentElapsed = percentElapsed.toFixed(2);

        await interaction.editReply(`Chapter 4 Season 1 is ${percentElapsed}% complete!`);
    },
};