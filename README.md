# DanielChauve Js

This aims to be a complete bot for streaming on Twitch (and link it with Discord later) to replace Streamer.bot, feel free to use/enrich/comment it !

The name comes from my own bot name account.

## Twitch Bot Template

Based on [Twurple](https://twurple.js.org/).

This is the source code of my personal bot but I believe you could find concrete use of several features and TS/JS packages for your own bot.

The template-package.json file needs to be renamed in package.json and completed with your informations/tokens.

### Features

Please found below a quick overview of the features you will find in this bot.

- **Simple text commands:** Commands that give a simple answer when triggered (e.g.: !hello => Hi Mark !)

- **Custom commands:** More complex commands which doesn't simply reply to the user (e.g.: !roll => _gives a random number + update an OBS source + store the result in a database_)

- **Link with a SQL database:** Everything needed to connect your bot to an SQL database

- **Link with an OBS websocket:** Everything needed to connect your bot to your OBS and update sources and scenes (currently not updating scene)

- **Channel Points Redemption Listener:** Listen to channel points redemptions rewards (with or without text message)

## Remarks

To avoid Typescript the `Excessive stack depth comparing types` error because of `obs-websocket-js` dependency, you can add

```
// @ts-ignore
```

just before the line of the error.

## Contact

Find my twitch here: [vintar21](https://www.twitch.tv/vintar21).
You can contact me by mail: contact@vintar.fr
