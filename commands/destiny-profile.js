const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkAccessToken = require('../Destiny/functions/checkAccessToken.js');
const getDetails = require('../Destiny/functions/getDetails.js');
const getMembershipDetails = require('../Destiny/functions/getMembershipDetails.js');
// Getting API
const Destiny2API = require('node-destiny-2');

const endpoint = 'https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/';
const baseUrl = 'https://www.bungie.net/Platform/Destiny2/';

const { bungieAPIKEY, bungieClientID, bungieClientSecret } = require('../config.json');

const rgbToHex = require('../rgbToHex.js');

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

        const destiny = new Destiny2API({
            key: bungieAPIKEY,
            oauthConfig: {
                id: bungieClientID,
                secret: bungieClientSecret
            }
        });

        const profile = await destiny.getProfile(membershipType, membershipID, ['100']);
        // console.log(profile.Response.profile);
        const characterId = profile.Response.profile.data.characterIds[0];
        const character = await destiny.getCharacter(membershipType, membershipID, characterId, ['200', '205']);
        const equipment = character.Response.equipment.data.items;
        // get all items
        const items = [];
        // for each item in equipment, get the item details
        for (const item of equipment) {
            const itemDetails = await destiny.getDestinyEntityDefinition('DestinyInventoryItemDefinition', item.itemHash, 'en');
            items.push(itemDetails.Response);
        }

        const colour = rgbToHex(character.Response.character.data.emblemColor.red, character.Response.character.data.emblemColor.green, character.Response.character.data.emblemColor.blue);
        // cut items to 8 length
        const cutItems = items.slice(0, 8);  

        // Displaying the data in a nice way
        const embed = new EmbedBuilder()
            .setTitle(`${profile.Response.profile.data.userInfo.bungieGlobalDisplayName} #${profile.Response.profile.data.userInfo.bungieGlobalDisplayNameCode}`)
            .setColor(colour)
            .setThumbnail(`https://www.bungie.net${character.Response.character.data.emblemPath}`)
            .setAuthor({ name: username, iconURL: `https://www.bungie.net${character.Response.character.data.emblemPath}` })
            .addFields(
                { name: `Kinetic`, value: `${cutItems[0].displayProperties.name}`, inline: false },
                { name: `Energy`, value: `${cutItems[1].displayProperties.name}`, inline: false },
                { name: `Power`, value: `${cutItems[2].displayProperties.name}`, inline: false },
                { name: `Helmet`, value: `${cutItems[3].displayProperties.name}`, inline: false },
                { name: `Gauntlets`, value: `${cutItems[4].displayProperties.name}`, inline: false },
                { name: `Chest`, value: `${cutItems[5].displayProperties.name}`, inline: false },
                { name: `Legs`, value: `${cutItems[6].displayProperties.name}`, inline: false },
                { name: `Class Item`, value: `${cutItems[7].displayProperties.name}`, inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

    },
};