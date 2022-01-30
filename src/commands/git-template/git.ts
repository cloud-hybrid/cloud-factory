import Path from "path";

import { Argv } from "yargs";
import { Constructor } from "../../constructs/constructor";

import { Handler, Option } from "../../constructs/selection";

const Module = Path.dirname(import.meta.url.replace("file://", ""));

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

        const constructor = new Constructor( "Lambda", Path.join(Module, "schema", "lambda.schema.json"), false );

        const defaults = constructor.defaults();
        const location = constructor.location();
        const properties = constructor.options();

        ( $?.debug ) && console.debug("[Debug] Properties", properties, "\n");
        ( $?.debug ) && console.debug("[Debug] Defaults (Input)", defaults, "\n");
        ( $?.debug ) && console.debug("[Debug] Location", location, "\n");

        const requirements = Object.entries(constructor.requirements());
        const options = requirements.map(($) => {
            return new Option( {
                name: $[1],
                value: $[1]
            } );
        });

        const handler = new Handler(options);

        const data = { ... defaults, ... await handler.prompt(options) }

        const validation = constructor.validate( data);
        console.log( validation?.errors ?? "Successfully Validated Schema", data);
        return true;
    } ).strict();
};

export { Command as Git };

export default { Command };