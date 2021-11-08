const { test, expect, beforeAll, afterAll } = require("@jest/globals");

const http = require("http");
const { fetch } = require("./fetch");

const server = http.createServer((req, res) => {
    switch (req.url) {
        case "/interrupted":
            res.writeHead(200, { "content-length": "100" });
            res.end();
            return;
        case "/no-body":
            res.writeHead(200, { "content-length": 0 });
            res.end();
            return;
        case "/aborted":
            res.destroy();
            return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () =>
        res.end(
            JSON.stringify({
                url: req.url,
                method: req.method,
                headers: req.headers,
                body: Buffer.concat(chunks).toString("utf8"),
            })
        )
    );
});

let baseUrl = null;

beforeAll(
    () =>
        new Promise((resolve, reject) => {
            server.on("error", reject);
            server.on("listening", () => {
                baseUrl = `http://localhost:${server.address().port}`;
                resolve();
            });
            server.listen(undefined, "localhost");
        })
);

afterAll(() => server.close());

test("success", async () => {
    const path = "/test/path";
    const method = "POST";
    const ct = "application/json";
    const body = "some-body";

    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: { "content-type": ct },
        body,
    });
    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");

    const json = await res.json();
    expect(json.url).toBe(path);
    expect(json.method).toBe(method);
    expect(json.headers["content-type"]).toBe(ct);
    expect(json.body).toBe(body);
});

test("error", async () => {
    await expect(fetch(`${baseUrl}/aborted`)).rejects.toThrowError();
    await expect(fetch()).rejects.toThrowError();
});

test("interrupted", async () => {
    const res = await fetch(`${baseUrl}/interrupted`);
    await expect(res.blob()).rejects.toThrowError("aborted");
});

test("no-body", async () => {
    const res = await fetch(`${baseUrl}/no-body`);
    await expect(res.blob()).resolves.toHaveLength(0);
});
