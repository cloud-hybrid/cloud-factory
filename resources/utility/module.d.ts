/// <reference types="node" />
import FS from "fs";
import { PathLike } from "fs";
interface Locality {
    /*** Resolvable URL via Protocol */
    url: string;
    /*** Resolvable, Full System Path URI via Pathing */
    uri: string;
    /*** URI Absolute Check */
    absolute: boolean;
    /*** File-Type Check */
    file: boolean;
    /*** System File-Separator */
    delimiter: string;
    /*** Target File-Name, Normalized */
    name?: string | PathLike | undefined;
    /*** Full System, Extension-Stripped Path */
    module?: string | PathLike | undefined;
    /*** Target File Extension */
    extension?: string | PathLike | undefined;
    /*** Full System Path to Directory */
    directory?: string | PathLike | undefined;
    /*** Directory Name, Normalized */
    basename?: string | PathLike | undefined;
    /*** Relative Path from Process.cwd() to Target */
    relative?: string | PathLike | undefined;
}
/***
 * Module Class Package Resolver
 * ---
 *
 * A meta-type for individual modules to provide filesystem
 * metadata, primarily for the purpose of exporting to consumers.
 *
 * Includes convenience methods including dirname and filename
 * that's essentially a wrapper around CommonJS `__filename`
 * && `__dirname`.
 *
 * @example
 *
 * const Module = new Locality(import.meta.url);
 *
 * @example
 *
 * const Module = Locality.initialize(import.meta.url);
 *
 */
declare class Locality implements Locality {
    constructor(importable: string);
    static initialize(self: string): Locality;
    /*** Compatability Dot-Property, `__filename` */
    /***
     * Filename, Full System Path
     * ---
     *
     * @type {string | PathLike}
     *
     * @returns {string | PathLike}
     *
     */
    filename(): string;
    /*** Compatability Dot-Property, `__dirname` */
    /***
     * Directory, Full System Path
     * ---
     *
     * @type {string | PathLike}
     *
     * @returns {string | PathLike}
     *
     */
    dirname(): FS.PathLike | undefined;
    /***
     * Target File Contents
     * ---
     *
     * Encoded via UTF-8
     *
     * @returns {string | null}
     *
     */
    contents(): string | null;
}
export { Locality };
export default Locality;
