import module from '../../module'
import command from '../../components/command'
import axios from 'axios'

export default module(
    command('roll', 'Rolls a die. Optimal parameter specifies sides - defaults to 20.', async (state, message, args) => {
        try {
            const sides = args.split(' ')[0] || 20;
            const number = Math.floor(Math.random() * sides) + 1;

            if(isNaN(sides)) {
                message.channel.send('That ain\'t a number, dumbass.')
            } else if (sides < 2) {
                message.channel.send('That\'s impossible.')
            } else {
                message.channel.send(
                    `You rolled a d${sides} and got **${number}**.`
                );
            }

        } catch(e) {
            throw e
        }
    })
)