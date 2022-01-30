import FS from "fs";
import Module from "module";
import Process from "process";

import Utility from "util";

import Ajv from "ajv";
import AJV, { ValidateFunction as Validate } from "ajv";
import $ from "ajv-formats";

type Generic = any;

const Import: NodeRequire = Module.createRequire( import.meta.url );

/*** Local File Type -- Relative to `import.meta.url` or `__directory` */
type File = FS.PathOrFileDescriptor | FS.PathLike | string;

interface Property {
    type: string;
    description: string;
    format: string;
    examples: any;
    enum?: object[] | string[] | number[] | boolean[];
    default?: string | object | number | string[] | object[] | number[];
    additionalProperties?: string;
    patternProperties?: string;
    uniqueItems?: boolean;
    minItems?: number;
    items: object[] | string[] | number[] | boolean[];
}

interface Requirement {
    type: string
    description: string

    format?: string;
    enum?: string | object;
    additionalProperties?: object;
    patternProperties?: string | object;
    minItems?: string[] | object[]
}

type Properties = Iterable<readonly [ string | number | symbol, Property ]>;

interface Input {
    /*** Constructor Name - Unique Identifier for Class, Unrelated to JSON-Schema */
    name: string;

    /*** Schema Title, Name */
    title: string;
    /*** Description of Schema */
    description: string;
    /*** Object type - almost always an Object or Array */
    type: "object" | [ "object", "boolean" ];
    /*** Schema Attributes, Properties */
    properties: Properties;

    /*** List of Required Attributes */
    required?: string[] | undefined | null;
    /*** References, JSON Pointers - `$defs` */
    definitions?: object[] | undefined | null;
}

interface Map {
    title: string;
    description: string;
    type: string | string[];
    properties: Properties;
    required?: string[] | undefined | null;
    definitions?: Object[] | undefined | null;
}

/***
 * JSON Schema Construct
 *
 * @example
 * // Generate a new Constructor, providing the schema name, and file location
 * const constructor = new Constructor( "Lambda", Path.join(Module, "schema", "lambda.schema.json"), false );
 *
 * const defaults = constructor.defaults();
 * const location = constructor.location();
 * const properties = constructor.options();
 *
 * console.debug("[Debug] Properties", properties, "\n");
 * console.debug("[Debug] Defaults (Input)", defaults, "\n");
 * console.debug("[Debug] Location", location, "\n");
 *
 * const success = constructor.validate( { ... defaults, ... { name: "test" } } );
 * console.log( success?.errors ?? "Successfully Validated Schema");
 *
 */
class Constructor implements Input {
    /*** Schema Identifier - `$id` */
    private readonly identifier = "$id";
    /*** Schema URL Definition - `$schema` */
    private readonly schema = "http://json-schema.org/draft-07/schema";

    /*** Constructor Name - Unique Identifier for Class, Unrelated to JSON-Schema */
    readonly name;

    /*** Schema Title, Name */
    readonly title;
    /*** Description of Schema */
    readonly description;
    /*** Object type - almost always an Object or Array */
    readonly type;

    /*** Schema Attributes, Properties */
    readonly properties: Properties;

    /*** File System Location of Target Schema */
    target: File;

    /*** List of Required Attributes */
    readonly required?;
    /*** References, JSON Pointers - `$defs`, `definitions` */
    readonly definitions?;

    private static Compiler = new AJV( { strict: true, allowUnionTypes: true } );
    private static Debug = Boolean( Process.env?.debug ) ?? false;

    /*** Reference Schema for IDE Resolve and Type-Hinting */
    private static Reference = Import( "./base.schema.json" );

    readonly identifiers = {
        properties: () => Object.keys( this.properties ),
        requirements: () => Object.keys( this.required ),
        definitions: () => Object.keys( this.definitions ),
        types: () => Object.values( this.type )
    };

    private readonly compilation: Validate<{ [Symbol.iterator](): Iterator<readonly [ (string | number | symbol), Property ]> }>;

    constructor(name: string, schema: File, debug: boolean = Constructor.Debug) {
        const $: typeof Constructor.Reference = Import( String( schema ) );

        this.target = schema;

        this.name = name;

        this.identifier = $.$id;
        this.schema = $.$schema;

        this.title = $.title;

        this.description = $.description;
        this.type = $.type;
        this.properties = $.properties;
        this.required = $.required ?? [];
        this.definitions = $.definitions ?? [];

        this.compilation = Constructor.compile( {
            title: this.title,
            description: this.description,
            type: this.type,
            properties: this.properties,
            required: this.required,
            definitions: this.definitions
        } );

        (debug) && console.debug( "[Debug]", this );
    }

    /*** Data Validator */
    public validate(data: any): Ajv {
        Constructor.Compiler.validate( this.compilation.schema, data );

        return Constructor.Compiler;
    }

    /*** Generate Opinionated Defaults According to Definitions in Schema */
    public defaults() {
        const data: object | any = {};
        const target = this.identifiers.properties();

        target.forEach( ($) => {
            const instance: Property = Reflect.get( this.properties, $ );
            if ( instance.default ) {
                data[$] = instance.default;
            }
        } );

        return data;
    }

    /*** Alias method for `required` */
    public requirements (): string[] {
        return this.required;
    }

    /*** Utility method for getting all Constructor type's options */
    public options() {
        return this.properties
    }

    /*** Utility method for getting schema location */
    public location() {
        return this.target
    }

    /***
     * Enable Format Extensions
     *
     * @private
     * @example
     * {
     *     "type": "uri-reference"
     * }
     *
     * @returns {boolean}
     */
    private static format(): boolean {
        $( Constructor.Compiler );

        return true;
    }

    private static compile(schema: Map): Validate<{ [Symbol.iterator](): Iterator<readonly [ (string | number | symbol), Property ]> }> | Generic {
        const $ = (Constructor.format()) && Constructor.Compiler.compile( schema );

        /// If Formatting Failed, or if Errors Occurred
        if ( !$ || $.errors ) {
            const error = new Error();

            error.name = "JSON-Schema-Validation-Error";
            error.message = "Unable to Validate JSON Schema";
            error.stack = JSON.stringify( Constructor.Compiler.errors, null, 4 );

            throw error;
        }

        return $;
    }

    /***
     * Self-Inspection -- Utility Method
     *
     * @returns {string}
     *
     */
    inspect(): string {
        return Utility.inspect(this, {
            showHidden: true,
            showProxy: true,
            colors: true,
            sorted: true,
            depth: Infinity
        });
    }
}

export { Constructor };
export default Constructor;
