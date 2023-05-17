import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Creates a new user in the database
 * @param {string} steamid SteamID of the user
 * @param {string} discordid DiscordID of the user
 */
async function newUser(steamid, discordid) {
	const user = await prisma.user.create({
		data: {
			steamid: steamid,
			discordid: discordid,
		},
	});
}

/**
 * Get the SteamID of the user from the database
 * @param {string} discordid DiscordID of the user
 */
async function getUser(discordid) {
	const user = await prisma.user.findUnique({
		where: {
			discordid: discordid,
		},
	});

	if (user) {
		return user.steamid;
	} else {
		return null;
	}
}

export { newUser, getUser };
