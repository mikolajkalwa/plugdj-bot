# plugdj-bot

A simple plugdj bot.

## Features

### Automatic DCMoveback

Disconnected users get automatically moved back to their waitlist spot when they rejoin.

### Voteskip

Automatically skip songs when they reach specified number of mehs.

### Historyskip

Automatically skip songs which are in history.

### Party never ends

Bot automatically joins into empty waitlist (and leaves when more people show up). 

## Installation

1. Install [Node.js](https://nodejs.org/en/).
2. Additional steps only for Windows users:
   1. Run PowerShell or CMD.exe with administrative privileges (run as Administrator).
   2. Install [Windows-Build-Tools](https://www.npmjs.com/package/windows-build-tools) with `npm install --global --production windows-build-tools`.
   3. Restart your command prompt application.
3. Install [pm2](https://pm2.io/runtime/) with `npm install -g pm2`.
4. Clone/Download this repo.
5. Navigate to the bot's directory and via command line run `npm install --production`.
6. Fill the [config.js](config.js) file.
7. Check if you filled the config file correctly with `npm run check-config`.
8. Start the bot with `pm2 start app.js --name plugdj-bot`.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


This bot is inspired by Fuechschen's [plugbot](https://github.com/Fuechschen/plugbot).