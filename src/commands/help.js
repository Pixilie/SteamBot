import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Liste de toutes les commandes');

const helpCommand = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`Liste des commandes`)
	.setDescription(
		`Voici la liste de toutes les commandes disponibles avec le bot SteamBot`
	)
	.setThumbnail(
		'https://images.frandroid.com/wp-content/uploads/2019/03/steam_logo.jpg'
	)
	.addFields(
		{
			name: '/time `steam-id`',
			value: 'Affiche le temps de jeu de la personne',
		},
		{
			name: '/ownedgames `steam-id`',
			value: `Affiche le nombre de jeux que possède la personne`,
		},
		{
			name: '/steamprofile `steam-id`',
			value: `Affiche les informations du profile Steam de la personne`,
		},
		{
			name: '/recentactivity `steam-id`',
			value: `Affiche les dernières activités de la personne`,
		}
	);

async function run(interaction) {
	await interaction.reply({
		embeds: [helpCommand],
	});
}
export { run, COMMAND_DEFINITION };
