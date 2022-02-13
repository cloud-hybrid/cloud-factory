const Policy: typeof import("./sts-assume-role.policy.json") = require("./sts-assume-role.policy.json");
const Schema: typeof import("./sts-assume-role.schema.json") = require("./sts-assume-role.schema.json");

export { Schema, Policy };

export default Policy;
