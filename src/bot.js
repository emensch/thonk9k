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

        glob.sync(path.join(__dirname, 'commands/*.js')).forEach( file => {
            this.addCommand(require(path.resolve(file)));
            this.cmdCount++
        });

        console.log(this.commands);

        console.log(`Finished loading ${this.cmdCount} commands.`)
    }

    addCommand(command) {
        this.commands[command.command] = {
            description: command.description,
            execute: command.execute
        }
    }

    runCommand(message) {
        const prefix = this.commandPrefix;
        const content = message.content;

        if(content.startsWith(prefix)) {
            const formattedContent = content.slice(prefix.length, content.length);
            let commandArray = formattedContent.split(' ');
            const command = commandArray.shift();
            const args = commandArray.join(' ');

            if(this.commands.hasOwnProperty(command)) {
                const selectedCommand = this.commands[command];
                selectedCommand.execute(this, message, args)
            } else {
                message.channel.sendMessage('Command not recognized. Try !help for a list of available commands.');
            }
        }
    }


    //client.on('message', message => {
    //    message.react(':thonking:291056594601377792')
    //});
}

module.exports = Bot;