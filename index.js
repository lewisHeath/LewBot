// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { token } = require('./config.json');

const fs = require('fs');
const path = require('path');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // set new item in the Collection with the key as the command name and the value as the exported module
    if('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`Command ${file} is not valid.`);
    }
}

// events
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()){
        // get the command
        const command = client.commands.get(interaction.commandName);
        // if not found just return
        if (!command) return;
        // try and execute
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } else if (interaction.isAutocomplete) {
        // get the command
        const command = client.commands.get(interaction.commandName);
        // if not found just return
        if (!command) return;
        // try and execute
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("ready", () => {
    client.user.setPresence({
        activities: [{ name: `you`, type: ActivityType.Watching }],
        status: 'dnd',
    });
});


// Log in to Discord with your client's token
client.login(token);