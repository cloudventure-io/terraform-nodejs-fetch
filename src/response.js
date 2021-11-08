const http = require("http");
const { Headers } = require("./headers");

class Response {
    /**
     *
     * @param {http.IncomingMessage} response
     */
    constructor(response) {
        this.status = response.statusCode;
        this.statusText = response.statusMessage;
        this.headers = new Headers(response.headers);
        this.incomingMessage = response;

        this.body = new Promise((resolve, reject) => {
            const chunks = [];
            response.on("data", (chunk) => chunks.push(chunk));
            response.on("aborted", () => reject(new Error("aborted")));
            response.on("end", () => resolve(Buffer.concat(chunks)));
        });
    }

    /**
     * Get response body
     * @returns {Promise<Buffer>}
     */
    async blob() {
        return this.body;
    }

    /**
     * Get response json
     * @returns {Promise<any>}
     */
    async json() {
        return JSON.parse(await this.blob());
    }
}

module.exports = { Response };
