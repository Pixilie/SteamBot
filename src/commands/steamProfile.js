import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const steamAPI_steamProfile = new URL(
	`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.apiKey}&format=json`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('steamprofile')
	.setDescription('Informations on a Steam profile')
	.addStringOption((option) =>
		option
			.setName('steam-id')
			.setDescription('SteamID64 of the profile')
			.setRequired(true)
	);

// Get cumulated time from steam API
async function steamProfile(id) {
	steamAPI_steamProfile.searchParams.set('steamids', id);

	let player = await fetch(steamAPI_steamProfile)
		.then((res) => res.json())
		.then((json) => json.response.players[0]);

	const steamProfileEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`${player.personaname}'s Steam profile`)
		.setURL(player.profileurl)
		.setDescription(
			`Here are all the informations on ${player.personaname}'s profile`
		)
		.setThumbnail(player.avatarmedium)
		.addFields(
			{
				name: 'SteamID',
				value: player.steamid,
			},
			{
				name: 'Last online',
				value: `<t:${player.lastlogoff}:f>`,
			},
			{
				name: 'Creation date',
				value: `<t:${player.timecreated}:F>`,
			}
		);

	return steamProfileEmbed;
}

async function run(interaction) {
	const id = interaction.options.getString('steam-id');

	if (id.toString().length === 17) {
		await interaction.reply({
			embeds: [await steamProfile(id)],
		});
	} else {
		await interaction.reply(
			'Invalid SteamID please try again by verifying the SteamID you have indicated is valid'
		);
	}
}

export { run, COMMAND_DEFINITION };
