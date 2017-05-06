import Discord from 'discord.js'
import sqlite from 'sqlite'
import glob from 'glob'
import path from 'path'

export default (token, {prefix = '!'} = {}) => {
    let state = {
        client: new Discord.Client(),
        db: null
    };

    if(!token) {
        throw new Error('No token specified')
    }

    async function getDB() {
        try {
            const dbpath = path.join(__dirname, '../database/database.sqlite');
            return sqlite.open(dbpath)
        } catch(e) {
            console.error(e)
        }
    }

    return Object.create({
        async init() {
            try {
                state.db = await getDB();
                state.client.login(token);

                state.client.on('ready', () => {
                    console.log('Thonking.')
                })
            } catch(e) {
                console.error(e)
            }
        }
    })
}