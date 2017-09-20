import module from '../../module'
import command from '../../components/command'
import axios from 'axios'

export default module(
    command('time', 'Gets the current EVE time and date.', async (state, message, args) => {
        try {
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'];

            let current = new Date();
            let hour = current.getUTCHours();
            let minute = current.getUTCMinutes();
            let month = months[current.getUTCMonth()];
            let day = current.getUTCDate();
            let year = current.getUTCFullYear();

            message.channel.send(
                `${hour}:${minute} ${month} ${day}, ${year} (EVE/UTC)`
            );

        } catch(e) {
            throw e
        }
    })
)