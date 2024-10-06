# SteamBot

## Presentation
SteamBot is a Discord bot created using the Discord.js library that provides you with interesting and useful statistics about your Steam profile, including the amount of time you've spent playing games, the number of games you own, and more.

## Informations
The bot may still have some bugs. If you have any suggestions or would like to report a bug, you can contact me through Discord (my tag is ``@pixilie``) or by email at pixilietv@gmail.com.  

## How to use it ?
You can get all the information needed by executing /help on your discord server

## Add it to your server
### Create the .env file
Don't forget to add a .env file at the root of the project.
The .env file should look like this:
```env
TOKEN=your_bot_token
API_KEY=your_steam_api_key
LOGTAIL_KEY=your_logtail_key
```

### Set up pm2 (or any other process manager)
- Install bun
- Run ``bun install`` (Inside projects directory)
- Install pm2
- Run ``pm2 start --name <name> .`` (Inside project directory)

