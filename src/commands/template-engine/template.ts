import FS from "fs";
import Process from "process";

import yargs, { Argv } from "yargs";

import TTY from "../../utilities/tty.js";
import { Prompt } from "../../utilities/prompt.js";
import { Template } from "../../library/template-engine/template.js";

/*** Debug Console Utility String Generator */
const Input = (input: ( string | number )[]) => "[Debug] CLI Input" + " " + "(" + input.toString().replace( ",", ", " ).toUpperCase() + ")";

function Configuration(Arguments: Argv) {
    const Syntax = (command: string) => [ command, "? [--debug] ? [--help]" ].join( " " );

    Arguments.hide( "version" );
    Arguments.help( "help", "Display Usage Guide" ).default( "help", false );

    Arguments.option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", false );
    Arguments.describe( "debug", "Enable Debug Logging" );
}

/*** File Input Argument Handler */
const File = async ($: Arguments) => {
    ( $?.file) && console.debug("Located File Argument", $.file);

    let file: string | FS.PathLike = ( $?.file ) ? String($.file) : "";

    const Handler = async () => {
        const $ = await Prompt( "Template File Location" + ":" + " " );

        return $.trim();
    }

    while ( file === "" || !FS.existsSync(file) || !Template.validate(String(file)) ) {
        if (file !== "" && !FS.existsSync(file)) {
            console.log("   - Template File Couldn't be Found");
        }

        if (file !== "" && FS.existsSync(file) && !Template.validate(String(file))) {
            console.log("   - Template File Couldn't Locate any Expression Match(es)");
        }

        file = await Handler().then( ($) => $);
    }

    (FS.existsSync(file)) && console.log("  - Template File Successfully Found");
    (Template.validate(String(file))) && console.log("  - Template File Successfully Validated");
    (FS.existsSync(file) && Template.validate(String(file))) && Process.stdout.write("\n");

    return file;
}

/*** Output-File Argument Handler */
const Output = async ($: Arguments) => {
    ( $?.output) && console.debug("Located File Argument", $.output);

    let output: string | FS.PathLike = ( $?.output ) ? String($.output) : "";

    const Handler = async () => {
        const $ = await Prompt( "Output File Location" + ":" + " " );

        return $.trim();
    }

    while ( output === "" ) output = await Handler().then( ($) => $);

    (FS.existsSync(output)) && console.warn("   - Warning: Target Output Path Will be Overwritten");
    (FS.existsSync(output)) || console.log("   - Target Output Path Validated Empty");

    return output;
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
    Configuration( $ );
    $.check( async ($) => {
        ( $?.debug ) && ( TTY ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        /*** File Input Argument Handler */
        const file = await File($);

        /*** File Output Argument Handler */
        const output = await Output($);

        /*** Continue Handler */
        Process.stdout.write("\n")
        const Continue = async () => {
            return await Prompt( "Continue? (Y/N)" + ":" + " " );
        }

        let trigger: string = await Continue().then( ($) => $.toUpperCase() );
        while ( trigger !== "Y" && trigger !== "N" ) trigger = await Continue().then( ($) => $.toUpperCase() );

        ( trigger === "Y" ) && Process.stdout.write("\n");
        ( trigger === "Y" ) && await Template.hydrate(String(file), String(output));

        return true;
    } ).strict();
};

export type YARGs = yargs.Arguments;
export interface Arguments extends YARGs {
    debug?: string;
    file?: string;
    output?: string;
}

export { Command as Render };

export default { Command };
