import Assertion from "assert";
import FS from "fs";
import Path from "path";
import Process from "process";

import { Argv } from "../../cli/arguments.js";

import { Local } from "../../utilities/environment.js";

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
    // const Syntax = (command: string) => [command, "? [--json] ? [--file \"FILE\"] ? [--debug] ? [--help]"].join(" ");

    Arguments.hide( "version" );
    Arguments.help( "help", "Display Usage Guide" ).default( "help", false );

    Arguments.option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", false );
    Arguments.describe( "debug", "Enable Debug Logging" );

    Arguments.option( "json", { type: "boolean" } ).alias( "json", "j" ).default( "json", true );
    Arguments.describe( "json", "Print to Stream as JSON Serialized Object" );

    Arguments.option( "file", { type: "string" } ).alias( "file", "f" ).default( "file", null );
    Arguments.describe( "file", "Write Current-Working-Directory to [FILE]" );

    // Arguments.example("Global", Syntax("npx cli cwd"));
    // Arguments.example("Node", Syntax("node cli cwd"));
    // Arguments.example("NPM", Syntax("npm run cli -- cwd"));

    // Arguments.usage([
    //     "Usage" + ":",
    //     "  >>> npm run cli -- cwd",
    //     "  >>> npm run cli -- cwd --help",
    //     "  >>> npm run cli -- cwd --json",
    //     "  >>> npm run cli -- cwd --debug",
    //     "  >>> npm run cli -- cwd --file \"Settings.json\""
    // ].join("\n"));
}

/***
 * Command Extension, Composition
 *
 * Writes data output to a user-provided local file.
 *
 * @param data {string | FS.PathLike} File Content(s)
 * @param target {string | FS.PathLike} Target File-Name
 * @param debug {Boolean | false} Enable Debug Logging
 *
 * @constructor
 *
 */

function Write(data: string, target: string, debug = false) {
    ( debug ) && console.debug( "[Debug] (Serialize) Input", JSON.stringify( {
        Data: JSON.parse( data ), Target: target, Debug: debug
    }, null, 4 ), "\n" );

    const CWD = Process.cwd();
    const Target = Path.relative( CWD, target );

    Assertion.notStrictEqual( target, "" );
    Assertion.strictEqual( CWD, Local );

    FS.writeFileSync( Target, data );

    return { Target, data, debug };
}

/***
 * Command Extension, Composition
 *
 * Writes data output to TTY Stream
 *
 * @param data {Object | String | Any} Output Data
 * @param serialize {Boolean | true}
 * @param debug {Boolean | false} Enable Debug Logging
 *
 * @constructor
 *
 */

function Output(data: any, serialize = true, debug = false) {
    ( debug ) && console.debug( "[Debug] (Output) Input", JSON.stringify( {
        Data: data, Serialize: serialize, Debug: debug
    }, null, 4 ), "\n" );

    ( serialize ) && Process.stdout.write( JSON.stringify( data, null, 4 ) + "\n" + "\n" );
    ( serialize ) || Process.stdout.write( data + "\n" + "\n" );

    return { data, serialize, debug };
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

    if ( Local === "" ) {
        Process.stderr.write( "[Warning] CWD is intended for usage with NPM only." + "\n" );
        Process.stderr.write( "... If there doesn't exist a package.json file relative to the current" + "\n" );
        Process.stderr.write( "... working directory, or if using `node`, CWD will return \"\"" + "\n" );

        Process.stdout.write( "\n" );
    }

    const Data = { "CWD": Local };
    const Serial = JSON.stringify( Data, null, 4 );

    Arguments.check( async ($) => {
        ( $?.debug ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        const Mapping = {
            file: ( $?.file ) ? Write( Serial, String( $?.file ), Boolean( $?.debug ) ) : null,
            json: ( $?.json ) ? Output( Data, true, Boolean( $?.debug ) ) : ( $?.json === false ) ? Output( Local,
                false,
                Boolean( $?.debug ) ) : null
        };

        ( $?.debug ) && console.dir( Mapping );

        return true;
    } ).strict();
};

export { Command as CWD };

export default { Command };