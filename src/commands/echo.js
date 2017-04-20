const Command = require('../command');

class Echo extends Command {
    constructor() {
        const trigger = 'echo';
        const description = 'Basic command to test bot. Responds with an echo of the message following the command.';

        super(trigger, description);
    }

    execute(bot, message, args) {
        message.channel.sendMessage(args);
    }
}

module.exports = Echo;

//module.exports = {
//    command: 'echo',
//    description: 'Basic command to test bot. Responds with an echo of the message following the command.',
//    execute(bot, message, args)  {
//        message.channel.sendMessage(args)
//    }
//}

