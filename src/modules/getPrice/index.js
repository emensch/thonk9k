import module from '../../module'
import command from '../../components/command'
import axios from 'axios'
import humanize from '../../utils/humanize'

export default module(
    command('getprice', 'Gets the Jita price of a given item.', async (state, message, args) => {
        try {
            const esiURL = 'https://esi.tech.ccp.is/latest/';

            const {data: itemData} = await axios.get(
                `${esiURL}search/?categories=inventorytype&datasource=tranquility&language=en-us&search=${args}`
            );

            const itemid = itemData.inventorytype[0];

            const [{data: [priceData]}, {data: {name: itemName}}] = await Promise.all([
                axios.get(`http://api.eve-central.com/api/marketstat/json?typeid=${itemid}&usesystem=30000142`),
                axios.get(`${esiURL}universe/types/${itemid}/?datasource=tranquility&language=en-us`)
            ]);

            const sellFivePercent = humanize(priceData.sell.fivePercent);
            const buyFivePercent = humanize(priceData.buy.fivePercent);

            message.channel.sendMessage(
                `__Price of **${itemName}** in Jita__:\n` +
                `**Sell**: ${sellFivePercent} ISK\n` +
                `**Buy**: ${buyFivePercent} ISK`
            )
        } catch(e) {
            console.error(e);
            throw e
        }
    })
)