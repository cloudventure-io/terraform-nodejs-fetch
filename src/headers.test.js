const { test, expect } = require("@jest/globals");
const { Headers } = require("./headers");

test("headers", () => {
    const h = new Headers();
    h["UPPER-CASE"] = "value";
    expect(h["upper-case"]).toBe("value");

    const h2 = new Headers({ "UPPER-CASE": "value" });
    expect(h2["upper-case"]).toBe("value");

    const h3 = new Headers({ ABC: "123", XYZ: "456" });
    expect(h3.abc).toBe("123");
    delete h3.ABC;
    expect(h2.abc).toBe(undefined);

    expect(h3.xyz).toBe("456");
    expect("XYZ" in h3).toBe(true);
    h3.xyz = undefined;
    expect("XYZ" in h3).toBe(false);
});
