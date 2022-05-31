import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Display the list of available commands');

const helpCommand = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`List of available commands`)
	.setDescription(`Here is the list of available commands`)
	.setThumbnail(
		'https://images.frandroid.com/wp-content/uploads/2019/03/steam_logo.jpg'
	)
	.addFields(
		{
			name: '/time `steam-id`',
			value: 'DIsplay the cumulated time of a Steam user',
		},
		{
			name: '/ownedgames `steam-id`',
			value: `Display the number of games owned by a Steam user`,
		},
		{
			name: '/steamprofile `steam-id`',
			value: `Display informations on a Steam user`,
		},
		{
			name: '/recentactivity `steam-id`',
			value: `Display the last activity of a Steam user`,
		}
	);

async function run(interaction) {
	await interaction.reply({
		embeds: [helpCommand],
	});
}
export { run, COMMAND_DEFINITION };