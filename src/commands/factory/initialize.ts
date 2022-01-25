import Assertion from "assert";
import FS from "fs";
import Module from "module";
import Path from "path";
import Process from "process";
import Utility from "util";

import { Argv } from "yargs";

import { Distributable } from "../../library/types/distributable.js";

const Remove = Utility.promisify( FS.rm );

/*** *Current Module Path* */
const File: string = import.meta.url.replace( "file" + ":" + "//", "" );
const Import: NodeRequire = Module.createRequire( File );

/***
 * Lambda Functions
 * ----------------
 * Locates Lambda Functions
 *
 * @param directory {string}
 * @constructor
 *
 */

function * Packages(directory: string): Generator {
    /*** Exclusions to Avoid Recursive Parsing; i.e. libraries, lambda-layers, or otherwise bundled requirements */
    const Exclusions = [ ".git", "library" ];

    const Files = FS.readdirSync( directory, { withFileTypes: true } );
    for ( const file of Files ) {
        if ( !Exclusions.includes( file.name ) ) {
            if ( file.isDirectory() ) {
                yield * Packages( Path.join( directory, file.name ) );
            } else {
                yield Path.join( directory, file.name );
            }
        }
    }
}

/***
 * Library (Lambda Layers)
 * -----------------------
 * Locates Lambda Layers
 *
 * @param directory {string}
 * @constructor
 *
 */

function * Library(directory: string): Generator {
    const Inclusions = [ "library" ];

    const Files = FS.readdirSync( directory, { withFileTypes: true } );

    for ( const file of Files ) {
        if ( Inclusions.includes( file.name ) ) {
            if ( file.isDirectory() ) {
                yield * Packages( Path.join( directory, file.name ) );
            } else {
                yield Path.join( directory, file.name );
            }
        }
    }
}

/***
 * NPM Package Directory Locator
 * -----------------------------
 * Locates Packages based on simple file inclusion: `package.json`
 *
 * @param files {string[]}
 *
 * @constructor
 *
 */

function Locate(files: string[] | any) {
    const Data: string[] = [];

    for ( const file in files ) {
        const Target = files[ file ];
        if ( Target.includes( "package.json" ) && !Target.includes( "scripts" ) ) {
            Data.push( Path.dirname( Target ) );
        }
    }

    return Data;
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

    Arguments.check( async ($: { [ p: string ]: unknown, _: ( string | number )[], $0: string }) => {
        await Remove( Path.join( Process.cwd(), "distribution" ), { recursive: true, force: true, maxRetries: 5 } );
        await Remove( Path.join( Process.cwd(), "factory" ), { recursive: true, force: true, maxRetries: 5 } );

        $.debug = ( $?.debug === true ) ? $.debug : false;

        ( $?.debug ) && console.debug( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        const packages = [ ... Packages( Process.cwd() ) ];
        const library = [ ... Library( Process.cwd() ) ];

        ( $?.debug ) && console.debug( "[Debug] Runtime Location" + ":", import.meta.url, "\n" );
        ( $?.debug ) && console.debug( "[Debug] CWD" + ":", Process.cwd(), "\n" );
        ( $?.debug ) && console.debug( "[Debug] File Structure (Packages)" + ":", [ packages ], "\n" );
        ( $?.debug ) && console.debug( "[Debug] File Structure (Library)" + ":", [ library ], "\n" );

        /***
         * Configuration File Assertion
         * ----------------------------
         * ***Note*** - the `factory.json` file is a hard requirement
         *
         */

        Assertion.strictEqual( FS.existsSync( Path.join( Process.cwd(), "factory.json" ) ),
            true,
            "factory.json Configuration Not Found"
        );

        const Factory: object = Import( Path.join( Process.cwd(), "factory.json" ) );

        ( $?.debug ) && console.debug( "[Debug] Factory Definition (factory.json)" + ":", Factory, "\n" );

        /*** Recursively Searched Folder(s) w/package.json Files, Excluding Library */
        const Resources = Locate( packages ); // ==> Lambda Functions

        ( $?.debug ) && console.debug( "[Debug] Target Package(s) (Resources)" + ":", Resources, "\n" );

        const Share = Locate( library ); // ==> Lambda Layers

        ( $?.debug ) && console.debug( "[Debug] Target Library (Shared Resources)" + ":", Share, "\n" );

        for ( const Target of Resources ) Distributable.define( Target, false );
        for ( const Target of Share ) Distributable.define( Target, true );

        ( $?.debug ) && console.debug( "[Debug] Distribution + Package Data" + ":", Distributable.packages, "\n" );
        ( $?.debug ) && console.debug( "[Debug] Compiling Distribution(s) ..." + "\n" );

        await Distributable.distribute();

        ( $?.debug ) && console.debug( "[Debug] Writing factory.json Distribution ...", "\n" );
        FS.writeFileSync( Path.join( Process.cwd(), "distribution", "factory.json" ), JSON.stringify( Factory ) );

        ( $?.debug ) && console.debug( "[Debug] Initialization Complete", "\n" );

        return true;
    } ).strict();
};

export { Command as Initialize };

export default { Command };