import FS from "fs";
import Process from "process";

import { Argv } from "yargs";

import { Secrets } from "../../library/aws/index.js";

import TTY from "../../utilities/tty.js";
import { Prompt } from "../await-input.js";

import { Parameter } from "@cloud-technology/parameter";

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

    Arguments.check( async ($) => {
        ( $?.debug ) && ( TTY ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        if (!( $?.name ?? null )) {
            console.log("The parameter's name must use a \"/\" separated");
            console.log("convention, including the following attributes" + ":");
            console.log("   - Organization (Business-Name)");
            console.log("   - Environment (Target Common-Name)");
            console.log("   - Application (Program or Application)");
            console.log("   - Resource (Resource Type)");
            console.log("   - Provider (Cloud Related Service)");
            console.log("   - Identifier (Unique Qualifier)");
            console.log("");
            console.log("Example: IBM/Production/Audit-Service/Storage/Watson-AI/Credentials");
            console.log("");
        }

        const Resource = Parameter.instantiate(( $?.name ?? null ) ? String( $.name ) : String(await Prompt( "Name" )));
        const Description: string = ( $?.description ?? null ) ? String( $.description ) : await Prompt( "Description" );
        const Secret: string = ( $?.secret ?? null ) ? String( $.secret ) : await Prompt( "Secret File" );

        ( $?.name ?? null ) || Process.stdout.write( "\n" );

//        const Response = ( Function ) ? await Function({ Name: Resource, ForceOverwriteReplicaSecret: true, Description: Description, SecretString: } ) : null;
//
//        const Data = Response?.SecretString ?? null;
//
//        ( ( TTY ) && !( $[ "value-only" ] ) && !( $.file ) ) && console.log( "[Log] API Response" + ":", JSON.stringify( Response, null, 4 ) );
//        ( ( TTY ) && ( $[ "value-only" ] ) && !( $.file ) ) && console.log( ( Data ) ? JSON.parse( Data ?? "" ) ?? JSON.stringify( Data, null, 4 ) ?? Data : "", "\n" );
//
//        ( !( TTY ) && !( $[ "value-only" ] ) && !( $.file ) ) && Process.stdout.write( JSON.stringify( Response, null, 4 ) );
//        ( !( TTY ) && ( $[ "value-only" ] ) && !( $.file ) ) && Process.stdout.write( Data ?? "" );
//
//        ( $.file ?? null ) && !( $[ "value-only" ] ) && FS.writeFileSync( String( $.file ) ?? "Fatal-Error.log", JSON.stringify( Response, null, 4 ) );
//        ( $.file ?? null ) && ( $[ "value-only" ] ) && FS.writeFileSync( String( $.file ) ?? "Fatal-Error.log", ( typeof Data === "string" ) ? JSON.stringify( JSON.parse( Data ), null, 4 ) : JSON.stringify( Data, null, 4 ) );

        return true;
    } ).strict();
};

export { Command as Create };

export default { Command };
