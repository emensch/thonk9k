export default module => {
    const proto = {
        async load() {
            return true
        }
    };

    return Object.assign(Object.create(proto), module)
}