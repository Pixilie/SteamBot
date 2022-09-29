import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getIDByNameOrID } from '../helpers.js';

const steamAPI_gamesOwned = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('ownedgames')
	.setDescription('Number of games owned by a Steam user')
	.addStringOption((option) =>
		option
			.setName('arguments')
			.setDescription('Pseudonym or SteamID of the user')
			.setRequired(true)
	);

/**
 * Get number of games you own from steam API with the pseudonym or the SteamID of the user
 * @param {string} value Pseudonym or SteamID of the user
 */
async function gamesOwned(value) {
	steamAPI_gamesOwned.searchParams.set(
		'steamid',
		await getIDByNameOrID(value)
	);

	console.log('Games owned command executed');

	let apiResponse = await fetch(steamAPI_gamesOwned);

	if (apiResponse.status !== 200) {
		return { error: `An error has occurred, ${value} is invalid` };
	}

	let content = await apiResponse.json();
	let gamesOwned = content.response.game_count;

	return { games: gamesOwned };
}

async function run(interaction) {
	let value = interaction.options.getString('arguments');

	const { games, error } = await gamesOwned(value);

	if (error) {
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply(`You own ${games} games on Steam`);
}

export { run, COMMAND_DEFINITION };
