export default loadFn => {
    const proto = {
        load(loaders) {
            loaders.push(loadFn)
        }
    };

    return Object.assign(Object.create(proto), {});
}