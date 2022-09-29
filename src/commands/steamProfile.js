import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getIDByNameOrID } from '../helpers.js';
import { isPrivate } from '../helpers.js';

const steamAPI_steamProfile = new URL(
	`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.apiKey}&format=json`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('steamprofile')
	.setDescription('Informations on a Steam profile')
	.addStringOption((option) =>
		option
			.setName('arguments')
			.setDescription('Pseudonym or SteamID of the user')
			.setRequired(true)
	);

/**
 * Get steam user's profile with the pseudonym or the SteamID of the user
 * @param {string} value Pseudonym or SteamID of the user
 */
async function steamProfile(value) {
	steamAPI_steamProfile.searchParams.set(
		'steamids',
		await getIDByNameOrID(value)
	);

	console.log('Steam profile command executed');

	let APIresponse = await fetch(steamAPI_steamProfile);

	if (APIresponse.status !== 200) {
		return { error: `An error has occurred, ${value} is invalid` };
	}

	let content = await APIresponse.json();

	if ((await isPrivate(content.response)) === true) {
		return { error: `This profile is private` };
	}

	let player = content.response.players[0];

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

	return { profile: steamProfileEmbed };
}

async function run(interaction) {
	let value = interaction.options.getString('arguments');

	const { profile, error } = await steamProfile(value);

	if (error) {
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply({ embeds: [profile] });
}

export { run, COMMAND_DEFINITION };
