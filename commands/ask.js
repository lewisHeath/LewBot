const { SlashCommandBuilder } = require('discord.js');
const { openAIKey } = require('../config.json');
const fs = require('fs');
const path = require('path');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: openAIKey,
});

const openai = new OpenAIApi(configuration);

// i only want to make 20 requests per day
counter = 0;
timeLockedAt = 0;
locked = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask a question and get an answer!')
        .addStringOption(option =>
            option
                .setName('input')
                .setDescription('The question to ask')
                .setRequired(true)
                .setAutocomplete(true)),

    async autocomplete(interaction) {
    },

    async execute(interaction) {
        // get the users input
        let option = interaction.options.getString('input');
        await interaction.deferReply();
        if(locked){
            // has it been over 24 hours?
            if(Date.now() - timeLockedAt >= 86400000){
                locked = false;
                counter = 0;
            } else {
                await interaction.editReply("Daily limit reached (soz, it costs money)");
                return;
            }
        }
        // read the text from the file ../prompt.txt
        const promptPath = path.join(__dirname, '../prompt.txt');
        const prompt = fs.readFileSync(promptPath, 'utf8');
        option = prompt + option + "\n\n";
        console.log(option);

        // make the API request
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: option,
            temperature: 0,
            max_tokens: 1000,
        });

        text = response.data.choices[0].text;
        // trim all white space
        text = text.replace(/\s+/g, ' ').trim();
        reply = `${interaction.options.getString('input')} - ${interaction.user}\n\n`;
        reply += text;
        await interaction.editReply(reply);
        counter++;

        if (counter >= 20) {
            console.log("You have reached the daily limit of 20 requests.");
            timeLockedAt = Date.now();
            locked = true;
        }
    },
};