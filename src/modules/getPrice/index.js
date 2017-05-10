import module from '../../module'
import command from '../../components/command'
import loader from '../../components/loader'
import axios from 'axios'
import humanize from '../../utils/humanize'

export default module(
    loader(() => {
        console.log('test')
    }),
    command('getprice', 'Gets the Jita price of a given item.', async (state, message, args) => {
        try {
            const {data: itemData} = await axios.get(
                `https://esi.tech.ccp.is/latest/search/?categories=inventorytype&datasource=tranquility&language=en-us&search=${args}`
            );

            const itemid = itemData.inventorytype[0];

            const {data: priceData} = await axios.get(
                `http://api.eve-central.com/api/marketstat/json?typeid=${itemid}&usesystem=30000142`
            );

            const sellFivePercent = humanize(priceData[0].sell.fivePercent);
            const buyFivePercent = humanize(priceData[0].buy.fivePercent);

            message.channel.sendMessage(
                `__Price of **${args}** (or nearest match) in Jita__:\n` +
                `**Sell**: ${sellFivePercent} ISK\n` +
                `**Buy**: ${buyFivePercent} ISK`
            )
        } catch(e) {
            console.error(e);
            throw e
        }
    })
)