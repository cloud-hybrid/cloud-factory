/***
 * @author      Jacob B. Sanders
 * @package     @cloud-technology
 * @summary     ESM Exportable Module
 *
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import { Construct } from "constructs";
import Module from "module";
import OS from "os";
import Path from "path";

import Error from "../../errors/schema.js";

import { Compiler } from "../../utilities/compiler.js";

/// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- ///

/*** ESM Resolver for *Current-Working-Directory* */
const CWD: string = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );

/*** ESM Resolver for Source` Directory relative to Current Working Directory */
const Source: string = Path.dirname( CWD );

/*** ESM Resolver for Package Directory relative to the Current Working Directory */
const PKG: string = Path.dirname( Source );

/*** ESM Resolver for Schemas Directory relative to the Current Working Directory */
const Schemas: string = Path.join( PKG, "schema" );

/*** ESM Resolver for Configuration File relative to the Current Working Directory */
const Configuration: string = Path.join( Schemas, "lambda", "function.schema.json" );

/*** ESM Compatability & JSON Importer */
const Import: NodeRequire = Module.createRequire( import.meta.url );
const Definition: typeof import("../../schema/lambda/function.schema.json") = Import( Configuration );
const Compilation = Compiler.compile( Definition );

/// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- ///

interface Requirements {
    name: string;

    description: string;

    uri: string;
}

interface Configuration {
    name: string;

    description: string;

    uri: string;

    handler?: string | undefined;

    Layers?: string[] | undefined;

    memory?: number | undefined;

    type?: string | undefined;

    runtime?: string | undefined;

    timeout?: number | undefined;

    environment?: { [ p: string ]: string | undefined } | object | undefined;

    tags?: { [ p: string ]: string | undefined } | object | undefined;
}

interface Settings extends Configuration {
    /*** @Task */
}

/// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- ///

class Lambda extends Construct implements Settings {
    /*** Basename of the package's directory. Ex) /Users/Development/Lambda-1 ==> `Lambda-1` */
    readonly name: string;

    /*** A description of the function. */
    readonly description: string;

    /*** Path to the function's deployment package within the local filesystem. */
    readonly uri: string;

    /*** Function entrypoint. Lambda Handler's are strictly set to ensure of consistent architecture(s) & deployable(s). */
    readonly handler: string;

    /**
     * List of Lambda Layers.
     */
    readonly Layers?: string[];

    /***  Lambda runtime memory allocation. Defaults to 128MB */
    readonly memory: number;

    /*** Function Packaging Type. Defaults and is enforced to Zip */
    readonly type: string;

    /*** Program Runtime Environment */
    readonly runtime: string;

    /*** Function timeout. Defaults to 10 seconds */
    readonly timeout: number;

    /*** Environment variables that are accessible from function code during execution */
    readonly environment: { [ p: string ]: string };

    /*** Environment variables that are accessible from function code during execution */
    readonly tags?: { [ p: string ]: string } | undefined;

    /***
     * Lambda Function Constructor
     * ---------------------------
     *
     * @param scope
     * @param id
     * @param name
     * @param description
     * @param uri
     * @param $ { Settings }
     */

    constructor(scope: Construct, id: string, name: string, description: string, uri: string, $: Settings = {
        name, description, uri
    }) {
        super( scope, id );

        this.name = name;
        this.description = description;
        this.uri = uri;

        const Schema = this.validate();

        this.runtime = $?.runtime || Schema.properties.runtime.default;
        this.handler = $?.handler || Schema.properties.handler.default;
        this.memory = $?.memory || Schema.properties.memory.default;
        this.type = $?.type || Schema.properties.type.default;
        this.runtime = $?.runtime || Schema.properties.runtime.default;
        this.timeout = $?.timeout || Schema.properties.timeout.default;

        // @ts-ignore
        this.environment = $?.Environment || Schema.properties.environment.default;

        this.tags = Schema.properties.tags.default;

        this.confirm();
    }

    public confirm() {
        this.validate();
    }

    private validate() {
        Compilation( this );

        // @ts-ignore
        const $: typeof Definition = Compilation.schema;

        if ( Compilation?.errors ) {
            throw new Error( {
                name: "Lambda-Schema-Error", message: JSON.stringify( {
                    Error: Compilation.errors.map( ($) => $ ) // Instance: this
                }, null, 4 )
            }, OS.constants.signals.SIGTERM, this.constructor );
        }

        return $;
    }
}

export { Lambda };

export default Lambda;