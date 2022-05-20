// Requirements
import { Client, Intents } from 'discord.js';
import config from './config.json' assert { type: 'json' };
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';

//Variables
let url =
	'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=9D2CF1FA472E23059BB3D8657A5C85D3&steamid=76561198807619278&format=json';
let playTime = 0;

// Get time
async function GetTime(url) {
	await fetch(url)
		.then((res) => res.json())
		.then((json) => {
			for (let i = 0; i < json['response']['games'].length; i++) {
				playTime =
					playTime + json['response']['games'][i]['playtime_forever'];
			}
		});
	return console.log('2: ' + playTime);
}

// New client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Print ready when bot started
client.once('ready', () => {
	console.log('Ready!');
});

// Slash commands registration
const commands = [
	new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),
	new SlashCommandBuilder()
		.setName('time')
		.setDescription('Replies with the time you lost on Steam games'),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.token);
rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
	body: commands,
})
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// Login to Discord
client.login(config.token);
