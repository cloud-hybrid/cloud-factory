/***
 * @module Environment
 *
 * Runtime Freeze of Process Environment Variables
 *
 * In future iteration(s) of Node.js, `process.env` will no longer
 * be supporting non-standard type-assignment to process.env attributes.
 *
 * The following module aims to provide backwards support by first
 * establishing a general object, and then iterating the key-value
 * assignments found in `process.env`.
 *
 * It's important that the following module should be imported as soon
 * as possible relative to the program's import tree.
 *
 */
declare type Generic = any;
declare class Process extends Object {
    static package: Generic;
    constructor();
}
export { Process };
export default Process;
