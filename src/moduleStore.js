export default () => {
    const commands = {};
    const tickers = [];

    return Object.create({
        addCommand(trigger, description, executeFn) {
            commands[trigger] = {executeFn, description}
        },

        addTicker(module) {
            tickers.push(module)
        },

        getCommands() {
            return commands
        },

        getTickers() {
            return tickers
        },

        getCommand(trigger) {
            if (commands.hasOwnProperty(trigger)) {
                return commands[trigger]
            } else {
                return false
            }
        }
    })
}