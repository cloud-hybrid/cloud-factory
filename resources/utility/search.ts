/***
 * @example
 * import { Search } from "./search";
 *
 * console.log(await Search(process.cwd(), RegExp(".*(remove.type.ts).*")));
 */

import { Walker } from "./walk";

/*** @private */
class Result {
    path?: string;
    file?: string;
    index?: number;
    input?: string;

    groups?: Generic;

    constructor (input: RegExpExecArray) {
        this.path = input[0]
        this.file = input[1]
        this.index = input.index;
        this.input = input.input;
        this.groups = input.groups;
    }
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
const Search = async (directory: string, query: RegExp) => {
    const results: Result[] = [];

    const data = await Walker(directory);
    data.forEach(($) => {
        const resolution = query.exec($);

        (resolution !== null) && results.push(new Result(resolution));
    })

    return results;
};

type Generic = any;

export { Search };
export default Search;
