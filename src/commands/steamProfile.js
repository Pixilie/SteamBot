import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

function convertTime(timestamp) {
	let date = new Date(timestamp * 1000);
	let hours = date.getHours();
	let minutes = date.getMinutes().toString();
	let seconds = date.getSeconds().toString();

	return hours + ':' + minutes + ':' + seconds;
}

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
	steamAPI_steamProfile.searchParams.set('steamids', id);

	let player = await fetch(steamAPI_steamProfile)
		.then((res) => res.json())
		.then((json) => json.response.players[0]);

	const steamProfileEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`Profile Steam de ${player.personaname}`)
		.setURL(player.profileurl)
		.setDescription(
			`Voici toutes les informations du profile Steam de ${player.personaname}`
		)
		.setThumbnail(player.avatarmedium)
		.addFields(
			{
				name: 'SteamID',
				value: player.steamid,
			},
			{
				name: 'Dernière connexion',
				value: `<t:${player.lastlogoff}:f>`,
			},
			{
				name: 'Date de création du compte',
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
		await interaction.reply('SteamID invalide');
	}
}

export { run, COMMAND_DEFINITION };
