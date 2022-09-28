import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getIDByNameOrID } from '../helpers.js';

const steamAPI_recentActivity = new URL(
	`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?format=json&key=${config.apiKey}`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('recentactivity')
	.setDescription(
		'Number of games played, and time spent over the last few weeks'
	)
	.addStringOption((option) =>
		option
			.setName('arguments')
			.setDescription('Pseudonym or SteamID of the user')
			.setRequired(true)
	);

/**
 * Get recent activity of a user from steam API with the pseudonym or the SteamID of the user
 * @param {string} value Pseudonym or SteamID of the user
 */
async function recentActivity(value) {
	steamAPI_recentActivity.searchParams.set(
		'steamid',
		await getIDByNameOrID(value)
	);

	let apiResponse = await fetch(steamAPI_recentActivity);
	let content = await apiResponse.json();

	if (apiResponse.status !== 200) {
		return { error: `An error has occurred, ${value} is invalid` };
	}

	let games = content.response.games;

	let lastPlayed_time = games.reduce((accumulator, current) => {
		return accumulator + current.playtime_2weeks;
	}, 0);

	lastPlayed_time = Math.round(lastPlayed_time / 60);

	let lastPlayed_gameName = games.map((current) => current.name).join(', ');

	let lastPlayed_gamesCount = content.response.total_count;

	return {
		playedTime: lastPlayed_time,
		gamesCount: lastPlayed_gamesCount,
		gameName: lastPlayed_gameName,
	};
}

async function run(interaction) {
	let value = interaction.options.getString('arguments');

	const { playedTime, gamesCount, gameName, error } = await recentActivity(
		value
	);

	if (error) {
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply(
		`You have played ${playedTime} hours over the last 2 weeks on ${gamesCount} games, which are  ${gameName}`
	);
}

export { run, COMMAND_DEFINITION };
