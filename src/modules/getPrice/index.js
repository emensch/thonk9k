import module from '../../module'
import command from '../../components/command'
import loader from '../../components/loader'
import axios from 'axios'
import humanize from '../../utils/humanize'

export default module(
    loader(async state => {
        try {
            const exists = await state.db.get(`
                SELECT name FROM sqlite_master
                WHERE type='table' AND
                name='typeNames'
            `);

            if (!exists) {
                throw new Error('typeNames table does not exist')
            }
        } catch(e) {
            throw e
        }
    }),
    command('getprice', 'Gets the Jita price of a given item.', async (state, message, args) => {
        try {
            const esiURL = 'https://esi.tech.ccp.is/latest/';

            const query = args.replace(/-/g, ' ');  // necessary so sqlite doesn't eat shit

            const result = await state.db.get(`
                SELECT * FROM typeNames
                WHERE typeNames MATCH $query||'*'
                ORDER BY rank
            `, {
                $query: query
            });

            if(typeof result !== "undefined") {
                const {ID, typeName} = result;

                // const {data: [priceData]} = await axios.get(
                //     //`http://api.eve-central.com/api/marketstat/json?typeid=${ID}&usesystem=30000142`
                // );

                const {data} = await axios.get(
                    `https://market.fuzzwork.co.uk/aggregates/?station=60003760&types=${ID}`
                );

                const priceData = (data[ID])

                // const sellFivePercent = humanize(priceData.sell.fivePercent);
                // const buyFivePercent = humanize(priceData.buy.fivePercent);

                const sellFivePercent = humanize(priceData.sell.percentile);
                const buyFivePercent = humanize(priceData.buy.percentile);

                message.channel.send(
                    `__Price of **${typeName}** in Jita__:\n` +
                    `**Sell**: ${sellFivePercent} ISK\n` +
                    `**Buy**: ${buyFivePercent} ISK`
                )
            } else {
                message.channel.send('Item not found.')
            }
        } catch(e) {
            throw e
        }
    })
)