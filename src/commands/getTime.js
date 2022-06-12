import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import * as helpers from '../helpers.js';

const steamAPI_timePlayed = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('time')
	.setDescription('Get cumulated time on Steam games')
	.addStringOption((option) =>
		option
			.setName('name')
			.setDescription('Pseudonyme of the user')
			.setRequired(true)
	);

// Get cumulated time from steam API with the pseudonym
async function getTimeName(name) {
	const id = await helpers.getIDByName(name);
	// TODO: handle if no steamid
	steamAPI_timePlayed.searchParams.set('steamid', id);

	let playTime = await fetch(steamAPI_timePlayed)
		.then((res) => {
			if (res.status == 500) {
				// TODO: handle properly
				return;
			}

			return res.json();
		})
		.then((json) =>
			json.response.games.reduce(
				(accumulator, current) =>
					accumulator + current.playtime_forever,
				0
			)
		);

	return Math.round(playTime / 60);
}

// Get cumulated time from steam API with the ID
// TODO: set up the command with this function | save the original one before changing it
async function getTimeID(id) {
	steamAPI_timePlayed.searchParams.set('steamid', id);

	let playTime = await fetch(steamAPI_timePlayed)
		.then((res) => res.json())
		.then((json) => json.response.games.reduce((accumulator, current)=> accumulator + current.playtime_forever, 0));

	return Math.round(playTime / 60);
}

async function run(interaction) {
	let name = interaction.options.getString('name');

	await interaction.reply(
		`You have played ${await getTime(name)} hours on Steam`
	);
}

export { run, COMMAND_DEFINITION };














// Get cumulated time from steam API with the pseudonym or the ID
async function getTime(params) {

	if (params.isInteger() == true & params.ToString().length == 17 ) {
		const id = await helpers.getIDByName(name);
		// TODO: handle if no steamid
		steamAPI_timePlayed.searchParams.set('steamid', id);

		let playTime = await fetch(steamAPI_timePlayed)
			.then((res) => {
				if (res.status == 500) {
					// TODO: handle properly
					return;
				}

				return res.json();
			})
			.then((json) =>
				json.response.games.reduce(
					(accumulator, current) =>
						accumulator + current.playtime_forever,
					0
				)
			);

		return Math.round(playTime / 60);

	} else if (typeof params == 'string') {
		steamAPI_timePlayed.searchParams.set('steamid', id);

		let playTime = await fetch(steamAPI_timePlayed)
			.then((res) => res.json())
			.then((json) => json.response.games.reduce((accumulator, current)=> accumulator + current.playtime_forever, 0));

		return Math.round(playTime / 60);
	}
}
