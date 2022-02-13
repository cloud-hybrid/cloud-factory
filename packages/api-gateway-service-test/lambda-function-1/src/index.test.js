const { expect } = require("@aws-cdk/assert");
const $ = require(".");

test("Runs function handler", async () => {
        expect(JSON.stringify(await $.handler()));
    }
);

module.exports = {};