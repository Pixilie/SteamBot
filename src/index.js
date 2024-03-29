import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import * as getTime from './commands/getTime.js';
import * as recentActivity from './commands/recentActivity.js';
import * as gamesOwned from './commands/gamesOwned.js';
import * as steamProfile from './commands/steamProfile.js';
import * as helpCommand from './commands/help.js';
import * as setSteamID from './commands/setSteamID.js';
import { Logtail } from '@logtail/node';
import { LogLevel } from '@logtail/types';

// Logtail key
const logtail = new Logtail(process.env.LOGTAIL_KEY);

// Authentifications of the bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	client.user.setActivity('your Steam stats', { type: 'WATCHING' });
});

// Slash commands registration
const commands = [
	getTime.COMMAND_DEFINITION,
	recentActivity.COMMAND_DEFINITION,
	gamesOwned.COMMAND_DEFINITION,
	steamProfile.COMMAND_DEFINITION,
	helpCommand.COMMAND_DEFINITION,
	setSteamID.COMMAND_DEFINITION,
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
	body: commands,
})
	.then(() => console.log("Successfully registered application's commands"))
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
		case 'setsteamid':
			setSteamID.run(interaction);
		default:
			break;
	}
});

// Login to Discord
client.login(process.env.TOKEN);
logtail.info('Successfully logged in. \n SteamBot is ready!', LogLevel.Info);
