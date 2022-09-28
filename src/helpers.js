import config from '../config.json' assert { type: 'json' };
import fetch from 'node-fetch';

const steamAPI_getNameByID = new URL(
	`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${config.apiKey}&format=json`
);

// TODO : Add a check to verify that getIDByName doesn't return 'null'

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

	/TODO : Error if can't convert/;
	return id.toString();
}
