module.exports = {
    command: 'ping',
    description: 'Basic command to test bot. Responds with pong.',
    execute(bot, message) {
        message.channel.sendMessage('pong')
    }
}