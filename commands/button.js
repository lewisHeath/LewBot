const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('makes a button!'),

    async execute(interaction, client) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('test')
                    .setLabel('Click me!')
                    .setStyle(ButtonStyle.Danger)
            );
        await interaction.reply({ content: "I think you should,", components: [row] })
    },
};