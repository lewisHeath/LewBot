const { SlashCommandBuilder } = require('discord.js');
const checkAccessToken = require('../Destiny/functions/checkAccessToken.js');
const getDetails = require('../Destiny/functions/getDetails.js');

const endpoint = 'https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/';
const { bungieAPIKEY } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('destiny-profile')
        .setDescription('Gets your destiny profile!'),

    async execute(interaction, client) {
        await interaction.deferReply();

        const username = interaction.user.username;
        if(!checkAccessToken(username)) {
            await interaction.editReply({ content: "You are not authorized! Please authorize your bungie.net account!" });
            return;
        }

        const { accessToken } = getDetails(username);

        // if there is a user, get their destiny profile
        const requestOptions = {
            method: 'GET',
            headers: {
                'X-API-Key': bungieAPIKEY,
                'Authorization': `Bearer ${accessToken}`
            }
        };

        // get the user's destiny profile
        try {
            const response = await fetch(endpoint, requestOptions);
            const data = await response.json();
            const membershipId = data.Response.membershipId;
            const displayName = data.Response.displayName;
            const uniqueName = data.Response.uniqueName;
    
            // respond with the user's destiny profile
            await interaction.editReply({ content: `Your destiny profile is:\nMembership ID: ${membershipId}\nDisplay Name: ${displayName}\nUnique Name: ${uniqueName}` });
        } catch (error) {
            console.log(error);
            await interaction.editReply({ content: "There was an error getting your destiny profile!" });
        }
    },
};