import Assertion from "assert";
import FS from "fs";
import Module from "module";
import Path from "path";
import Process from "process";
import Utility from "util";

import { Subprocess } from "../../utilities/subprocess.js";

import { Descriptor } from "./descriptor.js";

import Type from "./distributable.type";

class Distributable implements Type {
    /*** Static Class-Property Reference to Alike Distributable(s) */
    public static packages: Distributable[] = [];

    private static Remove = Utility.promisify( FS.rm );

    /*** Name of the Distributable Resource */
    name: string;

    /*** Current Working Directory */
    cwd: string;

    /*** Base Folder Name */
    base: string;

    /*** Source Folder */
    directory: string;

    /*** Distribution Target Folder */
    distribution: string;

    /*** File Path to `package.json` */
    definition: string;

    /*** Distribution Folder Lambda Layer */
    layer: boolean;

    /*** Overwrite Definition for `factory.json` */
    overwrites: object;

    /*** Under Development */
    factory: object | null = null;

    constructor(properties: Type) {
        this.name = properties.name;
        this.cwd = properties.cwd;
        this.base = properties.base;
        this.directory = properties.directory;
        this.distribution = properties.distribution;
        this.definition = properties.definition;
        this.layer = properties.layer;
        this.overwrites = properties.overwrites;
    }

    /***
     * Define Package Data
     * -------------------
     * @param data {Distributable[]} The Data Container for Package(s)
     * @param target {string} The Target Package Directory
     * @param layer {boolean} Is the Target Package a Lambda Layer
     *
     * @constructor
     *
     */

    static define(target: string, layer: boolean) {
        const Import = Module.createRequire( import.meta.url.replace( "file" + ":" + "//", "" ) );

        /// Import the package.json File as an Object via Node-Require Import
        const Package = Import( Path.join( target, "package.json" ) );

        /// Scan package.json for its Package-Name -- Stripping the Organization if applicable
        const Expression = RegExp( "(@.*/)?(.*)", "i" );
        const Name = Expression.exec( Package.name )?.pop() || "";

        const Definition = new Distributable( {
            name: Name,
            cwd: Process.cwd(),
            directory: target,
            base: Path.basename( target ),
            distribution: ( layer ) ? Path.join( Process.cwd(),
                "distribution",
                "library",
                Path.basename( target ) ) : Path.join( Process.cwd(), "distribution", Path.basename( target ) ),
            definition: Path.join( target, "package.json" ),
            layer: layer,
            overwrites: {},
            factory: null
        } );

        const Local = {
            Inline: Package?.factory || null,                           /// Priority 3 (Lowest)
            Factory: Path.join( target, "factory.json" ),                 /// Priority 2
            Overwrite: Path.join( target, "factory.overwrites.json" )    /// Priority 1 (Highest)
        };

        /*** Inline Configuration `factory.json` */
        if ( Local.Inline !== null ) {
            console.log( "[Log] Overwrite Target Found (Local.Inline) ...", "\n" );
            Definition.overwrites = {
                ... Local.Inline, ... Definition.overwrites
            };
        }

        /*** Local Configuration `factory.json` */
        if ( FS.existsSync( Local.Factory ) ) {
            console.log( "[Log] Overwrite Target Found (Local.Factory) ...", "\n" );

            Definition.overwrites = {
                ... Import( Local.Factory ), ... Definition.overwrites
            };
        }

        /*** Local Configuration `factory.overwrites.json` */
        if ( FS.existsSync( Local.Overwrite ) ) {
            console.log( "[Log] Overwrite Target Found (Local.Overwrite) ...", "\n" );

            Definition.overwrites = {
                ... Import( Local.Overwrite ), ... Definition.overwrites
            };
        }

        Distributable.packages.push( Definition );
    }

    static async remove(path: ( string ), retries: number, force: boolean, recursive: boolean) {
        const $ = async () => await Distributable.Remove( path, { recursive, force, maxRetries: retries } );

        await $();

        return;
    }

    /***
     * Distribution Folder Structure Normalization
     * -------------------------------------------
     *  In order to create a distribution:
     *
     *  1. Determine a set of packages. This is performed via iterating all relative directories for `package.json` files.
     *  2. Determine lambda layers. If any folders are found within the `library` folder immediately relative to the current
     *  process's PWD, these are said to be lambda layers.
     *  3. Perform dependency installations & folder mutations. If the package is a lambda layer, install node_modules,
     *  and repackage the folder into a lambda-runtime. If the package is a lambda function, install dependencies, and move
     *  folder into distribution target folder.
     *
     * @constructor
     *
     */

    static async distribute() {
        const Import = Module.createRequire( import.meta.url.replace( "file" + ":" + "//", "" ) );

        for ( const $ of Distributable.packages ) {
            /// Old Working Directory := Current Working Directory
            const OWD = Process.cwd();

            /// Target Working Directory
            Process.chdir( $.directory );

            /// Current Working Directory
            const CWD = Process.cwd();

            /// Should Never Happen, but Technically is Possible
            Assertion.strictEqual( $.directory, CWD, "Process Directory Drift" );

            /// Cleanse Directories if Applicable
            await Distributable.remove( Path.join( $.directory, "node_modules" ), 5, true, true );
            await Distributable.remove( Path.join( $.directory, "nodejs" ), 5, true, true );
            await Distributable.remove( $.distribution, 5, true, true );

            /// Install only Production-based Lambda Dependencies
            await Subprocess( "npm install --production", $.directory );

            if ( $.layer === true ) {
                const Dependencies = Import( $.definition )?.dependencies;
                const Count: number = ( Dependencies ) ? Object.keys( Dependencies ).length : 0;
                if ( Count > 0 ) { /// Install Lambda Layer Dependencies, if Applicable
                    /// ( debug ) && console.debug( "[Debug] Layer Dependencies" + ":", Import( $.definition ), "\n" );

                    /// Install Layer Dependencies, Relative to Original Source
                    await Subprocess( "npm install --production", $.directory );

                    /// Copy Layer Dependencies
                    Distributable.copy( Path.join( $.directory, "node_modules" ),
                        Path.join( $.directory, "nodejs", "node_modules" ) );
                }

                FS.mkdirSync( Path.join( $.distribution, "nodejs" ), { recursive: true } );

                /// Copy the Layer File(s), Shallow (Node-JS Directory)
                Distributable.shallow( $.directory, Path.join( $.distribution, "nodejs" ) );

                await Subprocess( "npm install --production", Path.join( $.distribution, "nodejs" ) );

                /// Copy Layer Folder into the Distribution Library
                Distributable.copy( $.directory, $.distribution );
            } else {
                /// Copy Lambda Function Folder into the Distribution
                Distributable.copy( $.directory, $.distribution );

                const Dependencies = Import( $.definition )?.dependencies;
                const Count: number = ( Dependencies ) ? Object.keys( Dependencies ).length : 0;
                if ( Count > 0 ) { /// Install Lambda Function Dependencies, if Applicable
                    /// ( debug ) && console.debug( "[Debug] Dependencies" + ":", Import( $.definition ) );

                    await Subprocess( "npm install --production", $.distribution );
                }
            }

            /// Clean-Up
            await Distributable.remove( Path.join( $.directory, "node_modules" ), 5, true, true );

            /*** Establish a `factory.overwrites.json` File in the Distribution Directory if Available */
            ( $.overwrites && Object.keys( $.overwrites ).length > 0 ) && FS
                .writeFileSync( Path.join( $.distribution, "factory.overwrites.json" ),
                    JSON.stringify( $.overwrites, null, 4 ) );

            /// Update CWD to PWD
            Process.chdir( OWD );
        }

        await Distributable.strip();
    }

    /***
     * Recursive Copy Function
     * -----------------------
     * *Note* - this will perform *actual, real copies*; symbolic links are resolved to their raw pointer location(s).
     *
     * These are important considerations especially when building for reproducible distributions.
     *
     * @param source {string} Original path
     * @param target {string} Target copy destination
     * @param debug {boolean} Debug Parameter
     *
     * @constructor
     *
     */

    static copy(source: string, target: string, debug: boolean = false) {
        FS.mkdirSync( target, { recursive: true } );
        FS.readdirSync( source ).forEach( (element) => {
            ( debug ) && console.debug( "\n" + "[Debug] Element Attribute(s)" + ":", element, "\n" );

            const Directory = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isDirectory();
            const Socket = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isSocket();
            const File = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isFile();

            const Partials = Path.parse( source );
            ( debug ) && console.debug( "[Debug] Target Partials" + ":", Partials, "\n" );

            const Name = Partials.dir.split( "/" ).pop();
            ( debug ) && console.debug( "[Debug] Target Name" + ":", Name );

            if ( !Directory && !Socket ) {
                try {
                    FS.copyFileSync( Path.join( source, element ),
                        Path.join( target, element ),
                        FS.constants.COPYFILE_FICLONE );
                } catch ( error ) {
                    // ...
                }
            } else {
                if ( !Socket && Directory ) {
                    Distributable.copy( Path.join( source, element ), Path.join( target, element ) );
                }
            }
        } );
    }

    /***
     * Shallow Copy
     * ------------
     * Shallow Copy
     *
     * @param source {string}
     * @param target {string}
     *
     * @constructor
     *
     */

    static shallow(source: string, target: string) {
        FS.readdirSync( source ).forEach( (element) => {
            const Target = Path.join( source, element );
            const File = FS.lstatSync( Target, { throwIfNoEntry: true } ).isFile();
            const Descriptor = Path.parse( Target );

            ( File ) && FS.copyFileSync( Path.format( Descriptor ), Path.join( target, Descriptor.base ) );
        } );
    }

    /***
     * Strip
     * -----
     *
     * @param distribution {string} Strip a given Lambda Layer distribution folder of unneeded file(s) (everything
     * other than the `nodejs` definition.
     *
     */

    static async strip() {
        /// ( debug ) && console.debug( "[Debug] Cleaning Layers ...", "\n" );

        for ( const item of Distributable.packages.filter( ($) => $.layer ) ) {
            /// Remove (nodejs) Directories from Source
            await Distributable.remove( Path.join( item.directory, "nodejs" ), 5, true, true );

            /// Remove !(nodejs) Directories from Target (Distribution)
            const Structure: FS.Dirent[] = FS.readdirSync( item.distribution, { withFileTypes: true } );

            /// Filter Results
            const Targets: Descriptor[] = Structure.filter( ($) => ( $.name !== "nodejs" ) ).map( ($) => new Descriptor( $ ) );

            /// ( debug ) && console.debug( "[Debug] Distribution Clean-Up Layer Target(s)" + ":", Targets, "\n" );

            for ( const target of Targets ) {
                await Distributable.remove( Path.join( item.distribution, target.name ), 5, false, true );
                /// ( debug ) && console.debug( "[Debug] Successfully Removed" + ":", target.name, "\n" );
            }
        }
    }
}

export { Distributable };

export default Distributable;