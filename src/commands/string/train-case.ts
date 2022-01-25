import Module from "module";
import Path from "path";
import Process from "process";

import { Argv } from "../../cli/arguments.js";
import { Prompt } from "../../utilities/prompt.js";

/***
 *
 * @param input
 * @param options
 *
 * @constructor
 *
 */

const Case = (input: string, options: { condense: boolean } | null | undefined = { condense: true }) => {
    if ( typeof input !== "string" ) throw new TypeError( "Input Parameter Expected String-Type" );

    return input.trim()
        .replace( /_/g, "-" )
        .replace( /([a-z])([A-Z])/g, "$1-$2" )
        .replace( /\W/g, ($) => /[À-ž]/.test( $ ) ? $ : "-" )
        .replace( /^-+|-+$/g, "" )
        .replace( /-{2,}/g, ($) => options && options.condense ? "-" : $ )
        .toLowerCase();
};

/*** *Current Module Path* */
const File: string = import.meta.url.replace( "file" + ":" + "//", "" );

/*** *Current Working Directory* */
const CWD: string = Path.dirname( File );

/*** *Package Directory* */
const PKG: string = Path.dirname( CWD );

/***
 *  JSON Capable Importer
 *
 *  @type {NodeRequire}
 *
 */

const Import = Module.createRequire( PKG );

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

    Configuration( Arguments );

    Arguments.check( async ($) => {
        ( $?.debug ) && console.debug( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        const Directory = Path.resolve( Process.cwd() );

        const Parameter = async () => await Prompt( "Input" + ":" + " " );

        let truthy: string = await Parameter().then( ($) => Case( $ ) );

        while ( truthy.trim().length === 0 ) truthy = await Parameter().then( ($) => Case( $ ) );

        Process.stdout.write( "\n" + truthy + "\n" );

        return true;
    } ).strict();
};

export { Command as Train };

export default { Command };