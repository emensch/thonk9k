export default (trigger, executeFn) => {
    const proto = {
        load(loaders) {
            loaders.push(state => {
                state.modules.addCommand(trigger, executeFn)
            })
        }
    };

    return Object.assign(Object.create(proto), {})
}