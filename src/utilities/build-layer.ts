import Spawn from "child_process";
import FS from "fs";
import Module from "module";
import Path from "path";
import Utility from "util";

const Process = process;

const File = import.meta.url.replace( "file" + ":" + "//", "" );

const Import = Module.createRequire( File );

/***
 *
 * Recursive Copy Function
 * -----------------------
 * *Note* - this will perform *actual, real copies*; symbolic links are resolved to their raw pointer location(s).
 *
 * These are important considerations especially when building for reproducible distributions.
 *
 * @param source {String} original path
 * @param target {String} target copy destination
 *
 * @constructor
 *
 */

function Copy(source: string, target: string) {
    /*** Exclusions to Avoid Recursive Parsing; i.e. libraries, lambda-layers, or otherwise bundled requirements */
    const Exclusions = [ ".git", ".idea", ".vscode", "artifacts", "cdktf.out", "templates" ];

    FS.mkdirSync( target, { recursive: true } );
    FS.readdirSync( source, { withFileTypes: true } ).forEach( (element) => {
        const Directory = element?.isDirectory() || false;
        const Socket = element?.isSocket() || false;
        const File = element?.isFile() || false;

        try {
            if ( !Socket && Directory ) {
                if ( !Exclusions.includes( element.name ) ) {
                    Copy( Path.join( source, element.name ), Path.join( target, element.name ) );
                }
            } else {
                if ( File && !Exclusions.includes( element.name ) ) {
                    FS.copyFileSync( Path.join( source, element.name ), Path.join( target, element.name ) );
                }
            }
        } catch ( e ) {
            /// ...
        }
    } );
}

/***
 * Subprocess Spawner
 * ==================
 *
 * @param command {String} Denormalized, Shell Command
 * @param directory {String} System Target Path for a Current-Working-Directory
 *
 * @constructor
 *
 */

const Subprocess = (command: string, directory: string = Process.cwd()) => {
    const Binary = command.split( " " )[ 0 ];
    const Arguments = command.split( " " ).splice( 1 );
    return Spawn.spawnSync( Binary, [ ... Arguments ], {
        cwd: directory, env: Process.env, stdio: "inherit"
    } );
};

const Main = async () => {
    const Directory = Process.cwd();

    console.debug( "[Debug] Directory" + ":", Directory );

    const Remove = Utility.promisify( FS.rm );

    await Remove( Path.join( Directory, "artifacts" ), { recursive: true, force: true } );

    FS.mkdirSync( Path.join( Directory, "artifacts" ), { recursive: true } );
    FS.mkdirSync( Path.join( Directory, "artifacts", "nodejs" ), { recursive: true } );

    Subprocess( "npm install --production .", Directory );

    /// Copy Layer
    Copy( Directory, Path.join( Directory, "artifacts", "nodejs" ) );
};

export { Main };

export default Main;