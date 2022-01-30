import Module from "module";

const Import: NodeRequire = Module.createRequire( import.meta.url );

const Base: typeof import("./base.schema.json") = Import("./base.schema.json");
const Lambda: typeof import("./lambda.schema.json") = Import("./lambda.schema.json");

export { Base, Lambda };
export default {
    Base, Lambda
};