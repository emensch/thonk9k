import module from '../../module'
import command from '../../components/command'
import axios from 'axios'

export default module(
    command('thera', 'Lists the five nearest k-space Thera connections to the given system.', async (state, message, args) => {
        try {
            const argsList = args.split(' ');
            const start = argsList[0];
            const end = argsList[1];

            const {data} = await axios.get(
                `https://www.eve-scout.com/api/wormholes?systemSearch=${args}&method=shortest`
            );

            // Check to see if system is valid, if it ain't there will be no 'jumps' prop
            if(data[0].hasOwnProperty('jumps')) {
                const list = data
                    .filter(e => {
                        return isKspace(e.sourceSolarSystem) || isKspace(e.destinationSolarSystem)
                    })
                    .map(e => {
                        return {
                            system: e.sourceSolarSystem.name === 'Thera' ?
                                e.destinationSolarSystem.name :
                                e.sourceSolarSystem.name,
                            jumps: e.jumps
                        }
                    })
                    .sort((a, b) => {
                        return a.jumps - b.jumps
                    })
                    .slice(0, 5)
                    .reduce((acc, val) => {
                        return acc + `\n${val.system}: **${val.jumps}** jumps`
                    }, ' ');

                message.channel.send(
                    `__Thera connections nearest to **${args}**__:${list}`
                );
            } else {
                message.channel.send('System not found.')
            }
        } catch(e) {
            throw e
        }
    })
)

function isKspace(solarSystem) {
    const {region: {name: regionName}} = solarSystem;
    return regionName.charAt(1) !== '-' // Wormhole regions look like G-R00031, etc
}