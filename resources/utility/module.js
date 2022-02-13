import FS from "fs";
import Path from "path";
import URI from "url";
import Process from "process";
var Types;
(function (Types) {
    Types["CJS"] = "CJS";
    Types["ECMA"] = "ECMA";
    Types["TS"] = "TypeScript";
    Types["JS"] = "JavaScript";
})(Types || (Types = {}));
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
class Locality {
    constructor(importable) {
        this.url = importable;
        this.uri = URI.fileURLToPath(this.url);
        this.absolute = Path.isAbsolute(this.uri) ?? false;
        this.file = FS.lstatSync(this.uri)?.isFile() ?? false;
        this.delimiter = Path.delimiter;
        this.extension = Path.extname(this.uri);
        this.name = Path.basename(this.uri, this.extension);
        this.module = Path.resolve(this.name);
        this.directory = Path.dirname(this.module);
        this.basename = Path.basename(this.directory);
        this.relative = Path.relative(Process.cwd(), this.uri);
    }
    static initialize(self) {
        return Reflect.construct(Locality, [self]);
    }
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
    filename() {
        return this.uri;
    }
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
    dirname() {
        return this.directory;
    }
    /***
     * Target File Contents
     * ---
     *
     * Encoded via UTF-8
     *
     * @returns {string | null}
     *
     */
    contents() {
        return (this.file) ? FS.readFileSync(this.uri).toString("utf-8").trim() : null;
    }
}
export { Locality };
export default Locality;
//# sourceMappingURL=module.js.map