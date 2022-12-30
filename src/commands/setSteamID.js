import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Log } from '../helpers.js';
import { newUser } from '../database.js';

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('setsteamid')
	.setDescription('Associate your SteamID to your Discord ID')
	.addStringOption((option) =>
		option
			.setName('steamid64')
			.setDescription("User's SteamID64")
			.setRequired(true)
	);

async function setSteamID(steamid, interaction) {
	if (/^7656\d{13}$/u.test(steamid)) {
		const user = await newUser(steamid, interaction.user.id);
	} else {
		return { error: `The SteamID64 provided is invalid` };
	}

	return { discordid: interaction.user.id };
}

async function run(interaction) {
	const steamid = interaction.options.getString('steamid64');
	const { error, discordid } = await setSteamID(steamid, interaction);

	if (error) {
		Log(`The SteamID64 \`${steamid}\` is invalid`, 'error');
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply(
		`SteamID \`${steamid}\` successfully associated to <@${discordid}>`
	);
	Log(
		`SteamID \`${steamid}\` successfully associated to <@${discordid}>`,
		'info'
	);
}

export { run, COMMAND_DEFINITION };
