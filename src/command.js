class Command {
    constructor(trigger, description) {
        this.trigger = trigger;
        this.description = description;
    }

    onExecute(bot, message, args) {

    }

    onLoad(bot) {
        return Promise.resolve()
    }
}

module.exports = Command;