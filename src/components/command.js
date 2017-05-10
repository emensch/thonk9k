export default (trigger, description, executeFn) => {
    const proto = {
        load(loaders) {
            loaders.push(state => {
                state.modules.addCommand(trigger, description, executeFn)
            })
        }
    };

    return Object.assign(Object.create(proto), {})
}