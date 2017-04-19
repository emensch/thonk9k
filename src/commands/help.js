module.exports = {
    command: 'help',
    description: 'Lists all available commands.',
    execute(bot, message) {
        let response = 'Available commands:\n';

        const keys = Object.keys(bot.commands);

        for(key of keys) {
            response += '!' + key + ': ' + bot.commands[key].description + '\n'
        }

        message.channel.sendMessage(response)
    }
}