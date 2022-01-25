import FS from "fs";
import Path from "path";
import Process from "process";

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
    const Data = { Valid: false, Path: "" };
    const Target = $( bin );
    const Iterator = Target.length;

    let i = 0;
    for ( i; i <= Iterator; i++ ) {
        try { // console.log(Target[i]);
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
