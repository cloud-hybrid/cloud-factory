/***
 * @example
 * import { Search } from "./search";
 *
 * console.log(await Search(process.cwd(), RegExp(".*(remove.type.ts).*")));
 */
/*** @private */
declare class Result {
    path?: string;
    file?: string;
    index?: number;
    input?: string;
    groups?: Generic;
    constructor(input: RegExpExecArray);
}
/***
 * Search Results
 *
 * @param {string} directory
 * @param {RegExp} query
 * @returns {Promise<Result[]>}
 *
 * @constructor
 */
declare const Search: (directory: string, query: RegExp) => Promise<Result[]>;
declare type Generic = any;
export { Search };
export default Search;
