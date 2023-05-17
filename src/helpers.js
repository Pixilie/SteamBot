import fetch from 'node-fetch';
import { Logtail } from '@logtail/node';
import { LogLevel } from '@logtail/types';
import { getUser } from './database.js';

// Logtail key
const logtail = new Logtail(process.env.LOGTAIL_KEY);

const steamAPI_getNameByID = new URL(
	`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.API_KEY}&format=json`
);

const steamAPI_steamProfile = new URL(
	`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.API_KEY}&format=json`
);

/**
 * Get the name of a Steam user by his SteamID64
 * @param {string} name
 * @returns {Promise<string>}
 */
export async function getIDByName(name) {
	steamAPI_getNameByID.searchParams.set('vanityurl', name);

	let response = await fetch(steamAPI_getNameByID)
		.then((res) => res.json())
		.then((json) => json.response);

	return response.steamid ?? null;
}

/**
 * If the value is a valid Steam ID, return it.
 * Otherwise, try to get the ID by name.
 * @param {string} value
 * @returns {Promise<string|null>}
 */
export async function getIDByNameOrID(value) {
	// If the value is a valid Steam ID, return it
	if (/^7656\d{13}$/u.test(value)) {
		return value;
	}

	// Otherwise, try to get the ID by name
	const id = await getIDByName(value);

	if (id === null) {
		return { error: `No SteamID found for ${value}` };
	} else {
		return id.toString();
	}
}

/**
 * Check if the profile is private
 * @param {string} name
 * @returns {Promise<string>}
 */
export async function isPrivate(value) {
	let answer = Object.keys(value);
	if (answer.length == 0) {
		return true;
	} else {
		return false;
	}
}

/**
 * Get Steam pseudo
 * @param {string} steamid
 * @returns {Promise<string>}
 */
export async function steamProfileName(steamid) {
	steamAPI_steamProfile.searchParams.set(
		'steamids',
		await getIDByNameOrID(steamid)
	);

	let APIresponse = await fetch(steamAPI_steamProfile);
	let content = await APIresponse.json();

	return content.response.players[0].personaname;
}

export async function isLink(value, interaction) {
	if (!value) {
		return { steamid: await getUser(interaction.user.id), error: null };
	}

	if (value == null) {
		return {
			steamid: null,
			error: `You need to link your discord account to your SteamID64. You can to it with the command /setsteamid`,
		};
	} else {
		return { steamid: value, error: null };
	}
}
