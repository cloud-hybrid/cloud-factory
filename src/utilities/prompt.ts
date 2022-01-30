/***
 * @author      Jacob B. Sanders
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import Process from "process";
import Input from "readline";
import Utility from "util";

/**
 * Asynchronous CLI Prompt
 *
 * @param query
 *
 * @returns {Promise<string>}
 *
 * @constructor
 *
 * @example
 * import { Prompt } from ...;
 *
 * const Awaitable = async (title: string) => {
 *     const Input = async () => await Prompt( title + ":" + " " );
 *
 *     let $: string = await Input().then( (output) => output );
 *     while ( $.trim().length === 0 ) $ = await Input().then( ($) => $ );
 *     return $.trim();
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
