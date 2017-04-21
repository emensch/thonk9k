const Command = require('../command');
const request = require ('request');

class GetPrice extends Command {
    constructor() {
        const trigger = 'getprice';
        const description = 'Gets Jita prices of specified item.';

        super(trigger, description);
    }

    onLoad(bot, cb) {
        bot.db.get(`
            SELECT name FROM sqlite_master
            WHERE type='table' AND
            name='typeIDs'
        `,
        (err, row) => {
            if(err) {
                cb(err)
            }

            if(row === undefined) {
                const error = new Error('typeIDs table does not exist. Run the loadTypeIDs util.');
                cb(error)
            }
        });

        cb();
    }

    execute(bot, message, args) {
        bot.lookupTypeID(args, (err, id) => {
            if (err) {
                message.channel.sendMessage(err.message);
                return;
            }

            request(`http://api.eve-central.com/api/marketstat/json?typeid=${id}&usesystem=30000142`, (err, res, body) => {
                if (err) {
                    message.channel.sendMessage('Ya fucked up');
                    return;
                }

                const parsed = JSON.parse(body)[0];
                const sellFivePercent = bot.humanizeNumber(parsed.sell.fivePercent);
                const buyFivePercent = bot.humanizeNumber(parsed.buy.fivePercent);

                message.channel.sendMessage(
                    `__Price of **${args}** in Jita:__\n` +
                    `**Sell**: ${sellFivePercent} ISK\n` +
                    `**Buy**: ${buyFivePercent} ISK`
                )

            });
        });
    }
}

module.exports = GetPrice;