import FS from "fs";
import Process from "process";

import { Argv } from "yargs";

import { Secrets } from "../../library/aws/index.js";

import TTY from "../../utilities/tty.js";
import { Prompt } from "../await-input.js";

/*** Debug Console Utility String Generator */
const Input = (input: ( string | number )[]) => "[Debug] CLI Input" + " " + "(" + input.toString().replace( ",", ", " ).toUpperCase() + ")";

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
    Arguments.hide( "version" );
    Arguments.help( "help", "Display Usage Guide" ).default( "help", false );

    Arguments.option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", false );
    Arguments.describe( "debug", "Enable Debug Logging" );
}

/***
 * Module Entry-Point Command
 * ==========================
 *
 * @param $ {Argv} Commandline Arguments
 *
 * @constructor
 *
 */

const Command = async ($: Argv) => {
    const Arguments: Argv = $;

    Configuration(Arguments);

    const Function = Secrets.Service?.commands?.getSecretValue ?? null;

    Arguments.check( async ($) => {
        ( $?.debug ) && ( TTY ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        const Resource: string = ( $?.name ?? null ) ? String( $.name ) : await Prompt( "Secret (Resource Name)" );

        ( $?.name ?? null ) || Process.stdout.write( "\n" );

        const Response = ( Function ) ? await Function( {
            SecretId: Resource
        } ) : null;

        const Data = Response?.SecretString ?? null;
        return true;
    } ).strict();
};

export { Command as Select };

export default { Command };
