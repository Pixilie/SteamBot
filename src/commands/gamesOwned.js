import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

const steamAPI_gamesOwned = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('ownedgames')
	.setDescription('Replies with the number of games you own')
	.addStringOption((option) =>
		option
			.setName('steam-id')
			.setDescription('Insert your SteamID64')
			.setRequired(true)
	);

// Get cumulated time from steam API
async function gamesOwned(id) {
	steamAPI_gamesOwned.searchParams.set('steamid', id);

	let gamesOwned = await fetch(steamAPI_gamesOwned)
		.then((res) => res.json())
		.then((json) => json.response.game_count);

	return gamesOwned;
}

async function run(interaction) {
	const ID = interaction.options.getString('steam-id');
	if (ID.toString().length === 17) {
		await interaction.reply(`Vous avez ${await gamesOwned(ID)} jeux.`);
	} else {
		await interaction.reply('SteamID invalide');
	}
}

export { run, COMMAND_DEFINITION };