class Headers {}

const handler = {
    get(target, key) {
        return target[key.toLowerCase()];
    },

    set(target, key, value) {
        if (value === undefined) {
            delete target[key.toLowerCase()];
        } else {
            target[key.toLowerCase()] = value;
        }
        return true;
    },

    deleteProperty(target, key) {
        delete target[key.toLowerCase()];
    },

    has(target, key) {
        return key.toLowerCase() in target;
    },
};

const HeadersProxy = new Proxy(Headers, {
    construct(target, [headers = {}]) {
        const res = new Proxy(new target(), handler);

        Object.entries(headers).forEach(([key, value]) => {
            res[key] = value;
        });

        return res;
    },
});

module.exports = {
    Headers: HeadersProxy,
};
