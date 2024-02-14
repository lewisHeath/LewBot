const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('authorize')
        .setDescription('authorize your bungie account'),

    async execute(interaction, client) {
        // Get username
        const username = interaction.user.username;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('authorize')
                    .setURL(`https://www.bungie.net/en/oauth/authorize?client_id=42986&response_type=code&state=${username}`)
                    .setStyle(ButtonStyle.Link)
            );
        await interaction.reply({ content: "Please authorize your bungie.net account!", components: [row] })
    },
};