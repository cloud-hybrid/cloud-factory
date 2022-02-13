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
declare const ID: (input: string, options?: {
    condense: boolean;
} | null | undefined) => string;
export { ID };
export default ID;
