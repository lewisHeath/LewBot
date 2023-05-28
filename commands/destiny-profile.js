const { SlashCommandBuilder } = require('discord.js');
const checkAccessToken = require('../Destiny/functions/checkAccessToken.js');
const getDetails = require('../Destiny/functions/getDetails.js');
const getMembershipDetails = require('../Destiny/functions/getMembershipDetails.js');

const endpoint = 'https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/';
const baseUrl = 'https://www.bungie.net/Platform/Destiny2/';

const { bungieAPIKEY } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('destiny-profile')
        .setDescription('Gets your destiny profile!'),

    async execute(interaction, client) {
        await interaction.deferReply();

        const username = interaction.user.username;
        const authorized = await checkAccessToken(username);
        if(!authorized) {
            await interaction.editReply({ content: "You are not authorized! Please authorize your bungie.net account!" });
            return;
        }

        const { accessToken } = getDetails(username);
        const { membershipID, membershipType } = getMembershipDetails(username);

        // if there is a user, get their destiny profile
        const requestOptions = {
            method: 'GET',
            headers: {
                'X-API-Key': bungieAPIKEY,
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const urlEnding = `${membershipType}/Profile/${membershipID}/?components=100`
        const url = baseUrl + urlEnding;
        console.log(`making request to: ${url}`);
        // make the request
        const response = await fetch(url, requestOptions);
        // const data = await response.json();
        // print the error
        if(!response.ok) {
            console.log(`Error: ${response.status} ${response.statusText}`);
            await interaction.editReply({ content: `Error: ${response.status} ${response.statusText}` });
        }

        const data = await response.json();
        console.log(data.Response.profile.data.characterIds);
        await interaction.editReply({ content: `Your profile IDs: ${JSON.stringify(data.Response.profile.data.characterIds)}` });
    },
};