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