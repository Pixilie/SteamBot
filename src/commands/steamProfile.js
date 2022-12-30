import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getIDByNameOrID } from '../helpers.js';
import { isPrivate } from '../helpers.js';
import { Log } from '../helpers.js';
import { isLink } from '../helpers.js';

const steamAPI_steamProfile = new URL(
	`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.apiKey}&format=json`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('steamprofile')
	.setDescription('Informations on a Steam profile')
	.addStringOption((option) =>
		option
			.setName('pseudo-or-id64')
			.setDescription("User's Steam pseudo or user's SteamID64")
			.setRequired(false)
	);

/**
 * Get steam user's profile with the pseudonym or the SteamID of the user
 * @param {string} value Pseudonym or SteamID of the user
 */
async function steamProfile(value, interaction) {
	const { steamid, error } = await isLink(value, interaction);

	if (error) {
		return { error: error };
	} else {
		value = steamid;
	}

	steamAPI_steamProfile.searchParams.set(
		'steamids',
		await getIDByNameOrID(value)
	);

	let APIresponse = await fetch(steamAPI_steamProfile);
	let content = await APIresponse.json();

	if (content.response.players.length == 0) {
		return { error: `An error has occurred, ${value} is invalid` };
	}

	if ((await isPrivate(content.response)) === true) {
		return { error: `This profile is private` };
	}

	let player = content.response.players[0];
	let color = '';
	let ig = '';
	let states = '';

	if (player.personastate == 0) {
		color = '#000000';
		states = 'offline';
	} else if (player.personastate == 1) {
		color = '#27b900';
		states = 'online';
	} else if (player.personastate == 3) {
		color = '#fdc71c';
		states = 'away';
	}

	if (player.gameextrainfo) {
		ig = `Currently in game on ${player.gameextrainfo}`;
	} else {
		ig = `Currently ${states}`;
	}

	let steamProfileEmbed = new MessageEmbed()
		.setColor(color)
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
			},
			{
				name: 'Status',
				value: ig,
			}
		);

	return { profile: steamProfileEmbed };
}

async function run(interaction) {
	let value = interaction.options.getString('pseudo-or-id64');

	const { profile, error } = await steamProfile(value, interaction);

	if (error) {
		Log(
			`${interaction.user.tag} tried to execute /steamprofile with the following arguments "${value}" but an error has occurred: ${error}`,
			'info'
		);
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply({ embeds: [profile] });
	Log(
		`/steamprofile command executed by ${interaction.user.tag} with the following arguments "${value}"`,
		'info'
	);
}

export { run, COMMAND_DEFINITION };
