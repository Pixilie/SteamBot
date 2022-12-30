import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getIDByNameOrID } from '../helpers.js';
import { isPrivate } from '../helpers.js';
import { Log } from '../helpers.js';
import { steamProfileName } from '../helpers.js';
import { isLink } from '../helpers.js';

const steamAPI_timePlayed = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('time')
	.setDescription('Get cumulated time on Steam games')
	.addStringOption((option) =>
		option
			.setName('pseudo-or-id64')
			.setDescription("User's Steam pseudo or user's SteamID64")
			.setRequired(false)
	);

/**
 * Get cumulated time from steam API with the pseudonym or the SteamID of the user
 * @param {string} value Pseudonym or SteamID of the user
 */
async function getTime(value, interaction) {
	const { steamid, error } = await isLink(value, interaction);

	if (error) {
		return { error: error };
	} else {
		value = steamid;
	}

	steamAPI_timePlayed.searchParams.set(
		'steamid',
		await getIDByNameOrID(value)
	);

	let APIresponse = await fetch(steamAPI_timePlayed);
	let pseudo = await steamProfileName(value);

	if (APIresponse.status !== 200) {
		return { error: `An error has occurred, ${value} is invalid` };
	}

	let content = await APIresponse.json();

	if ((await isPrivate(content.response)) === true) {
		return { error: `This profile is private` };
	}

	let playTime = content?.response.games.reduce(
		(accumulator, current) => accumulator + current.playtime_forever,
		0
	);

	return { time: Math.round(playTime / 60), pseudo: pseudo };
}

async function run(interaction) {
	let value = interaction.options.getString('pseudo-or-id64');

	const { time, error, pseudo } = await getTime(value, interaction);

	if (error) {
		Log(
			`${interaction.userMention(
				interaction.user.id
			)} tried to execute /time with the following arguments "${value}" but an error has occurred: ${error}`,
			'info'
		);
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply(
		`<@${interaction.user.id}>, ${pseudo} have played ${time} hours on Steam`
	);
	Log(
		`/time command executed by ${interaction.user.tag} with the following arguments "${value}"`,
		'info'
	);
}

export { run, COMMAND_DEFINITION };
