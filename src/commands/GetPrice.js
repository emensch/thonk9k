const Command = require('../command');

class GetPrice extends Command {
    constructor() {
        const trigger = 'echo';
        const description = 'Basic command to test bot. Responds with an echo of the message following the command.';

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
    }

    execute(bot, message, args) {
        message.channel.sendMessage(args);
    }
}

module.exports = GetPrice;

//module.exports = {
//    command: 'getPrice',
//    description: 'Gets Jita prices of specified item.',
//    onLoad(bot, cb) {
//        bot.db.get(`
//            SELECT name FROM sqlite_master
//            WHERE type='table' AND
//            name='tyeIDs'
//        `,
//        (err, row) => {
//            if(err) {
//                cb(err)
//            }
//
//            if(row === undefined) {
//                const error = new Error('typeIDs table does not exist. Run the loadTypeIDs util.');
//                cb(error)
//            }
//        })
//    },
//    execute(bot, message, args)  {
//        message.channel.sendMessage(args)
//    }
//}