const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const file = 'statuses.txt';

const MAX_LEN = 128;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-status-message')
        .setDescription('Gives LewBot a new status to choose from!')
        .addStringOption(option =>
            option
                .setName('status')
                .setDescription('The status message')
                .setRequired(true)),

    async execute(interaction, client) {
        await interaction.deferReply({
            //this is the important part
            ephemeral: true,
        });
        // get the message
        let status = interaction.options.getString('status');
        console.log(status.length);
        if (!status || status.length > MAX_LEN) {
            await interaction.editReply("Invalid status message!");
            return;
        }
        console.log(status);
        // overwrite the file
        fs.appendFile(file, `\n${status}`, async (err) => {
            if (err) {
                console.error('Error appending to statuses.txt:', err);
                await interaction.editReply("Error, status not added :(");
            } else {
                await interaction.editReply("Status added!");
            }
        });
    },
};
