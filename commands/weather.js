const { SlashCommandBuilder } = require('discord.js');
const { weatherAPIKey } = require('../config.json');

let api = "http://api.weatherapi.com/v1/current.json?key="
api += weatherAPIKey;
api += "&q=";

// read the citites from the ../worldcitites.csv file, the city is under the "city" column
const fs = require('fs');
const path = require('path');
const promptPath = path.join(__dirname, '../worldcities.csv');
const cities = fs.readFileSync(promptPath, 'utf8');
let choices = cities.split("\n").map(line => line.split(",")[0]);
// remove the first line (the column names)
choices.shift();
// the current format is '"city"' so remove the quotes
choices = choices.map(choice => choice.replace(/"/g, ''));

// console.log(choices);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('find the current weather in a location!')
        .addStringOption(option =>
            option
                .setName('place')
                .setDescription('The town/city to find the weather for')
                .setRequired(true)
                .setAutocomplete(true)),

    async autocomplete(interaction) {
        // get the users input
        let option = interaction.options.getString('place');
        const focusedValue = interaction.options.getFocused();
        let filtered = choices.filter(choice => choice.startsWith(focusedValue));
        // has to be limited to 25 choices
        if(filtered.length > 25){
            filtered = filtered.slice(0, 25);
        }
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },

    async execute(interaction, client) {
        // get the users input
        let option = interaction.options.getString('place');
        const url = api + option;
        console.log(url);
        await interaction.deferReply();
        try{
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            await interaction.editReply("The weather in " + data.location.name + " is " + data.current.condition.text + " with a temperature of " + data.current.temp_c + "°C");
        } catch (error) {
            console.log(error);
            await interaction.editReply("There was an error getting the weather");
        }
    },
};