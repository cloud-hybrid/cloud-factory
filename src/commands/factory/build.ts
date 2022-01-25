import Assertion from "assert";
import FS from "fs";
import Module from "module";
import Path from "path";
import Process from "process";
import Utility from "util";

import { Argv } from "../../cli/arguments.js";
import { Subprocess } from "../../utilities/subprocess.js";

const Remove = Utility.promisify( FS.rm );

/*** *Current Module Path* */
const File: string = import.meta.url.replace( "file" + ":" + "//", "" );

const Import: NodeRequire = Module.createRequire( File );

/*** *Current Working Directory* */
const CWD: string = Path.dirname( File );

/*** *Package Directory* */
const PKG = Path.resolve( CWD, "..", "..", "..", ".." );

/*** Target Workable Directory (packages) */
const Target = Path.join( PKG, "packages" );

/*** Packages */
const Targets = ( FS.existsSync( Target ) ) ? FS.readdirSync( Target,
    { withFileTypes: true } ).filter( ($) => $.isDirectory() ) : null;

/***
 * Library
 * -------
 * The library folder is to be used as a buffer for lambda-related dependencies; the goal here is to keep an easy
 * to understand, and single folder in the `packages` directory for exclusion(s). All other folders that get
 * cloned (via git) into the packages directory can be parsed for `package.json` files to then be later built
 * independently of one-another, while still getting potential lambda layers -- all from the same, reproducible
 * source(s).
 *
 */

const Library = Path.join( PKG, "packages", "library" );

/*** Exclusions to Avoid Recursive Parsing; i.e. libraries, lambda-layers, or otherwise bundled requirements */
const Exclusions = [ "library", "node_modules" ];

interface Package {
    Name: string;

    Dependencies: { string: string } | null;

    Directory: string,

    Version: string | null;

    Description: string | null;

    Package: string;

    Layer: boolean;
}

function * Walk(directory: string): Generator {
    const Files = FS.readdirSync( directory, { withFileTypes: true } );
    for ( const file of Files ) {
        if ( !Exclusions.includes( file.name ) ) {
            if ( file.isDirectory() ) {
                yield * Walk( Path.join( directory, file.name ) );
            } else {
                yield Path.join( directory, file.name );
            }
        }
    }
}

function * Parse(directory: string): Generator {
    const Files = FS.readdirSync( directory, { withFileTypes: true } );
    for ( const file of Files ) {
        if ( file.isDirectory() ) {
            yield * Walk( Path.join( directory, file.name ) );
        } else {
            yield Path.join( directory, file.name );
        }
    }
}

/***
 * Recursive Copy Function
 * -----------------------
 * *Note* - this will perform *actual, real copies*; symbolic links are resolved to their raw pointer location(s).
 *
 * These are important considerations especially when building for reproducible distributions.
 *
 * @param source {String} original path
 * @param target {String} target copy destination
 *
 * @constructor
 *
 */

function Copy(source: string, target: string) {
    FS.mkdirSync( target, { recursive: true } );
    FS.readdirSync( source ).forEach( (element) => {
        const Directory = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isDirectory();
        const Socket = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isSocket();

        if ( !Directory && !Socket ) {
            FS.copyFileSync( Path.join( source, element ), Path.join( target, element ) );
        } else {
            if ( !Socket ) {
                Copy( Path.join( source, element ), Path.join( target, element ) );
            }
        }
    } );
}

/***
 * Layer Builder
 * -------------
 * @param source
 * @param target
 *
 * @constructor
 *
 */

function Layer(source: string, target: string) {
    FS.statSync( target, { throwIfNoEntry: true } );
    FS.readdirSync( source ).forEach( (element) => {
        const Target = Path.join( source, element );
        const File = FS.lstatSync( Target, { throwIfNoEntry: true } ).isFile();
        const Descriptor = Path.parse( Target );

        if ( File && Descriptor.ext === ".js" ) {
            FS.copyFileSync( Path.format( Descriptor ), Path.join( target, Descriptor.base ) );
        } else {
            if ( Descriptor.base === "package.json" ) {
                FS.copyFileSync( Path.format( Descriptor ), Path.join( target, Descriptor.base ) );
            } else {
                ( File ) && FS.copyFileSync( Path.format( Descriptor ), Path.join( target, Descriptor.base ) );
            }
        }
    } );
}

/***
 * `package.json` Directory Locator
 * --------------------------------
 *
 * @param files
 *
 * @constructor
 *
 */

function Locate(files: string[] | any) {
    const Data: string[] = [];

    for ( const file in files ) {
        const Target = files[ file ];
        if ( Target.includes( "package.json" ) ) {
            Data.push( Path.dirname( Target ) );
        }
    }

    return Data;
}

/***
 * Distribution Folder Structure Normalization
 * -------------------------------------------
 * Building a Layer via Shell or Bash:
 *
 *  ```bash
 *  #!/bin/bash --norc
 *
 *  set -eo pipefail
 *
 *  mkdir -p layer/nodejs
 *
 *  rm -r -f node_modules
 *  rm -r -f layer/nodejs/node_modules
 *
 *  npm install --production
 *
 *  mv node_modules layer/nodejs/node_modules
 *
 *  exit 0
 *  ```
 * @param data
 * @constructor
 */

async function Distribution(data: Package[]) {
    const Directory = Path.join( Target, "distribution" );
    const Layers = Path.join( Directory, "library" );

    for ( const $ of data ) {
        /// Name, Target Directory
        const Name = $.Name;

        /// Old Working Directory := Current Working Directory
        const OWD = Process.cwd();

        /// Target Working Directory
        Process.chdir( $.Directory );

        /// Current Working Directory
        const CWD = Process.cwd();

        /// Should Never Happen, but Technically is Possible
        Assertion.strictEqual( $.Directory, CWD, "Process Directory Drift" );

        /// Cleanse Directories if Applicable
        await Remove( Path.join( CWD, "node_modules" ), { recursive: true, force: true } );
        await Remove( Path.join( CWD, Name ), { recursive: true, force: true } );

        /// Install only Production-based Lambda Dependencies
        await Subprocess( "npm install --production" );

        if ( $.Layer === true ) {
            /// Copy Layer Dependencies
            Copy( Path.join( CWD, "node_modules" ), Path.join( CWD, Name, "nodejs", "node_modules" ) );
            await Remove( Path.join( CWD, "node_modules" ), { recursive: true, force: true } );

            /// Copy the Layer File(s), Shallow
            Layer( CWD, Path.join( CWD, Name, "nodejs" ) );

            /// Copy Layer Folder into the Distribution Library
            Copy( Path.join( CWD, Name ), Path.join( Layers, Name ) );
            await Remove( Path.join( CWD, Name ), { recursive: true, force: true } );

            Process.chdir( OWD );
        } else {
            if ( $.Layer === false ) {
                /// Copy Lambda Folder into the Distribution Library, Recursively
                Copy( CWD, Path.join( Directory, Name ) );
                await Remove( Path.join( CWD, "node_modules" ), { recursive: true } );

                Process.chdir( OWD );
            }
        }
    }
}

/*** Debug Console Utility String Generator */
const Input = (input: ( string | number )[]) => "[Debug] CLI Input" + " " + "(" + input.toString().replace( ",",
    ", " ).toUpperCase() + ")";

/***
 * Command Configuration, Composition
 *
 * Acquires and configures settings specific to the module's {@link Command} Function-Constant.
 *
 * @param Arguments {Argv} CLI Input Arguments for Derivative Command
 *
 * @constructor
 *
 */

function Configuration(Arguments: Argv) {
    const Syntax = (command: string) => [ command, "? [--debug] ? [--help]" ].join( " " );

    Arguments.hide( "version" );
    Arguments.help( "help", "Display Usage Guide" ).default( "help", false );

    Arguments.option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", false );
    Arguments.describe( "debug", "Enable Debug Logging" );

    Arguments.example( "Global", Syntax( "npx cli cdfk build" ) );
    Arguments.example( "Node", Syntax( "node cli cdfk build" ) );
    Arguments.example( "NPM", Syntax( "npm run cli -- cdfk build" ) );

    Arguments.usage( [ "Usage" + ":", "  >>> npm run cli -- cdfk build", "  >>> npm run cli -- cdfk build --help", "  >>> npm run cli -- cdfk build --debug" ].join(
        "\n" ) );
}

/***
 * Module Entry-Point Command
 * ==========================
 *
 * @param $ {Argv} Commandline Arguments (Implicitly passed from cli.ts).
 *
 * @constructor
 *
 */

const Command = async ($: Argv) => {
    const Arguments: Argv = $;

    console.warn( "[Warning] The Current Command is Under Development." );
    console.warn( "... To view runtime debug logs, provide the \"--debug\" flag", "\n" );

    Configuration( Arguments );

    if ( FS.existsSync( Path.join( Target, "distribution" ) ) ) {
        await Remove( Path.join( Target, "distribution" ), { recursive: true } );
    }

    Arguments.check( async ($) => {
        ( $?.debug ) && console.debug( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        ( $?.debug ) && console.debug( "[Debug] Runtime Location" + ":", import.meta.url, "\n" );
        ( $?.debug ) && console.debug( "[Debug] User CWD" + ":", Process.cwd(), "\n" );
        ( $?.debug ) && console.debug( "[Debug] Package" + ":", PKG, "\n" );

        ( $?.debug ) && console.debug( "[Debug] Directories" + ":", Targets, "\n" );

        const Files = [];
        for ( const filePath of Walk( Path.join( PKG, "packages" ) ) ) {
            Files.push( filePath );
        }

        /*** Recursively Searched Folder(s) w/package.json Files */
        const Dependencies = Locate( Files );

        ( $?.debug ) && console.debug( "[Debug] Located Target Dependencies" + ":", Dependencies, "\n" );

        const Data: {
            Name: string; Dependencies: { string: string } | null; Directory: string, Version: string | null; Description: string | null; Package: string; Layer: boolean;
        }[] = [];

        Dependencies.forEach( (Target) => {
            /// Import the package.json File as an Object via Node-Require Import
            const Package = Import( Path.join( Target, "package.json" ) );

            ( $?.debug ) && console.log( "[Debug] Package" + ":", Package, "\n" );

            /// Scan package.json for its Package-Name -- Stripping the Organization if applicable
            const Expression = RegExp( "(@.*/)?(.*)", "i" );

            const Name = Expression.exec( Package.name )?.pop() || "";

            // Acquire Dependencies.
            //
            // Later, a comparison can be made across all service-related packages, and if any
            // dependencies are found to be in two or more, a lambda-layer or hoisted dependencies list can be
            // built.

            Data.push( {
                Name,
                Dependencies: Package?.dependencies || null,
                Directory: Target,
                Version: Package?.version || null,
                Description: Package?.description || null,
                Package: Path.join( Target, "package.json" ),
                Layer: false
            } );
        } );

        const Requirements = [];
        for ( const filePath of Parse( Library ) ) {
            Requirements.push( filePath );
        }

        const Layers = Locate( Requirements );
        Layers.forEach( (Target) => {
            /// Import the package.json File as an Object via Node-Require Import
            const Package = Import( Path.join( Target, "package.json" ) );

            ( $?.debug ) && console.log( "[Debug] Package" + ":", Package, "\n" );

            /// Scan package.json for its Package-Name -- Stripping the Organization if applicable
            const Expression = RegExp( "(@.*/)?(.*)", "i" );

            const Name = Expression.exec( Package.name )?.pop() || "";

            // Acquire Dependencies.
            //
            // Later, a comparison can be made across all service-related packages, and if any
            // dependencies are found to be in two or more, a lambda-layer or hoisted dependencies list can be
            // built.

            Data.push( {
                Name,
                Dependencies: Package?.dependencies,
                Directory: Target,
                Version: Package?.version || null,
                Description: Package?.description || null,
                Package: Path.join( Target, "package.json" ),
                Layer: true
            } );
        } );

        ( $?.debug ) && console.log( "[Debug] Data" + ":", Data, "\n" );

        await Distribution( Data );

        return true;
    } ).strict();
};

export { Command as Build };

export default { Command };