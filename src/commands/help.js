const Command = require('../command');

class Help extends Command {
    constructor() {
        const trigger = 'help';
        const description = 'Lists all available commands.';

        super(trigger, description);
    }

    execute(bot, message, args) {
        let response = '__**Available commands:**__\n';

        Object.keys(bot.commands).forEach( key => {
            response += `**${bot.commandPrefix + key}**: ${bot.commands[key].description}\n`
        });

        message.channel.sendMessage(response)
    }
}

module.exports = Help;

//module.exports = {
//    command: 'help',
//    description: 'Lists all available commands.',
//    execute(bot, message) {
//        let response = 'Available commands:\n';
//
//        const keys = Object.keys(bot.commands);
//
//        for(key of keys) {
//            response += bot.commandPrefix + key + ': ' + bot.commands[key].description + '\n'
//        }
//
//        message.channel.sendMessage(response)
//    }
//}