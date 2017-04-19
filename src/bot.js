
const Discord = require('discord.js');

class Bot {
    constructor() {
        this.client = new Discord.Client();
        this.token = 'MzAzMzI4NjQzNTUwMDE5NTg2.C9Wgwg.2SjC-LzYWuLNGPdhG0F0axdAqtM';

        this.client.on('ready', () => {
            console.log('Thonking.');
        });
    }

    thonk() {
        this.client.login(this.token)
    }



    //client.on('message', message => {
    //    message.react(':thonking:291056594601377792')
    //});
}

module.exports = Bot;