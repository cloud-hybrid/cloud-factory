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

/*** Exclusions to Avoid Recursive Parsing; i.e. libraries, lambda-layers, or otherwise bundled requirements */
const Exclusions = [ ".git", ".idea", ".vscode", "cdktf.out", "templates", "documentation", "scripts" ];

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

//            await Subprocess("git clone --single-branch --no-tags --dissociate https://github.com/cloud-hybrid/cloud-factory.git", Process.cwd(), false);
//
//            Copy(Path.join(Process.cwd(), "cloud-factory"), Process.cwd(), false);

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