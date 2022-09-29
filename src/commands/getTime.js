import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getIDByNameOrID } from '../helpers.js';

const steamAPI_timePlayed = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('time')
	.setDescription('Get cumulated time on Steam games')
	.addStringOption((option) =>
		option
			.setName('arguments')
			.setDescription('Pseudonym or SteamID of the user')
			.setRequired(true)
	);

/**
 * Get cumulated time from steam API with the pseudonym or the SteamID of the user
 * @param {string} value Pseudonym or SteamID of the user
 */
async function getTime(value) {
	steamAPI_timePlayed.searchParams.set(
		'steamid',
		await getIDByNameOrID(value)
	);

	console.log('Get time command executed');

	let APIresponse = await fetch(steamAPI_timePlayed);

	if (APIresponse.status !== 200) {
		return { error: `An error has occurred, ${value} is invalid` };
	}

	let content = await APIresponse.json();

	let playTime = content?.response.games.reduce(
		(accumulator, current) => accumulator + current.playtime_forever,
		0
	);

	return { time: Math.round(playTime / 60) };
}

async function run(interaction) {
	let value = interaction.options.getString('arguments');

	const { time, error } = await getTime(value);

	if (error) {
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply(`You have played ${time} hours on Steam`);
}

export { run, COMMAND_DEFINITION };
