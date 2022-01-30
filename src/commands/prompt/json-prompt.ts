import Utility from "util";

import { Argv } from "../../cli/arguments";
import Prompt from "../../utilities/json-prompt";

/*** *Current Module Path* */
const File: string = import.meta.url.replace( "file" + ":" + "//", "" );

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
 *
 * @param $ {Argv} Commandline Arguments
 *
 * @constructor
 *
 */

const Command = async ($: Argv) => {
    Configuration( $ );

    $.check( async ($) => {
        ( $?.debug ) && console.debug("\n" + "\n" + Input( $._ ), JSON.stringify( $, null, 4 ) );

        const Configuration = async () => ($?.debug)
            ? await Prompt(true) : await Prompt(false);

        const Object = await Configuration();
        const Inspection = Utility.inspect(Object, {
            colors: true,
            breakLength: 120,
            depth: Infinity,
            showProxy: true,
            showHidden: true
        });

        ($?.debug) && process.stdout.write("\n" + Inspection + "\n");

        return true;
    } ).strict();
};

export { Command as JSON };

export default { Command };