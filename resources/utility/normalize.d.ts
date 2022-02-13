/***
 * @example
 * import { Normalization } from "./normalize";
 *
 * const example = async () => {
 *     const env = [
 *         "Alpha='true'",
 *         "BRAVO=\"ABC\"",
 *         "charlie=\"brown",
 *         "delta = \"hello, i am spaced\"",
 *         "export echo=\"test-123\"",
 *         "FoXtrOT=false",
 *         "GAMMA=\"${GLOBAL_VARIABLE }\"",
 *         "hotel=\"heeeeelp meeeee\" # Test Hello World"
 *     ];
 *
 *     FS.writeFileSync(".env.temp", env.join("\n"));
 *
 *     const test = new Normalization(".env.temp");
 *
 *     await test.hydrate(".env.temp.hydrated");
 *
 *     const contents = FS.readFileSync(".env.temp");
 *
 *     console.log(test);
 *
 *     return contents;
 * }
 *
 * await example();
 */
/// <reference types="node" />
import FS from "fs";
/***
 * Environment Variable(s) File Parser
 * ---
 *
 * - Please note that the following implementation hasn't been
 * tested in significance.
 *
 * @extends {Array, Variables}
 *
 * Allows the ability to parse a dot-env of equal or similar malformations (see below)
 *
 * @example
 * ... `.env`
 *
 * /// Alpha=true
 * /// BRAVO="ABC"
 * /// charlie="brown
 * /// delta = "hello, i am spaced"
 * /// export echo="test-123"
 * /// FoXtrOT=false
 * /// GAMMA="${GLOBAL_VARIABLE}"
 * /// hotel="heeeeelp meeeee" # Test Hello World
 *
 * const environment = new Environment(".env");
 * const dotEnv = await environment.hydrate();
 *
 * console.log(dotEnv);
 */
declare class Normalization extends Array {
    file: string;
    path: string;
    valid: boolean;
    protected cwd: string;
    raw: string | Buffer;
    constructor(file: string | FS.PathLike);
    /***
     * String Bash Operation Symbols from Key-Value Pair
     * ---
     * @param {string} variable - The "Key" in `Key="Value"`
     *
     * @private
     *
     * @example
     *
     * /// .env
     * declare test=true
     *
     * # --> Becomes ...
     * # "test"
     *
     */
    private static key;
    /***
     * Split Key-Value Pair
     * ---
     *
     * @param {string} line
     *
     * @returns {string[]}
     *
     * @private
     *
     */
    private static split;
    /***
     * Strip Inline Comment
     * ---
     *
     * @param {[string, string] | [string] | string[]} array
     *
     * @returns {[string, string]}
     *
     * @private
     *
     */
    private static comment;
    /***
     * Compute the Key-Value(s)
     * ---
     *
     * @param {string} target - Target Normalized File path
     *
     * @returns {Promise<Normalization>}
     *
     */
    hydrate(target?: string): Promise<Normalization>;
}
export interface Variable {
    Key: string;
    Value: string;
}
export declare type Variables = Variable[];
export { Normalization };
export default Normalization;
