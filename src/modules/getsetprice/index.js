import module from '../../module'
import command from '../../components/command'
import loader from '../../components/loader'
import axios from 'axios'
import humanize from '../../utils/humanize'
import fs from 'fs'
import path from 'path'

export default module(
    loader(async state => {
        try {
            const exists = await state.db.get(`
                SELECT name FROM sqlite_master
                WHERE type='table' AND
                name='implantSetIDs'
            `);

            if (!exists) {
                console.log('Generating implantSetIDs table...');
                const filePath = path.resolve(__dirname, 'implantIDs.json');

                const file = fs.readFileSync(filePath, {encoding: 'utf8'});
                const implantIDs = JSON.parse(file);

                await state.db.run(`
                    CREATE TABLE IF NOT EXISTS implantSetIDs (
                        setName TEXT PRIMARY KEY,
                        IDs TEXT
                    )
                `);

                for(let key in implantIDs) {
                    await state.db.run(`
                        INSERT INTO implantSetIDs (setName, IDs)
                        VALUES ($setName, $IDs)
                    `, {
                        $setName: key,
                        $IDs: JSON.stringify(implantIDs[key])
                    })
                }

                console.log('Done.')
            }
        } catch(e) {
            if(e.code === 'ENOENT') {
                console.error('implantIDs.json could not be accessed.')
            } else {
                throw e
            }
        }
    }),
    command('getsetprice', 'Gets the Jita price of a given implant set.', async (state, message, args) => {
        try {
            const {setName, IDs} = await state.db.get(`SELECT * FROM implantSetIDs WHERE setName LIKE '%'||$setName||'%'`, {
                $setName: args
            });

            const parsedIDs = JSON.parse(IDs);

            // const queryString = parsedIDs.map(e => {
            //     return `typeid=${e}&`
            // }).join('');

            const queryString = parsedIDs.map(e => {
                return `${e},`
            }).join('');

            // const {data: priceData} = await axios.get(
            //     `http://api.eve-central.com/api/marketstat/json?${queryString}usesystem=30000142`
            // );

            const {data: priceData} = await axios.get(
                `https://market.fuzzwork.co.uk/aggregates/?station=60003760&types=${queryString}`
            );

            const buyPrice = humanize(sumPrice('buy', priceData));
            const sellPrice = humanize(sumPrice('sell', priceData));

            message.channel.send(
                `__Price of **${setName}** set in Jita__:\n` +
                `**Sell**: ${sellPrice} ISK\n` +
                `**Buy**: ${buyPrice} ISK`
            )

        } catch(e) {
            console.error(e);
            throw e
        }
    })
)

// function sumPrice(key, priceData) {
//     console.log('priceData', priceData);
//     return priceData.map(e => {
//         return e[key].fivePercent
//     }).reduce((acc, val) => {
//         return acc + val
//     });
// }

function sumPrice(key, priceData) {
    let sum = 0;
    for(const ID in priceData) {
        sum += parseFloat(priceData[ID][key].percentile)
    }

    return sum
}