# Installation guide

## WIP: this installation guide isn't complete but it will arrive soon !

Find below the steps to install, custom and launch your bot ! Please feel free
to contact me if something is unclear or if you have remarks !

## Prerequisities

Download and install the following tools to use the bot.

- node: https://nodejs.org/en/download
- git: https://git-scm.com/install/windows
- code editor like VSCode: https://code.visualstudio.com/

## Step 1: Downloading the bot

Create a folder somewhere on your computer where you will clone the Git
repository. Open this folder in VSCode or just open a git terminal in the
created folder, then run:

`git clone https://github.com/Vintar21/DanielChauveJs.git`

In the _config_ folder you will find several templates for configFiles, remove
the ".template" from their name. Now you should have _configDiscord.json_,
_configGoogle.json_, _configObs.json_, _configSql.json_ and _configTwitch.json_
in the config folder.

The first thing you can do is to put your channel's name (Twitch's login) in
_configTwitch.json_ as **channel**. For instance: `"channel": "vintar21"`

I recommend you to create a local branch for your bot:
`git branch <pseudo>-version && git checkout <pseudo>-version` (i.e.:
`git branch vintar-version && git checkout vintar-version`).

## Step 2: Getting your tokens

This bot handle many connection to different type of services, you don't have to
use them all you can just get the tokens and credentials you need. For a minimal
working version you will only need your account's Twitch tokens but I highly
recommend you to get those for Discord and GoogleSheet too.

### Twitch

Now we will get the necessary tokens to access the Twitch APIs. If you want your
bot to have a dedicated account, create a Twitch account for it first and if
possible, enable 2FA.

#### Your tokens

Your Twitch token is like a secret password to use your rights on your accounts
(for moderation, edit channels...). This bot use your account to do all the
things that requires privileges (timeout, ban, get followers informations, edit
channel point rewards...). The bot account will simply read and send messages in
the chat, for more explications go to the following section.

First of all you have to create a Twitch application on your account (don't
worry, it's not a big deal). The bot will be connected to your account through
this application. To create your application you need to connect to
[Twitch developer's console](https://dev.twitch.tv/console). Once it's done go
to **Dashboard**. At the top right you should see a violet button **Register
your app**, click on it.

Give it a proper name and put `https://twitchtokengenerator.com` in OAuth's URL.
Select **Chat Bot** for the Category. Your Client Type should be
**Confidential**. You can now create your application! 🎉

Get your Client ID and keep it. The client ID is the equivalent of your Twitch's
login then comes your Secret key. Click on **New Secret** and copy the string
somewhere safe. Your Client Secret is the equivalent of your Twitch's password
so don't loose it and keep it... secret.

The next step is giving rights to your application, go to
https://twitchtokengenerator.com and select "Bot App". Then fill the Client
Secret and Client ID fields with the information you just get from your
application. Then scroll down and adjust the rights you want to give to your
bot, if you scroll at the bottom of the list you can just click on "Select All".
Your application needs almost all the rights so for the Alpha version of this
bot we will consider necessary to select all the scopes. You can now click on
"Generate Token". Agree to give all the rights to your application. If you get
an error or the page doesn't displays correctly get back and click on "Request
Token" to send yourself an email that will give you the necessary tokens.

Once done you should have the following informations: Your client ID, your
client secret and your refresh token. The refresh token is important so your
bot's rights will not expire after 4 hours. Fill those informations in
_configTwitch.json_ respectively in the fields:

- broadcaster-client-id
- broadcaster-secret
- broadcaster-refresh-token

For more information you can check Twitch's documentation here:
https://dev.twitch.tv/docs/authentication#registration

#### Your bot tokens

If you don't have and don't want to use a dedicated account for your bot, you
can ignore this section.

For the bot's configuration, I recommend you to go in the Private Browsing of
your browser so you don't have your main twitch account connected.

Create a Twitch's account for your Bot if it's not already done. Connect to your
bot account and make sure to enable 2FA (Double authentication) in the
[Settings](https://www.twitch.tv/settings/security). You can check and adjust
the parameter you want for your bot here too (like authorize DMs)

Once it's done you can reproduce the steps of the previous section (_It will be
detailled here later_).

Once you have your Client ID and your Client Secret put them in your
_configTwitch.json_ respectively in the fields:

- bot-client-id
- bot-secret

For the moment the bot account doesn't need to have a refresh token but keep it
somewhere just in case (you can add a field "bot-refresh-token" in
_configTwitch.json_)

### Google

To get your Google sheet key and email, follow this tutorial:
https://dev.classmethod.jp/articles/hands-on-guide-to-google-sheets-api-in-typescript/

Then fill the _configGoogle.json_ with the information you get.

To get the **spreadsheet-id** go to the **Step 4**

### Discord

If you need more details on how the discord bot works and what you can do with
it, please check the
[discord.js documentation](https://discord.js.org/docs/packages/discord.js/14.25.1)

#### Creating your Discord bot

Go to https://discord.com/developers/applications and connect to your Discor
account. Then create a new application wih the top-right button.

Give it a name that will be your bot's user's name, agree to the Terms and
Policy and create your app. Once on the page of your app you can configure it by
giving it a description, a profile picture (that will appears on the bot account
on Discord) and tags. You can explore other tabs to cusomize your Discord bot
more.

Finally go to the **Bot** tab and click on "reinitialize token" and copy it in
_configDiscord.json_ in the _token_ field.

#### Get the server and channel id

Please feel free to remove fields necessary in _configDiscord.js_. You basically
need the ids of the servers you want the bot to joins and interact with and the
ids of the channels the bot should send messages.

To get them go on your Discord server and right click on its name at the
top-left then click on "Copy the server id" at the bottom of the menu. For
getting a channel's id, right click on the channel name then click on "Copy the
channel id" at the bottom of the menu.

### Database

For the moment the bot only handles SQL database but feel free to enrich it and
add other database supports !

#### SQL

The simpliest way to setup a SQL database is to do it locally on your computer.
In this case, the database will only be available when your computer is turned
on and on your local machine.

_TODO: Sql Server Manager setup_

Get your SQL address and complete _configs/configSql.json_

## Step 3: Connecting to OBS

Once again this step isn't mandatory so if you don't want your bot to interact
with your OBS you can skip this part.

In _configObs.json_ make sure "obs-light-testing" is set to `false`. This field
is here if you need to test some features without really modifying things in
OBS.

We will now fill the "obs-websocket" informations with a few steps:

- Run OBS
- Go in Tools > Websocket server's settings
- Check "Enable Websocket Server"
- Check Use authentication
- Click on "Generate a password"
- Then click on "Display connection's information below"
- Copy those information in the corresponding fields of "obs-websocket" in
  _configObs.json_

It's done your bot will now be connected to your OBS!

## Step 4: Copying the Google Sheet template

You will found a Google Sheet template
[here](https://docs.google.com/spreadsheets/d/1SQdq-KMPg3Cb1yKxD0Shh8IsA7g23qsHpZlW9Epy6RQ/edit?usp=sharing),
import and copy it in your own Google Sheet environment so you can edit it. It's
also recommended that you share your GSheet with your moderators and/or the
person you want to edit some things on your bot.

As the bot is in Alpha, this template can evolve so make sure to be up to date
with the last version of this templates.

In this template you can add and customize Simple Commands, which means commands
that just send one or several response when they are triggered. For more complex
commands please dive in the code by itself.

- The "General Commands" sheet is the default command of the bot, you can and
  should customize them.

- The "Simple Commands" sheet is where you can put your custom commands. Look at
  the General Commands as an example. When you want to put muliple entries in a
  cell (in Aliases for instance use **CTRL+ENTER** to skip a line in the cell).
  If you don't precise a Category, the command will be always available. If you
  don't put cooldowns, default ones will be applied (User Cooldown: 3 second,
  Global Cooldown: 1 second)

- You can use Placeholders, if so, please check the box hasPlaceholders. Here
  are a list of the placeholders available
  - $USER: the name of the user who trigerred the command
  - $BROADCASTER: Your name
  - $CATEGORY: The Category on your stream right now
  - $INPUT: The message of the user for instance in `!cmd hi everyone` $INPUT
    corresponds to "hi everyone"
  - $RAND1/$RAND2/$RAND3/$RAND4/$RAND5: Those placeholders are here if you want to randomize some parts of your answers and have dedicated column in the GSheet.
    For instance if your answer is "$RAND1
    vintar21" and your RAND1 column is filled with

  ```
  Hi
  Hello
  Yo
  ```

  The answer can be "Hi vintar21" or "Hello vintar21" or "Yo vintar21".

- Counters sheet is here to store your counters and their values, you will find
  some example of counters in it, please delete or modify them.

- Categories sheet is containing a non-exhaustive (at all) list of some Twitch's
  categories. The ID column is useless for now so you can add more categories if
  you need it, simply make sure their name are correct (the names are in english
  and case sensitive!). To check the real name of a category you can use
  `!category` command while being on the wanted category.

- Finally, you can add more sheets in your GSheet to use in your custom
  commands, but for that you will need to check the bot's code.

## Updating the bot
