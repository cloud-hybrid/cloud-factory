import FS from "fs";
import Path from "path";
import Process from "process";

import { Argv } from "yargs";

import { Subprocess } from "../../utilities/subprocess.js";

/*** Debug Console Utility String Generator */
const Input = (input: (string | number)[]) => "[Debug] CLI Input" + " " + "(" + input.toString().replace( ",",
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

    /*** @Task Create No-Prompt Flag to Avoid User Input */

    Configuration( Arguments );

    Arguments.check( async ($) => {
        try {
            ($?.debug) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );
            ($?.debug) && console.debug( "Current Directory" + ":", Process.cwd(), "\n" );

            Process.chdir( Path.join( Process.cwd(), "distribution" ) );

            const Binaries = FS.readdirSync( Path.join( Process.cwd(), "node_modules", ".bin" ), { withFileTypes: true } )
                .map( ($) => Path.join( Process.cwd(), "node_modules", ".bin", $.name ) );

            Binaries.forEach( ($) => Process.env["PATH"] += ":" + $ );

            console.debug( "[Debug] Local Callable Path(s)" + ":", JSON.stringify( Binaries, null, 4 ), "\n" );

            const CDK = Binaries.indexOf( Path.join( Process.cwd(), "node_modules", ".bin", "cdktf" ) );

            console.log( "[Log] Deploying Stack ...", "\n" );

            await Subprocess( Binaries[CDK] + " " + "deploy --auto-approve", Process.cwd() );

            return true;
        } catch ( error ) {
            console.error( error );

            return false;
        }
    } ).strict();
};

export { Command as Deploy };

export default { Command };