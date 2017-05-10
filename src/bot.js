import Discord from 'discord.js'
import sqlite from 'sqlite'
import glob from 'glob'
import path from 'path'
import moduleStore from './moduleStore'

export default (token, {prefix = '!'} = {}) => {
    let state = {
        commandPrefix: prefix,
        client: new Discord.Client(),
        db: null,
        modules: moduleStore()
    };

    if(!token) {
        throw new Error('No token specified')
    }

    async function getDB() {
        try {
            const dbpath = path.resolve(__dirname, '../database/database.sqlite');
            return sqlite.open(dbpath)
        } catch(e) {
            console.error(e)
        }
    }

    function loadModules(modulePath) {
        glob.sync(modulePath).forEach( file => {
            let module = require(path.resolve(file)).default;
            // Only add if file exports something
            if(typeof module === 'object') {
                try {
                    module.load(state)
                } catch(e) {
                    console.error(e)
                }
            }
        });
    }

    async function processMessage(message) {
        const content = message.content;
        if (content.startsWith(prefix)) {
            const formatted = content.slice(prefix.length, content.length);
            let commandArray = formatted.split(' ');
            const trigger = commandArray.shift().toLowerCase();
            const args = commandArray.join(' ');
            const command = state.modules.getCommand(trigger);

            if(command) {
                try {
                    await command.executeFn(state, message, args)
                } catch(e) {
                    message.channel.sendMessage('You blew it.')
                }
            } else {
                message.channel.sendMessage(
                    `Command not recognized. Try ${prefix}help for a list of all available commands.`
                )
            }
        }
    }

    return Object.create({
        async init() {
            try {
                state.db = await getDB();
                loadModules(path.resolve(__dirname, 'core/*'));
                loadModules(path.resolve(__dirname, 'modules/*'));
                state.client.login(token);

                state.client.on('ready', () => {
                    console.log('Thonking.')
                });

                state.client.on('message', message => {
                    processMessage(message)
                });
            } catch(e) {
                console.error(e)
            }
        }
    })
}