/***
 * @name        SSH-Permissions
 * @package     @cloud-technology
 * @summary     ESM SSH Extension
 *
 * @author      Jacob B. Sanders
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import FS from "fs";
import Module from "module";
import Path from "path";

/***
 * Compatability Replacement for `__dirname` (Commonjs)
 *
 * @type {function(): string}
 *
 * @constructor
 *
 * @example
 * >>> const URI = () => Path.normalize(import.meta.url).replace("file" + ":", "");
 *
 */

const URI = () => Path.normalize( import.meta.url ).replace( "file" + ":", "" );
const Directory = () => Path.dirname( URI() );

/***
 * Compatability Replacement for `require` (Commonjs)
 *
 * @type {NodeRequire}
 *
 * @constructor
 *
 * @example
 * >>> const Import = Module.createImport(URI());
 * >>> const Package = Import("package.json");
 *
 */

const Import = Module.createRequire( URI() );

/***
 *
 * @param key {string} System Path to File
 *
 * @return {Promise<*>}
 *
 * @constructor
 *
 */

const Modify = (key: string) => {
    return new Promise( (resolve) => {
        try {
            FS.chmod( key, 0o400, resolve );
        } finally {
            /*** */
        }
    } );
};

/***
 *
 * @param key {string} System Path to File
 *
 * @return {Promise<*>}
 *
 * @constructor
 *
 */

const Unlock = (key: string) => {
    return new Promise( (resolve) => {
        try {
            FS.chmod( key, 0o777, resolve );
        } finally {
            /*** */
        }
    } );
};

export { Modify, Unlock };

export default Modify;