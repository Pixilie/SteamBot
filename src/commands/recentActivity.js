import fetch from 'node-fetch';
import { Logtail } from '@logtail/node';
import { LogLevel } from '@logtail/types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getIDByNameOrID } from '../helpers.js';
import { isPrivate } from '../helpers.js';
import { steamProfileName } from '../helpers.js';
import { isLink } from '../helpers.js';

// Logtail key
const logtail = new Logtail(process.env.LOGTAIL_KEY);

const steamAPI_recentActivity = new URL(
	`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?format=json&key=${process.env.API_KEY}`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('recentactivity')
	.setDescription(
		'Number of games played, and time spent over the last few weeks'
	)
	.addStringOption((option) =>
		option
			.setName('pseudo-or-id64')
			.setDescription("User's Steam pseudo or user's SteamID64")
			.setRequired(false)
	);

/**
 * Get recent activity of a user from steam API with the pseudonym or the SteamID of the user
 * @param {string} value Pseudonym or SteamID of the user
 */
async function recentActivity(value, interaction) {
	const { steamid, error } = await isLink(value, interaction);

	if (error) {
		return { error: error };
	} else {
		value = steamid;
	}

	steamAPI_recentActivity.searchParams.set(
		'steamid',
		await getIDByNameOrID(value)
	);

	let apiResponse = await fetch(steamAPI_recentActivity);
	let pseudo = await steamProfileName(value);

	if (apiResponse.status !== 200) {
		return { error: `An error has occurred, ${value} is invalid` };
	}

	let content = await apiResponse.json();

	if ((await isPrivate(content.response)) === true) {
		return { error: `This profile is private` };
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
		pseudo: pseudo,
	};
}

async function run(interaction) {
	let value = interaction.options.getString('pseudo-or-id64');

	const { playedTime, gamesCount, gameName, error, pseudo } =
		await recentActivity(value, interaction);

	if (error) {
		logtail.error(
			`${interaction.user.tag} tried to execute /recentactivity with the following arguments "${value}" but an error has occurred: ${error}`, LogLevel.Error
		);
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply(
		`<@${interaction.user.id}>, ${pseudo} have played ${playedTime} hours over the last 2 weeks on ${gamesCount} games, which are ${gameName}`
	);
	logtail.info(
		`/recentactivity command executed by ${interaction.user.tag} with the following arguments "${value}"`, LogLevel.Info
	);
}

export { run, COMMAND_DEFINITION };
