import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import config from './config.json' assert { type: 'json' };
import * as getTime from './functions/getTime.js';
import * as lastPlayed from './functions/lastPlayed.js';

//Authentifications of the bot
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
				.setDescription('Insert your SteamID')
				.setRequired(true)
		),

	new SlashCommandBuilder()
		.setName('lastplayed')
		.setDescription('Replies with the last Steam games you played')
		.addStringOption((option) =>
			option
				.setName('steam-id')
				.setDescription('Insert your SteamID64')
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
				`Vous avez passé ${await getTime.getTime(ID)} heures.`
			);
		} else {
			await interaction.reply('SteamID invalide');
		}
	}
});



//Last games played command
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'lastplayed') {
		const ID = interaction.options.getString('steam-id');
		if (ID.toString().length === 17) {
			await interaction.reply(
				`Vous avez passé ${await lastPlayed.lastPlayed(ID).lastPlayed_time} heures les 2 dernières semaines.`
			);
		} else {
			await interaction.reply('SteamID invalide');
		}
	}
});



// Login to Discord
client.login(config.token);
