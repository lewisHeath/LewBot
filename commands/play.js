const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
const { colours } = require('../colours.js');
const getAverageColor = require('../getColourFromImage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song!')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song you want to play')
                .setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();
        // check if the user is in a voice channel
        if (!interaction.member.voice.channel) return interaction.editReply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        // search for the song
        const query = interaction.options.getString('song');
        const searchResult = await client.player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {});

        // if no songs were found
        if (!searchResult || !searchResult.tracks.length) return interaction.editReply({ content: 'No results were found!', ephemeral: true });
        
        // make the queue
        let queue = await client.player.getQueue(interaction.guildId);
        // if there is no queue, then make one
        if (!queue) {
            console.log('making queue')
            queue = await client.player.createQueue(interaction.guild, {
                metadata: interaction.channel
            });
        }
        
        // join the voice channel only if not already in it
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            client.player.deleteQueue(interaction.guildId);
            return interaction.editReply({ content: 'Could not join your voice channel!', ephemeral: true });
        }
        
        // add the song to the queue (TWICE - because of unknown bug where it skips 2)
        await queue.addTrack(searchResult.tracks[0]);
        await queue.addTrack(searchResult.tracks[0]);
        const playing = queue.playing;
        console.log(queue.tracks)
        console.log(playing)
        if(playing == false) {
            console.log('playing')
            await queue.play();
        }
        
        // get random colour
        const randomColour = colours[Math.floor(Math.random() * colours.length)];
        console.log(randomColour);
        let colour;
        try{
            colour = await getAverageColor(searchResult.tracks[0].thumbnail);
            console.log(colour);
        } catch (error) {
            console.log(error);
            colour = randomColour;
        }
        
        const embed = new EmbedBuilder()
        .setColor(colour)
        .setTitle(searchResult.tracks[0].title)
            .setURL(searchResult.tracks[0].url)
            .setThumbnail(searchResult.tracks[0].thumbnail)
            .addFields(
                { name: 'Duration', value: searchResult.tracks[0].duration, inline: true },
                { name: 'Requested by', value: searchResult.tracks[0].requestedBy.username, inline: true }
            )
            .setTimestamp();
        
        interaction.editReply({ embeds: [embed] });
    },
};
