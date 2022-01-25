import AJV, { ValidateFunction } from "ajv";

import { JTDSchemaType } from "ajv/lib/types/jtd-schema";

import Module from "module";

const Import: NodeRequire = Module.createRequire( import.meta.url );

type Pointer = { val: number; next?: Pointer }

const Compiler = new AJV( {
    allErrors: true,
    verbose: false,
    strict: false,
    allowUnionTypes: true,
    allowMatchingProperties: true,
    removeAdditional: true,
    validateFormats: true,
    useDefaults: true,
    unevaluated: true,
    validateSchema: true
} );

const Reference: JTDSchemaType<Pointer, { node: Pointer }> = {
    definitions: {
        node: {
            properties: {
                val: { type: "float64" }
            },
            optionalProperties: {
                next: { ref: "node" }
            }
        }
    },
    ref: "node"
};

// Compiler.addMetaSchema(Meta);

const $ = Import( "./index.json" );
type Schema = typeof $;
const validate: ValidateFunction<Schema> = Compiler.compile( $ );

class Constructor {
    readonly schema: typeof $;

    readonly pointers: typeof $.$defs;

    constructor() {
        this.schema = $;
        this.pointers = $.$defs;
    }
}

console.log( validate( {
    name: "test",
    description: "...",
    uri: "./index.js"
} ) );

console.log( validate.errors );

console.log( validate( {
    name: "test"
} ) );

console.log( validate.errors );

export default Constructor;
