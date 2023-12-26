# discord-sticker-uploader
Fully automatic stickers uploader for Discord using AI

# Bot requirements
It **MUST** be a bot with 0 guilds, you cannot use that bot for own usage (smth commands or other)<br>
If you do, it will make a lot of bugs and errors<br>
Why? Bot fetch all guilds and get number to new guild and then send invite to new guild to all servers where is inviteChannel<br>

## Bot intents
Bot must have all intents, you can set all as in picture
![img](https://github.com/Amirust/discord-sticker-uploader/blob/master/intents.png)

# Usage
1. Install `Node.js (>= 16)`, `Python (>= 10)` and Python PIP
2. Clone repository
3. Run `setup.sh` or `setup.bat`
4. Go to `config.json` and fill it (uploadInterval can stay default)
5. Run `npm start`
6. Move any .png file to `stickers` folder (it will be created on setup) and wait info in console

# Config
### `watchFolder`
The folder where you will put new stickers for observer, it should be a global path<br>
Example: "C:/DSU/stickers" (Windows), "~/stickers" (UNIX)

### `uploadInterval`
Interval, every period will uploaded new files from `watchFolder` (read **How It Works**)
Example: Any value from 1 to 9007199254740991 (node.js limitation)

### `botToken`
Just bot token

### `baseGuildName`
Base name to created guilds<br>
Placeholders:
- `{number}` - Guild number

Example: "Mira stickers {number}" (guild will be with name "Mira stickers 1")

### `invitesChannel`
The name of channel where be stored all invites to other servers<br>
**PLS FILL IT ONCE, DON'T CHANGE IT IN FUTURE**

# How It Works
Step -> by step<br>
You put new image to stickers folder -> observer saw new image and put in to array -> every `uploadInterval` this array will be uploaded -> upload finished, created new folders with guild name, invite and id, image moved to this folder and renamed

# Todo
1. Rewrite code to normal (now is cringe, but it will work)
2. Normal logger

# Crashes or bug reporting
All in issues pls

## Thanks to
- [nyuuzyou Stickers Image Classification AI Model](https://huggingface.co/nyuuzyou/stickers) - For great model
