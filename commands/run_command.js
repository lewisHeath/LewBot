const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('run_command')
        .setDescription('Plz dont destroy the server ;)')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The command to run')
                .setRequired(true)),

    async execute(interaction, client) {
        await interaction.deferReply({
            //this is the important part
            ephemeral: false,
        });
        // get the message
        let command = interaction.options.getString('command');
        console.log(command);
        response = await execute_command(command);
        await interaction.editReply(`${command}\n\n${response}`);
    },
};

async function execute_command(command) {
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log('Command output:', stdout);
    console.error('Command errors:', stderr);
    return stdout;
  } catch (error) {
    console.error(`Error executing command: ${error}`);
    return error;
  }
}
