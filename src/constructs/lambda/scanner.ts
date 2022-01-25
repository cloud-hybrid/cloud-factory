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

/// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- ///

/***
 * Lambda Packaging Requirements
 * -----------------------------
 * The minimal following folder structure is a requirement to deploy a lambda:
 *
 * ```
 * factory
 *  └── packages
 *       ├── artifacts.json
 *       └── service
 *            └── lambda-(n + 1)
 *                 ├── package.json
 *                 └── src
 *                      └── index.js
 * ```
 *
 * Such requirements derive from the following assumptions:
 *      - A) **The lambda function is to be readily available over HTTP protocol**
 *          * At a minimum, a single API Gateway is required
 *      - B) **The lambda function is to be REST-compliant** (without state)
 *          * Any given lambda functions cannot require the state or source dependencies of another
 *      - C) **The lambda function is to be publicly accessible** (authentication being arbitrary)
 *          * Arguably an extension of point A
 *      - D) **The lambda function is to be deployable as *apart of a larger service, or individually***
 *          * Development lifecycles see benefit in this flexibility; deployment runtimes can easily
 *            and expectedly clone in any given repository into a target directory
 *
 * Where `artifacts.json` defines the folder structure and runtime requirements in order for pipelines
 * to compile such compatible folder structure(s). Objectively, it can be assumed that such information that
 * gets written into `artifacts.json` is provided by either package maintainers or a development team(s). Let
 * the following be a list of key-pair definitions for a single object in `artifacts.json`:
 *      - `{ "repository": ".*(git)?+(http?s)//[username]:[token]@hostname/?[folder]/repository.git" }`
 *      - `{ "branch": "string" }`
 *      - `{ "service": "string"|null }`
 */

const Requirements = [];

const Optionals = [];

interface Descriptor {
    /**
     * The file name that this `fs.Dirent` object refers to. The type of this
     * value is determined by the `options.encoding` passed to {@link readdir} or {@link readdirSync}.
     */
    name: string;

    /***
     * Returns `true` if the `fs.Dirent` object describes a regular file.
     */
    isFile(): boolean;

    /**
     * Returns `true` if the `fs.Dirent` object describes a file system
     * directory.
     */
    isDirectory(): boolean;

    /**
     * Returns `true` if the `fs.Dirent` object describes a block device.
     */
    isBlockDevice(): boolean;

    /**
     * Returns `true` if the `fs.Dirent` object describes a character device.
     */
    isCharacterDevice(): boolean;

    /**
     * Returns `true` if the `fs.Dirent` object describes a symbolic link.
     */
    isSymbolicLink(): boolean;

    /**
     * Returns `true` if the `fs.Dirent` object describes a first-in-first-out
     * (FIFO) pipe.
     */
    isFIFO(): boolean;

    /**
     * Returns `true` if the `fs.Dirent` object describes a socket.
     */
    isSocket(): boolean;
}

/***
 * @typedef {
 *     root: {String},
 *     dir: {String},
 *     base: {String},
 *     ext: {String},
 *     name: {String}
 *     $: {Descriptor[]}
 * } Type
 */

interface Type {
    root: string;

    dir: string;

    base: string;

    ext: string;

    name: string;

    $: Type[];
}

/***
 * Directory Name Resolver
 * -----------------------
 *
 * @param path {String|FS.PathLike} Directory or File System Path
 *
 * @return {FS.PathLike|Path.dirname|string}
 *
 * @constructor
 *
 */

const Directory = (path: string) => {
    const Resolved = Path.normalize( path );
    Assertion( FS.existsSync( Resolved ) );

    const Data = {
        ... Path.parse( Resolved ), ... {
            $: FS.readdirSync( Resolved, { withFileTypes: true } )
        }
    };

    console.debug( "[Debug] Directory Type Data" + ":", JSON.stringify( {
        Resolved, Data
    }, null, 4 ), "\n" );

    return Data;
};

/***
 * Parent Directory Name Resolver
 * ------------------------------
 *
 * @param path {String|FS.PathLike} Directory or File System Path
 *
 * @return {FS.PathLike|Path.dirname|string}
 *
 * @constructor
 *
 */

const Parent = (path: string) => {
    const Resolved = Path.dirname( path );
    const Data = {
        ... Path.parse( Resolved ), ... {
            $: FS.readdirSync( Resolved, { withFileTypes: true } )
        }
    };

    console.debug( "[Debug] Directory Type Data" + ":", JSON.stringify( {
        Resolved, Data
    }, null, 4 ), "\n" );

    return Data;
};

/*** Expected: ~ factory/cdfk */
const directory: string = Parent( CWD ).dir;

/*** Expected: ~ factory */
const Package = Parent( directory );
Assertion.strictEqual( Package.name, "factory" );

/*** Expected: "packages" Directory in Package Folder */
const Descriptors = Package.$.map( ($) => $.name );
Assertion.strictEqual( Descriptors.includes( "packages" ), true );

/*** Expected: "packages" Directory */
const Packages = Path.join( Path.format( Package ), "packages" );
Assertion.strictEqual( FS.existsSync( Packages ), true );

console.log( Directory( Packages ) );
