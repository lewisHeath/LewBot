const { SlashCommandBuilder } = require('discord.js');

const colours = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('colours')
        .setDescription('React to change colour!'),
    async execute(interaction, client) {
        const message = await interaction.reply({
            content: `React to change colour!`,
            fetchReply: true
        });

        reactions = client.emojis.cache.filter(emoji => colours.includes(emoji.name.toLowerCase()));
        // for (const reaction of reactions.values()) {
        //     await message.react(reaction);
        // }

        const filter = (reaction, user) => {
            return colours.includes(reaction.emoji.name.toLowerCase());
        }

        // react to the message with the colours
        for (const reaction of reactions.values()) {
            await message.react(reaction);
        }

        // collector without a time limit
        const collector = message.createReactionCollector({ filter, time: 0 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            // here i will change their role to the one of the colour
            const member = message.guild.members.cache.get(user.id);
            // remove all other colour roles
            for (const colour of colours) {
                const otherRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === colour);
                member.roles.remove(otherRole);
            }
            // wait for the role to be removed
            setTimeout(() => {}, 1000);
            // add role of the colour
            const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === reaction.emoji.name.toLowerCase());
            member.roles.add(role);
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });
    },
};