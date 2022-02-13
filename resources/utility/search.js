/***
 * @example
 * import { Search } from "./search";
 *
 * console.log(await Search(process.cwd(), RegExp(".*(remove.type.ts).*")));
 */
import { Walker } from "./walk";
/*** @private */
class Result {
    path;
    file;
    index;
    input;
    groups;
    constructor(input) {
        this.path = input[0];
        this.file = input[1];
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
const Search = async (directory, query) => {
    const results = [];
    const data = await Walker(directory);
    data.forEach(($) => {
        const resolution = query.exec($);
        (resolution !== null) && results.push(new Result(resolution));
    });
    return results;
};
export { Search };
export default Search;
//# sourceMappingURL=search.js.map