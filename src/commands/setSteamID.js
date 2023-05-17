import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { newUser } from '../database.js';
import { Logtail } from '@logtail/node';
import { LogLevel } from '@logtail/types';

// Logtail key
const logtail = new Logtail(process.env.LOGTAIL_KEY);

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('setsteamid')
	.setDescription('Associate your SteamID to your Discord ID')
	.addStringOption((option) =>
		option
			.setName('steamid64')
			.setDescription("User's SteamID64")
			.setRequired(true)
	);

/**
 * Associate your SteamID to your Discord ID
 * @param {string} steamid SteamID64
 * @param {object} interaction Interaction object
 * @returns {Promise<{discordid: string}|{error: string}>}
 */
async function setSteamID(steamid, interaction) {
	if (/^7656\d{13}$/u.test(steamid)) {
		const user = await newUser(steamid, interaction.user.id);
	} else {
		return { error: `The SteamID64 provided is invalid` };
	}

	return { discordid: interaction.user.id };
}

/**
 * Associate your SteamID to your Discord ID
 * @param {object} interaction Interaction object
 */
async function run(interaction) {
	const steamid = interaction.options.getString('steamid64');
	const { error, discordid } = await setSteamID(steamid, interaction);

	if (error) {
		logtail.error(`The SteamID64 \`${steamid}\` is invalid`, LogLevel.Error);
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply(
		`SteamID \`${steamid}\` successfully associated to <@${discordid}>`
	);
	logtail.info(
		`SteamID \`${steamid}\` successfully associated to <@${discordid}>`, LogLevel.Info
	);
}

export { run, COMMAND_DEFINITION };
