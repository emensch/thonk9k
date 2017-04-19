module.exports = {
    command: 'echo',
    description: 'Basic command to test bot. Responds with an echo of the message following the command.',
    execute(bot, message, args)  {
        message.channel.sendMessage(args)
    }
}