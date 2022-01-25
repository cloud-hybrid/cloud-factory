import FS from "fs";
import Module from "module";
import Path from "path";
import Process from "process";

import { Argv } from "../../cli/arguments.js";
import { Flatten } from "../../utilities/flatten.js";
import { Prompt } from "../../utilities/prompt.js";

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

const Schema = {
    "TF": true,
    "CDK": true,
    "CFN": false,
    "Cloud": {
        "Provider": "AWS", "Region": "us-east-2"
    },
    "Source": "src",
    "Service": "Proof-of-Concept",
    "Environment": "Development",
    "Organization": "Cloud-Vault",
    "Deployment": {
        "Type": "Service", "Method": "Single"
    },
    "SAM": "service",
    "Functions": [ "lambda" ]
};

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

    Arguments.example( "Global", Syntax( "npx cli factory configuration" ) );
    Arguments.example( "Node", Syntax( "node cli factory configuration" ) );
    Arguments.example( "NPM", Syntax( "npm run cli -- factory configuration" ) );

    Arguments.usage( [ "Usage" + ":", "  >>> npm run cli -- factory configuration", "  >>> npm run cli -- factory configuration --help", "  >>> npm run cli -- factory configuration --debug" ].join(
        "\n" ) );
}

/***
 * File System Path Resolution Factory
 *
 * @param file {FS.Dirent}
 * @param directory {string | FS.PathLike}
 *
 * @constructor
 *
 */

function Mapper(file: FS.Dirent, directory: string) {
    return {
        Name: file.name, System: Path.join( directory, file.name ), Directory: {
            System: Path.resolve( directory ), Name: Path.basename( directory )
        }
    };
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

    Arguments.check( async ($) => {
        ( $?.debug ) && console.debug( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        ( $?.debug ) && console.debug( "[Debug] User CWD" + ":", Process.cwd(), "\n" );
        ( $?.debug ) && console.debug( "[Debug] Relative Runtime Path(s)" + ":", JSON.stringify( {
            Paths: {
                Runtime: File, Directory: CWD
            }
        }, null, 4 ), "\n" );

        const Directory = Path.resolve( Process.cwd() );
        const Target = Path.join( Directory, "settings.json" );

        /// FS.statSync(Directory, {throwIfNoEntry: false});

        /// const Directories = FS.readdirSync(Directory, {withFileTypes: true}).filter(($) => $.isDirectory()).map(($) => $.name);
        const Files = {
            /*** Abstract File Information Type */
            $: FS.readdirSync( Directory, { withFileTypes: true } ).filter( ($) => $.isFile() ).map( ($) => Mapper( $,
                Directory ) ),
            /*** List of Simple File-Names */
            List: FS.readdirSync( Directory, { withFileTypes: true } ).filter( ($) => $.isFile() ).map( ($) => $.name ),
            /*** Full System Path(s) to User's Current Working Directory's File(s) */
            Paths: FS.readdirSync( Directory,
                { withFileTypes: true } ).filter( ($) => $.isFile() ).map( ($) => Path.join( Directory, $.name ) )
        };

        /*** Trigger Configuration Prompt(s) if settings.json isn't found relative to User's current-working-directory */
        const Trigger = ( !Files.Paths.includes( Target ) );

        ( $?.debug ) && console.debug( "[Debug] Configuration Prompt(s) Trigger" + ":", Trigger, "\n" );

        if ( Trigger ) {
            Process.stdout.write( "A Configuration File (\"settings.json\") Couldn't be Found..." + "\n" );

            const Begin = async () => await Prompt( "    >>> Create File Now? (Y/N)" + ":" + " " );

            let _: string = await Begin().then( ($) => $.toUpperCase() );

            while ( _ !== "Y" && _ !== "N" ) _ = await Begin().then( ($) => $.toUpperCase() );

            switch ( _ ) {
                case "N":
                    break;
                case "Y":
                    const Keys = Flatten( Schema );
                    console.log( Keys );
                    break;
            }
        }

        return true;
    } ).strict();
};

export { Command as Configuration };

export default { Command };