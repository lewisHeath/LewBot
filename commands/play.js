const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
const { colours } = require('../colours.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song!')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song you want to play')
                .setRequired(true)),
    async execute(interaction, client) {
        // check if the user is in a voice channel
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        // search for the song
        const query = interaction.options.getString('song');
        const searchResult = await client.player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {});

        // if no songs were found
        if (!searchResult || !searchResult.tracks.length) return interaction.reply({ content: 'No results were found!', ephemeral: true });
        
        // make the queue
        const queue = await client.player.createQueue(interaction.guild);
        
        // join the voice channel only if not already in it
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            client.player.deleteQueue(interaction.guildId);
            return interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
        }
        // if the first song is a playlist
        if (searchResult.playlist) {
            // add the whole playlist to the queue
            queue.addTracks(searchResult.tracks);
            // if there is no queue yet, then play the song
            if (!queue.playing) {
                queue.play();
            }
            // if the first song is not a playlist
        } else {
            // add the song to the queue
            queue.addTrack(searchResult.tracks[0]);
            console.log(queue.tracks)
            // if there is no queue yet, then play the song
            if (!queue.playing) {
                queue.play();
            }
        }
        
        // get random colour
        const randomColour = colours[Math.floor(Math.random() * colours.length)];
        
        const embed = new EmbedBuilder()
        .setColor(randomColour)
        .setTitle(searchResult.tracks[0].title)
            .setURL(searchResult.tracks[0].url)
            .setThumbnail(searchResult.tracks[0].thumbnail)
            .addFields(
                { name: 'Duration', value: searchResult.tracks[0].duration, inline: true },
                { name: 'Requested by', value: searchResult.tracks[0].requestedBy.username, inline: true }
            )
            .setTimestamp();
        
        interaction.reply({ embeds: [embed] });
    },
};