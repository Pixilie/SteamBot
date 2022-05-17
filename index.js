// Requirements
import { Client, Intents } from 'discord.js';
import config from './config.json' assert { type: "json" };
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder  } from '@discordjs/builders';
  
// New client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Print ready when bot started
client.once('ready', () => {
	console.log('Ready!');
});

// Slash commands registration
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('time').setDescription('Replies with the time you lost on Steam games'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.token);
rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// Login to Discord
client.login(config.token);