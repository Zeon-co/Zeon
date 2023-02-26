const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
  conf: {
    enabled: true,
    guildOnly: false,
    aliases: ["pong"],
    permLevel: "User"
  },
  help: {
    name: "ping",
    category: "Misc",
    description: "Pong!",
    usage: "ping"
  }
};