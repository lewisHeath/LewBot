// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { token } = require('./config.json');

const fs = require('fs');
const path = require('path');
const { Player } = require("discord-player");
const { error } = require('console');

// const manifest = require('./Destiny/manifest.js');

// Create a new client instance
const { Guilds, GuildMessages, GuildMessageReactions, GuildVoiceStates } = GatewayIntentBits;
const client = new Client({ intents: [
    Guilds, GuildMessages, GuildMessageReactions, GuildVoiceStates
]});

client.commands = new Collection();
client.buttons = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

client.player.on('connectionCreate', (queue) => {
    queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, 'networking');
        const newNetworking = Reflect.get(newState, 'networking');

        const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
            const newUdp = Reflect.get(newNetworkState, 'udp');
            clearInterval(newUdp?.keepAliveInterval);
        }

        oldNetworking?.off('stateChange', networkStateChangeHandler);
        newNetworking?.on('stateChange', networkStateChangeHandler);
    });
});

// commands
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

// buttons
const buttonsPath = path.join(__dirname, 'buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    const button = require(filePath);
    // update the map
    client.buttons.set(button.data.name, button);
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
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } else if (interaction.isAutocomplete()) {
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
    } else if (interaction.isButton()) {
        // find the command this button belongs to
        const button = client.buttons.get(interaction.customId);
        // if not found 
        if(!button) {
            console.error("no button found")
        }
        try {
            await button.execute(interaction);
        } catch(error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
        }
    }
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    // output lewbot to the screen

    console.log(`===============================================`);
    console.log(`
    __    _______       ______  ____  ______
   / /   / ____/ |     / / __ )/ __ \/_  __/
  / /   / __/  | | /| / / __  / / / / / /
 / /___/ /___  | |/ |/ / /_/ / /_/ / / /
/_____/_____/  |__/|__/_____/\____/ /_/

`);
    console.log(`===============================================`);
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("ready", () => {
    const statuses = [
        { name: "you ;)", type: ActivityType.Watching },
    ];

    client.user.setPresence({
        activities: [{ name: `a game`, type: ActivityType.Playing }],
        status: 'dnd',
    });

    setStatusFromTextFile();
    setInterval(() => {
        // var randomStatus = statuses[Math.floor(Math.random()*statuses.length)];
        // client.user.setActivity(randomStatus.name, {type: randomStatus.type})
        setStatusFromTextFile();
    }, 1000 * 10 * 60);
});

function setStatusFromTextFile() {
    // const file = '/root/DiscordBot/LewBot/statuses.txt';
    const file = 'statuses.txt';
    fs.readFile(file, 'utf8', (err, data) => {
        if (err){
            console.log(error);
            return;
        }
        //split into lines
        const lines = data.split('\n');
        // get a random line from the file
        const randomLine = lines[Math.floor(Math.random() * lines.length)].trim();
        console.log(`line chosen: ${randomLine}`);
        client.user.setActivity({
            type: ActivityType.Custom,
            name: 'customstatus',
            state: randomLine
        });
    });
}

// Log in to Discord with your client's token
client.login(token);
