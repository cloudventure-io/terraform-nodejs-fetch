require("./typedefs");

const http = require("http");
const https = require("https");

const { Request } = require("./request");
const { Response } = require("./response");

/**
 * @param {string|URL|Request} url
 * @param {RequestOptions} [options]
 * @return {Promise<Response>}
 */
const fetch = async (url, { method, headers, body, ...options } = {}) => {
    const u =
        typeof url === "string" || url instanceof URL
            ? new Request(url, { method, headers, body })
            : url;

    if (!(u instanceof Request)) {
        throw new TypeError("url must be string, URL or Request");
    }

    return new Promise((resolve, reject) => {
        const client = u.url.protocol === "https:" ? https : http;

        const req = client.request(
            u.url,
            {
                method: u.method,
                headers: u.headers,
                ...options,
            },
            (res) => resolve(new Response(res))
        );

        req.on("error", reject);
        req.end(u.body.length ? u.body : undefined);
    });
};

module.exports = {
    fetch,
    Request,
    Response,
};
