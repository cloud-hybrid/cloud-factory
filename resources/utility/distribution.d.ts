/// <reference types="node" />
import FS from "fs";
declare class Distributable {
    private static Remove;
    /*** Target-level directories to avoid copying into distribution */
    ignore: string[];
    /*** Debug parameter used during the various class-instance namespace'd callables */
    debug: boolean;
    /*** The target directory for the distribution */
    target: string | FS.PathLike;
    /***
     * @param {string[]} undesired - Target-level directories to avoid copying into distribution
     *
     * @param target {string} - Target Directory for Distribution
     * @param force {boolean} - Forcefully Create Target Directory
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */
    constructor(target: string, force: boolean, undesired: string[], debug?: boolean);
    /***
     * Asynchronous implementation of `FS.rm`, wrapped with Node.js's Promisify
     * utility.
     *
     * > Asynchronously removes files and directories (modeled on the standard POSIX `rmutility`).
     * > No arguments other than a possible exception are given to the
     * > completion callback.
     *
     * @constructor
     *
     */
    static remove(path: (string), retries: number, force: boolean, recursive: boolean): Promise<void>;
    /***
     * Recursive Copy Function
     *
     * *Note* - the following function is recursive, and will perform *actual, real copies*; symbolic
     * links are resolved to their raw pointer location(s).
     *
     * Hoisted package linking is damaging, and is an important considerations especially when
     * building for reproducible distributions.
     *
     * @param source {string} Original path
     * @param target {string} Target copy destination
     *
     * @constructor
     *
     */
    copy(source: string, target: string): void;
    /***
     * Shallow Copy
     *
     * @param source {string}
     * @param target {string}
     *
     * @constructor
     *
     */
    static shallow(source: string, target: string): void;
}
export { Distributable };
export default Distributable;
