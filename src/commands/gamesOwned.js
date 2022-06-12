import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

const steamAPI_gamesOwned = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('ownedgames')
	.setDescription('Number of games owned by a Steam user')
	.addStringOption((option) =>
		option
			.setName('steam-id')
			.setDescription('SteamID64 of the user')
			.setRequired(true)
	);

// Get cumulated time from steam API
async function gamesOwned(id) {
	steamAPI_gamesOwned.searchParams.set('steamid', id);

	let content = await fetch(steamAPI_gamesOwned).then((res) => res.json());

	let gamesOwned = content.response.game_count;

	return gamesOwned;
}

async function run(interaction) {
	const id = interaction.options.getString('steam-id');
	if (id.toString().length === 17) {
		await interaction.reply(`You own ${await gamesOwned(id)} games.`);
	} else {
		await interaction.reply(
			'Invalid SteamID please try again by verifying the SteamID you have indicated is valid'
		);
	}
}

export { run, COMMAND_DEFINITION };
