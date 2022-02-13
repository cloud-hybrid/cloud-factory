/***
 * Identifier String-Type-Casing
 * ---
 *
 * Similar to a Type-Cast, Cast the String into a Train-Case String.
 *
 * @param input {string}
 * @param options {string}
 *
 * @constructor
 *
 */

const ID = (input: string, options: { condense: boolean } | null | undefined = { condense: true }) => {
    return input.trim()
        .replace( /_/g, "-" )
        .replace( /([a-z])([A-Z])/g, "$1-$2" )
        .replace( /\W/g, ($) => /[À-ž]/.test( $ ) ? $ : "-" )
        .replace( /^-+|-+$/g, "" )
        .replace( /-{2,}/g, ($) => options && options.condense ? "-" : $ )
        .toLowerCase();
};

export { ID };

export default ID;
