import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

async function newUser(steamid, discordid) {
	const user = await prisma.user.create({
		data: {
			steamid: steamid,
			discordid: discordid,
		},
	});
}

async function getUser(discordid) {
	console.log('getUser')
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
