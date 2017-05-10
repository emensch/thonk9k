export default (...components) => {
    let loaders = [];

    components.forEach(elem => {
        elem.load(loaders)
    });

    let proto = {
        load(state) {
            loaders.forEach(loader => {
                loader(state)
            })
        }
    };

    return Object.assign(Object.create(proto), ...components)
}