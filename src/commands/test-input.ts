import { Argv } from "../cli/arguments.js";
import { Prompt } from "../utilities/prompt.js";

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
    const Syntax = (command: string) => [ command, "? [--debug]" ].join( " " );

    Arguments.hide( "version" );
    Arguments.help( "help", "Display Usage Guide" ).default( "help", false );

    Arguments.option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", true );
    Arguments.describe( "debug", "Enable Debug Logging" );

    Arguments.example( "Global", Syntax( "npx cli test-input" ) );
    Arguments.example( "Node", Syntax( "node cli test-input" ) );
    Arguments.example( "NPM", Syntax( "npm run cli -- test-input" ) );

    Arguments.usage( [ "Usage" + ":", "  >>> npm run cli -- test-input", "  >>> npm run cli -- test-input --debug", "  >>> npm run cli -- test-input --help" ].join(
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

    Configuration( Arguments );

    const Query = await Prompt( "Arbitrary User-Input" + ":" + " " );

    Arguments.check( ($: any) => {
        ( $?.debug ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );
        ( $?.debug ) && console.log( "[Debug] User-Input" + ":", Query );

        return true;
    } ).strict();
};

export { Command as Input };

export default { Command };