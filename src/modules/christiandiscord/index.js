import module from '../../module'
import command from '../../components/command'
import loader from '../../components/loader'
import axios from 'axios'

export default module(
    command('christiandiscord', 'Maintains our status as a good Christian discord.', async (state, message, args) => {
        try {
            const { data: [passage] } = await axios.get(`http://labs.bible.org/api/?passage=random&type=json`);
            const { bookname, chapter, verse, text } = passage;

            message.channel.send(`**${bookname} ${chapter}:${verse}** ${text}`)
        } catch(e) {
            throw e
        }
    })
)