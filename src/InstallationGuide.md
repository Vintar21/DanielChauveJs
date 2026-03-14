# Installation guide

## WIP: this installation guide isn't complete but it will arrive soon !

Find below the steps to install, custom and launch your bot !
Please feel free to contact me if something is unclear or if you have remarks !

## Prerequisities

    - node:https://nodejs.org/en/download
    - git: https://git-scm.com/install/windows
    - code editor like VSCode: https://code.visualstudio.com/

## Step 1: Download the bot

Create a folder somewhere on your computer where you will clone the Git repository.
Open this folder in VSCode or just open a git terminal in the created folder, then run:

`git clone https://github.com/Vintar21/DanielChauveJs.git`

In the _config_ folder you will find several templates for configFiles, remove the ".template" from their name.
Now you should have _configDiscord.json_, _configGoogle.json_, _configObs.json_, _configSql.json_ and _configTwitch.json_ in the confifg folder.

I recommend you to create a local branch for your bot: `git branch <pseudo>-version && git checkout <pseudo>-version` (i.e.: `git branch vintar-version && git checkout vintar-version`).

## Step 2: Get your tokens

This bot handle many connection to different type of services, you don't have to use them all you can just get the tokens and credentials you need.
For a minimal working version you will only need your account's Twitch tokens but I highly recommend you to get those for Discord and GoogleSheet too.

### Twitch

Now we will get the necessary tokens to access the Twitch APIs. If you want your bot to have a dedicated account, create a Twitch account for it first and if possible, enable 2FA.

#### Your tokens

#### Your bot tokens

If you don't have and don't want to use a dedicated account for your bot, you can ignore this section.

### Google

See: https://dev.classmethod.jp/articles/hands-on-guide-to-google-sheets-api-in-typescript/

### Discord

Create a Discord App: https://discord.com/developers/applications

### Database

For the moment the bot only handle SQL database but feel free to enrich it and add other database supports !

#### SQL

The simpliest way to setup a SQL database is to do it locally on your computer. In this case, the database will only be available when your computer is turned on and on your local machine.

_TODO: Sql Server Manager setup_

Get your SQL address and complete _configs/configSql.json_

## Step 3: Connection to OBS

Once again this step isn't mandatory so if you don't want your bot to interact with your OBS you can skip this part.

## Step 4: Copy the Google Sheet template

You will found **HERE** a Google Sheet template, import and copy it in your own Google Sheet environment so you can edit it

## Update the bot
