class Command {
    constructor(trigger, description) {
        this.trigger = trigger;
        this.description = description;
    }

    onExecute(bot, message, args) {

    }

    onLoad(bot, cb) {
        cb();
    }
}

module.exports = Command;