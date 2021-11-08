require("./typedefs");
const { Headers } = require("./headers");

class Request {
    /**
     *
     * @param {string|URL} url
     * @param {RequestOptions} [options]
     */
    constructor(url, { method = "GET", headers = {}, body } = {}) {
        this.url = url instanceof URL ? url : new URL(url);
        this.method = method;
        this.headers = new Headers(headers);
        this.body = Buffer.from(body || "");
    }
}

module.exports = { Request };
