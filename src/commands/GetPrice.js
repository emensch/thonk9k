const Command = require('../command');

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
        })

        cb();
    }

    execute(bot, message, args) {
        message.channel.sendMessage(args);
    }
}

module.exports = GetPrice;