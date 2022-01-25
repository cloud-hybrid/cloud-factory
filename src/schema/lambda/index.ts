import Module from "module";

/*** *Current Module Path* */
const $: string = import.meta.url.replace( "file" + ":" + "//", "" );

/*** JSON Import Utility (Node-Require) */
const Import: NodeRequire = Module.createRequire( $ );

/*** @type {await import("./function.schema.json")} */
const Function = Import( "./function.schema.json" );

/*** @type {await import("./layer.schema.json")} */
const Layer = Import( "./layer.schema.json" );

/*** @type {await import("./tsconfig.schema.json")} */
const TS = Import( "./tsconfig.schema.json" );

const Schemas = {
    Function, Layer, TS
};

export default Schemas;

export { Schemas };