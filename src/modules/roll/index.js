import module from '../../module'
import command from '../../components/command'
import axios from 'axios'

export default module(
    command('roll', 'Rolls a die. Optional parameter specifies sides - defaults to 20.', async (state, message, args) => {
        try {
            const formatted = args.split(' ')[0] || '1d20';
            const parsed = formatted.split('d');
            const number = parsed[0];
            const sides = parsed[1];
            let messageToSend = '';

            if(isNaN(sides) || isNaN(number)) {
                message.channel.send('That ain\'t a number, dumbass.')
            } else if (sides < 2 || number < 1) {
                message.channel.send('That\'s impossible.')
            } else if (number > 20 || parsed.length > 3) {
                message.channel.send('Don\'t be stupid.')
            } else {
                let results = [];

                for(let i = 0; i < number; i++) {
                    results.push(Math.floor(Math.random() * sides) + 1)
                }

                if(parseInt(number) === 1) {
                    messageToSend = `You rolled ${number}d${sides} and got **${results[0]}**.`
                } else {
                    let messagePart = '';
                    let total = results.reduce((acc, val) => acc + val);
                    results.forEach((e, idx) => {
                        messagePart += (idx > 0) ? `, **${e}**` : `**${e}**`
                    });

                    messageToSend = `You rolled ${number}d${sides} and got: ${messagePart} for a total of **${total}**.`
                }

                message.channel.send(messageToSend)
            }

        } catch(e) {
            throw e
        }
    })
)