import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config.json' assert { type: 'json' };
import * as getTime from './commands/getTime.js';
import * as recentActivity from './commands/recentActivity.js';
import * as gamesOwned from './commands/gamesOwned.js';
import * as steamProfile from './commands/steamProfile.js';
import * as helpCommand from './commands/help.js';

// Authentifications of the bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('SteamBot is ready!');
	client.user.setActivity('your Steam stats', { type: 'WATCHING' });
});

// Slash commands registration
const commands = [
	getTime.COMMAND_DEFINITION,
	recentActivity.COMMAND_DEFINITION,
	gamesOwned.COMMAND_DEFINITION,
	steamProfile.COMMAND_DEFINITION,
	helpCommand.COMMAND_DEFINITION,
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.token);
rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
	body: commands,
})
	.then(() => console.log('Successfully registered commands!'))
	.catch(console.error);

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	switch (interaction.commandName) {
		case 'time':
			getTime.run(interaction);
			break;
		case 'recentactivity':
			recentActivity.run(interaction);
			break;
		case 'ownedgames':
			gamesOwned.run(interaction);
			break;
		case 'steamprofile':
			steamProfile.run(interaction);
			break;
		case 'help':
			helpCommand.run(interaction);
			break;
		default:
			break;
	}
});

// Login to Discord
client.login(config.token);
