/***
 * @name        cli-prompt
 * @package     @cloud-vault
 * @summary     ESM-based CLI Prompt
 *
 * @author      Jacob B. Sanders
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import Process from "process";
import Input from "readline";
import Utility from "util";

/***
 * Asynchronous CLI Prompt
 *
 * @param query
 *
 * @returns {Promise<string>}
 *
 * @constructor
 *
 * @example
 *
 * const Command = async ($: Argv) => {
 *     Configuration( $ );
 *     $.check( async ($) => {
 *         ( $?.debug ) && ( TTY ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );
 *
 *         const Continue = async () => await Prompt( "Continue? (Y/N)" + ":" + " " );
 *
 *         let trigger: string = await Continue().then( ($) => $.toUpperCase() );
 *
 *         while ( trigger !== "Y" && trigger !== "N" ) trigger = await Continue().then( ($) => $.toUpperCase() );
 *
 *         return true;
 *     } ).strict();
 * };
 *
 */

const Prompt = (query: string) => {
    // eslint-disable-next-line no-async-promise-executor
    const Data: Promise<string> = new Promise( async (resolve, reject) => {
        let $: unknown = "";

        const Interface = Input.createInterface( {
            input: Process.openStdin(), output: Process.stdout
        } );

        const prompt = Utility.promisify( Interface.question ).bind( Interface );

        try {
            $ = await prompt( query );
        } catch ( _ ) {
            reject( _ );
        } finally {
            Interface.close();
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolve( $ );
    } );

    return Data;
};

export { Prompt };

export default Prompt;
