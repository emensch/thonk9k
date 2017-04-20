const Command = require('../command');

class Ping extends Command {
    constructor() {
        const trigger = 'ping';
        const description = 'Basic command to test bot. Responds with pong.';

        super(trigger, description);
    }

    execute(bot, message, args) {
        message.channel.sendMessage('pong')
    }
}

module.exports = Ping;