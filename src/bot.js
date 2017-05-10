import Discord from 'discord.js'
import sqlite from 'sqlite'
import glob from 'glob'
import path from 'path'
import moduleStore from './moduleStore'

export default (token, {prefix = '!'} = {}) => {
    let state = {
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

        console.log(state.modules.getCommands())
    }

    return Object.create({
        async init() {
            try {
                state.db = await getDB();
                loadModules(path.resolve(__dirname, 'core/*'));
                loadModules(path.resolve(__dirname, 'modules/*'));
                //state.client.login(token);

                state.client.on('ready', () => {
                    console.log('Thonking.')
                })
            } catch(e) {
                console.error(e)
            }
        }
    })
}