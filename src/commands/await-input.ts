import { Prompt } from "../utilities/prompt.js";

/**
 *
 * @param {string} title
 * @returns {Promise<string>}
 * @constructor
 *
 * @example
 *
 * const Command = async ($: Argv) => {
 *     Configuration( $ );
 *     $.check( async ($) => {
 *         ( $?.debug ) && ( TTY ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );
 *
 *         ( $?.file) && console.debug("Located File Argument", $.file);
 *         ( $?.output) && console.debug("Located Output Argument", $.output);
 *
 *         const Continue = async () => {
 *             return await Prompt( "Continue? (Y/N)" + ":" + " " );
 *         }
 *
 *         let trigger: string = await Continue().then( ($) => $.toUpperCase() );
 *
 *         while ( trigger !== "Y" && trigger !== "N" ) trigger = await Continue().then( ($) => $.toUpperCase() );
 *
 *         /// ...
 *
 *         return true;
 *     } ).strict();
 * };
 *
 * @example
 *
 * const Command = async ($: Argv) => {
 *     Configuration( $ );
 *     $.check( async ($) => {
 *         ( $?.debug ) && ( TTY ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );
 *
 *         let file = "";
 *         ( $?.file) && console.debug("Located File Argument", $.file);
 *         file = ( $?.file ) ? String($.file) : "";
 *         const File = async () => {
 *             const $ = await Prompt( "Template File Location" + ":" + " " );
 *
 *             return $.trim();
 *         }
 *
 *         while ( file === "" ) file = await File().then( ($) => $);
 *
 *         let output = "";
 *         ( $?.output) && console.debug("Located Output Argument", $.output);
 *         output = ( $?.output ) ? String($.output) : "";
 *         const Output = async () => {
 *             const $ = await Prompt( "Hydrated Output File-Path" + ":" + " " );
 *
 *             return $.trim();
 *         }
 *
 *         while ( output === "" ) output = await Output().then( ($) => $);
 *
 *         ( $?.output) && console.debug("Located Output Argument", $.output);
 *
 *         const Continue = async () => {
 *             return await Prompt( "Continue? (Y/N)" + ":" + " " );
 *         }
 *
 *         let trigger: string = await Continue().then( ($) => $.toUpperCase() );
 *
 *         while ( trigger !== "Y" && trigger !== "N" ) trigger = await Continue().then( ($) => $.toUpperCase() );
 *
 *         return true;
 *
 *  } ).strict();
 *
 */

const Awaitable = async (title: string) => {
    const Input = async () => await Prompt( title + ":" + " " );

    let $: string = await Input().then( (output) => output );

    while ( $.trim().length === 0 ) $ = await Input().then( ($) => $ );

    return $.trim();
};

export { Awaitable as Prompt };

export default Awaitable;