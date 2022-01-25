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

/*** *Current Working Directory* */
const CWD: string = Path.dirname( File );

/*** *Package Directory* */
const PKG: string = Path.dirname( CWD );

/*** Repository */
const Repository: string = Path.resolve( CWD, "..", "..", "..", ".." );

/***
 *  JSON Capable Importer
 *
 *  @type {NodeRequire}
 *
 */

const Import = Module.createRequire( PKG );

/*** Exclusions to Avoid Recursive Parsing; i.e. libraries, lambda-layers, or otherwise bundled requirements */
const Exclusions = [ ".git", ".idea", ".vscode", "cdktf.out", "templates", "documentation", "scripts" ];

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

    Arguments.example( "Global", Syntax( "npx cli factory main" ) );
    Arguments.example( "Node", Syntax( "node cli factory main" ) );
    Arguments.example( "NPM", Syntax( "npm run cli -- factory main" ) );

    Arguments.usage( [ "Usage" + ":", "  >>> npm run cli -- factory main", "  >>> npm run cli -- factory main --help", "  >>> npm run cli -- factory main --debug" ].join(
        "\n" ) );
}

/***
 * Recursive Copy Function
 * -----------------------
 * *Note* - this will perform *actual, real copies*; symbolic links are resolved to their raw pointer location(s).
 *
 * These are important considerations especially when building for reproducible distributions.
 *
 * @param source {string} Original Source Path
 * @param target {string} Target Copy Destination
 *
 * @param debug {boolean}
 * @constructor
 *
 */

function Copy(source: string, target: string, debug: boolean = false) {
    FS.mkdirSync( target, { recursive: true } );
    FS.readdirSync( source,
        { withFileTypes: true } ).filter( ($) => ( !Exclusions.includes( $.name ) ) ).forEach( ($) => {
        const Directory = FS.lstatSync( Path.join( source, $.name ), { throwIfNoEntry: true } ).isDirectory();
        const File = FS.lstatSync( Path.join( source, $.name ), { throwIfNoEntry: true } ).isFile();

        if ( File ) {
            try {
                FS.copyFileSync( Path.join( source, $.name ),
                    Path.join( target, $.name ),
                    FS.constants.COPYFILE_FICLONE );

                ( debug ) && console.debug( "[Debug]" + ":", {
                    Source: Path.join( source, $.name ), Target: Path.join( target, $.name )
                } );
            } catch ( error ) {
                // ...
            }
        } else {
            if ( Directory ) {
                Copy( Path.join( source, $.name ), Path.join( target, $.name ) );
            }
        }
    } );
}

/***
 * Recursive Copy Function (Dry-Run)
 * ---------------------------------
 * @param source {string} Original Source Path
 * @param target {string} Target Copy Destination
 *
 * @constructor
 *
 */

function Dry(source: string, target: string) {
    FS.mkdirSync( target, { recursive: true } );
    FS.readdirSync( source,
        { withFileTypes: true } ).filter( ($) => ( !Exclusions.includes( $.name ) ) ).forEach( ($) => {
        const Directory = FS.lstatSync( Path.join( source, $.name ), { throwIfNoEntry: true } ).isDirectory();
        const File = FS.lstatSync( Path.join( source, $.name ), { throwIfNoEntry: true } ).isFile();

        if ( File ) {
            try {
                console.log( " - " + "Source" + ":" + " " + Path.join( source, $.name ) );
                console.log( " - " + "Target" + ":" + " " + Path.join( target, $.name ) );
            } catch ( error ) {
                // ...
            }
        } else {
            if ( Directory ) {
                Dry( Path.join( source, $.name ), Path.join( target, $.name ) );
            }
        }
    } );
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

    /*** @Task Create No-Prompt Flag to Avoid User Input */

    Configuration( Arguments );

    Arguments.check( async ($) => {
        try {
            console.log( "[Log] Source Directory" + ":", Repository );

            ( $?.debug ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );
            ( $?.debug ) && console.debug( "Current Directory" + ":", Process.cwd(), "\n" );

            console.log( "\n" + "[Log] Writing File Structure ...", "\n" );

            await Remove( Path.join( Process.cwd(), "factory" ), { force: true, recursive: true } );

            ( $?.debug ) && Dry( Repository, Path.join( Process.cwd(), "factory" ) );

            // @ts-ignore
            Copy( Repository, Path.join( Process.cwd(), "factory" ), $?.debug );

            /// Install Dependencies
            await Subprocess( "npm install --global", Path.join( Process.cwd(), "factory" ) );
            await Subprocess( "npm install typescript --global", Path.join( Process.cwd(), "factory" ) );
            await Subprocess( "npm install cdktf@latest --global", Path.join( Process.cwd(), "factory" ) );

            Copy( Path.join( Process.cwd(), "distribution" ), Path.join( Process.cwd(), "factory", "distribution" ) );

            await Subprocess( "cdktf get", Path.join( Process.cwd(), "factory", "distribution" ) );
            await Subprocess( "cdktf synth", Path.join( Process.cwd(), "factory", "distribution" ) );

            return true;
        } catch ( error ) {
            console.trace( error );

            return false;
        }
    } ).strict();
};

export { Command as Generate };

export default { Command };