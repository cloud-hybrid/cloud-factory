/***
 * @author      Jacob B. Sanders
 * @package     @cloud-technology
 * @summary     ESM Exportable Module
 *
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import Assertion from "assert";
import FS from "fs";
import Module from "module";
import Path from "path";

/*** ESM Resolver for *Current-Working-Directory* */
const CWD: string = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );

/*** ESM Resolver for Package Directory relative to Current Working Directory */
const PKG: string = Path.dirname( CWD );

/*** ESM Resolver for Source Directory relative to the Current Working Directory */
const Source: string = Path.dirname( PKG );

/*** ESM Resolver for Schemas Directory relative to the Current Working Directory */
const Schemas: string = Path.dirname( Source );

/*** ESM Compatability & JSON Importer */
const Import: NodeRequire = Module.createRequire( import.meta.url );

const Schema: typeof import("../../schema/lambda/layer.schema.json") = Import( Path.join( Schemas,
    "layer.schema.json" ) );

class Layer {
    /*** The importable package name of the lambda-layer as resolved from lambda function source code. */
    public name: string;

    /*** A description of the lambda-layer dependencies. */
    public description: string;

    /*** S3-Uri or Local File-System Location of source code. */
    public uri: string;

    /// /*** Options are Retain and Delete. Defaults to Retain. When Retain is set, a transformed resource is created so CloudFormation does not delete old versions after an update. */
    /// public retention?: string;

    /*** List of runtimes compatible with the layer. Value is strictly set to ensure compatibilities & consistent deployable(s). */
    public readonly runtime?: string = "node14.x";

    /*** Schema Definition */
    public readonly schema: typeof Schema = Schema;

    /***
     * Lambda Layer Constructor
     * ------------------------
     *
     * @param name {string} The importable package name of the lambda-layer as resolved from lambda function source code.
     * @param description {string} A description of the lambda-layer dependencies.
     * @param uri {{ type: {"s3"|"local"}, value: {string}}} A URI type that extends the location string; allows for greater flexibility
     *      with runtime assertions further than that of a regular expression. `value` is an S3-Uri or Local File-System Location of source code.
     */

    constructor(name: string, description: string, uri: { type: "s3" | "local", value: string }) {
        this.name = name;
        this.description = description;

        // @todo S3 existence check + string regular expression validation

        if ( uri.type === "local" ) {
            Assertion.strictEqual( FS.existsSync( Path.resolve( uri.value ) ), true );
        }

        this.uri = Path.resolve( uri.value );
    }
}