import FS from "fs";
import Path from "path";

/***
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

function Copy(source, target) {
    /*** Exclusions to Avoid Recursive Parsing; i.e. libraries, lambda-layers, or otherwise bundled requirements */
    const Exclusions = [
        ".git",
        ".idea",
        ".vscode",

        "cdktf.out",
        "templates"
    ];

    FS.mkdirSync(target, { recursive: true });
    FS.readdirSync(source).forEach((element) => {
        const Directory = FS.lstatSync(Path.join(source, element), { throwIfNoEntry: false })?.isDirectory() || false;
        const Socket = FS.lstatSync(Path.join(source, element), { throwIfNoEntry: false })?.isSocket() || false;

        try {
            if ( !Socket ) {
                if ( !Exclusions.includes(target) ) {
                    FS.mkdirSync(target, { recursive: true });
                }
            }

            if ( !Directory && !Socket ) {
                if ( !Exclusions.includes(source) ) {
                    FS.copyFileSync(Path.join(source, element), Path.join(target, element));
                }
            } else if ( !Socket ) {
                if ( !Exclusions.includes(source) ) {
                    Copy(Path.join(source, element), Path.join(target, element));
                }
            }
        } catch ( e ) {
            /// ...
        }
    });
}

/***
 * Layer Builder
 * -------------
 * @param source
 * @param target
 *
 * @constructor
 *
 */

function Layer(source, target) {
    FS.readdirSync(source).forEach((element) => {
        const Target = Path.join(source, element);
        const Descriptor = Path.parse(Target);

        if ( Descriptor.base === "package.json" ) {
            FS.copyFileSync(Path.format(Descriptor), Path.join(target, Descriptor.base));
        }
    });
}

export default Copy;

export { Copy, Layer };