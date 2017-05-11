import module from '../../module'
import command from '../../components/command'
import loader from '../../components/loader'
import axios from 'axios'

export default module(
    command('distance', 'Lists the shortest distance between two systems.', async (state, message, args) => {
        try {
            const argsList = args.split(' ');
            const start = argsList[0];
            const end = argsList[1];

            const esiURL = 'https://esi.tech.ccp.is/latest/';

            const [{data: {solarsystem: [startID]}}, {data: {solarsystem: [endID]}}] = await Promise.all([
                axios.get(`${esiURL}search/?categories=solarsystem&datasource=tranquility&language=en-us&search=${start}`),
                axios.get(`${esiURL}search/?categories=solarsystem&datasource=tranquility&language=en-us&search=${end}`)
            ]);

            const [{data: shortestRoute}, {data: safestRoute}] = await Promise.all([
                axios.get(`${esiURL}route/${startID}/${endID}/?datasource=tranquility&flag=shortest`),
                axios.get(`${esiURL}route/${startID}/${endID}/?datasource=tranquility&flag=secure`)
            ]);

            message.channel.send(
                `__Distance between **${start}** and **${end}**__:\n` +
                `**Shortest**: **${shortestRoute.length - 1}** jumps\n` +
                `**Safest**: **${safestRoute.length - 1}** jumps`
            );
        } catch(e) {
            throw e
        }
    })
)