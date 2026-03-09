# DanielChauve Js

This aims to be a complete bot for streaming on Twitch (and link it with Discord later) to replace Streamer.bot, feel free to use/enrich/comment it !
Please do not use this bot or it's template in a commercial purpose (which does not include using it for your Twitch channel or Discord server).

The name comes from my own bot name account.

## Twitch Bot Template

For getting your Twitch ClientIds/AccessTokens you can use: [Twitch Token Generator](https://twitchtokengenerator.com/).

This is the source code of my personal bot but I believe you could find concrete use of several features and TS/JS packages for your own bot.

The template-package.json file needs to be renamed in package.json and completed with your informations/tokens.

### Features

Please found below a quick overview of the features you will find in this bot.

- **Simple text commands:** Commands that give a simple answer when triggered (e.g.: !hello => Hi Mark !)

- **Custom commands:** More complex commands which doesn't simply reply to the user (e.g.: !roll => _gives a random number + update an OBS source + store the result in a database_)

- **Link with a SQL database:** Everything needed to connect your bot to an SQL database

- **Link with an OBS websocket:** Everything needed to connect your bot to your OBS and update sources and scenes (currently not updating scene)

- **Link with a Google spreadsheet:** Everything needed to connect to Google Spreadsheet APIs, it could be an alternative for not using database

- **Channel Points Redemption Listener:** Listen to channel points redemptions rewards (with or without text message)

- **Easy bets and polls:** Create polls and bet easily, relaunching the last one or start one with default values

- **Timers:** Messages or commands that are send regularly parameterized with number of messages send and time elapsed since the last timer's message

- **Counters:** Create counters in commands but not only. You can bind counters to stream ccategory in order they aren't triggered everytime or to have different counter with the same name

- **Discord announces:** Connect the bot to a Discord Client to send announce messages (with embed) when live is on

## References & documentations

Based mainly on [Twurple](https://twurple.js.org/), [Discord.js](https://discord.js.org/).

## Remarks

To avoid Typescript the `Excessive stack depth comparing types` error because of `obs-websocket-js` dependency, you can add

```
// @ts-ignore
```

just before the line of the error.

## Contact

Find my twitch here: [vintar21](https://www.twitch.tv/vintar21).
You can contact me by mail: contact@vintar.fr
Find me on Discord: vintar for DM or [Vintar](https://discord.gg/n82ZkWSXjV) to join my server.
