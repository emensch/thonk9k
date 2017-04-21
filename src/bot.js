const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const glob = require('glob');
const path = require('path');

class Bot {
    constructor() {
        this.client = new Discord.Client();
        this.db = new sqlite3.Database(path.join(__dirname, '../db/database.db'));
        this.token = 'MzAzMzI4NjQzNTUwMDE5NTg2.C9Wgwg.2SjC-LzYWuLNGPdhG0F0axdAqtM';
        this.commandPrefix = '!';
        this.commands = {};
        this.cmdCount = 0;

        this.loadCommands();

        this.client.on('ready', () => {
            console.log('Thonking.');
        });
    }

    thonk() {
        this.client.login(this.token);

        this.client.on('message', message => {
            this.runCommand(message)
        })
    }

    loadCommands() {
        console.log('Loading commands...');
        let classMap = {};

        glob.sync(path.join(__dirname, 'commands/*.js')).forEach( file => {
            let cmdObj = require(path.resolve(file));

            // Only add if file exports something
            if(typeof cmdObj === 'function') {
                classMap[cmdObj.name] = cmdObj;
            }
        });

        // Iterate through keys and instantiate command objects
        // ES6 doesn't really like "dynamic" class names
        // This is OK because I hate myself and no one else will ever see this
        Object.keys(classMap).forEach( key => {
            this.addCommand(new classMap[key]())
        });

        console.log(`Finished loading ${this.cmdCount} commands.`)
    }

    addCommand(command) {
        command.onLoad(this, err => {
            if (err) {
                console.error(err);
            } else {
                console.log(command.trigger + ' loaded');
                let formatted = command.trigger.toLowerCase();
                this.commands[formatted] = command;
                this.cmdCount++;
            }
        });
    }

    runCommand(message) {
        const prefix = this.commandPrefix;
        const content = message.content;

        if (content.startsWith(prefix)) {
            const formattedContent = content.slice(prefix.length, content.length);
            let commandArray = formattedContent.split(' ');
            const command = commandArray.shift().toLowerCase();
            const args = commandArray.join(' ');

            if (this.commands.hasOwnProperty(command)) {
                const selectedCommand = this.commands[command];
                selectedCommand.execute(this, message, args)
            } else {
                message.channel.sendMessage('Command not recognized. Try !help for a list of available commands.');
            }
        }
    }

    // Utility method to lookup typeID from typeName
    lookupTypeID(typeName, cb) {
        this.db.get(`
            SELECT typeID from typeIDs
            WHERE typeName = ?
        `, typeName, (err, row) => {
            if (err) {
                cb(err);
                return;
            }

            if(typeof row === 'undefined') {
                cb(new Error('That item does not exist.'));
                return;
            }

            cb(null, row.typeID)
        })
    }

    humanizeNumber(num) {
        const strNum = num.toFixed(2).toString();
        const places = strNum.indexOf('.');

        if (places < 7) {
            // I absolutely ripped this regex off StackOverflow
            return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        const truncated = num / 10 ** (Math.floor((places - 1)/3) * 3);
        return truncated.toFixed(2) + (places > 9 ? 'b' : 'm');

    }

    //client.on('message', message => {
    //    message.react(':thonking:291056594601377792')
    //});
}

module.exports = Bot;