import config from '../config.json' assert { type: 'json' };

const steamAPI_lastPlayed = new URL(
	`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?format=json&key=${config.apiKey}`
);

// Get cumulated time from steam API
async function lastPlayed(id) {
	steamAPI_lastPlayed.searchParams.set('steamid', id);

	let lastPlayed_time = await fetch(steamAPI_lastPlayed)
		.then((res) => res.json())
		.then((json) =>
			json.response.games.reduce((accumulator, current) => {
				return Math.round((accumulator + current.playtime_2weeks)/60);
			}, 0)
		);
    
    let lastPlayed_gameName = await fetch(steamAPI_lastPlayed)
		.then((res) => res.json())
		.then((json) =>
			json.response.games.reduce((accumulator, current) => {
				return accumulator + current.name;
			}, 0)
		);
    
    let lastPlayed_gamesCount = await fetch(steamAPI_lastPlayed)
        .then((res) => res.json())
        .then((json) =>
            json.response.total_count
		);

	return {lastPlayed_time, lastPlayed_gamesCount, lastPlayed_gameName};
}

export { lastPlayed };