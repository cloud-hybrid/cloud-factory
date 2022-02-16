/***
 * @example
 * import { Binary } from "./abi";
 *
 * /// Search for `git` ABI
 * const example = () => {
 *     console.log(Binary("git"));
 * }
 *
 * example();
 */

import FS from "fs";
import Path from "path";
import Process from "process";

/*** @private */
function $(bin: string | FS.PathLike) {
    return ( Process.env.PATH || "" ).replace( /["]+/g, "" ).split( Path.delimiter ).map( (chunk) => {
        return ( Process.env.PATHEXT || "" ).split( Path.delimiter ).map( (ext) => {
            return Path.join( chunk, bin + ext );
        } );
    } ).reduce( (a, b) => {
        return a.concat( b );
    } );
}

const Binary = (bin: string | FS.PathLike) => {
    const Target = $( bin );
    const Data = { Valid: false, Path: "" };

    let i = 0;
    for ( i; i <= Target.length; i++ ) {
        try {
            if ( FS.statSync( Target[ i ] )?.isFile() ) {
                Data.Valid = true;
                Data.Path = Target[ i ];

                break;
            }
        } catch ( e ) {
            /// throw e;
        }
    }

    return Data.Valid;
};

export { Binary };

export default Binary;
