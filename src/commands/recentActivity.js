import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

const steamAPI_recentActivity = new URL(
	`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?format=json&key=${config.apiKey}`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('recentactivity')
	.setDescription(
		'Nombre de jeux joués, et le temps passé sur les dernières semaines'
	)
	.addStringOption((option) =>
		option
			.setName('steam-id')
			.setDescription('Insérer votre SteamID64')
			.setRequired(true)
	);

// Get cumulated time from steam API
async function recentActivity(id) {
	steamAPI_recentActivity.searchParams.set('steamid', id);

	let response = await fetch(steamAPI_recentActivity)
		.then((res) => res.json())
		.then((json) => json.response);

	let lastPlayed_time = response.games.reduce((accumulator, current) => {
		return accumulator + current.playtime_2weeks;
	}, 0);
	lastPlayed_time = Math.round(lastPlayed_time / 60);

	let lastPlayed_gameName = response.games
		.map((current) => current.name)
		.join(', ');

	let lastPlayed_gamesCount = response.total_count;

	return { lastPlayed_time, lastPlayed_gamesCount, lastPlayed_gameName };
}

async function run(interaction) {
	let id = interaction.options.getString('steam-id');
	let values = await recentActivity(id);
	if (id.toString().length === 17) {
		await interaction.reply(
			`Vous avez passé ${values.lastPlayed_time} heures les 2 dernières semaines sur un total de ${values.lastPlayed_gamesCount} jeux, qui sont : ${values.lastPlayed_gameName}`
		);
	} else {
		await interaction.reply(
			'SteamID invalide, veuillez réessayer en vérifiant bien la SteamID que vous avez indiqué est valide'
		);
	}
}

export { run, COMMAND_DEFINITION };
