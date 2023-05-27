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
                .setName('question')
                .setDescription('The question to ask')
                .setRequired(true)),

    async execute(interaction, client) {
        // get the users input
        let option = interaction.options.getString('question');
        console.log(option);
        await interaction.deferReply();
        if (locked) {
            // has it been over 24 hours?
            if (Date.now() - timeLockedAt >= 86400000) {
                locked = false;
                counter = 0;
            } else {
                await interaction.editReply("Daily limit reached (soz, it costs money)");
                return;
            }
        }

        // get the conversation history from the channel
        let history = await interaction.channel.messages.fetch({ limit: 100 });
        // get the name of the user who sent the message and the content of the message
        // history = history.map(message => `${message.author.username}: ${message.content}`);
        messages = [];
        messages.push({ "role": "user", "content": option });
        // add the messages to the array
        history.forEach(message => {
            if (message.author.username == "LewBot 4.0") {
                messages.push({ "role": "assistant", "content": message.content });
            } else {
                messages.push({ "role": "user", "content": message.content });
            }
        });

        // get the pesonality from the file ../personality.txt
        let personality = fs.readFileSync(path.join(__dirname, '../personality.txt'), 'utf8');

        messages.push({ "role": "system", "content": personality });
        // reverse the array so that the most recent message is first
        messages.reverse();

        // remove any messages that are empty
        messages = messages.filter(message => message.content != "");

        console.log(messages);

        try{
            // make a post request to localhost:5000 with the body being the messages
            // wait longer than 3 seconds for a response
            const response = await fetch('http://localhost:5000/api', {
                method: 'POST',
                body: JSON.stringify(messages),
                headers: { 'Content-Type': 'application/json' }
            });

            const reply = await response.json();
	    console.log("--------");
	    console.log(reply);
	    console.log("--------");
            let response_to_user = `${interaction.options.getString('question')} - ${interaction.user}\n\n`;
            response_to_user += reply;

            await interaction.editReply(response_to_user);
            counter++;
        } catch (error) {
            console.error("OpenAI API error:", error);
            await interaction.editReply("There was an error while executing this command!");
        }

        if (counter >= 20) {
            console.log("You have reached the daily limit of 20 requests.");
            timeLockedAt = Date.now();
            locked = true;
        }
    },
};
