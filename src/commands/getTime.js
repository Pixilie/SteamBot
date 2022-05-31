import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import * as getNameByID from '../getNameByID.js';

const steamAPI_timePlayed = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('time')
	.setDescription('Get cumulated time from Steam')
	.addStringOption((option) =>
		option
			.setName('name')
			.setDescription('SteamID64 of the user')
			.setRequired(true)
	);

// Get cumulated time from steam API
async function getTime(name) {
	const id = await getNameByID.getNameByID(name);
	steamAPI_timePlayed.searchParams.set('steamid', id);

	let playTime = await fetch(steamAPI_timePlayed)
		.then((res) => res.json())
		.then((json) =>
			json.response.games.reduce((accumulator, current) => {
				return accumulator + current.playtime_forever;
			}, 0)
		);

	return Math.round(playTime / 60);
}

async function run(interaction) {
	let name = interaction.options.getString('name');

	await interaction.reply(
		`You have played ${await getTime(name)} hours on Steam`
	);
}

export { run, COMMAND_DEFINITION };
