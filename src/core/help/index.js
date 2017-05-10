import module from '../../module'
import command from '../../components/command'

export default module(
    command('help', 'Lists all commands alongside their description.', (state, message, args) => {
        const commands = state.modules.getCommands();
        let response = '__**Available commands:**__\n';

        Object.keys(commands).forEach( key => {
            response += `**${state.commandPrefix + key}**: ${commands[key].description}\n`
        });

        message.channel.sendMessage(response)
    })
)