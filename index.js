import { Client, Intents } from 'discord.js';
import config from './config.json' assert { type: 'json' };
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';

// Get cumulated time from steam API
async function getTime(url) {
	let playTime = await fetch(url)
		.then((res) => res.json())
		.then((json) =>
			json.response.games.reduce((accumulator, current) => {
				return accumulator + current.playtime_forever;
			}, 0)
		);
	return Math.round(playTime / 60);
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

// Slash commands registration
const commands = [
	new SlashCommandBuilder()
		.setName('time')
		.setDescription('Replies with the time you lost on Steam games')
		.addStringOption((option) =>
			option
				.setName('steam-id')
				.setDescription('The input to echo back')
				.setRequired(true)
		),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.token);
rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
	body: commands,
})
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// Playtime command
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'time') {
		const ID = interaction.options.getString('steam-id');
		if (ID.toString().length === 17) {
			await interaction.reply(
				`Vous avez passé ${await getTime(
					`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=9D2CF1FA472E23059BB3D8657A5C85D3&steamid=${ID}&format=json`
				)} heures`
			);
		} else {
			await interaction.reply('SteamID invalide');
		}
	}
});

// Login to Discord
client.login(config.token);
