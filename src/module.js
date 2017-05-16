export default (...components) => {
    let loaders = [];

    components.forEach(elem => {
        elem.load(loaders)
    });

    let proto = {
        async load(state) {
            for(let loader of loaders) {
                await loader(state)
            }
        }
    };

    return Object.assign(Object.create(proto), ...components)
}