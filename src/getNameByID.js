import config from '../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

const steamAPI_getNameByID = new URL(
	`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${config.apiKey}&format=json`
);

async function getNameByID(name) {
	steamAPI_getNameByID.searchParams.set('vanityurl', name);

	let steamID = await fetch(steamAPI_getNameByID)
		.then((res) => res.json())
		.then((json) => console.log(json.response.steamid));
	return getNameByID;
}

export { getNameByID };
