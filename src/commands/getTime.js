import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

const steamAPI_timePlayed = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('time')
	.setDescription('Replies with the time you lost on Steam games')
	.addStringOption((option) =>
		option
			.setName('steam-id')
			.setDescription('Insert your SteamID')
			.setRequired(true)
	);

// Get cumulated time from steam API
async function getTime(id) {
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
	let id = interaction.options.getString('steam-id');

	if (id.toString().length === 17) {
		await interaction.reply(
			`Vous avez joué ${await getTime(id)} heures sur Steam`
		);
	} else {
		await interaction.reply('SteamID invalide');
	}
}

export { run, COMMAND_DEFINITION };
