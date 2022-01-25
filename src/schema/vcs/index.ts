import Module from "module";

/*** *Current Module Path* */
const $: string = import.meta.url.replace( "file" + ":" + "//", "" );

/*** JSON Import Utility (Node-Require) */
const Import: NodeRequire = Module.createRequire( $ );

/*** @type {await import("./github.schema.json")} */
const GitHub = Import( "./github.schema.json" );

const Schemas = {
    GitHub
};

export default Schemas;

export { Schemas };