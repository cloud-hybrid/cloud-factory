/***
 * Usage Example
 *
 * @example
 * await import("@cloud/library/json-prompt");
 *
 * @example
 * const Configuration = await import("@cloud/library/json-prompt");
 * const environment = Configuration.environment;
 * console.log(Configuration, environment);
 *
 */

import FS from "fs";

import Process from "process";
import Input from "readline";
import Utility from "util";

type Generic = any;

const Awaitable = (query: string, buffer: [ string? ]) => {
    return new Promise( async (resolve, reject) => {
        let $: string | Generic = "";

        const Interface = Input.createInterface( {
            input: Process.openStdin(), output: Process.stdout
        } );

        Interface.on( "line", (line) => {
            buffer.push( line );
        } );

        Interface.on( "SIGINT", () => {
            buffer.push( "EOF" );

            resolve( buffer );
        } );

        try {
            $ = await Utility.promisify( Interface.question ).bind( Interface )( query );
        } catch ( error ) {
            reject( error );
        } finally {
            Interface.close();
        }

        resolve( $ );
    } );
};

const File = async (title: string) => {
    const buffer: [ string? ] | Generic = [];
    const Input = async () => await Awaitable( title + ":" + " ", buffer );

    buffer.unshift( await Input().then( (output) => output ) );

    return [ buffer.join( "\n" ), buffer.join( "" ) ];
};

const Prompt = async () => {
    return await File( "Configuration" );
};

Process.stdout.write( "Please Provide Configuration File" + ":" + " " );
const $ = await Prompt();
const Parse = (debug = false) => {
    try {
        return JSON.parse( $[0] );
    } catch ( error ) {
        try { /// Append "}" to Buffer
            if ( !FS.existsSync( $[1] ) ) {
                const mutation = $[0] + "\n" + "}";
                return JSON.parse( mutation );
            } else {
                try { /// Attempt to Read-In File
                    const target = FS.readFileSync( $[1] );

                    (debug) && Process.stdout.write( "\n" +
                        String( target ).trim().split( "\n" ).map( ($) => {
                            return "    >>> " + $ + "\n";
                        } ).join( "" )
                    );

                    return JSON.parse( String( target ) );
                } catch ( error ) {
                    /// Likely, a Directory or Socket, or missing Trailing Newline

                    Process.stderr.write( "Target File Descriptor isn't JSON Serializable" + "\n" );
                }
            }
        } catch ( error ) {
            if ( $[1] === "" ) {
                process.stdout.write( "\n" );
                process.stdout.write( "   >>> Cancelled" + "\n" );
                (!debug) && process.stdout.write( "\n" );
            } else {
                Process.stderr.write( "Unable to Parse System Path or Standard-Input (0) Buffer" + "\n" );
            }
        }
    }
};

export { Parse };

export default Parse;

