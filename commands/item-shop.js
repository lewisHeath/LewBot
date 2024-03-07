const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('item-shop')
        .setDescription('Display current fortnite item shop!'),

    async execute(interaction, client) {
        await interaction.deferReply();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}_${month}_${day}`;
        console.log(formattedDate);
        console.log("sending item shop into the chat");
        await interaction.editReply(`This is your item shop!\nhttps://shop.easyfnstats.com/${formattedDate}_en.png`);
    }
};
