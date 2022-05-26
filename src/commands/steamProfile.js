import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const steamAPI_steamProfile = new URL(
	`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.apiKey}&format=json`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('steamprofile')
	.setDescription('Replies with informations of your Steam profile')
	.addStringOption((option) =>
		option
			.setName('steam-id')
			.setDescription('Insert your SteamID64')
			.setRequired(true)
	);

// Get cumulated time from steam API
async function steamProfile(id) {
	steamAPI_steamProfile.searchParams.set('steamid', id);

	let player = await fetch(steamAPI_steamProfile)
		.then((res) => res.json())
		.then((json) => json.response.player);

	const steamProfileEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`Profile Steam de ${player.name}`)
		.setURL(player.profileurl)
		.setAuthor({
			name: 'Some name',
			iconURL: 'https://i.imgur.com/AfFp7pu.png',
			url: 'https://discord.js.org',
		})
		.setDescription(
			`Voici toutes les informations du profile Steam de ${player.name}`
		)
		.setThumbnail(player.avatar)
		.addFields(
			{ name: 'Regular field title', value: 'Some value here' },
			{ name: '\u200B', value: '\u200B' },
			{
				name: 'Inline field title',
				value: 'Some value here',
				inline: true,
			},
			{
				name: 'Inline field title',
				value: 'Some value here',
				inline: true,
			}
		)
		.addField('Inline field title', 'Some value here', true)
		.setImage('https://i.imgur.com/AfFp7pu.png');

	return steamProfileEmbed;
}

async function run(interaction) {
	const ID = interaction.options.getString('steam-id');
	if (ID.toString().length === 17) {
		await interaction.reply({
			embeds: [steamProfile.steamProfile(ID)],
		});
	} else {
		await interaction.reply('SteamID invalide');
	}
}

export { run, COMMAND_DEFINITION };
