import config from '../config.json' assert { type: 'json' };

const steamAPI_timePlayed = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

// Get cumulated time from steam API
async function getTime(id) {
	steamAPI_timePlayed.searchParams.set('steamid', id);

	let playTime = await fetch(steamAPI_timePlayed)
		.then((res) => res.json())
		.then((json) =>
			json.response.games.reduce((accumulator, current) => {
				return accumulator + current.playtime_forever;
			}, 0)
		);
	return Math.round(playTime / 60);
}

export { getTime };